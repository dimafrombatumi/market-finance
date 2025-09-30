import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Receipt, 
  BarChart3,
  Store,
  Users,
  ChevronLeft,
  ChevronRight
  // Calendar,
  // UserCheck
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const SidebarContainer = styled.aside<{ isCollapsed: boolean }>`
  width: ${props => props.isCollapsed ? '70px' : '250px'};
  background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
  color: white;
  padding: 0;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  
  @media (max-width: 768px) {
    width: 280px;
    box-shadow: 4px 0 12px rgba(0, 0, 0, 0.15);
  }
`;

const SidebarHeader = styled.div<{ isCollapsed: boolean }>`
  padding: ${props => props.isCollapsed ? '16px 8px' : '24px'};
  border-bottom: 1px solid #475569;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
`;

const Logo = styled.div<{ isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.isCollapsed ? '0' : '12px'};
  flex: 1;
  justify-content: ${props => props.isCollapsed ? 'center' : 'flex-start'};
  
  h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #f1f5f9;
    opacity: ${props => props.isCollapsed ? 0 : 1};
    transition: opacity 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
  }
`;

const ToggleButton = styled.button<{ isCollapsed: boolean }>`
  padding: 8px;
  border: 1px solid #475569;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  color: #cbd5e1;
  transition: all 0.2s ease;
  min-height: 40px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: #f1f5f9;
    border-color: #64748b;
  }
  
  @media (max-width: 768px) {
    display: none; /* Hide on mobile */
  }
`;


const Navigation = styled.nav`
  flex: 1;
  padding: 16px 0;
`;

const NavItem = styled(NavLink)<{ isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.isCollapsed ? '0' : '12px'};
  padding: ${props => props.isCollapsed ? '12px 8px' : '12px 24px'};
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  font-size: 14px;
  font-weight: 500;
  min-height: 48px; /* Better touch target */
  justify-content: ${props => props.isCollapsed ? 'center' : 'flex-start'};
  position: relative;

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
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span {
    opacity: ${props => props.isCollapsed ? 0 : 1};
    transition: opacity 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
    display: ${props => props.isCollapsed ? 'none' : 'block'};
  }
  
  @media (max-width: 768px) {
    padding: 16px 24px;
    font-size: 16px;
    min-height: 56px; /* Larger touch target for mobile */
    justify-content: flex-start;
    
    svg {
      width: 20px;
      height: 20px;
    }

    span {
      opacity: 1;
    }
  }
`;

const ToggleSection = styled.div<{ isCollapsed: boolean }>`
  padding: ${props => props.isCollapsed ? '12px 8px' : '16px 24px'};
  border-top: 1px solid #475569;
  display: flex;
  justify-content: ${props => props.isCollapsed ? 'center' : 'flex-end'};
  align-items: center;
`;

const Footer = styled.div<{ isCollapsed: boolean }>`
  padding: ${props => props.isCollapsed ? '16px 8px' : '24px'};
  border-top: 1px solid #475569;
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
  opacity: ${props => props.isCollapsed ? 0 : 1};
  transition: opacity 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
`;

const getNavigationItems = (t: (key: string) => string) => [
  { path: '/dashboard', label: t('navigation.dashboard'), icon: Home },
  { path: '/products', label: t('navigation.products'), icon: Package },
  { path: '/sales', label: t('navigation.sales'), icon: ShoppingCart },
  { path: '/expenses', label: t('navigation.expenses'), icon: Receipt },
  { path: '/instructors', label: t('navigation.instructors'), icon: Users },
  // { path: '/workshops', label: t('navigation.workshops'), icon: Calendar },
  // { path: '/workshop-registrations', label: t('navigation.workshopRegistrations'), icon: UserCheck },
  { path: '/reports', label: t('navigation.reports'), icon: BarChart3 },
];

interface SidebarProps {
  onItemClick?: () => void;
  isCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onItemClick, isCollapsed = false, onToggleSidebar }) => {
  const location = useLocation();
  const { t } = useLanguage();
  const navigationItems = getNavigationItems(t);

  const handleItemClick = () => {
    onItemClick?.();
  };

  const handleToggleSidebar = () => {
    console.log('Sidebar toggle clicked, current state:', isCollapsed);
    onToggleSidebar?.();
  };


  return (
    <SidebarContainer isCollapsed={isCollapsed}>
      <SidebarHeader isCollapsed={isCollapsed}>
        <Logo isCollapsed={isCollapsed}>
          <Store size={24} />
          <h1>Handmade Store</h1>
        </Logo>
      </SidebarHeader>
      
      <Navigation>
        {navigationItems.map((item) => (
          <NavItem
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? 'active' : ''}
            onClick={handleItemClick}
            isCollapsed={isCollapsed}
          >
            <item.icon />
            <span>{item.label}</span>
          </NavItem>
        ))}
      </Navigation>
      
      <ToggleSection isCollapsed={isCollapsed}>
        <ToggleButton 
          onClick={handleToggleSidebar}
          isCollapsed={isCollapsed}
          title={isCollapsed ? t('common.expandSidebar') : t('common.collapseSidebar')}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </ToggleButton>
      </ToggleSection>
      
      <Footer isCollapsed={isCollapsed}>
        © 2024 Handmade Store Management
      </Footer>
    </SidebarContainer>
  );
};