import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Sale, SaleFormData } from '../types';
import { supabase } from '../lib/supabase';
import { convertDbSaleToApp, convertAppSaleToDb, handleSupabaseError } from '../lib/supabaseUtils';

interface SalesState {
  sales: Sale[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchSales: () => void;
  addSale: (saleData: SaleFormData) => void;
  updateSale: (id: string, saleData: Partial<SaleFormData>) => void;
  deleteSale: (id: string) => void;
  getSaleById: (id: string) => Sale | undefined;
  getSalesByDateRange: (startDate: Date, endDate: Date) => Sale[];
  getTotalRevenue: () => number;
  getTotalSalesCount: () => number;
  getSalesByStatus: (status: 'completed' | 'pending' | 'cancelled') => Sale[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  restoreSales: (sales: Sale[]) => void;
}

export const useSalesStore = create<SalesState>()(
  devtools(
    (set, get) => ({
      sales: [],
      loading: false,
      error: null,

      fetchSales: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('sales')
            .select('*')
            .order('sale_date', { ascending: false });

          if (error) {
            handleSupabaseError(error, 'fetch sales');
            return;
          }

          const sales = await Promise.all(
            (data || []).map(convertDbSaleToApp)
          );
          set({ sales, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch sales',
            loading: false 
          });
        }
      },

      addSale: async (saleData: SaleFormData) => {
        set({ loading: true, error: null });
        try {
          const newSale: Sale = {
            id: crypto.randomUUID(),
            saleDate: new Date(),
            ...saleData,
            status: 'completed',
          };

          const dbSale = convertAppSaleToDb(newSale);
          const { data: saleDataResult, error: saleError } = await supabase
            .from('sales')
            .insert(dbSale)
            .select()
            .single();

          if (saleError) {
            handleSupabaseError(saleError, 'add sale');
            return;
          }

          // Insert sale items
          const saleItems = newSale.items.map(item => ({
            sale_id: newSale.id,
            product_id: item.productId,
            product_name: item.productName,
            quantity: item.quantity,
            unit_price: item.unitPrice,
            total_price: item.totalPrice,
          }));

          const { error: itemsError } = await supabase
            .from('sale_items')
            .insert(saleItems);

          if (itemsError) {
            handleSupabaseError(itemsError, 'add sale items');
            return;
          }

          // Update product stock quantities
          for (const item of newSale.items) {
            // First get current stock
            const { data: product, error: fetchError } = await supabase
              .from('products')
              .select('stock_quantity')
              .eq('id', item.productId)
              .single();

            if (fetchError) {
              console.error('Error fetching product stock:', item.productId, fetchError);
              continue;
            }

            // Update with new stock quantity
            const newStockQuantity = product.stock_quantity - item.quantity;
            const { error: stockError } = await supabase
              .from('products')
              .update({ 
                stock_quantity: newStockQuantity,
                updated_at: new Date().toISOString()
              })
              .eq('id', item.productId);

            if (stockError) {
              console.error('Error updating stock for product:', item.productId, stockError);
              // Don't fail the entire sale if stock update fails
            }
          }

          // Refresh products to update local state
          // This will trigger a refetch of products to show updated stock levels
          window.dispatchEvent(new CustomEvent('refreshProducts'));

          const convertedSale = await convertDbSaleToApp(saleDataResult);
          set((state) => ({
            sales: [convertedSale, ...state.sales],
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add sale',
            loading: false 
          });
        }
      },

      updateSale: async (id: string, saleData: Partial<SaleFormData>) => {
        set({ loading: true, error: null });
        try {
          const existingSale = get().sales.find(s => s.id === id);
          if (!existingSale) {
            throw new Error('Sale not found');
          }

          const updatedSale = {
            ...existingSale,
            ...saleData,
          };

          const dbSale = convertAppSaleToDb(updatedSale);
          const { data, error } = await supabase
            .from('sales')
            .update(dbSale)
            .eq('id', id)
            .select()
            .single();

          if (error) {
            handleSupabaseError(error, 'update sale');
            return;
          }

          const convertedSale = await convertDbSaleToApp(data);
          set((state) => ({
            sales: state.sales.map(sale =>
              sale.id === id ? convertedSale : sale
            ),
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update sale',
            loading: false 
          });
        }
      },

      deleteSale: async (id: string) => {
        set({ loading: true, error: null });
        try {
          // Get sale items before deleting to restore stock
          const { data: saleItems, error: itemsFetchError } = await supabase
            .from('sale_items')
            .select('*')
            .eq('sale_id', id);

          if (itemsFetchError) {
            handleSupabaseError(itemsFetchError, 'fetch sale items');
            return;
          }

          // Restore stock quantities
          if (saleItems) {
            for (const item of saleItems) {
              // First get current stock
              const { data: product, error: fetchError } = await supabase
                .from('products')
                .select('stock_quantity')
                .eq('id', item.product_id)
                .single();

              if (fetchError) {
                console.error('Error fetching product stock:', item.product_id, fetchError);
                continue;
              }

              // Update with restored stock quantity
              const newStockQuantity = product.stock_quantity + item.quantity;
              const { error: stockError } = await supabase
                .from('products')
                .update({ 
                  stock_quantity: newStockQuantity,
                  updated_at: new Date().toISOString()
                })
                .eq('id', item.product_id);

              if (stockError) {
                console.error('Error restoring stock for product:', item.product_id, stockError);
              }
            }
          }

          // Delete sale items
          const { error: itemsError } = await supabase
            .from('sale_items')
            .delete()
            .eq('sale_id', id);

          if (itemsError) {
            handleSupabaseError(itemsError, 'delete sale items');
            return;
          }

          // Delete the sale
          const { error } = await supabase
            .from('sales')
            .delete()
            .eq('id', id);

          if (error) {
            handleSupabaseError(error, 'delete sale');
            return;
          }

          // Refresh products to update local state
          window.dispatchEvent(new CustomEvent('refreshProducts'));

          set((state) => ({
            sales: state.sales.filter(sale => sale.id !== id),
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete sale',
            loading: false 
          });
        }
      },

      getSaleById: (id: string) => {
        return get().sales.find(sale => sale.id === id);
      },

      getSalesByDateRange: (startDate: Date, endDate: Date) => {
        return get().sales.filter(sale => {
          const saleDate = new Date(sale.saleDate);
          return saleDate >= startDate && saleDate <= endDate;
        });
      },

      getTotalRevenue: () => {
        return get().sales
          .filter(sale => sale.status === 'completed')
          .reduce((total, sale) => total + sale.totalAmount, 0);
      },

      getTotalSalesCount: () => {
        return get().sales.filter(sale => sale.status === 'completed').length;
      },

      getSalesByStatus: (status: 'completed' | 'pending' | 'cancelled') => {
        return get().sales.filter(sale => sale.status === status);
      },

      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),

      restoreSales: (sales: Sale[]) => {
        console.log('Sales store: restoring', sales.length, 'sales');
        set({ sales, loading: false, error: null });
      },
    }),
    {
      name: 'sales-store',
    }
  )
);
