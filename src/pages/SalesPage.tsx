import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, ShoppingCart, Calendar, CreditCard, User, Edit, Trash2 } from 'lucide-react';
import { useSalesStore } from '../stores';
import { SaleFormModal } from '../components/sales/SaleForm';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const SalesContainer = styled.div`
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

const AddSaleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #059669;
  }
`;

const SalesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
`;

const SaleCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const SaleHeader = styled.div`
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const SaleActions = styled.div`
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

const SaleInfo = styled.div`
  flex: 1;
`;

const SaleId = styled.div`
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`;

const SaleAmount = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 8px;
`;

const SaleDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #64748b;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SaleItems = styled.div`
  padding: 0 24px 20px;
`;

const ItemsHeader = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 12px;
`;

const SaleItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f8fafc;
  
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
  
  .quantity {
    font-size: 12px;
    color: #64748b;
  }
`;

const ItemPrice = styled.div`
  font-weight: 600;
  color: #1e293b;
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


const PaymentMethodBadge = styled.span<{ method: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: ${props => {
    switch (props.method) {
      case 'cash': return 'rgba(34, 197, 94, 0.1)';
      case 'card': return 'rgba(59, 130, 246, 0.1)';
      case 'online': return 'rgba(168, 85, 247, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.method) {
      case 'cash': return '#22c55e';
      case 'card': return '#3b82f6';
      case 'online': return '#a855f7';
      default: return '#6b7280';
    }
  }};
`;

export const SalesPage: React.FC = () => {
  const [isSaleFormOpen, setIsSaleFormOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; sale: any }>({
    isOpen: false,
    sale: null
  });

  const { sales, deleteSale, loading } = useSalesStore();

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

  // Handlers
  const handleAddSale = () => {
    setEditingSale(null);
    setIsSaleFormOpen(true);
  };

  const handleEditSale = (sale: any) => {
    setEditingSale(sale);
    setIsSaleFormOpen(true);
  };

  const handleDeleteSale = (sale: any) => {
    setDeleteConfirm({ isOpen: true, sale });
  };

  const confirmDelete = async () => {
    if (deleteConfirm.sale) {
      await deleteSale(deleteConfirm.sale.id);
      setDeleteConfirm({ isOpen: false, sale: null });
    }
  };

  const closeSaleForm = () => {
    setIsSaleFormOpen(false);
    setEditingSale(null);
  };

  // Simple sorting
  const sortedSales = [...sales].sort(
    (a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime()
  );

  // Show loading spinner while data is being fetched
  if (loading && sales.length === 0) {
    return <LoadingSpinner text="Loading sales..." />;
  }

  return (
    <SalesContainer>
      <Header>
        <HeaderTitle>Sales ({sales.length})</HeaderTitle>
        <AddSaleButton onClick={handleAddSale}>
          <Plus size={18} />
          New Sale
        </AddSaleButton>
      </Header>

      <SalesGrid>
        {sortedSales.length > 0 ? (
          sortedSales.map(sale => (
            <SaleCard key={sale.id}>
              <SaleHeader>
                <SaleInfo>
                  <SaleId>Sale #{sale.id.slice(-8)}</SaleId>
                  <SaleAmount>{formatCurrency(sale.totalAmount)}</SaleAmount>
                  <SaleDetails>
                    <DetailItem>
                      <Calendar size={12} />
                      {formatDate(sale.saleDate)}
                    </DetailItem>
                    <DetailItem>
                      <CreditCard size={12} />
                      <PaymentMethodBadge method={sale.paymentMethod}>
                        {sale.paymentMethod}
                      </PaymentMethodBadge>
                    </DetailItem>
                    {sale.customerName && (
                      <DetailItem>
                        <User size={12} />
                        {sale.customerName}
                      </DetailItem>
                    )}
                  </SaleDetails>
                </SaleInfo>
                <SaleActions>
                  <ActionButton 
                    $variant="edit" 
                    onClick={() => handleEditSale(sale)}
                    title="Edit Sale"
                  >
                    <Edit size={16} />
                  </ActionButton>
                  <ActionButton 
                    $variant="delete" 
                    onClick={() => handleDeleteSale(sale)}
                    title="Delete Sale"
                  >
                    <Trash2 size={16} />
                  </ActionButton>
                </SaleActions>
              </SaleHeader>
              
              <SaleItems>
                <ItemsHeader>Items ({sale.items.length})</ItemsHeader>
                {sale.items.map((item, index) => (
                  <SaleItem key={index}>
                    <ItemInfo>
                      <div className="name">{item.productName}</div>
                      <div className="quantity">Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</div>
                    </ItemInfo>
                    <ItemPrice>{formatCurrency(item.totalPrice)}</ItemPrice>
                  </SaleItem>
                ))}
              </SaleItems>
            </SaleCard>
          ))
        ) : (
          <EmptyState>
            <ShoppingCart size={64} />
            <h3>No sales yet</h3>
            <p>Start by recording your first sale</p>
          </EmptyState>
        )}
      </SalesGrid>

      {/* Sale Form Modal */}
      <SaleFormModal
        isOpen={isSaleFormOpen}
        onClose={closeSaleForm}
        sale={editingSale}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, sale: null })}
        onConfirm={confirmDelete}
        title="Delete Sale"
        message={`Are you sure you want to delete this sale? This action cannot be undone.`}
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
        loading={loading}
      />

    </SalesContainer>
  );
};