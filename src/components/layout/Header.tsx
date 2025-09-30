import React, { useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, Menu, Database, Download } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { BackupManager, BackupOptions, BackupData } from '../../lib/backupUtils';
import { useProductStore, useSalesStore, useTransactionStore, useInstructorStore, useWorkshopStore, useWorkshopRegistrationStore } from '../../stores';
import { useNotifications } from '../../contexts/NotificationContext';

const HeaderContainer = styled.header`
  background: white;
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: 64px;
  
  @media (max-width: 768px) {
    padding: 12px 16px;
  }
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

const MobileMenuButton = styled.button`
  display: none;
  padding: 8px;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;
  min-height: 40px;
  min-width: 40px;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #f1f5f9;
    color: #1e293b;
  }
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`;


const IconButton = styled.button`
  padding: 8px;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;
  min-height: 40px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #f1f5f9;
    color: #1e293b;
  }
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

const BackupButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #3b82f6;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: #2563eb;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DropdownMenu = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 50;
  min-width: 200px;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f3f4f6;
  }
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
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
    case '/instructors':
      return { title: t('navigation.instructors'), description: t('instructors.title') };
    case '/workshops':
      return { title: t('navigation.workshops'), description: t('workshops.title') };
    case '/workshop-registrations':
      return { title: t('navigation.workshopRegistrations'), description: t('workshopRegistrations.title') };
    case '/reports':
      return { title: t('navigation.reports'), description: t('reports.financialReports') };
    case '/backup':
      return { title: t('backup.title'), description: t('backup.backupDescription') };
    default:
      return { title: 'Handmade Store', description: 'Management System' };
  }
};

interface HeaderProps {
  isSidebarCollapsed?: boolean;
  onMobileMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isSidebarCollapsed = false, onMobileMenuToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  const pageInfo = getPageInfo(location.pathname, t);

  const [isBackupDropdownOpen, setIsBackupDropdownOpen] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);

  // Получаем данные из всех сторов
  const { products, restoreProducts } = useProductStore();
  const { sales, restoreSales } = useSalesStore();
  const { transactions, restoreTransactions } = useTransactionStore();
  const { instructors, restoreInstructors } = useInstructorStore();
  const { workshops, restoreWorkshops, schedules, restoreSchedules } = useWorkshopStore();
  const { registrations: workshopRegistrations, restoreRegistrations } = useWorkshopRegistrationStore();

  const allData = {
    products,
    sales,
    transactions,
    instructors,
    workshops,
    workshopRegistrations,
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleBackupClick = (format: 'json' | 'excel') => {
    setIsCreatingBackup(true);
    setIsBackupDropdownOpen(false);

    try {
      const backupData = BackupManager.createBackup(allData, {
        type: 'full',
        includeMetadata: true,
        format: format === 'json' ? 'json' : 'excel',
      });

      if (format === 'json') {
        BackupManager.downloadJsonBackup(backupData as BackupData);
      } else {
        BackupManager.downloadExcelBackup(backupData as any[]);
      }

      addNotification({ title: t('backup.title'), message: t('backup.backupCreated'), type: 'success' });
    } catch (error) {
      addNotification({ title: t('backup.title'), message: t('backup.backupFailed'), type: 'error' });
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleBackupPageClick = () => {
    navigate('/backup');
    setIsBackupDropdownOpen(false);
  };

  return (
    <HeaderContainer>
      <MobileMenuButton onClick={onMobileMenuToggle} title={t('common.menu')}>
        <Menu size={20} />
      </MobileMenuButton>
      
      <PageTitle>
        <h1>{pageInfo.title}</h1>
        <p>{pageInfo.description}</p>
      </PageTitle>
      
      <HeaderActions>
        <LanguageSwitcher />

        {user && (
          <DropdownContainer>
            <BackupButton
              onClick={() => setIsBackupDropdownOpen(!isBackupDropdownOpen)}
              disabled={isCreatingBackup}
            >
              <Database size={16} />
              {isCreatingBackup ? t('backup.backupInProgress') : t('backup.createBackup')}
            </BackupButton>
            
            <DropdownMenu isOpen={isBackupDropdownOpen}>
              <DropdownItem onClick={() => handleBackupClick('json')}>
                <Download size={16} style={{ marginRight: '8px' }} />
                {t('backup.downloadBackup')} (JSON)
              </DropdownItem>
              <DropdownItem onClick={() => handleBackupClick('excel')}>
                <Download size={16} style={{ marginRight: '8px' }} />
                {t('backup.downloadBackup')} (Excel)
              </DropdownItem>
              <DropdownItem onClick={handleBackupPageClick}>
                <Database size={16} style={{ marginRight: '8px' }} />
                {t('backup.title')}
              </DropdownItem>
            </DropdownMenu>
          </DropdownContainer>
        )}
        
        {user ? (
          <>
            <UserProfile>
              <UserInfo>
                <p className="name">{user.email}</p>
                <p className="role">Store Owner</p>
              </UserInfo>
              <User size={20} />
            </UserProfile>
            <LogoutButton onClick={handleLogout}>
              <LogOut size={16} />
              <span>{t('auth.logout')}</span>
            </LogoutButton>
          </>
        ) : (
          <LogoutButton onClick={handleLogin}>
            <User size={16} />
            <span>{t('auth.login')}</span>
          </LogoutButton>
        )}
      </HeaderActions>
    </HeaderContainer>
  );
};