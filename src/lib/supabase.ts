import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          cost: number;
          category: string;
          stock_quantity: number;
          min_stock_level: number;
          sku?: string;
          image_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          cost: number;
          category: string;
          stock_quantity: number;
          min_stock_level: number;
          sku?: string;
          image_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          cost?: number;
          category?: string;
          stock_quantity?: number;
          min_stock_level?: number;
          sku?: string;
          image_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      sales: {
        Row: {
          id: string;
          sale_date: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          subtotal: number;
          tax_amount: number;
          discount_amount: number;
          total_amount: number;
          payment_method: 'cash' | 'card' | 'online' | 'other';
          notes?: string;
          status: 'completed' | 'pending' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sale_date?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          subtotal: number;
          tax_amount: number;
          discount_amount: number;
          total_amount: number;
          payment_method: 'cash' | 'card' | 'online' | 'other';
          notes?: string;
          status?: 'completed' | 'pending' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sale_date?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          subtotal?: number;
          tax_amount?: number;
          discount_amount?: number;
          total_amount?: number;
          payment_method?: 'cash' | 'card' | 'online' | 'other';
          notes?: string;
          status?: 'completed' | 'pending' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      sale_items: {
        Row: {
          id: string;
          sale_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          sale_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          sale_id?: string;
          product_id?: string;
          product_name?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          created_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          type: 'income' | 'expense' | 'sale';
          category: string;
          description: string;
          amount: number;
          date: string;
          reference_id?: string;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: 'income' | 'expense' | 'sale';
          category: string;
          description: string;
          amount: number;
          date?: string;
          reference_id?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: 'income' | 'expense' | 'sale';
          category?: string;
          description?: string;
          amount?: number;
          date?: string;
          reference_id?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
