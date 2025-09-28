// Core Business Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  category: string;
  stockQuantity: number;
  minStockLevel: number;
  sku?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  saleDate: Date;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items: SaleItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'online' | 'other';
  notes?: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense' | 'sale';
  category: string;
  description: string;
  amount: number;
  date: Date;
  referenceId?: string;
  notes?: string;
}

export interface DashboardData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  totalSales: number;
  lowStockItems: Product[];
  recentTransactions: Transaction[];
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
  price: number;
  cost: number;
  category: string;
  stockQuantity: number;
  minStockLevel: number;
  sku?: string;
  imageUrl?: string;
}

export interface SaleFormData {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items: SaleItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'online' | 'other';
  notes?: string;
}

export interface TransactionFormData {
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: Date;
  notes?: string;
}

// Chart Data Types
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  name: string;
  value: number;
}

export interface MonthlyTrend {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}