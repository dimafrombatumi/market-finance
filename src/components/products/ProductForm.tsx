import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Product, ProductFormData } from '../../types';
import { Input, TextArea, Select } from '../common/Input';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
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

const getCategoryOptions = (t: (key: string) => string) => [
  { value: 'Kitchen & Dining', label: t('products.categories.kitchenDining') },
  { value: 'Clothing', label: t('products.categories.clothing') },
  { value: 'Electronics', label: t('products.categories.electronics') },
  { value: 'Home & Garden', label: t('products.categories.homeGarden') },
  { value: 'Sports & Outdoors', label: t('products.categories.sportsOutdoors') },
  { value: 'Books & Media', label: t('products.categories.booksMedia') },
  { value: 'Health & Beauty', label: t('products.categories.healthBeauty') },
  { value: 'Toys & Games', label: t('products.categories.toysGames') },
  { value: 'Automotive', label: t('products.categories.automotive') },
  { value: 'Other', label: t('products.categories.other') },
];

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onClose,
  onSuccess
}) => {
  const { t } = useLanguage();
  const { addProduct, updateProduct } = useProductStore();
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    cost: 0,
    category: '',
    stockQuantity: 0,
    minStockLevel: 0,
    sku: '',
    imageUrl: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        cost: product.cost,
        category: product.category,
        stockQuantity: product.stockQuantity,
        minStockLevel: product.minStockLevel,
        sku: product.sku || '',
        imageUrl: product.imageUrl || '',
      });
    }
  }, [product]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.cost < 0) {
      newErrors.cost = 'Cost cannot be negative';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.stockQuantity < 0) {
      newErrors.stockQuantity = 'Stock quantity cannot be negative';
    }

    if (formData.minStockLevel < 0) {
      newErrors.minStockLevel = 'Minimum stock level cannot be negative';
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
      if (product) {
        await updateProduct(product.id, formData);
      } else {
        await addProduct(formData);
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleChange = (field: keyof ProductFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form id="product-form" onSubmit={handleSubmit}>
      <FormContainer>
        <FormGroup>
          <Input
            label={`${t('products.productName')} *`}
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            fullWidth
            placeholder={t('products.productName')}
          />
          
          <TextArea
            label={`${t('products.productDescription')} *`}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            error={errors.description}
            fullWidth
            placeholder={t('products.productDescription')}
          />
        </FormGroup>

        <FormRow>
          <Input
            label={`${t('common.price')} *`}
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
            error={errors.price}
            fullWidth
            placeholder="0.00"
          />
          
          <Input
            label={t('common.cost')}
            type="number"
            step="0.01"
            min="0"
            value={formData.cost}
            onChange={(e) => handleChange('cost', parseFloat(e.target.value) || 0)}
            error={errors.cost}
            fullWidth
            placeholder="0.00"
          />
        </FormRow>

        <FormRow>
          <Select
            label={`${t('common.category')} *`}
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            options={getCategoryOptions(t)}
            error={errors.category}
            fullWidth
          />
          
          <Input
            label={t('products.sku')}
            value={formData.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
            fullWidth
            placeholder={t('products.sku')}
          />
        </FormRow>

        <FormRow>
          <Input
            label={t('products.stockQuantity')}
            type="number"
            min="0"
            value={formData.stockQuantity}
            onChange={(e) => handleChange('stockQuantity', parseInt(e.target.value) || 0)}
            error={errors.stockQuantity}
            fullWidth
            placeholder="0"
          />
          
          <Input
            label={t('products.minStockLevel')}
            type="number"
            min="0"
            value={formData.minStockLevel}
            onChange={(e) => handleChange('minStockLevel', parseInt(e.target.value) || 0)}
            error={errors.minStockLevel}
            fullWidth
            placeholder="0"
          />
        </FormRow>

        <Input
          label={t('products.imageUrl')}
          type="url"
          value={formData.imageUrl}
          onChange={(e) => handleChange('imageUrl', e.target.value)}
          fullWidth
          placeholder="https://example.com/image.jpg"
        />
      </FormContainer>
    </form>
  );
};

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const { t } = useLanguage();
  const { loading } = useProductStore();

  const handleSuccess = () => {
    // Optionally show success message
    console.log(t('products.productSaved'));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? t('products.editProduct') : t('products.addProduct')}
      size="lg"
      footer={
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button 
            type="submit" 
            form="product-form"
            loading={loading}
            disabled={loading}
          >
            {product ? t('common.save') : t('common.add')}
          </Button>
        </div>
      }
    >
      <ProductForm
        product={product}
        onClose={onClose}
        onSuccess={handleSuccess}
      />
    </Modal>
  );
};
