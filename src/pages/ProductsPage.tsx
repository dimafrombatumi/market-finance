import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, Search, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Product } from '../types';
import { ProductForm } from '../components/products/ProductForm';

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
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
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
  
  &:hover {
    background-color: #2563eb;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  margin: 20px;
`;

export const ProductsPage: React.FC = () => {
  const { state, deleteProduct } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredProducts = state.products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

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
          Add Product
        </AddButton>
      </Header>

      <ProductsGrid>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => {
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
                        variant="edit" 
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit size={16} />
                      </ActionButton>
                      <ActionButton 
                        variant="delete" 
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 size={16} />
                      </ActionButton>
                    </ProductActions>
                  </ProductHeader>
                  
                  <ProductDescription>{product.description}</ProductDescription>
                  
                  <ProductDetails>
                    <DetailItem>
                      <div className="label">Price</div>
                      <div className="value">{formatCurrency(product.price)}</div>
                    </DetailItem>
                    <DetailItem>
                      <div className="label">Cost</div>
                      <div className="value">{formatCurrency(product.cost)}</div>
                    </DetailItem>
                    <DetailItem>
                      <div className="label">Category</div>
                      <div className="value">{product.category}</div>
                    </DetailItem>
                    <DetailItem>
                      <div className="label">Stock</div>
                      <div className="value">{product.stockQuantity} units</div>
                    </DetailItem>
                  </ProductDetails>
                  
                  <StockStatus isLow={isLowStock}>
                    {isLowStock ? <AlertTriangle size={14} /> : <Package size={14} />}
                    {isLowStock ? 'Low Stock' : 'In Stock'}
                  </StockStatus>
                </ProductContent>
              </ProductCard>
            );
          })
        ) : (
          <EmptyState>
            <Package size={64} />
            <h3>{searchQuery ? 'No products found' : 'No products yet'}</h3>
            <p>
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Start by adding your first product'
              }
            </p>
          </EmptyState>
        )}
      </ProductsGrid>

      <Modal isOpen={isFormOpen}>
        <ModalContent>
          <ProductForm
            product={editingProduct}
            onClose={handleFormClose}
          />
        </ModalContent>
      </Modal>
    </ProductsContainer>
  );
};