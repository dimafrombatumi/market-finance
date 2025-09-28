import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Trash2, Package } from 'lucide-react';
import { Sale, SaleFormData, SaleItem } from '../../types';
import { Input, TextArea, Select } from '../common/Input';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { useSalesStore } from '../../stores';
import { useProductStore } from '../../stores';
import { useLanguage } from '../../contexts/LanguageContext';

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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ItemsSection = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
`;

const ItemsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ItemsTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
`;

const AddItemButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #2563eb;
  }
`;

const ItemRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  gap: 12px;
  align-items: end;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
`;

const RemoveItemButton = styled.button`
  padding: 8px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #dc2626;
  }
`;

const TotalsSection = styled.div`
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  
  &.total {
    border-top: 1px solid #e2e8f0;
    font-weight: 600;
    font-size: 16px;
    margin-top: 8px;
  }
`;

const getPaymentMethodOptions = (t: (key: string) => string) => [
  { value: 'cash', label: t('sales.paymentMethods.cash') },
  { value: 'card', label: t('sales.paymentMethods.card') },
  { value: 'online', label: t('sales.paymentMethods.online') },
  { value: 'other', label: t('sales.paymentMethods.other') },
];

interface SaleFormProps {
  sale?: Sale;
  onClose: () => void;
  onSuccess?: () => void;
}

