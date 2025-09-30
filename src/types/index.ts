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

// Workshop Types
export interface Instructor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  specialties: string[];
  experience: number; // years
  imageUrl?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  hourlyRate: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workshop {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  instructorId: string;
  instructor?: Instructor;
  category: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in hours
  maxParticipants: number;
  price: number;
  materialsCost?: number;
  imageUrl?: string;
  requirements?: string[];
  materials?: string[];
  schedule: WorkshopSchedule[];
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  isRecurring: boolean;
  recurringPattern?: 'weekly' | 'monthly' | 'custom';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkshopSchedule {
  id: string;
  workshopId: string;
  startDate: Date;
  endDate: Date;
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  location: string;
  room?: string;
  maxParticipants: number;
  currentParticipants: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
}

export interface WorkshopRegistration {
  id: string;
  workshopId: string;
  scheduleId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  registrationDate: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'online' | 'other';
  totalAmount: number;
  notes?: string;
  specialRequests?: string;
}

// Workshop Form Types
export interface InstructorFormData {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  specialties: string[];
  experience: number;
  imageUrl?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
  hourlyRate: number;
  isActive: boolean;
}

export interface WorkshopFormData {
  title: string;
  description: string;
  shortDescription: string;
  instructorId: string;
  category: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  maxParticipants: number;
  price: number;
  materialsCost?: number;
  imageUrl?: string;
  requirements?: string[];
  materials?: string[];
  isRecurring: boolean;
  recurringPattern?: 'weekly' | 'monthly' | 'custom';
  tags: string[];
}

export interface WorkshopScheduleFormData {
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  location: string;
  room?: string;
  maxParticipants: number;
  notes?: string;
}

export interface WorkshopRegistrationFormData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  paymentMethod: 'cash' | 'card' | 'online' | 'other';
  notes?: string;
  specialRequests?: string;
}