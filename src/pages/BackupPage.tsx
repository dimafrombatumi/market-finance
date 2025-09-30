import React from 'react';
import styled from 'styled-components';
import { BackupManagerComponent } from '../components/backup/BackupManager';

const PageContainer = styled.div`
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
  
  h1 {
    margin: 0 0 8px 0;
    font-size: 32px;
    font-weight: 700;
    color: #1e293b;
  }
  
  p {
    margin: 0;
    color: #64748b;
    font-size: 16px;
  }
`;

export const BackupPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader>
        <h1>Резервное копирование</h1>
        <p>Управление резервными копиями ваших данных</p>
      </PageHeader>
      
      <BackupManagerComponent />
    </PageContainer>
  );
};
