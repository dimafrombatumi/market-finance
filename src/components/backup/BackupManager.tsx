import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Download, Upload, Database, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { BackupManager, BackupData, BackupOptions } from '../../lib/backupUtils';
import { useProductStore, useSalesStore, useTransactionStore, useInstructorStore, useWorkshopStore, useWorkshopRegistrationStore } from '../../stores';

const BackupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const BackupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  
  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #1e293b;
  }
`;

const BackupDescription = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
`;

const BackupActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
`;

const ActionCard = styled.div`
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #3b82f6;
    background: #f1f5f9;
  }
`;

const ActionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
  }
`;

const ActionDescription = styled.p`
  margin: 0 0 16px 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #3b82f6;
          color: white;
          &:hover {
            background: #2563eb;
          }
        `;
      case 'danger':
        return `
          background: #ef4444;
          color: white;
          &:hover {
            background: #dc2626;
          }
        `;
      default:
        return `
          background: #e2e8f0;
          color: #374151;
          &:hover {
            background: #d1d5db;
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const StatusMessage = styled.div<{ type: 'success' | 'error' | 'info' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  
  ${props => {
    switch (props.type) {
      case 'success':
        return `
          background: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        `;
      case 'error':
        return `
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        `;
      default:
        return `
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
        `;
    }
  }}
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const BackupManagerComponent: React.FC = () => {
  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [backupType, setBackupType] = useState<BackupOptions['type']>('full');
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Получаем данные из всех сторов
  const { products, restoreProducts, fetchProducts } = useProductStore();
  const { sales, restoreSales, fetchSales } = useSalesStore();
  const { transactions, restoreTransactions, fetchTransactions } = useTransactionStore();
  const { instructors, restoreInstructors, fetchInstructors } = useInstructorStore();
  const { workshops, restoreWorkshops, schedules, restoreSchedules, fetchWorkshops } = useWorkshopStore();
  const { registrations: workshopRegistrations, restoreRegistrations, fetchRegistrations } = useWorkshopRegistrationStore();

  const allData = {
    products,
    sales,
    transactions,
    instructors,
    workshops,
    workshopRegistrations,
  };

  const handleCreateBackup = async (format: 'json' | 'excel') => {
    setIsCreatingBackup(true);
    setStatusMessage(null);

    try {
      const backupData = BackupManager.createBackup(allData, {
        type: backupType,
        includeMetadata: true,
        format: format === 'json' ? 'json' : 'excel',
      });

      if (format === 'json') {
        BackupManager.downloadJsonBackup(backupData as BackupData);
      } else {
        BackupManager.downloadExcelBackup(backupData as any[]);
      }

      setStatusMessage({
        type: 'success',
        text: t('backup.backupCreated'),
      });

      addNotification({ title: t('backup.title'), message: t('backup.backupCreated'), type: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatusMessage({
        type: 'error',
        text: `${t('backup.backupFailed')}: ${errorMessage}`,
      });
      addNotification({ title: t('backup.title'), message: t('backup.backupFailed'), type: 'error' });
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    setStatusMessage(null);

    try {
      // Валидация файла
      await BackupManager.validateBackupFile(file);

      // Чтение файла
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const backupData = BackupManager.restoreFromJson(content);

          console.log('Backup data loaded:', backupData);
          console.log('Products count:', backupData.data.products.length);
          console.log('Sales count:', backupData.data.sales.length);
          console.log('Transactions count:', backupData.data.transactions.length);

          // Восстанавливаем данные в сторы
          if (backupData.data.products.length > 0) {
            console.log('Restoring products...');
            restoreProducts(backupData.data.products);
          }
          
          if (backupData.data.sales.length > 0) {
            console.log('Restoring sales...');
            restoreSales(backupData.data.sales);
          }
          
          if (backupData.data.transactions.length > 0) {
            console.log('Restoring transactions...');
            restoreTransactions(backupData.data.transactions);
          }
          
          if (backupData.data.instructors.length > 0) {
            console.log('Restoring instructors...');
            restoreInstructors(backupData.data.instructors);
          }
          
          if (backupData.data.workshops.length > 0) {
            console.log('Restoring workshops...');
            // Restore workshops
            restoreWorkshops(backupData.data.workshops);

            // Also rebuild schedules array from each workshop's embedded schedules
            const extractedSchedules = backupData.data.workshops.flatMap(w => w.schedule || []);
            if (extractedSchedules.length > 0) {
              console.log('Restoring schedules...');
              restoreSchedules(extractedSchedules);
            }
          }
          
          if (backupData.data.workshopRegistrations.length > 0) {
            console.log('Restoring registrations...');
            restoreRegistrations(backupData.data.workshopRegistrations);
          }

          setStatusMessage({
            type: 'success',
            text: t('backup.backupRestored'),
          });

          addNotification({ title: t('backup.title'), message: t('backup.backupRestored'), type: 'success' });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          setStatusMessage({
            type: 'error',
            text: `${t('backup.restoreFailed')}: ${errorMessage}`,
          });
          addNotification({ title: t('backup.title'), message: t('backup.restoreFailed'), type: 'error' });
        } finally {
          setIsRestoring(false);
        }
      };

      reader.readAsText(file);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatusMessage({
        type: 'error',
        text: `${t('backup.restoreFailed')}: ${errorMessage}`,
      });
      addNotification({ title: t('backup.title'), message: t('backup.restoreFailed'), type: 'error' });
      setIsRestoring(false);
    }
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const getTotalRecords = () => {
    return Object.values(allData).reduce((total, records) => total + records.length, 0);
  };

  const handleRefreshFromSupabase = async () => {
    setIsRestoring(true);
    setStatusMessage(null);

    try {
      console.log('Refreshing data from Supabase...');
      await Promise.all([
        fetchProducts(),
        fetchSales(),
        fetchTransactions(),
        fetchInstructors(),
        fetchWorkshops(),
        fetchRegistrations(),
      ]);

      setStatusMessage({
        type: 'success',
        text: 'Data refreshed from Supabase',
      });

      addNotification({ title: t('backup.title'), message: 'Data refreshed from Supabase', type: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setStatusMessage({
        type: 'error',
        text: `Failed to refresh data: ${errorMessage}`,
      });
      addNotification({ title: t('backup.title'), message: 'Failed to refresh data', type: 'error' });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <BackupContainer>
      <BackupHeader>
        <Database size={24} />
        <h2>{t('backup.title')}</h2>
      </BackupHeader>
      
      <BackupDescription>
        {t('backup.backupDescription')}
      </BackupDescription>

      {statusMessage && (
        <StatusMessage type={statusMessage.type}>
          {statusMessage.type === 'success' && <CheckCircle size={16} />}
          {statusMessage.type === 'error' && <AlertCircle size={16} />}
          {statusMessage.type === 'info' && <Clock size={16} />}
          {statusMessage.text}
        </StatusMessage>
      )}

      <BackupActions>
        <ActionCard>
          <ActionHeader>
            <Download size={20} />
            <h3>{t('backup.createBackup')}</h3>
          </ActionHeader>
          
          <ActionDescription>
            {t('backup.backupDescription')} ({getTotalRecords()} записей)
          </ActionDescription>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              Тип резервной копии:
            </label>
            <Select value={backupType} onChange={(e) => setBackupType(e.target.value as BackupOptions['type'])}>
              <option value="full">{t('backup.backupTypes.full')}</option>
              <option value="products">{t('backup.backupTypes.products')}</option>
              <option value="sales">{t('backup.backupTypes.sales')}</option>
              <option value="transactions">{t('backup.backupTypes.transactions')}</option>
              <option value="workshops">{t('backup.backupTypes.workshops')}</option>
              <option value="instructors">{t('backup.backupTypes.instructors')}</option>
            </Select>
          </div>

          <ButtonGroup>
            <Button
              variant="primary"
              onClick={() => handleCreateBackup('json')}
              disabled={isCreatingBackup}
            >
              {isCreatingBackup ? <LoadingSpinner /> : <Download size={16} />}
              {isCreatingBackup ? t('backup.backupInProgress') : 'JSON'}
            </Button>
            
            <Button
              variant="primary"
              onClick={() => handleCreateBackup('excel')}
              disabled={isCreatingBackup}
            >
              {isCreatingBackup ? <LoadingSpinner /> : <Download size={16} />}
              {isCreatingBackup ? t('backup.backupInProgress') : 'Excel'}
            </Button>
          </ButtonGroup>
        </ActionCard>

        <ActionCard>
          <ActionHeader>
            <Upload size={20} />
            <h3>{t('backup.restoreBackup')}</h3>
          </ActionHeader>
          
          <ActionDescription>
            {t('backup.restoreDescription')}
          </ActionDescription>

          <ButtonGroup>
            <Button
              variant="secondary"
              onClick={handleRestoreClick}
              disabled={isRestoring}
            >
              {isRestoring ? <LoadingSpinner /> : <Upload size={16} />}
              {isRestoring ? t('backup.restoreInProgress') : t('backup.selectBackupFile')}
            </Button>
            
            <Button
              variant="secondary"
              onClick={handleRefreshFromSupabase}
              disabled={isRestoring}
            >
              {isRestoring ? <LoadingSpinner /> : <Database size={16} />}
              {isRestoring ? 'Refreshing...' : 'Refresh from Supabase'}
            </Button>
          </ButtonGroup>

          <FileInput
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
          />
        </ActionCard>
      </BackupActions>
    </BackupContainer>
  );
};
