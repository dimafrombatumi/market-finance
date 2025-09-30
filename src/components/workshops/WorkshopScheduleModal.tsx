import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useWorkshopStore } from '../../stores';
import { WorkshopScheduleForm } from './WorkshopScheduleForm';
import { WorkshopSchedule } from '../../types';

interface WorkshopScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshopId: string;
  schedule?: WorkshopSchedule;
}

export const WorkshopScheduleModal: React.FC<WorkshopScheduleModalProps> = ({
  isOpen,
  onClose,
  workshopId,
  schedule
}) => {
  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  const { loading } = useWorkshopStore();

  const handleSuccess = () => {
    addNotification({
      type: 'success',
      title: t('common.success'),
      message: t('workshops.schedule.saved')
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={schedule ? t('workshops.schedule.editSchedule') : t('workshops.schedule.addSchedule')}
      size="lg"
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
            form="workshop-schedule-form"
            loading={loading}
            disabled={loading}
            size="sm"
          >
            {schedule ? t('common.save') : t('common.add')}
          </Button>
        </div>
      }
    >
      <WorkshopScheduleForm
        workshopId={workshopId}
        schedule={schedule}
        onClose={onClose}
        onSuccess={handleSuccess}
      />
    </Modal>
  );
};