export const SaleForm: React.FC<SaleFormProps> = ({
  sale,
  onClose,
  onSuccess
}) => {
  const { t } = useLanguage();
  const { addSale, updateSale } = useSalesStore();
  const { products } = useProductStore();
  const [formData, setFormData] = useState<SaleFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    items: [],
    subtotal: 0,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 0,
    paymentMethod: 'cash',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (sale) {
      setFormData({
        customerName: sale.customerName || '',
        customerEmail: sale.customerEmail || '',
        customerPhone: sale.customerPhone || '',
        items: sale.items,
        subtotal: sale.subtotal,
        taxAmount: sale.taxAmount,
        discountAmount: sale.discountAmount,
        totalAmount: sale.totalAmount,
        paymentMethod: sale.paymentMethod,
        notes: sale.notes || '',
      });
    }
  }, [sale]);

  const calculateTotals = (items: SaleItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = subtotal * 0.1; // 10% tax
    const discountAmount = 0; // Can be modified later
    const totalAmount = subtotal + taxAmount - discountAmount;

    return { subtotal, taxAmount, discountAmount, totalAmount };
  };

  const addItem = () => {
    const newItem: SaleItem = {
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index: number, field: keyof SaleItem, value: string | number) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      const item = { ...newItems[index], [field]: value };

      // If product is selected, update product details
      if (field === 'productId' && value) {
        const product = products.find(p => p.id === value);
        if (product) {
          item.productName = product.name;
          item.unitPrice = product.price;
          item.totalPrice = product.price * item.quantity;
        }
      }

      // If quantity or unit price changes, recalculate total
      if (field === 'quantity' || field === 'unitPrice') {
        item.totalPrice = item.quantity * item.unitPrice;
      }

      newItems[index] = item;

      // Recalculate totals
      const totals = calculateTotals(newItems);

      return {
        ...prev,
        items: newItems,
        ...totals,
      };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.items.length === 0) {
      newErrors.items = 'At least one item is required';
    }

    if (formData.items.some(item => !item.productId || item.quantity <= 0)) {
      newErrors.items = 'All items must have a product and quantity > 0';
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
      if (sale) {
        await updateSale(sale.id, formData);
      } else {
        await addSale(formData);
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving sale:', error);
    }
  };

  const handleChange = (field: keyof SaleFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const productOptions = products.map(product => ({
    value: product.id,
    label: `${product.name} - $${product.price}`,
  }));

  return (
    <form id="sale-form" onSubmit={handleSubmit}>
      <FormContainer>
        <FormGroup>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#1e293b' }}>
            {t('sales.customerInfo')}
          </h3>
          
          <FormRow>
            <Input
              label={t('sales.customerName')}
              value={formData.customerName}
              onChange={(e) => handleChange('customerName', e.target.value)}
              fullWidth
              placeholder={t('sales.customerName')}
            />
            
            <Input
              label={t('sales.customerEmail')}
              type="email"
              value={formData.customerEmail}
              onChange={(e) => handleChange('customerEmail', e.target.value)}
              fullWidth
              placeholder="customer@example.com"
            />
          </FormRow>

          <Input
            label={t('sales.customerPhone')}
            type="tel"
            value={formData.customerPhone}
            onChange={(e) => handleChange('customerPhone', e.target.value)}
            fullWidth
            placeholder="+1 (555) 123-4567"
          />
        </FormGroup>

        <ItemsSection>
          <ItemsHeader>
            <ItemsTitle>{t('sales.items')}</ItemsTitle>
            <AddItemButton type="button" onClick={addItem}>
              <Plus size={16} />
              {t('sales.addItem')}
            </AddItemButton>
          </ItemsHeader>

          {formData.items.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px 20px', 
              color: '#64748b',
              border: '2px dashed #d1d5db',
              borderRadius: '8px'
            }}>
              <Package size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <p>{t('sales.addFirstItem')}</p>
            </div>
          ) : (
            <>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '2fr 1fr 1fr 1fr auto', 
                gap: '12px', 
                padding: '8px 0', 
                borderBottom: '1px solid #e2e8f0',
                fontWeight: 600,
                color: '#64748b',
                fontSize: '14px'
              }}>
                <div>{t('sales.product')}</div>
                <div>{t('sales.quantity')}</div>
                <div>{t('sales.unitPrice')}</div>
                <div>{t('sales.total')}</div>
                <div></div>
              </div>
              {formData.items.map((item, index) => (
              <ItemRow key={index}>
                <Select
                  value={item.productId}
                  onChange={(e) => updateItem(index, 'productId', e.target.value)}
                  options={productOptions}
                  fullWidth
                />
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                  fullWidth
                />
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  fullWidth
                />
                <div style={{ 
                  padding: '12px 16px', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontWeight: 600
                }}>
                  ${item.totalPrice.toFixed(2)}
                </div>
                <RemoveItemButton type="button" onClick={() => removeItem(index)}>
                  <Trash2 size={16} />
                </RemoveItemButton>
              </ItemRow>
              ))}
            </>
          )}

          {errors.items && (
            <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px' }}>
              {errors.items}
            </div>
          )}
        </ItemsSection>

        <TotalsSection>
          <TotalRow>
            <span>{t('sales.subtotal')}:</span>
            <span>${formData.subtotal.toFixed(2)}</span>
          </TotalRow>
          <TotalRow>
            <span>{t('sales.tax')}:</span>
            <span>${formData.taxAmount.toFixed(2)}</span>
          </TotalRow>
          <TotalRow>
            <span>{t('sales.discount')}:</span>
            <span>-${formData.discountAmount.toFixed(2)}</span>
          </TotalRow>
          <TotalRow className="total">
            <span>{t('sales.total')}:</span>
            <span>${formData.totalAmount.toFixed(2)}</span>
          </TotalRow>
        </TotalsSection>

        <FormRow>
          <Select
            label={t('sales.paymentMethod')}
            value={formData.paymentMethod}
            onChange={(e) => handleChange('paymentMethod', e.target.value as any)}
            options={getPaymentMethodOptions(t)}
            fullWidth
          />
        </FormRow>

        <TextArea
          label={t('sales.notes')}
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          fullWidth
          placeholder={t('sales.additionalNotes')}
        />
      </FormContainer>
    </form>
  );
};

interface SaleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale?: Sale;
}

export const SaleFormModal: React.FC<SaleFormModalProps> = ({
  isOpen,
  onClose,
  sale
}) => {
  const { t } = useLanguage();
  const { loading } = useSalesStore();

  const handleSuccess = () => {
    console.log(t('sales.saleSaved'));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={sale ? t('sales.editSale') : t('sales.addSale')}
      size="xl"
      footer={
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'flex-end'
        }}>
          <Button 
            variant="outline" 
            onClick={onClose}
            size="sm"
          >
            {t('common.cancel')}
          </Button>
          <Button 
            type="submit" 
            form="sale-form"
            loading={loading}
            disabled={loading}
            size="sm"
          >
            {sale ? t('common.save') : t('common.add')}
          </Button>
        </div>
      }
    >
      <SaleForm
        sale={sale}
        onClose={onClose}
        onSuccess={handleSuccess}
      />
    </Modal>
  );
};
