import React from 'react';
import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

const HeaderContainer = styled.header`
  background: white;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const PageTitle = styled.div`
  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #1e293b;
  }
  
  p {
    margin: 4px 0 0 0;
    font-size: 14px;
    color: #64748b;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 8px 12px 8px 40px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  width: 250px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  width: 16px;
  height: 16px;
  color: #9ca3af;
`;

const IconButton = styled.button`
  padding: 8px;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background-color: #f1f5f9;
    color: #1e293b;
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f1f5f9;
  }
`;

const UserInfo = styled.div`
  text-align: right;
  
  .name {
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
    margin: 0;
  }
  
  .role {
    font-size: 12px;
    color: #64748b;
    margin: 0;
  }
`;

const getPageInfo = (pathname: string) => {
  switch (pathname) {
    case '/':
    case '/dashboard':
      return { title: 'Dashboard', description: 'Overview of your handmade store' };
    case '/products':
      return { title: 'Products', description: 'Manage your product inventory' };
    case '/sales':
      return { title: 'Sales', description: 'Record and track sales' };
    case '/expenses':
      return { title: 'Expenses', description: 'Track expenses and income' };
    case '/reports':
      return { title: 'Reports', description: 'Financial reports and analytics' };
    default:
      return { title: 'Handmade Store', description: 'Management System' };
  }
};

export const Header: React.FC = () => {
  const location = useLocation();
  const { getLowStockProducts } = useData();
  const pageInfo = getPageInfo(location.pathname);
  const lowStockCount = getLowStockProducts().length;

  return (
    <HeaderContainer>
      <PageTitle>
        <h1>{pageInfo.title}</h1>
        <p>{pageInfo.description}</p>
      </PageTitle>
      
      <HeaderActions>
        <SearchContainer>
          <SearchIcon />
          <SearchInput 
            type="text" 
            placeholder="Search products, sales..." 
          />
        </SearchContainer>
        
        <IconButton>
          <Bell size={20} />
          {lowStockCount > 0 && (
            <NotificationBadge>{lowStockCount}</NotificationBadge>
          )}
        </IconButton>
        
        <UserProfile>
          <UserInfo>
            <p className="name">Store Owner</p>
            <p className="role">Administrator</p>
          </UserInfo>
          <User size={20} />
        </UserProfile>
      </HeaderActions>
    </HeaderContainer>
  );
};