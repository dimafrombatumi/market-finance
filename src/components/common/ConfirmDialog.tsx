import React from 'react';
import styled from 'styled-components';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 0;
`;

const IconContainer = styled.div<{ $type: 'warning' | 'info' | 'success' | 'danger' }>`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  background-color: ${props => {
    switch (props.$type) {
      case 'warning': return 'rgba(245, 158, 11, 0.1)';
      case 'info': return 'rgba(59, 130, 246, 0.1)';
      case 'success': return 'rgba(16, 185, 129, 0.1)';
      case 'danger': return 'rgba(239, 68, 68, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      case 'success': return '#10b981';
      case 'danger': return '#ef4444';
      default: return '#6b7280';
    }
  }};
`;

const Title = styled.h3`
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
`;

const Message = styled.p`
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
`;

const getIcon = (type: 'warning' | 'info' | 'success' | 'danger') => {
  switch (type) {
    case 'warning': return <AlertTriangle size={32} />;
    case 'info': return <Info size={32} />;
    case 'success': return <CheckCircle size={32} />;
    case 'danger': return <XCircle size={32} />;
    default: return <Info size={32} />;
  }
};

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'warning' | 'info' | 'success' | 'danger';
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="sm"
      footer={
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'flex-end'
        }}>
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={loading}
            size="sm"
          >
            {cancelText}
          </Button>
          <Button 
            variant={type === 'danger' ? 'danger' : 'primary'}
            onClick={handleConfirm}
            loading={loading}
            disabled={loading}
            size="sm"
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <DialogContent>
        <IconContainer $type={type}>
          {getIcon(type)}
        </IconContainer>
        <Title>{title}</Title>
        <Message>{message}</Message>
      </DialogContent>
    </Modal>
  );
};
