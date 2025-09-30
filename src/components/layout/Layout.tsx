import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Dashboard } from '../../pages/Dashboard';
import { ProductsPage } from '../../pages/ProductsPage';
import { SalesPage } from '../../pages/SalesPage';
import { ExpensesPage } from '../../pages/ExpensesPage';
import { InstructorsPage } from '../../pages/InstructorsPage';
// import { WorkshopsPage } from '../../pages/WorkshopsPage';
// import { WorkshopRegistrationsPage } from '../../pages/WorkshopRegistrationsPage';
import { ReportsPage } from '../../pages/ReportsPage';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f8fafc;
  position: relative;
`;


const StyledSidebar = styled.div`
  @media (max-width: 768px) {
    display: none; /* Hide sidebar on mobile since we removed mobile menu */
  }
`;

const MainContent = styled.div<{ isSidebarCollapsed: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
  transition: all 0.3s ease;
`;

const ContentArea = styled.main<{ isSidebarCollapsed: boolean }>`
  flex: 1;
  padding: 24px ${props => props.isSidebarCollapsed ? '16px' : '24px'};
  overflow-y: auto;
  background-color: #f8fafc;
  transition: padding 0.3s ease;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const Layout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    console.log('Toggling sidebar, current state:', isSidebarCollapsed);
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <LayoutContainer>
      <StyledSidebar>
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
        />
      </StyledSidebar>
      
      <MainContent isSidebarCollapsed={isSidebarCollapsed}>
        <Header 
          isSidebarCollapsed={isSidebarCollapsed}
        />
        <ContentArea isSidebarCollapsed={isSidebarCollapsed}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/instructors" element={<InstructorsPage />} />
            {/* <Route path="/workshops" element={<WorkshopsPage />} /> */}
            {/* <Route path="/workshop-registrations" element={<WorkshopRegistrationsPage />} /> */}
            <Route path="/reports" element={<ReportsPage />} />
          </Routes>
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};