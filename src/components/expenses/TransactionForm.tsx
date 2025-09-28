import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Save } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Transaction, TransactionFormData } from '../../types';

const FormContainer = styled.div`
  padding: 24px;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
`;

const FormTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
`;

const CloseButton = styled.button`
  padding: 8px;
  border: none;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f1f5f9;
    color: #1e293b;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.variant === 'primary' ? `
    background-color: #3b82f6;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #2563eb;
    }
    
    &:disabled {
      background-color: #9ca3af;
      cursor: not-allowed;
    }
  ` : `
    background-color: #f8fafc;
    color: #64748b;
    border: 1px solid #e2e8f0;
    
    &:hover {
      background-color: #f1f5f9;
      color: #1e293b;
    }
  `}
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
`;

interface TransactionFormProps {
  transaction?: Transaction | null;
  onClose: () => void;
}

const commonCategories = {
  expense: [
    'Materials & Supplies',
    'Equipment',
    'Marketing & Advertising',
    'Shipping & Packaging',
    'Office Supplies',
    'Utilities',
    'Insurance',
    'Professional Services',
    'Travel',
    'Other'
  ],
  income: [
    'Product Sales',
    'Custom Orders',
    'Workshops/Classes',
    'Consultation',
    'Grants',
    'Investment',
    'Other'
  ]
};

export const TransactionForm: React.FC<TransactionFormProps> = ({ transaction, onClose }) => {
  const { addTransaction, updateTransaction } = useData();
  const [formData, setFormData] = useState<TransactionFormData>({
    type: 'expense',
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<Partial<TransactionFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type as 'income' | 'expense',
        category: transaction.category,
        description: transaction.description,
        amount: transaction.amount.toString(),
        date: transaction.date.toISOString().split('T')[0],
      });
    }
  }, [transaction]);

  const validateForm = (): boolean => {
    const newErrors: Partial<TransactionFormData> = {};

    if (!formData.type) {
      newErrors.type = 'Transaction type is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const transactionData = {
        type: formData.type,
        category: formData.category.trim(),
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        date: new Date(formData.date),
      };

      if (transaction) {
        updateTransaction({
          ...transaction,
          ...transactionData,
        });
      } else {
        addTransaction(transactionData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof TransactionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const availableCategories = commonCategories[formData.type];

  return (
    <FormContainer>
      <FormHeader>
        <FormTitle>{transaction ? 'Edit Transaction' : 'Add New Transaction'}</FormTitle>
        <CloseButton onClick={onClose} type="button">
          <X size={20} />
        </CloseButton>
      </FormHeader>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="type">Transaction Type *</Label>
          <Select
            id="type"
            value={formData.type}
            onChange={(e) => {
              handleInputChange('type', e.target.value);
              // Reset category when type changes
              setFormData(prev => ({ ...prev, category: '' }));
            }}
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Select>
          {errors.type && <ErrorMessage>{errors.type}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="category">Category *</Label>
          <Select
            id="category"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            required
          >
            <option value="">Select a category...</option>
            {availableCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          {errors.category && <ErrorMessage>{errors.category}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Description *</Label>
          <Input
            id="description"
            type="text"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter transaction description"
            required
          />
          {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="amount">Amount ($) *</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            placeholder="0.00"
            required
          />
          {errors.amount && <ErrorMessage>{errors.amount}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            required
          />
          {errors.date && <ErrorMessage>{errors.date}</ErrorMessage>}
        </FormGroup>

        <FormActions>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            <Save size={16} />
            {isSubmitting ? 'Saving...' : transaction ? 'Update Transaction' : 'Add Transaction'}
          </Button>
        </FormActions>
      </Form>
    </FormContainer>
  );
};