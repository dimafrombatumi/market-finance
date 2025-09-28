import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Product, ProductFormData } from '../types';
import { supabase } from '../lib/supabase';
import { convertDbProductToApp, convertAppProductToDb, handleSupabaseError } from '../lib/supabaseUtils';

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchProducts: () => void;
  addProduct: (productData: ProductFormData) => void;
  updateProduct: (id: string, productData: Partial<ProductFormData>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  searchProducts: (query: string) => Product[];
  getLowStockProducts: () => Product[];
  updateStock: (id: string, quantity: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProductStore = create<ProductState>()(
  devtools(
    (set, get) => ({
      products: [],
      loading: false,
      error: null,

      fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) {
            handleSupabaseError(error, 'fetch products');
            return;
          }

          const products = data?.map(convertDbProductToApp) || [];
          set({ products, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch products',
            loading: false 
          });
        }
      },

      addProduct: async (productData: ProductFormData) => {
        set({ loading: true, error: null });
        try {
          const newProduct: Product = {
            id: crypto.randomUUID(),
            ...productData,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const dbProduct = convertAppProductToDb(newProduct);
          const { data, error } = await supabase
            .from('products')
            .insert(dbProduct)
            .select()
            .single();

          if (error) {
            handleSupabaseError(error, 'add product');
            return;
          }

          const convertedProduct = convertDbProductToApp(data);
          set((state) => ({
            products: [convertedProduct, ...state.products],
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add product',
            loading: false 
          });
        }
      },

      updateProduct: async (id: string, productData: Partial<ProductFormData>) => {
        set({ loading: true, error: null });
        try {
          const existingProduct = get().products.find(p => p.id === id);
          if (!existingProduct) {
            throw new Error('Product not found');
          }

          const updatedProduct = {
            ...existingProduct,
            ...productData,
            updatedAt: new Date(),
          };

          const dbProduct = convertAppProductToDb(updatedProduct);
          const { data, error } = await supabase
            .from('products')
            .update(dbProduct)
            .eq('id', id)
            .select()
            .single();

          if (error) {
            handleSupabaseError(error, 'update product');
            return;
          }

          const convertedProduct = convertDbProductToApp(data);
          set((state) => ({
            products: state.products.map(product =>
              product.id === id ? convertedProduct : product
            ),
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update product',
            loading: false 
          });
        }
      },

      deleteProduct: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

          if (error) {
            handleSupabaseError(error, 'delete product');
            return;
          }

          set((state) => ({
            products: state.products.filter(product => product.id !== id),
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete product',
            loading: false 
          });
        }
      },

      getProductById: (id: string) => {
        return get().products.find(product => product.id === id);
      },

      searchProducts: (query: string) => {
        if (!query.trim()) return get().products;
        
        const lowerQuery = query.toLowerCase();
        return get().products.filter(product =>
          product.name.toLowerCase().includes(lowerQuery) ||
          product.description.toLowerCase().includes(lowerQuery) ||
          product.category.toLowerCase().includes(lowerQuery) ||
          product.sku?.toLowerCase().includes(lowerQuery)
        );
      },

      getLowStockProducts: () => {
        return get().products.filter(
          product => product.stockQuantity <= product.minStockLevel
        );
      },

      updateStock: async (id: string, quantity: number) => {
        set({ loading: true, error: null });
        try {
          const { error } = await supabase
            .from('products')
            .update({ 
              stock_quantity: quantity,
              updated_at: new Date().toISOString()
            })
            .eq('id', id);

          if (error) {
            handleSupabaseError(error, 'update stock');
            return;
          }

          set((state) => ({
            products: state.products.map(product =>
              product.id === id
                ? { ...product, stockQuantity: quantity, updatedAt: new Date() }
                : product
            ),
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update stock',
            loading: false 
          });
        }
      },

      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'product-store',
    }
  )
);

// Listen for refresh events from sales
if (typeof window !== 'undefined') {
  window.addEventListener('refreshProducts', () => {
    useProductStore.getState().fetchProducts();
  });
}
