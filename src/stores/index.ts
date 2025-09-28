// Export all stores
export { useProductStore } from './productStore';
export { useSalesStore } from './salesStore';
export { useTransactionStore } from './transactionStore';
export { useDashboardStore } from './dashboardStore';

// Re-export types for convenience
export type { Product, Sale, Transaction, DashboardData } from '../types';
