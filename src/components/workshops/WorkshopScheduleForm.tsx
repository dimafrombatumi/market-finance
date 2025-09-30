import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWorkshopStore } from '../../stores';
import { useLanguage } from '../../contexts/LanguageContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { WorkshopSchedule, WorkshopScheduleFormData } from '../../types';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const StatusContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const StatusOption = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #3b82f6;
  }
  
  input[type="radio"]:checked + & {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`;

const RadioInput = styled.input`
  margin: 0;
`;

interface WorkshopScheduleFormProps {
  workshopId: string;
  schedule?: WorkshopSchedule;
  onClose: () => void;
  onSuccess: () => void;
}

export const WorkshopScheduleForm: React.FC<WorkshopScheduleFormProps> = ({
  workshopId,
  schedule,
  onClose,
  onSuccess
}) => {
  const { t } = useLanguage();
  const { addSchedule, updateSchedule, loading } = useWorkshopStore();
  
  const [formData, setFormData] = useState<WorkshopScheduleFormData>({
    startDate: new Date(),
    endDate: new Date(),
    startTime: '10:00',
    endTime: '12:00',
    location: '',
    room: '',
    maxParticipants: 10,
    notes: ''
  });

  useEffect(() => {
    if (schedule) {
      setFormData({
        startDate: schedule.startDate,
        endDate: schedule.endDate,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        location: schedule.location,
        room: schedule.room || '',
        maxParticipants: schedule.maxParticipants,
        notes: schedule.notes || ''
      });
    }
  }, [schedule]);

  const handleInputChange = (field: keyof WorkshopScheduleFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация обязательных полей
    if (!formData.location.trim()) {
      alert(t('workshops.schedule.locationRequired'));
      return;
    }
    
    if (!formData.startTime || !formData.endTime) {
      alert(t('workshops.schedule.timeRequired'));
      return;
    }
    
    try {
      if (schedule) {
        await updateSchedule(schedule.id, formData);
      } else {
        await addSchedule(workshopId, formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert(`Ошибка при сохранении расписания: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`);
    }
  };

  return (
    <form id="workshop-schedule-form" onSubmit={handleSubmit}>
      <FormContainer>
        <FormRow>
          <FormGroup>
            <Label>{t('workshops.schedule.startDate')} *</Label>
            <Input
              type="date"
              value={formData.startDate.toISOString().split('T')[0]}
              onChange={(e) => handleInputChange('startDate', new Date(e.target.value))}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>{t('workshops.schedule.endDate')} *</Label>
            <Input
              type="date"
              value={formData.endDate.toISOString().split('T')[0]}
              onChange={(e) => handleInputChange('endDate', new Date(e.target.value))}
              required
            />
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <Label>{t('workshops.schedule.startTime')} *</Label>
            <Input
              type="time"
              value={formData.startTime}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>{t('workshops.schedule.endTime')} *</Label>
            <Input
              type="time"
              value={formData.endTime}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
              required
            />
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <Label>{t('workshops.schedule.location')} *</Label>
            <Input
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder={t('workshops.schedule.locationPlaceholder')}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>{t('workshops.schedule.room')}</Label>
            <Input
              value={formData.room}
              onChange={(e) => handleInputChange('room', e.target.value)}
              placeholder={t('workshops.schedule.roomPlaceholder')}
            />
          </FormGroup>
        </FormRow>

        <FormGroup>
          <Label>{t('workshops.schedule.maxParticipants')} *</Label>
          <Input
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value) || 0)}
            placeholder={t('workshops.schedule.maxParticipantsPlaceholder')}
            required
            min="1"
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('workshops.schedule.notes')}</Label>
          <TextArea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder={t('workshops.schedule.notesPlaceholder')}
          />
        </FormGroup>
      </FormContainer>
    </form>
  );
};
