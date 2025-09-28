import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Dashboard } from '../../pages/Dashboard';
import { ProductsPage } from '../../pages/ProductsPage';
import { SalesPage } from '../../pages/SalesPage';
import { ExpensesPage } from '../../pages/ExpensesPage';
import { ReportsPage } from '../../pages/ReportsPage';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f8fafc;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #f8fafc;
`;

export const Layout: React.FC = () => {
  return (
    <Router>
      <LayoutContainer>
        <Sidebar />
        <MainContent>
          <Header />
          <ContentArea>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Routes>
          </ContentArea>
        </MainContent>
      </LayoutContainer>
    </Router>
  );
};