import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { DashboardData, Product, Transaction } from '../types';
import { useProductStore } from './productStore';
import { useSalesStore } from './salesStore';
import { useTransactionStore } from './transactionStore';

interface DashboardState {
  loading: boolean;
  error: string | null;
  
  // Computed data
  getDashboardData: () => DashboardData;
  getTotalRevenue: () => number;
  getTotalExpenses: () => number;
  getNetProfit: () => number;
  getTotalSales: () => number;
  getLowStockItems: () => Product[];
  getRecentTransactions: () => Transaction[];
  
  // Actions
  refreshData: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set, get) => ({
      loading: false,
      error: null,

      getDashboardData: () => {
        const productStore = useProductStore.getState();
        const salesStore = useSalesStore.getState();
        const transactionStore = useTransactionStore.getState();

        const totalRevenue = transactionStore.getTotalIncome();
        const totalExpenses = transactionStore.getTotalExpenses();
        const netProfit = totalRevenue - totalExpenses;
        const totalSales = salesStore.getTotalSalesCount();
        const lowStockItems = productStore.getLowStockProducts();
        const recentTransactions = transactionStore.getRecentTransactions(10);

        return {
          totalRevenue,
          totalExpenses,
          netProfit,
          totalSales,
          lowStockItems,
          recentTransactions,
        };
      },

      getTotalRevenue: () => {
        const transactionStore = useTransactionStore.getState();
        return transactionStore.getTotalIncome();
      },

      getTotalExpenses: () => {
        const transactionStore = useTransactionStore.getState();
        return transactionStore.getTotalExpenses();
      },

      getNetProfit: () => {
        const transactionStore = useTransactionStore.getState();
        return transactionStore.getNetProfit();
      },

      getTotalSales: () => {
        const salesStore = useSalesStore.getState();
        return salesStore.getTotalSalesCount();
      },

      getLowStockItems: () => {
        const productStore = useProductStore.getState();
        return productStore.getLowStockProducts();
      },

      getRecentTransactions: () => {
        const transactionStore = useTransactionStore.getState();
        return transactionStore.getRecentTransactions(10);
      },

      refreshData: () => {
        set({ loading: true, error: null });
        try {
          // Refresh all stores
          useProductStore.getState().fetchProducts();
          useSalesStore.getState().fetchSales();
          useTransactionStore.getState().fetchTransactions();
          set({ loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to refresh data',
            loading: false 
          });
        }
      },

      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'dashboard-store',
    }
  )
);
