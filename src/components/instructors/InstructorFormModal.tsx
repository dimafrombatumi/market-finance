import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { InstructorForm } from './InstructorForm';
import { useLanguage } from '../../contexts/LanguageContext';
import { useInstructorStore } from '../../stores';
import { Instructor } from '../../types';

interface InstructorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  instructor?: Instructor;
}

export const InstructorFormModal: React.FC<InstructorFormModalProps> = ({
  isOpen,
  onClose,
  instructor
}) => {
  const { t } = useLanguage();
  const { loading } = useInstructorStore();

  const handleSuccess = () => {
    console.log(t('instructors.instructorSaved'));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={instructor ? t('instructors.editInstructor') : t('instructors.addInstructor')}
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
            form="instructor-form"
            loading={loading}
            disabled={loading}
            size="sm"
          >
            {instructor ? t('common.save') : t('common.add')}
          </Button>
        </div>
      }
    >
      <InstructorForm
        instructor={instructor}
        onClose={onClose}
        onSuccess={handleSuccess}
      />
    </Modal>
  );
};
