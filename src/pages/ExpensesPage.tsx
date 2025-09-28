import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, Receipt, TrendingUp, TrendingDown, Edit, Trash2 } from 'lucide-react';
import { useTransactionStore } from '../stores';
import { TransactionFormModal } from '../components/transactions/TransactionForm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';

const ExpensesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
`;

const AddTransactionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #2563eb;
  }
`;

const TransactionsList = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TransactionItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f8fafc;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TransactionIcon = styled.div<{ type: 'income' | 'expense' }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.type === 'income' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.type === 'income' ? '#10b981' : '#ef4444'};
`;

const TransactionInfo = styled.div`
  .description {
    font-weight: 500;
    color: #1e293b;
    margin-bottom: 4px;
  }
  
  .details {
    font-size: 12px;
    color: #64748b;
    display: flex;
    gap: 12px;
  }
`;

const TransactionAmount = styled.div<{ type: 'income' | 'expense' }>`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.type === 'income' ? '#10b981' : '#ef4444'};
`;

const TransactionDate = styled.div`
  font-size: 12px;
  color: #64748b;
  text-align: right;
`;

const TransactionActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button<{ $variant?: 'edit' | 'delete' }>`
  padding: 6px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => {
    switch (props.$variant) {
      case 'edit': return 'rgba(59, 130, 246, 0.1)';
      case 'delete': return 'rgba(239, 68, 68, 0.1)';
      default: return 'rgba(0, 0, 0, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'edit': return '#3b82f6';
      case 'delete': return '#ef4444';
      default: return '#6b7280';
    }
  }};
  
  &:hover {
    transform: scale(1.1);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
  
  h3 {
    margin: 16px 0 8px 0;
    font-size: 18px;
    color: #1e293b;
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
`;


export const ExpensesPage: React.FC = () => {
  const { t } = useLanguage();
  const [isTransactionFormOpen, setIsTransactionFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; transaction: any }>({
    isOpen: false,
    transaction: null
  });

  const { getTransactionsByType, deleteTransaction, loading } = useTransactionStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Get income and expense transactions (excluding sales)
  const incomeTransactions = getTransactionsByType('income');
  const expenseTransactions = getTransactionsByType('expense');
  const filteredTransactions = [...incomeTransactions, ...expenseTransactions];
  
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Handlers using Zustand store
  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsTransactionFormOpen(true);
  };

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setIsTransactionFormOpen(true);
  };

  const handleDeleteTransaction = (transaction: any) => {
    setDeleteConfirm({ isOpen: true, transaction });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.transaction) {
      await deleteTransaction(deleteConfirm.transaction.id);
      setDeleteConfirm({ isOpen: false, transaction: null });
    }
  };

  const closeTransactionForm = () => {
    setIsTransactionFormOpen(false);
    setEditingTransaction(null);
  };

  // Show loading spinner while data is being fetched
  if (loading && filteredTransactions.length === 0) {
    return <LoadingSpinner text={t('common.loading')} />;
  }

  return (
    <ExpensesContainer>
      <Header>
        <HeaderTitle>{t('transactions.title')} ({filteredTransactions.length})</HeaderTitle>
        <AddTransactionButton onClick={handleAddTransaction}>
          <Plus size={18} />
          {t('transactions.addTransaction')}
        </AddTransactionButton>
      </Header>

      <TransactionsList>
        {sortedTransactions.length > 0 ? (
          sortedTransactions.map(transaction => (
            <TransactionItem key={transaction.id}>
              <TransactionIcon type={transaction.type as 'income' | 'expense'}>
                {transaction.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              </TransactionIcon>
              
              <TransactionInfo>
                <div className="description">{transaction.description}</div>
                <div className="details">
                  <span>{t('common.category')}: {transaction.category}</span>
                  <span>{t('common.date')}: {formatDate(transaction.date)}</span>
                </div>
              </TransactionInfo>
              
              <TransactionAmount type={transaction.type as 'income' | 'expense'}>
                {transaction.type === 'expense' ? '-' : '+'}
                {formatCurrency(transaction.amount)}
              </TransactionAmount>
              
              <TransactionDate>
                {formatDate(transaction.date)}
              </TransactionDate>
              
              <TransactionActions>
                      <ActionButton 
                        $variant="edit" 
                        onClick={() => handleEditTransaction(transaction)}
                      >
                        <Edit size={16} />
                      </ActionButton>
                      <ActionButton 
                        $variant="delete" 
                        onClick={() => handleDeleteTransaction(transaction)}
                      >
                        <Trash2 size={16} />
                      </ActionButton>
              </TransactionActions>
            </TransactionItem>
          ))
        ) : (
          <EmptyState>
            <Receipt size={64} />
            <h3>{t('transactions.noTransactions')}</h3>
            <p>{t('transactions.startByAddingTransaction')}</p>
          </EmptyState>
        )}
      </TransactionsList>

      {/* Transaction Form Modal */}
      <TransactionFormModal
        isOpen={isTransactionFormOpen}
        onClose={closeTransactionForm}
        transaction={editingTransaction}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, transaction: null })}
        onConfirm={confirmDelete}
        title={t('transactions.deleteTransaction')}
        message={t('transactions.deleteConfirm')}
        type="danger"
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        loading={loading}
      />

    </ExpensesContainer>
  );
};