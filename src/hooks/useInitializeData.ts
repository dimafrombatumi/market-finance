import { useEffect } from 'react';
import { useProductStore } from '../stores/productStore';
import { useSalesStore } from '../stores/salesStore';
import { useTransactionStore } from '../stores/transactionStore';

export const useInitializeData = () => {
  const { fetchProducts } = useProductStore();
  const { fetchSales } = useSalesStore();
  const { fetchTransactions } = useTransactionStore();

  useEffect(() => {
    // Initialize all data when the app starts
    const initializeData = async () => {
      try {
        await Promise.all([
          fetchProducts(),
          fetchSales(),
          fetchTransactions(),
        ]);
      } catch (error) {
        console.error('Failed to initialize data:', error);
      }
    };

    initializeData();
  }, [fetchProducts, fetchSales, fetchTransactions]);
};
