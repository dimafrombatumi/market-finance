import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, Search, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import { useProductStore } from '../stores';
import { ProductFormModal } from '../components/products/ProductForm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useLanguage } from '../contexts/LanguageContext';

const ProductsContainer = styled.div`
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
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 250px;
  
  @media (max-width: 768px) {
    max-width: 100%;
    order: 2;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #9ca3af;
`;

const AddButton = styled.button`
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
  min-height: 48px; /* Better touch target */
  
  &:hover {
    background-color: #2563eb;
  }
  
  @media (max-width: 768px) {
    order: 1;
    justify-content: center;
    padding: 14px 20px;
    font-size: 16px;
    min-height: 52px;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
  }
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const ProductImage = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 48px;
`;

const ProductContent = styled.div`
  padding: 20px;
`;

const ProductHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const ProductTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
`;

const ProductActions = styled.div`
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

const ProductDescription = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
`;

const ProductDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const DetailItem = styled.div`
  .label {
    font-size: 12px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
  }
  
  .value {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
  }
`;

const StockStatus = styled.div<{ isLow: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => props.isLow ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)'};
  color: ${props => props.isLow ? '#ef4444' : '#10b981'};
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
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


export const ProductsPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; product: any }>({
    isOpen: false,
    product: null
  });
  
  // Use Zustand store
  const { searchProducts, deleteProduct, loading } = useProductStore();
  
  // Use store's search function
  const products = searchProducts(searchQuery);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };


  // Handlers using Zustand store
  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsProductFormOpen(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const handleDeleteProduct = (product: any) => {
    setDeleteConfirm({ isOpen: true, product });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.product) {
      await deleteProduct(deleteConfirm.product.id);
      setDeleteConfirm({ isOpen: false, product: null });
    }
  };

  const closeProductForm = () => {
    setIsProductFormOpen(false);
    setEditingProduct(null);
  };

  // Show loading spinner while data is being fetched
  if (loading && products.length === 0) {
    return <LoadingSpinner text="Loading products..." />;
  }

  return (
    <ProductsContainer>
      <Header>
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
        
        <AddButton onClick={handleAddProduct}>
          <Plus size={18} />
          {t('products.addProduct')}
        </AddButton>
      </Header>

      <ProductsGrid>
        {products.length > 0 ? (
          products.map(product => {
            const isLowStock = product.stockQuantity <= product.minStockLevel;
            
            return (
              <ProductCard key={product.id}>
                <ProductImage>
                  <Package size={48} />
                </ProductImage>
                
                <ProductContent>
                  <ProductHeader>
                    <ProductTitle>{product.name}</ProductTitle>
                    <ProductActions>
                      <ActionButton 
                        $variant="edit" 
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit size={16} />
                      </ActionButton>
                      <ActionButton 
                        $variant="delete" 
                        onClick={() => handleDeleteProduct(product)}
                      >
                        <Trash2 size={16} />
                      </ActionButton>
                    </ProductActions>
                  </ProductHeader>
                  
                  <ProductDescription>{product.description}</ProductDescription>
                  
                  <ProductDetails>
                    <DetailItem>
                      <div className="label">{t('common.price')}</div>
                      <div className="value">{formatCurrency(product.price)}</div>
                    </DetailItem>
                    <DetailItem>
                      <div className="label">{t('common.cost')}</div>
                      <div className="value">{formatCurrency(product.cost)}</div>
                    </DetailItem>
                    <DetailItem>
                      <div className="label">{t('common.category')}</div>
                      <div className="value">{product.category}</div>
                    </DetailItem>
                    <DetailItem>
                      <div className="label">{t('products.stockQuantity')}</div>
                      <div className="value">{product.stockQuantity} units</div>
                    </DetailItem>
                  </ProductDetails>
                  
                  <StockStatus isLow={isLowStock}>
                    {isLowStock ? <AlertTriangle size={14} /> : <Package size={14} />}
                    {isLowStock ? t('products.lowStock') : t('products.inStock')}
                  </StockStatus>
                </ProductContent>
              </ProductCard>
            );
          })
        ) : (
          <EmptyState>
            <Package size={64} />
            <h3>{searchQuery ? t('products.noProductsFound') : t('products.noProducts')}</h3>
            <p>
              {searchQuery 
                ? t('products.tryAdjustingSearch')
                : t('products.startByAdding')
              }
            </p>
          </EmptyState>
        )}
      </ProductsGrid>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isProductFormOpen}
        onClose={closeProductForm}
        product={editingProduct}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, product: null })}
        onConfirm={confirmDelete}
        title={t('products.deleteProduct')}
        message={t('products.deleteConfirm', { name: deleteConfirm.product?.name })}
        type="danger"
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        loading={loading}
      />

    </ProductsContainer>
  );
};