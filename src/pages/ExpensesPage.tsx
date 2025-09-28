import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, Receipt, TrendingUp, TrendingDown, Edit, Trash2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Transaction } from '../types';
import { TransactionForm } from '../components/expenses/TransactionForm';

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

const ActionButton = styled.button<{ variant?: 'edit' | 'delete' }>`
  padding: 6px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => {
    switch (props.variant) {
      case 'edit': return 'rgba(59, 130, 246, 0.1)';
      case 'delete': return 'rgba(239, 68, 68, 0.1)';
      default: return 'rgba(0, 0, 0, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.variant) {
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

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  margin: 20px;
`;

export const ExpensesPage: React.FC = () => {
  const { state, deleteTransaction } = useData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

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

  // Filter out sales transactions (they're shown in sales page)
  const transactions = state.transactions.filter(t => t.type !== 'sale');
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  return (
    <ExpensesContainer>
      <Header>
        <HeaderTitle>Expenses & Income ({transactions.length})</HeaderTitle>
        <AddTransactionButton onClick={handleAddTransaction}>
          <Plus size={18} />
          Add Transaction
        </AddTransactionButton>
      </Header>

      <TransactionsList>
        {sortedTransactions.length > 0 ? (
          sortedTransactions.map(transaction => (
            <TransactionItem key={transaction.id}>
              <TransactionIcon type={transaction.type}>
                {transaction.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              </TransactionIcon>
              
              <TransactionInfo>
                <div className="description">{transaction.description}</div>
                <div className="details">
                  <span>Category: {transaction.category}</span>
                  <span>Date: {formatDate(transaction.date)}</span>
                </div>
              </TransactionInfo>
              
              <TransactionAmount type={transaction.type}>
                {transaction.type === 'expense' ? '-' : '+'}
                {formatCurrency(transaction.amount)}
              </TransactionAmount>
              
              <TransactionDate>
                {formatDate(transaction.date)}
              </TransactionDate>
              
              <TransactionActions>
                <ActionButton 
                  variant="edit" 
                  onClick={() => handleEditTransaction(transaction)}
                >
                  <Edit size={16} />
                </ActionButton>
                <ActionButton 
                  variant="delete" 
                  onClick={() => handleDeleteTransaction(transaction.id)}
                >
                  <Trash2 size={16} />
                </ActionButton>
              </TransactionActions>
            </TransactionItem>
          ))
        ) : (
          <EmptyState>
            <Receipt size={64} />
            <h3>No transactions yet</h3>
            <p>Start by adding your first expense or income</p>
          </EmptyState>
        )}
      </TransactionsList>

      <Modal isOpen={isFormOpen}>
        <ModalContent>
          <TransactionForm
            transaction={editingTransaction}
            onClose={handleFormClose}
          />
        </ModalContent>
      </Modal>
    </ExpensesContainer>
  );
};