import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp, DollarSign, Package } from 'lucide-react';
import { useSalesStore, useTransactionStore } from '../stores';

const ReportsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const DateFilters = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
`;

const ReportCard = styled.div<{ fullWidth?: boolean }>`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'auto'};
`;

const CardHeader = styled.div`
  padding: 20px 24px 16px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 12px;
  
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

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const SummaryCard = styled.div`
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  text-align: center;
  
  .value {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 4px;
  }
  
  .label {
    font-size: 12px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-top: 16px;
`;

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const ReportsPage: React.FC = () => {
  const { sales } = useSalesStore();
  const { transactions } = useTransactionStore();
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredData = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= start && transactionDate <= end;
    });

    const filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.saleDate);
      return saleDate >= start && saleDate <= end;
    });

    return { transactions: filteredTransactions, sales: filteredSales };
  }, [transactions, sales, startDate, endDate]);

  const summaryData = useMemo(() => {
    const revenue = filteredData.transactions
      .filter(t => t.type === 'sale' || t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = filteredData.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const profit = revenue - expenses;
    const salesCount = filteredData.sales.length;

    return { revenue, expenses, profit, salesCount };
  }, [filteredData]);

  const categoryBreakdown = useMemo(() => {
    const expensesByCategory = filteredData.transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(expensesByCategory).map(([category, amount]) => ({
      category,
      amount,
      name: category,
      value: amount,
    }));
  }, [filteredData]);

  const monthlyTrends = useMemo(() => {
    const monthlyData: Record<string, { revenue: number; expenses: number; profit: number }> = {};

    filteredData.transactions.forEach(transaction => {
      const month = new Date(transaction.date).toISOString().substr(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, expenses: 0, profit: 0 };
      }

      if (transaction.type === 'sale' || transaction.type === 'income') {
        monthlyData[month].revenue += transaction.amount;
      } else if (transaction.type === 'expense') {
        monthlyData[month].expenses += transaction.amount;
      }
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        expenses: data.expenses,
        profit: data.revenue - data.expenses,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [filteredData]);

  const topProducts = useMemo(() => {
    const productSales: Record<string, { quantity: number; revenue: number; name: string }> = {};

    filteredData.sales.forEach((sale: any) => {
      sale.items.forEach((item: any) => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            quantity: 0,
            revenue: 0,
            name: item.productName,
          };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.totalPrice;
      });
    });

    return Object.entries(productSales)
      .map(([id, data]) => ({
        id,
        ...data,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredData]);

  return (
    <ReportsContainer>
      <DateFilters>
        <Calendar size={20} />
        <FilterGroup>
          <Label>Start Date</Label>
          <DateInput
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </FilterGroup>
        <FilterGroup>
          <Label>End Date</Label>
          <DateInput
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </FilterGroup>
      </DateFilters>

      <SummaryGrid>
        <SummaryCard>
          <div className="value">{formatCurrency(summaryData.revenue)}</div>
          <div className="label">Total Revenue</div>
        </SummaryCard>
        <SummaryCard>
          <div className="value">{formatCurrency(summaryData.expenses)}</div>
          <div className="label">Total Expenses</div>
        </SummaryCard>
        <SummaryCard>
          <div className="value" style={{ color: summaryData.profit >= 0 ? '#10b981' : '#ef4444' }}>
            {formatCurrency(summaryData.profit)}
          </div>
          <div className="label">Net Profit</div>
        </SummaryCard>
        <SummaryCard>
          <div className="value">{summaryData.salesCount}</div>
          <div className="label">Total Sales</div>
        </SummaryCard>
      </SummaryGrid>

      <ReportsGrid>
        <ReportCard fullWidth>
          <CardHeader>
            <TrendingUp size={20} />
            <h3>Revenue vs Expenses Over Time</h3>
          </CardHeader>
          <CardContent>
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), '']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Revenue"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Expenses"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Profit"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </ReportCard>

        <ReportCard>
          <CardHeader>
            <DollarSign size={20} />
            <h3>Expenses by Category</h3>
          </CardHeader>
          <CardContent>
            {categoryBreakdown.length > 0 ? (
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={(props) => `${props.category}: ${formatCurrency(props.value as number)}`}
                    >
                      {categoryBreakdown.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                No expense data for this period
              </div>
            )}
          </CardContent>
        </ReportCard>

        <ReportCard>
          <CardHeader>
            <Package size={20} />
            <h3>Top Products by Revenue</h3>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip formatter={(value: number) => [formatCurrency(value), 'Revenue']} />
                    <Bar dataKey="revenue" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                No sales data for this period
              </div>
            )}
          </CardContent>
        </ReportCard>
      </ReportsGrid>
    </ReportsContainer>
  );
};