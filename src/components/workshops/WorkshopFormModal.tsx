import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { WorkshopForm } from './WorkshopForm';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useWorkshopStore } from '../../stores';
import { Workshop } from '../../types';

interface WorkshopFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshop?: Workshop;
}

export const WorkshopFormModal: React.FC<WorkshopFormModalProps> = ({
  isOpen,
  onClose,
  workshop
}) => {
  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  const { loading } = useWorkshopStore();

  const handleSuccess = () => {
    addNotification({
      type: 'success',
      title: t('common.success'),
      message: t('workshops.workshopSaved')
    });
    onClose(); // Close the modal after successful save
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={workshop ? t('workshops.editWorkshop') : t('workshops.addWorkshop')}
      size="xl"
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
            size="sm"
          >
            {t('common.cancel')}
          </Button>
          <Button 
            type="submit" 
            form="workshop-form"
            loading={loading}
            disabled={loading}
            size="sm"
          >
            {workshop ? t('common.save') : t('common.add')}
          </Button>
        </div>
      }
    >
      <WorkshopForm
        workshop={workshop}
        onClose={onClose}
        onSuccess={handleSuccess}
      />
    </Modal>
  );
};
