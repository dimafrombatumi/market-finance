import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Transaction, TransactionFormData } from '../../types';
import { Input, TextArea, Select } from '../common/Input';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useTransactionStore } from '../../stores';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

// const FormGroup = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 20px;
// `;

const TypeOptions = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

const CategoryOptions = {
  income: [
    { value: 'Sales Revenue', label: 'Sales Revenue' },
    { value: 'Other Income', label: 'Other Income' },
    { value: 'Investment', label: 'Investment' },
    { value: 'Grants', label: 'Grants' },
    { value: 'Donations', label: 'Donations' },
  ],
  expense: [
    { value: 'Materials & Supplies', label: 'Materials & Supplies' },
    { value: 'Rent & Utilities', label: 'Rent & Utilities' },
    { value: 'Marketing & Advertising', label: 'Marketing & Advertising' },
    { value: 'Professional Services', label: 'Professional Services' },
    { value: 'Equipment & Tools', label: 'Equipment & Tools' },
    { value: 'Transportation', label: 'Transportation' },
    { value: 'Insurance', label: 'Insurance' },
    { value: 'Taxes', label: 'Taxes' },
    { value: 'Other', label: 'Other' },
  ],
};

interface TransactionFormProps {
  transaction?: Transaction;
  onClose: () => void;
  onSuccess?: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onClose,
  onSuccess
}) => {
  const { addTransaction, updateTransaction } = useTransactionStore();
  const [formData, setFormData] = useState<TransactionFormData>({
    type: 'expense',
    category: '',
    description: '',
    amount: 0,
    date: new Date(),
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type as 'income' | 'expense',
        category: transaction.category,
        description: transaction.description,
        amount: transaction.amount,
        date: transaction.date,
        notes: transaction.notes || '',
      });
    }
  }, [transaction]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (transaction) {
        await updateTransaction(transaction.id, formData);
      } else {
        await addTransaction(formData);
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleChange = (field: keyof TransactionFormData, value: string | number | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTypeChange = (type: 'income' | 'expense') => {
    setFormData(prev => ({ 
      ...prev, 
      type,
      category: '' // Reset category when type changes
    }));
    setErrors(prev => ({ ...prev, category: '' }));
  };

  const currentCategoryOptions = CategoryOptions[formData.type] || [];

  return (
    <form id="transaction-form" onSubmit={handleSubmit}>
      <FormContainer>
        <FormRow>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: 500, 
              color: '#374151',
              marginBottom: '6px'
            }}>
              Type *
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {TypeOptions.map(option => (
                <label key={option.value} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="type"
                    value={option.value}
                    checked={formData.type === option.value}
                    onChange={(e) => handleTypeChange(e.target.value as 'income' | 'expense')}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>
          
          <Input
            label="Amount *"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => handleChange('amount', parseFloat(e.target.value) || 0)}
            error={errors.amount}
            fullWidth
            placeholder="0.00"
          />
        </FormRow>

        <FormRow>
          <Select
            label="Category *"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            options={currentCategoryOptions}
            error={errors.category}
            fullWidth
          />
          
          <Input
            label="Date"
            type="datetime-local"
            value={formData.date.toISOString().slice(0, 16)}
            onChange={(e) => handleChange('date', new Date(e.target.value))}
            fullWidth
          />
        </FormRow>

        <Input
          label="Description *"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          error={errors.description}
          fullWidth
          placeholder="Enter transaction description"
        />

        <TextArea
          label="Notes"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          fullWidth
          placeholder="Additional notes (optional)"
        />
      </FormContainer>
    </form>
  );
};

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction;
}

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  onClose,
  transaction
}) => {
  const { loading } = useTransactionStore();

  const handleSuccess = () => {
    console.log('Transaction saved successfully');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={transaction ? 'Edit Transaction' : 'Add New Transaction'}
      size="md"
      footer={
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="transaction-form"
            loading={loading}
            disabled={loading}
          >
            {transaction ? 'Update Transaction' : 'Add Transaction'}
          </Button>
        </div>
      }
    >
      <TransactionForm
        transaction={transaction}
        onClose={onClose}
        onSuccess={handleSuccess}
      />
    </Modal>
  );
};
