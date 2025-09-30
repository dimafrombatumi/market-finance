import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Transaction, TransactionFormData } from '../types';
import { supabase } from '../lib/supabase';
import { convertDbTransactionToApp, convertAppTransactionToDb, handleSupabaseError } from '../lib/supabaseUtils';

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchTransactions: () => void;
  addTransaction: (transactionData: TransactionFormData) => void;
  updateTransaction: (id: string, transactionData: Partial<TransactionFormData>) => void;
  deleteTransaction: (id: string) => void;
  getTransactionById: (id: string) => Transaction | undefined;
  getTransactionsByType: (type: 'income' | 'expense' | 'sale') => Transaction[];
  getTransactionsByDateRange: (startDate: Date, endDate: Date) => Transaction[];
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getNetProfit: () => number;
  getRecentTransactions: (limit?: number) => Transaction[];
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  restoreTransactions: (transactions: Transaction[]) => void;
}

export const useTransactionStore = create<TransactionState>()(
  devtools(
    (set, get) => ({
      transactions: [],
      loading: false,
      error: null,

      fetchTransactions: async () => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: false });

          if (error) {
            handleSupabaseError(error, 'fetch transactions');
            return;
          }

          const transactions = data?.map(convertDbTransactionToApp) || [];
          set({ transactions, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch transactions',
            loading: false 
          });
        }
      },

      addTransaction: async (transactionData: TransactionFormData) => {
        set({ loading: true, error: null });
        try {
          const newTransaction: Transaction = {
            id: crypto.randomUUID(),
            ...transactionData,
          };

          const dbTransaction = convertAppTransactionToDb(newTransaction);
          const { data, error } = await supabase
            .from('transactions')
            .insert(dbTransaction)
            .select()
            .single();

          if (error) {
            handleSupabaseError(error, 'add transaction');
            return;
          }

          const convertedTransaction = convertDbTransactionToApp(data);
          set((state) => ({
            transactions: [convertedTransaction, ...state.transactions],
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add transaction',
            loading: false 
          });
        }
      },

      updateTransaction: async (id: string, transactionData: Partial<TransactionFormData>) => {
        set({ loading: true, error: null });
        try {
          const existingTransaction = get().transactions.find(t => t.id === id);
          if (!existingTransaction) {
            throw new Error('Transaction not found');
          }

          const updatedTransaction = {
            ...existingTransaction,
            ...transactionData,
          };

          const dbTransaction = convertAppTransactionToDb(updatedTransaction);
          const { data, error } = await supabase
            .from('transactions')
            .update(dbTransaction)
            .eq('id', id)
            .select()
            .single();

          if (error) {
            handleSupabaseError(error, 'update transaction');
            return;
          }

          const convertedTransaction = convertDbTransactionToApp(data);
          set((state) => ({
            transactions: state.transactions.map(transaction =>
              transaction.id === id ? convertedTransaction : transaction
            ),
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update transaction',
            loading: false 
          });
        }
      },

      deleteTransaction: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);

          if (error) {
            handleSupabaseError(error, 'delete transaction');
            return;
          }

          set((state) => ({
            transactions: state.transactions.filter(transaction => transaction.id !== id),
            loading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete transaction',
            loading: false 
          });
        }
      },

      getTransactionById: (id: string) => {
        return get().transactions.find(transaction => transaction.id === id);
      },

      getTransactionsByType: (type: 'income' | 'expense' | 'sale') => {
        return get().transactions.filter(transaction => transaction.type === type);
      },

      getTransactionsByDateRange: (startDate: Date, endDate: Date) => {
        return get().transactions.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= startDate && transactionDate <= endDate;
        });
      },

      getTotalIncome: () => {
        return get().transactions
          .filter(transaction => transaction.type === 'income' || transaction.type === 'sale')
          .reduce((total, transaction) => total + transaction.amount, 0);
      },

      getTotalExpenses: () => {
        return get().transactions
          .filter(transaction => transaction.type === 'expense')
          .reduce((total, transaction) => total + transaction.amount, 0);
      },

      getNetProfit: () => {
        const income = get().getTotalIncome();
        const expenses = get().getTotalExpenses();
        return income - expenses;
      },

      getRecentTransactions: (limit = 10) => {
        return [...get().transactions]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit);
      },

      setLoading: (loading: boolean) => set({ loading }),
      setError: (error: string | null) => set({ error }),

      restoreTransactions: (transactions: Transaction[]) => {
        console.log('Transaction store: restoring', transactions.length, 'transactions');
        set({ transactions, loading: false, error: null });
      },
    }),
    {
      name: 'transaction-store',
    }
  )
);
