// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number; // Cost to make/acquire
  stockQuantity: number;
  minStockLevel: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Sale Types
export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'online' | 'other';
  customerName?: string;
  customerEmail?: string;
  saleDate: Date;
  notes?: string;
}

// Financial Transaction Types
export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'sale';
  category: string;
  description: string;
  amount: number;
  date: Date;
  referenceId?: string; // Links to sale ID if it's a sale transaction
}

// Dashboard/Report Types
export interface DashboardData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalSales: number;
  lowStockItems: Product[];
  recentTransactions: Transaction[];
}

export interface ReportFilters {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  type?: 'income' | 'expense' | 'sale' | 'all';
}

// UI Types
export interface NavigationItem {
  path: string;
  label: string;
  icon: string;
}

export type ThemeMode = 'light' | 'dark';

// Form Types
export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: string;
  cost: string;
  stockQuantity: string;
  minStockLevel: string;
  imageUrl?: string;
}

export interface SaleFormData {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  paymentMethod: 'cash' | 'card' | 'online' | 'other';
  customerName?: string;
  customerEmail?: string;
  notes?: string;
}

export interface TransactionFormData {
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: string;
  date: string;
}