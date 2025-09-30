import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { WorkshopRegistrationForm } from './WorkshopRegistrationForm';
import { useLanguage } from '../../contexts/LanguageContext';
import { useWorkshopRegistrationStore } from '../../stores';
import { Workshop, WorkshopSchedule } from '../../types';

interface WorkshopRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshop: Workshop;
  schedule: WorkshopSchedule;
}

export const WorkshopRegistrationModal: React.FC<WorkshopRegistrationModalProps> = ({
  isOpen,
  onClose,
  workshop,
  schedule
}) => {
  const { t } = useLanguage();
  const { loading } = useWorkshopRegistrationStore();

  const handleSuccess = () => {
    alert(t('workshops.registrationSuccessful'));
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('workshops.registerForWorkshop')}
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
            form="workshop-registration-form"
            loading={loading}
            disabled={loading || schedule.currentParticipants >= schedule.maxParticipants}
            size="sm"
          >
            {schedule.currentParticipants >= schedule.maxParticipants 
              ? t('workshopRegistrations.noSpotsAvailable')
              : t('workshops.register')
            }
          </Button>
        </div>
      }
    >
      <WorkshopRegistrationForm
        workshop={workshop}
        schedule={schedule}
        onClose={onClose}
        onSuccess={handleSuccess}
      />
    </Modal>
  );
};
