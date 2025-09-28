import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

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

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8fafc;
    color: #ef4444;
    border-color: #fecaca;
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

const getPageInfo = (pathname: string, t: (key: string) => string) => {
  switch (pathname) {
    case '/':
    case '/dashboard':
      return { title: t('navigation.dashboard'), description: t('dashboard.overview') };
    case '/products':
      return { title: t('navigation.products'), description: t('products.title') };
    case '/sales':
      return { title: t('navigation.sales'), description: t('sales.title') };
    case '/expenses':
      return { title: t('navigation.expenses'), description: t('transactions.title') };
    case '/reports':
      return { title: t('navigation.reports'), description: t('reports.financialReports') };
    default:
      return { title: 'Handmade Store', description: 'Management System' };
  }
};

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const pageInfo = getPageInfo(location.pathname, t);
  const lowStockCount = 0; // Mock data

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

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
            placeholder={t('common.search')} 
          />
        </SearchContainer>
        
        <LanguageSwitcher />
        
        <IconButton>
          <Bell size={20} />
          {lowStockCount > 0 && (
            <NotificationBadge>{lowStockCount}</NotificationBadge>
          )}
        </IconButton>
        
        {user ? (
          <UserActions>
            <UserProfile>
              <UserInfo>
                <p className="name">{user.email}</p>
                <p className="role">Store Owner</p>
              </UserInfo>
              <User size={20} />
            </UserProfile>
            <LogoutButton onClick={handleLogout}>
              <LogOut size={16} />
              {t('auth.logout')}
            </LogoutButton>
          </UserActions>
        ) : (
          <LogoutButton onClick={handleLogin}>
            <User size={16} />
            {t('auth.login')}
          </LogoutButton>
        )}
      </HeaderActions>
    </HeaderContainer>
  );
};