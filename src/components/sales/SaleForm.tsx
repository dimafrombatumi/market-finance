import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { X, Plus, Minus, ShoppingCart, Save } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Product, SaleItem } from '../../types';

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
  gap: 24px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProductSelector = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  background-color: #f8fafc;
`;

const ProductSelectorHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const ProductSelect = styled.select`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const QuantityInput = styled.input`
  width: 80px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const AddProductButton = styled.button`
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: #2563eb;
  }
  
  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const SelectedItems = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
`;

const ItemsHeader = styled.div`
  padding: 12px 16px;
  background-color: #f1f5f9;
  font-weight: 500;
  color: #374151;
  font-size: 14px;
`;

const ItemsList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const SaleItemRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto auto auto;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  .name {
    font-weight: 500;
    color: #1e293b;
    margin-bottom: 2px;
  }
  
  .details {
    font-size: 12px;
    color: #64748b;
  }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuantityButton = styled.button`
  width: 24px;
  height: 24px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f1f5f9;
    border-color: #9ca3af;
  }
`;

const RemoveButton = styled.button`
  padding: 4px;
  border: none;
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(239, 68, 68, 0.2);
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SaleTotal = styled.div`
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 8px;
  text-align: right;
  
  .label {
    font-size: 14px;
    color: #64748b;
    margin-bottom: 4px;
  }
  
  .amount {
    font-size: 24px;
    font-weight: 700;
    color: #10b981;
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
    background-color: #10b981;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #059669;
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

const EmptyItemsState = styled.div`
  padding: 40px 16px;
  text-align: center;
  color: #64748b;
  
  p {
    margin: 8px 0 0 0;
    font-size: 14px;
  }
`;

interface SaleFormProps {
  onClose: () => void;
}

export const SaleForm: React.FC<SaleFormProps> = ({ onClose }) => {
  const { state, addSale } = useData();
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'online' | 'other'>('cash');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const availableProducts = state.products.filter(product => product.stockQuantity > 0);

  const addProductToSale = () => {
    const product = state.products.find(p => p.id === selectedProductId);
    if (!product || selectedQuantity <= 0 || selectedQuantity > product.stockQuantity) {
      return;
    }

    const existingItemIndex = saleItems.findIndex(item => item.productId === selectedProductId);
    
    if (existingItemIndex >= 0) {
      const newQuantity = saleItems[existingItemIndex].quantity + selectedQuantity;
      if (newQuantity <= product.stockQuantity) {
        setSaleItems(prev => prev.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.unitPrice }
            : item
        ));
      }
    } else {
      const newItem: SaleItem = {
        productId: product.id,
        productName: product.name,
        quantity: selectedQuantity,
        unitPrice: product.price,
        totalPrice: selectedQuantity * product.price,
      };
      setSaleItems(prev => [...prev, newItem]);
    }

    setSelectedProductId('');
    setSelectedQuantity(1);
  };

  const updateItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(index);
      return;
    }

    const item = saleItems[index];
    const product = state.products.find(p => p.id === item.productId);
    
    if (product && newQuantity <= product.stockQuantity) {
      setSaleItems(prev => prev.map((item, i) => 
        i === index 
          ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.unitPrice }
          : item
      ));
    }
  };

  const removeItem = (index: number) => {
    setSaleItems(prev => prev.filter((_, i) => i !== index));
  };

  const totalAmount = saleItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (saleItems.length === 0) {
      alert('Please add at least one item to the sale');
      return;
    }

    setIsSubmitting(true);

    try {
      await addSale({
        items: saleItems,
        totalAmount,
        paymentMethod,
        customerName: customerName.trim() || undefined,
        customerEmail: customerEmail.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      onClose();
    } catch (error) {
      console.error('Error saving sale:', error);
      alert('Error saving sale. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      <FormHeader>
        <FormTitle>New Sale</FormTitle>
        <CloseButton onClick={onClose} type="button">
          <X size={20} />
        </CloseButton>
      </FormHeader>

      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>
            <ShoppingCart size={18} />
            Products
          </SectionTitle>
          
          <ProductSelector>
            <ProductSelectorHeader>
              <ProductSelect
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
              >
                <option value="">Select a product...</option>
                {availableProducts.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {formatCurrency(product.price)} (Stock: {product.stockQuantity})
                  </option>
                ))}
              </ProductSelect>
              
              <QuantityInput
                type="number"
                min="1"
                value={selectedQuantity}
                onChange={(e) => setSelectedQuantity(parseInt(e.target.value) || 1)}
                placeholder="Qty"
              />
              
              <AddProductButton 
                type="button"
                onClick={addProductToSale}
                disabled={!selectedProductId}
              >
                <Plus size={16} />
                Add
              </AddProductButton>
            </ProductSelectorHeader>
          </ProductSelector>

          <SelectedItems>
            <ItemsHeader>Selected Items</ItemsHeader>
            <ItemsList>
              {saleItems.length > 0 ? (
                saleItems.map((item, index) => (
                  <SaleItemRow key={index}>
                    <ItemInfo>
                      <div className="name">{item.productName}</div>
                      <div className="details">{formatCurrency(item.unitPrice)} each</div>
                    </ItemInfo>
                    
                    <QuantityControls>
                      <QuantityButton 
                        type="button"
                        onClick={() => updateItemQuantity(index, item.quantity - 1)}
                      >
                        <Minus size={12} />
                      </QuantityButton>
                      <span>{item.quantity}</span>
                      <QuantityButton 
                        type="button"
                        onClick={() => updateItemQuantity(index, item.quantity + 1)}
                      >
                        <Plus size={12} />
                      </QuantityButton>
                    </QuantityControls>
                    
                    <div>{formatCurrency(item.totalPrice)}</div>
                    
                    <RemoveButton 
                      type="button"
                      onClick={() => removeItem(index)}
                    >
                      <X size={16} />
                    </RemoveButton>
                  </SaleItemRow>
                ))
              ) : (
                <EmptyItemsState>
                  <ShoppingCart size={32} />
                  <p>No items added yet</p>
                </EmptyItemsState>
              )}
            </ItemsList>
          </SelectedItems>
        </Section>

        <Section>
          <SectionTitle>Customer Information (Optional)</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="customerEmail">Customer Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Enter customer email"
              />
            </FormGroup>
          </FormGrid>
        </Section>

        <Section>
          <SectionTitle>Payment & Notes</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="online">Online</option>
                <option value="other">Other</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this sale"
              />
            </FormGroup>
          </FormGrid>
        </Section>

        <SaleTotal>
          <div className="label">Total Amount</div>
          <div className="amount">{formatCurrency(totalAmount)}</div>
        </SaleTotal>

        <FormActions>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={isSubmitting || saleItems.length === 0}
          >
            <Save size={16} />
            {isSubmitting ? 'Processing...' : 'Complete Sale'}
          </Button>
        </FormActions>
      </Form>
    </FormContainer>
  );
};