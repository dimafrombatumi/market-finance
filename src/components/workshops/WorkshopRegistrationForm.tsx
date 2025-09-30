import React, { useState } from 'react';
import styled from 'styled-components';
import { useWorkshopRegistrationStore } from '../../stores';
import { useLanguage } from '../../contexts/LanguageContext';
import { Input } from '../common/Input';
import { WorkshopRegistrationFormData, Workshop, WorkshopSchedule } from '../../types';

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

const WorkshopInfo = styled.div`
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const WorkshopTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
`;

const WorkshopDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  font-size: 14px;
  color: #64748b;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const DetailLabel = styled.span`
  font-weight: 500;
  color: #374151;
`;

const PriceDisplay = styled.div`
  background: #eff6ff;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  margin: 16px 0;
`;

const PriceAmount = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
`;

const PriceLabel = styled.div`
  font-size: 14px;
  color: #64748b;
`;

interface WorkshopRegistrationFormProps {
  workshop: Workshop;
  schedule: WorkshopSchedule;
  onClose: () => void;
  onSuccess: () => void;
}

export const WorkshopRegistrationForm: React.FC<WorkshopRegistrationFormProps> = ({
  workshop,
  schedule,
  onClose,
  onSuccess
}) => {
  const { t } = useLanguage();
  const { addRegistration, loading } = useWorkshopRegistrationStore();
  
  const [formData, setFormData] = useState<WorkshopRegistrationFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    paymentMethod: 'cash',
    notes: '',
    specialRequests: ''
  });

  const handleInputChange = (field: keyof WorkshopRegistrationFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация формы
    if (!formData.customerName.trim()) {
      alert(t('errors.required'));
      return;
    }
    
    if (!formData.customerEmail.trim()) {
      alert(t('errors.required'));
      return;
    }
    
    // Простая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customerEmail)) {
      alert(t('errors.invalidEmail'));
      return;
    }
    
    try {
      await addRegistration({
        ...formData,
        workshopId: workshop.id,
        scheduleId: schedule.id
      });
      onSuccess();
    } catch (error) {
      console.error('Error registering for workshop:', error);
      const errorMessage = error instanceof Error && error.message.includes('Нет свободных мест') 
        ? t('workshopRegistrations.noSpotsAvailable')
        : 'Произошла ошибка при записи на мастер-класс. Попробуйте еще раз.';
      alert(errorMessage);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (time: string) => {
    return time;
  };

  const totalPrice = workshop.price + (workshop.materialsCost || 0);
  const isFullyBooked = schedule.currentParticipants >= schedule.maxParticipants;

  return (
    <form id="workshop-registration-form" onSubmit={handleSubmit}>
      <FormContainer>
        <WorkshopInfo>
          <WorkshopTitle>{workshop.title}</WorkshopTitle>
          <WorkshopDetails>
            <DetailItem>
              <DetailLabel>{t('workshops.instructor')}:</DetailLabel>
              <span>{workshop.instructor?.name}</span>
            </DetailItem>
            <DetailItem>
              <DetailLabel>{t('workshops.date')}:</DetailLabel>
              <span>{formatDate(schedule.startDate)}</span>
            </DetailItem>
            <DetailItem>
              <DetailLabel>{t('workshops.time')}:</DetailLabel>
              <span>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</span>
            </DetailItem>
            <DetailItem>
              <DetailLabel>{t('workshops.duration')}:</DetailLabel>
              <span>{workshop.duration} {t('workshops.hours')}</span>
            </DetailItem>
            <DetailItem>
              <DetailLabel>{t('workshops.location')}:</DetailLabel>
              <span>{schedule.location}</span>
            </DetailItem>
            <DetailItem>
              <DetailLabel>{t('workshops.skillLevel')}:</DetailLabel>
              <span>{t(`workshops.skillLevels.${workshop.skillLevel}`)}</span>
            </DetailItem>
            <DetailItem>
              <DetailLabel>{t('workshops.participants')}:</DetailLabel>
              <span>{schedule.currentParticipants}/{schedule.maxParticipants}</span>
            </DetailItem>
          </WorkshopDetails>
        </WorkshopInfo>

        <PriceDisplay>
          <PriceAmount>${totalPrice.toFixed(2)}</PriceAmount>
          <PriceLabel>
            {t('workshops.workshopPrice')}: ${workshop.price.toFixed(2)}
            {workshop.materialsCost && (
              <span> + {t('workshops.materialsCost')}: ${workshop.materialsCost.toFixed(2)}</span>
            )}
          </PriceLabel>
        </PriceDisplay>

        {isFullyBooked && (
          <div style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center',
            marginBottom: '16px',
            fontWeight: '500'
          }}>
            ⚠️ {t('workshopRegistrations.fullyBooked')}
          </div>
        )}

        <FormRow>
          <FormGroup>
            <Label>{t('workshops.customerName')} *</Label>
            <Input
              value={formData.customerName}
              onChange={(e) => handleInputChange('customerName', e.target.value)}
              placeholder={t('workshops.customerNamePlaceholder')}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>{t('workshops.customerEmail')} *</Label>
            <Input
              type="email"
              value={formData.customerEmail}
              onChange={(e) => handleInputChange('customerEmail', e.target.value)}
              placeholder={t('workshops.customerEmailPlaceholder')}
              required
            />
          </FormGroup>
        </FormRow>

        <FormGroup>
          <Label>{t('workshops.customerPhone')}</Label>
          <Input
            type="tel"
            value={formData.customerPhone}
            onChange={(e) => handleInputChange('customerPhone', e.target.value)}
            placeholder={t('workshops.customerPhonePlaceholder')}
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('workshops.paymentMethod')} *</Label>
          <Select
            value={formData.paymentMethod}
            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
            required
          >
            <option value="cash">{t('workshops.paymentMethods.cash')}</option>
            <option value="card">{t('workshops.paymentMethods.card')}</option>
            <option value="online">{t('workshops.paymentMethods.online')}</option>
            <option value="other">{t('workshops.paymentMethods.other')}</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>{t('workshops.notes')}</Label>
          <TextArea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder={t('workshops.notesPlaceholder')}
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('workshops.specialRequests')}</Label>
          <TextArea
            value={formData.specialRequests}
            onChange={(e) => handleInputChange('specialRequests', e.target.value)}
            placeholder={t('workshops.specialRequestsPlaceholder')}
          />
        </FormGroup>
      </FormContainer>
    </form>
  );
};
