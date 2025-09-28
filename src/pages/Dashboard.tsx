import React from 'react';
import styled from 'styled-components';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { useData } from '../contexts/DataContext';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const StatCard = styled.div<{ variant?: 'success' | 'danger' | 'warning' | 'info' }>`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => {
    switch (props.variant) {
      case 'success': return '#10b981';
      case 'danger': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#e5e7eb';
    }
  }};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const StatTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatIcon = styled.div<{ variant?: 'success' | 'danger' | 'warning' | 'info' }>`
  padding: 8px;
  border-radius: 8px;
  background-color: ${props => {
    switch (props.variant) {
      case 'success': return 'rgba(16, 185, 129, 0.1)';
      case 'danger': return 'rgba(239, 68, 68, 0.1)';
      case 'warning': return 'rgba(245, 158, 11, 0.1)';
      case 'info': return 'rgba(59, 130, 246, 0.1)';
      default: return 'rgba(0, 0, 0, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'success': return '#10b981';
      case 'danger': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  }};
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
`;

const StatChange = styled.div<{ positive?: boolean }>`
  font-size: 12px;
  color: ${props => props.positive ? '#10b981' : '#ef4444'};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
  }
`;

const CardContent = styled.div`
  padding: 24px;
`;

const AlertItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #fef3cd;
  border: 1px solid #fde047;
  border-radius: 8px;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
`;

const TransactionInfo = styled.div`
  .description {
    font-weight: 500;
    color: #1e293b;
    margin-bottom: 4px;
  }
  
  .date {
    font-size: 12px;
    color: #64748b;
  }
`;

const TransactionAmount = styled.div<{ type: 'income' | 'expense' | 'sale' }>`
  font-weight: 600;
  color: ${props => {
    switch (props.type) {
      case 'income':
      case 'sale':
        return '#10b981';
      case 'expense':
        return '#ef4444';
      default:
        return '#64748b';
    }
  }};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
  
  p {
    margin: 8px 0 0 0;
    font-size: 14px;
  }
`;

export const Dashboard: React.FC = () => {
  const { getDashboardData } = useData();
  const dashboardData = getDashboardData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <DashboardContainer>
      <StatsGrid>
        <StatCard variant="success">
          <StatHeader>
            <StatTitle>Total Revenue</StatTitle>
            <StatIcon variant="success">
              <TrendingUp size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{formatCurrency(dashboardData.totalRevenue)}</StatValue>
          <StatChange positive>
            <TrendingUp size={12} />
            This month
          </StatChange>
        </StatCard>

        <StatCard variant="danger">
          <StatHeader>
            <StatTitle>Total Expenses</StatTitle>
            <StatIcon variant="danger">
              <TrendingDown size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{formatCurrency(dashboardData.totalExpenses)}</StatValue>
          <StatChange>
            <TrendingDown size={12} />
            This month
          </StatChange>
        </StatCard>

        <StatCard variant="info">
          <StatHeader>
            <StatTitle>Net Profit</StatTitle>
            <StatIcon variant="info">
              <DollarSign size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{formatCurrency(dashboardData.netProfit)}</StatValue>
          <StatChange positive={dashboardData.netProfit >= 0}>
            {dashboardData.netProfit >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {dashboardData.netProfit >= 0 ? 'Profit' : 'Loss'}
          </StatChange>
        </StatCard>

        <StatCard variant="warning">
          <StatHeader>
            <StatTitle>Total Sales</StatTitle>
            <StatIcon variant="warning">
              <ShoppingCart size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{dashboardData.totalSales}</StatValue>
          <StatChange positive>
            <Activity size={12} />
            Transactions
          </StatChange>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <Card>
          <CardHeader>
            <h3>Recent Transactions</h3>
          </CardHeader>
          <CardContent>
            {dashboardData.recentTransactions.length > 0 ? (
              dashboardData.recentTransactions.map(transaction => (
                <TransactionItem key={transaction.id}>
                  <TransactionInfo>
                    <div className="description">{transaction.description}</div>
                    <div className="date">{formatDate(transaction.date)}</div>
                  </TransactionInfo>
                  <TransactionAmount type={transaction.type}>
                    {transaction.type === 'expense' ? '-' : '+'}
                    {formatCurrency(transaction.amount)}
                  </TransactionAmount>
                </TransactionItem>
              ))
            ) : (
              <EmptyState>
                <Activity size={48} />
                <p>No transactions yet</p>
              </EmptyState>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3>Low Stock Alerts</h3>
          </CardHeader>
          <CardContent>
            {dashboardData.lowStockItems.length > 0 ? (
              dashboardData.lowStockItems.map(product => (
                <AlertItem key={product.id}>
                  <AlertTriangle size={16} />
                  <div>
                    <div style={{ fontWeight: 500 }}>{product.name}</div>
                    <div style={{ fontSize: '12px', color: '#92400e' }}>
                      Only {product.stockQuantity} left (Min: {product.minStockLevel})
                    </div>
                  </div>
                </AlertItem>
              ))
            ) : (
              <EmptyState>
                <AlertTriangle size={48} />
                <p>All products are well stocked</p>
              </EmptyState>
            )}
          </CardContent>
        </Card>
      </ContentGrid>
    </DashboardContainer>
  );
};