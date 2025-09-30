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
import { BackupPage } from '../../pages/BackupPage';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f8fafc;
  position: relative;
`;


const StyledSidebar = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isMobileMenuOpen',
})<{ isMobileMenuOpen: boolean }>`
  @media (max-width: 768px) {
    display: ${props => props.isMobileMenuOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1000;
    width: 280px;
  }
`;

const MobileOverlay = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isMobileMenuOpen',
})<{ isMobileMenuOpen: boolean }>`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  
  @media (max-width: 768px) {
    display: ${props => props.isMobileMenuOpen ? 'block' : 'none'};
  }
`;

const MainContent = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isSidebarCollapsed',
})<{ isSidebarCollapsed: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
  transition: all 0.3s ease;
`;

const ContentArea = styled.main.withConfig({
  shouldForwardProp: (prop) => prop !== 'isSidebarCollapsed',
})<{ isSidebarCollapsed: boolean }>`
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    console.log('Toggling sidebar, current state:', isSidebarCollapsed);
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    console.log('Toggling mobile menu, current state:', isMobileMenuOpen);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <LayoutContainer>
      <MobileOverlay 
        isMobileMenuOpen={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      <StyledSidebar isMobileMenuOpen={isMobileMenuOpen}>
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          onItemClick={() => setIsMobileMenuOpen(false)}
        />
      </StyledSidebar>
      
      <MainContent isSidebarCollapsed={isSidebarCollapsed}>
        <Header 
          isSidebarCollapsed={isSidebarCollapsed}
          onMobileMenuToggle={toggleMobileMenu}
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
            <Route path="/backup" element={<BackupPage />} />
          </Routes>
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};