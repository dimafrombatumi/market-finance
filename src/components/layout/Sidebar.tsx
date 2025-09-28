import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Receipt, 
  BarChart3,
  Store
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const SidebarContainer = styled.aside`
  width: 250px;
  background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const Logo = styled.div`
  padding: 24px;
  border-bottom: 1px solid #475569;
  display: flex;
  align-items: center;
  gap: 12px;
  
  h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #f1f5f9;
  }
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 16px 0;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  font-size: 14px;
  font-weight: 500;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #f1f5f9;
  }

  &.active {
    background-color: rgba(59, 130, 246, 0.15);
    color: #93c5fd;
    border-right: 3px solid #3b82f6;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Footer = styled.div`
  padding: 24px;
  border-top: 1px solid #475569;
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
`;

const getNavigationItems = (t: (key: string) => string) => [
  { path: '/dashboard', label: t('navigation.dashboard'), icon: Home },
  { path: '/products', label: t('navigation.products'), icon: Package },
  { path: '/sales', label: t('navigation.sales'), icon: ShoppingCart },
  { path: '/expenses', label: t('navigation.expenses'), icon: Receipt },
  { path: '/reports', label: t('navigation.reports'), icon: BarChart3 },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const navigationItems = getNavigationItems(t);

  return (
    <SidebarContainer>
      <Logo>
        <Store size={24} />
        <h1>Handmade Store</h1>
      </Logo>
      
      <Navigation>
        {navigationItems.map((item) => (
          <NavItem
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? 'active' : ''}
          >
            <item.icon />
            {item.label}
          </NavItem>
        ))}
      </Navigation>
      
      <Footer>
        © 2024 Handmade Store Management
      </Footer>
    </SidebarContainer>
  );
};