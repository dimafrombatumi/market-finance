import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Product, Sale, Transaction, DashboardData } from '../types';

// Storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'handmade_store_products',
  SALES: 'handmade_store_sales',
  TRANSACTIONS: 'handmade_store_transactions',
};

// State interface
interface AppState {
  products: Product[];
  sales: Sale[];
  transactions: Transaction[];
  loading: boolean;
}

// Action types
type ActionType =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_DATA'; payload: { products: Product[]; sales: Sale[]; transactions: Transaction[] } }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'ADD_SALE'; payload: Sale }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string };

// Initial state
const initialState: AppState = {
  products: [],
  sales: [],
  transactions: [],
  loading: true,
};

// Reducer
const dataReducer = (state: AppState, action: ActionType): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'LOAD_DATA':
      return {
        ...state,
        products: action.payload.products,
        sales: action.payload.sales,
        transactions: action.payload.transactions,
        loading: false,
      };
    
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        ),
      };
    
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload),
      };
    
    case 'ADD_SALE':
      return { ...state, sales: [...state.sales, action.payload] };
    
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(transaction =>
          transaction.id === action.payload.id ? action.payload : transaction
        ),
      };
    
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(transaction => transaction.id !== action.payload),
      };
    
    default:
      return state;
  }
};

// Context interface
interface DataContextValue {
  state: AppState;
  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  // Sale actions
  addSale: (sale: Omit<Sale, 'id' | 'saleDate'>) => void;
  // Transaction actions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  // Data utilities
  getDashboardData: () => DashboardData;
  searchProducts: (query: string) => Product[];
  getProductById: (id: string) => Product | undefined;
  getLowStockProducts: () => Product[];
}

// Create context
const DataContext = createContext<DataContextValue | undefined>(undefined);

// Storage utilities
const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const loadFromStorage = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return [];
  }
};

// Provider component
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const products = loadFromStorage(STORAGE_KEYS.PRODUCTS).map((p: any) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
    }));
    
    const sales = loadFromStorage(STORAGE_KEYS.SALES).map((s: any) => ({
      ...s,
      saleDate: new Date(s.saleDate),
    }));
    
    const transactions = loadFromStorage(STORAGE_KEYS.TRANSACTIONS).map((t: any) => ({
      ...t,
      date: new Date(t.date),
    }));

    dispatch({ type: 'LOAD_DATA', payload: { products, sales, transactions } });
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!state.loading) {
      saveToStorage(STORAGE_KEYS.PRODUCTS, state.products);
      saveToStorage(STORAGE_KEYS.SALES, state.sales);
      saveToStorage(STORAGE_KEYS.TRANSACTIONS, state.transactions);
    }
  }, [state.products, state.sales, state.transactions, state.loading]);

  // Product actions
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const product: Product = {
      ...productData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_PRODUCT', payload: product });
  };

  const updateProduct = (product: Product) => {
    const updatedProduct = { ...product, updatedAt: new Date() };
    dispatch({ type: 'UPDATE_PRODUCT', payload: updatedProduct });
  };

  const deleteProduct = (id: string) => {
    dispatch({ type: 'DELETE_PRODUCT', payload: id });
  };

  // Sale actions
  const addSale = (saleData: Omit<Sale, 'id' | 'saleDate'>) => {
    const sale: Sale = {
      ...saleData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      saleDate: new Date(),
    };
    
    // Update product stock quantities
    sale.items.forEach(item => {
      const product = state.products.find(p => p.id === item.productId);
      if (product && product.stockQuantity >= item.quantity) {
        updateProduct({
          ...product,
          stockQuantity: product.stockQuantity - item.quantity,
        });
      }
    });

    // Add sale transaction
    const saleTransaction: Transaction = {
      id: sale.id + '_transaction',
      type: 'sale',
      category: 'Sales',
      description: `Sale #${sale.id}`,
      amount: sale.totalAmount,
      date: sale.saleDate,
      referenceId: sale.id,
    };

    dispatch({ type: 'ADD_SALE', payload: sale });
    dispatch({ type: 'ADD_TRANSACTION', payload: saleTransaction });
  };

  // Transaction actions
  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...transactionData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  };

  const updateTransaction = (transaction: Transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  // Utility functions
  const getDashboardData = (): DashboardData => {
    const totalRevenue = state.transactions
      .filter(t => t.type === 'sale' || t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = state.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netProfit = totalRevenue - totalExpenses;
    const totalSales = state.sales.length;
    const lowStockItems = getLowStockProducts();
    const recentTransactions = state.transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    return {
      totalRevenue,
      totalExpenses,
      netProfit,
      totalSales,
      lowStockItems,
      recentTransactions,
    };
  };

  const searchProducts = (query: string): Product[] => {
    const lowerQuery = query.toLowerCase();
    return state.products.filter(
      product =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );
  };

  const getProductById = (id: string): Product | undefined => {
    return state.products.find(product => product.id === id);
  };

  const getLowStockProducts = (): Product[] => {
    return state.products.filter(product => product.stockQuantity <= product.minStockLevel);
  };

  const value: DataContextValue = {
    state,
    addProduct,
    updateProduct,
    deleteProduct,
    addSale,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getDashboardData,
    searchProducts,
    getProductById,
    getLowStockProducts,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Custom hook
export const useData = (): DataContextValue => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};