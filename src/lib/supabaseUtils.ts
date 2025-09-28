import { supabase } from './supabase';
import { Product, Sale, Transaction, SaleItem } from '../types';

// Helper functions to convert between database and app types

export const convertDbProductToApp = (dbProduct: any): Product => ({
  id: dbProduct.id,
  name: dbProduct.name,
  description: dbProduct.description,
  price: dbProduct.price,
  cost: dbProduct.cost,
  category: dbProduct.category,
  stockQuantity: dbProduct.stock_quantity,
  minStockLevel: dbProduct.min_stock_level,
  sku: dbProduct.sku,
  imageUrl: dbProduct.image_url,
  createdAt: new Date(dbProduct.created_at),
  updatedAt: new Date(dbProduct.updated_at),
});

export const convertAppProductToDb = (appProduct: Product) => ({
  id: appProduct.id,
  name: appProduct.name,
  description: appProduct.description,
  price: appProduct.price,
  cost: appProduct.cost,
  category: appProduct.category,
  stock_quantity: appProduct.stockQuantity,
  min_stock_level: appProduct.minStockLevel,
  sku: appProduct.sku,
  image_url: appProduct.imageUrl,
  created_at: appProduct.createdAt.toISOString(),
  updated_at: appProduct.updatedAt.toISOString(),
});

export const convertDbSaleToApp = async (dbSale: any): Promise<Sale> => {
  // Fetch sale items
  const { data: saleItems, error } = await supabase
    .from('sale_items')
    .select('*')
    .eq('sale_id', dbSale.id);

  if (error) {
    console.error('Error fetching sale items:', error);
    throw error;
  }

  const items: SaleItem[] = saleItems?.map(item => ({
    productId: item.product_id,
    productName: item.product_name,
    quantity: item.quantity,
    unitPrice: item.unit_price,
    totalPrice: item.total_price,
  })) || [];

  return {
    id: dbSale.id,
    saleDate: new Date(dbSale.sale_date),
    customerName: dbSale.customer_name,
    customerEmail: dbSale.customer_email,
    customerPhone: dbSale.customer_phone,
    items,
    subtotal: dbSale.subtotal,
    taxAmount: dbSale.tax_amount,
    discountAmount: dbSale.discount_amount,
    totalAmount: dbSale.total_amount,
    paymentMethod: dbSale.payment_method,
    notes: dbSale.notes,
    status: dbSale.status,
  };
};

export const convertAppSaleToDb = (appSale: Sale) => ({
  id: appSale.id,
  sale_date: appSale.saleDate.toISOString(),
  customer_name: appSale.customerName,
  customer_email: appSale.customerEmail,
  customer_phone: appSale.customerPhone,
  subtotal: appSale.subtotal,
  tax_amount: appSale.taxAmount,
  discount_amount: appSale.discountAmount,
  total_amount: appSale.totalAmount,
  payment_method: appSale.paymentMethod,
  notes: appSale.notes,
  status: appSale.status,
});

export const convertDbTransactionToApp = (dbTransaction: any): Transaction => ({
  id: dbTransaction.id,
  type: dbTransaction.type,
  category: dbTransaction.category,
  description: dbTransaction.description,
  amount: dbTransaction.amount,
  date: new Date(dbTransaction.date),
  referenceId: dbTransaction.reference_id,
  notes: dbTransaction.notes,
});

export const convertAppTransactionToDb = (appTransaction: Transaction) => ({
  id: appTransaction.id,
  type: appTransaction.type,
  category: appTransaction.category,
  description: appTransaction.description,
  amount: appTransaction.amount,
  date: appTransaction.date.toISOString(),
  reference_id: appTransaction.referenceId,
  notes: appTransaction.notes,
});

// Error handling utility
export const handleSupabaseError = (error: any, operation: string) => {
  console.error(`Supabase error during ${operation}:`, error);
  throw new Error(`Failed to ${operation}: ${error.message || 'Unknown error'}`);
};
