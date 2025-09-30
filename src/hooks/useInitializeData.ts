import { useEffect, useRef } from 'react';
import { useProductStore } from '../stores/productStore';
import { useSalesStore } from '../stores/salesStore';
import { useTransactionStore } from '../stores/transactionStore';

export const useInitializeData = () => {
  const { fetchProducts } = useProductStore();
  const { fetchSales } = useSalesStore();
  const { fetchTransactions } = useTransactionStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only initialize once, not on every render
    if (hasInitialized.current) return;
    
    // Initialize all data when the app starts
    const initializeData = async () => {
      try {
        console.log('Initializing data from Supabase...');
        await Promise.all([
          fetchProducts(),
          fetchSales(),
          fetchTransactions(),
        ]);
        hasInitialized.current = true;
        console.log('Data initialization completed');
      } catch (error) {
        console.error('Failed to initialize data:', error);
      }
    };

    initializeData();
  }, []); // Remove dependencies to prevent re-initialization
};
