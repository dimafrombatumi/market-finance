import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Calendar, Mail, Phone, CreditCard, CheckCircle, Clock, Plus } from 'lucide-react';
import { useWorkshopRegistrationStore, useWorkshopStore } from '../stores';
import { useLanguage } from '../contexts/LanguageContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { WorkshopRegistration, Workshop, WorkshopSchedule } from '../types';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const SearchInput = styled.input`
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const RegistrationsTable = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 20px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  align-items: center;
  
  &:hover {
    background: #f8fafc;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const Cell = styled.div`
  font-size: 14px;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.$status) {
      case 'confirmed': return '#dcfce7';
      case 'pending': return '#fef3cd';
      case 'cancelled': return '#fee2e2';
      case 'completed': return '#e0e7ff';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'confirmed': return '#166534';
      case 'pending': return '#92400e';
      case 'cancelled': return '#991b1b';
      case 'completed': return '#3730a3';
      default: return '#374151';
    }
  }};
`;

const PaymentBadge = styled.span<{ $status: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.$status) {
      case 'paid': return '#dcfce7';
      case 'pending': return '#fef3cd';
      case 'refunded': return '#fee2e2';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'paid': return '#166534';
      case 'pending': return '#92400e';
      case 'refunded': return '#991b1b';
      default: return '#374151';
    }
  }};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
  
  h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    font-weight: 600;
    color: #374151;
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const QuickRegistrationForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
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

const Input = styled.input`
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  
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

export const WorkshopRegistrationsPage: React.FC = () => {
  const { t } = useLanguage();
  const { 
    registrations, 
    loading, 
    error, 
    fetchRegistrations,
    addRegistration,
    updateRegistrationStatus,
    updatePaymentStatus
  } = useWorkshopRegistrationStore();
  const { workshops, schedules, fetchWorkshops } = useWorkshopStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [workshopFilter, setWorkshopFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [quickFormData, setQuickFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    workshopId: '',
    scheduleId: '',
    paymentMethod: 'cash' as 'cash' | 'card' | 'online' | 'other',
    notes: '',
    specialRequests: ''
  });

  useEffect(() => {
    fetchRegistrations();
    fetchWorkshops();
  }, [fetchRegistrations, fetchWorkshops]);

  const filteredRegistrations = registrations.filter(registration => {
    const workshop = workshops.find(w => w.id === registration.workshopId);
    const matchesSearch = 
      registration.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop?.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || registration.status === statusFilter;
    const matchesPayment = !paymentFilter || registration.paymentStatus === paymentFilter;
    const matchesWorkshop = !workshopFilter || registration.workshopId === workshopFilter;
    
    return matchesSearch && matchesStatus && matchesPayment && matchesWorkshop;
  });

  const handleStatusChange = async (id: string, status: WorkshopRegistration['status']) => {
    await updateRegistrationStatus(id, status);
  };

  const handlePaymentChange = async (id: string, paymentStatus: WorkshopRegistration['paymentStatus']) => {
    await updatePaymentStatus(id, paymentStatus);
  };

  const handleQuickFormChange = (field: string, value: any) => {
    setQuickFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuickFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quickFormData.customerName.trim() || !quickFormData.customerEmail.trim()) {
      alert(t('errors.required'));
      return;
    }

    if (!quickFormData.workshopId || !quickFormData.scheduleId) {
      alert('Пожалуйста, выберите мастер-класс и расписание');
      return;
    }

    try {
      await addRegistration(quickFormData);
      setIsAddModalOpen(false);
      setQuickFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        workshopId: '',
        scheduleId: '',
        paymentMethod: 'cash' as 'cash' | 'card' | 'online' | 'other',
        notes: '',
        specialRequests: ''
      });
    } catch (error) {
      console.error('Error adding registration:', error);
      alert('Произошла ошибка при добавлении записи');
    }
  };

  const getAvailableSchedules = (): WorkshopSchedule[] => {
    if (!quickFormData.workshopId) return [];
    return schedules.filter((s: WorkshopSchedule) => s.workshopId === quickFormData.workshopId);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const stats = {
    total: registrations.length,
    confirmed: registrations.filter(r => r.status === 'confirmed').length,
    pending: registrations.filter(r => r.status === 'pending').length,
    paid: registrations.filter(r => r.paymentStatus === 'paid').length,
  };

  if (loading) {
    return <LoadingSpinner text={t('common.loading')} />;
  }

  if (error) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
          <p>{error}</p>
          <Button onClick={() => fetchRegistrations()} style={{ marginTop: '16px' }}>
            {t('common.retry')}
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>{t('workshopRegistrations.title')}</PageTitle>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} />
          {t('workshopRegistrations.addRegistration')}
        </Button>
      </PageHeader>

      <StatsContainer>
        <StatCard>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>{t('workshopRegistrations.totalRegistrations')}</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.confirmed}</StatValue>
          <StatLabel>{t('workshopRegistrations.confirmed')}</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.pending}</StatValue>
          <StatLabel>{t('workshopRegistrations.pending')}</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.paid}</StatValue>
          <StatLabel>{t('workshopRegistrations.paid')}</StatLabel>
        </StatCard>
      </StatsContainer>

      <FiltersContainer>
        <SearchInput
          type="text"
          placeholder={t('workshopRegistrations.searchRegistrations')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">{t('workshopRegistrations.allStatuses')}</option>
          <option value="pending">{t('workshopRegistrations.status.pending')}</option>
          <option value="confirmed">{t('workshopRegistrations.status.confirmed')}</option>
          <option value="cancelled">{t('workshopRegistrations.status.cancelled')}</option>
          <option value="completed">{t('workshopRegistrations.status.completed')}</option>
        </FilterSelect>
        <FilterSelect
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <option value="">{t('workshopRegistrations.allPayments')}</option>
          <option value="pending">{t('workshopRegistrations.payment.pending')}</option>
          <option value="paid">{t('workshopRegistrations.payment.paid')}</option>
          <option value="refunded">{t('workshopRegistrations.payment.refunded')}</option>
        </FilterSelect>
        <FilterSelect
          value={workshopFilter}
          onChange={(e) => setWorkshopFilter(e.target.value)}
        >
          <option value="">{t('workshopRegistrations.allWorkshops')}</option>
          {workshops.map(workshop => (
            <option key={workshop.id} value={workshop.id}>
              {workshop.title}
            </option>
          ))}
        </FilterSelect>
      </FiltersContainer>

      {filteredRegistrations.length === 0 ? (
        <EmptyState>
          <Calendar size={48} />
          <h3>{t('workshopRegistrations.noRegistrations')}</h3>
          <p>{t('workshopRegistrations.noRegistrationsDescription')}</p>
        </EmptyState>
      ) : (
        <RegistrationsTable>
          <TableHeader>
            <div>{t('workshopRegistrations.customer')}</div>
            <div>{t('workshopRegistrations.workshop')}</div>
            <div>{t('workshopRegistrations.registrationDate')}</div>
            <div>{t('workshopRegistrations.status')}</div>
            <div>{t('workshopRegistrations.paymentStatus')}</div>
            <div>{t('workshopRegistrations.amount')}</div>
            <div>{t('workshopRegistrations.paymentMethod')}</div>
            <div>{t('common.actions')}</div>
          </TableHeader>
          
          {filteredRegistrations.map(registration => {
            const workshop = workshops.find(w => w.id === registration.workshopId);
            
            return (
              <TableRow key={registration.id}>
                <Cell>
                  <div>
                    <div style={{ fontWeight: '500' }}>{registration.customerName}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      <Mail size={12} />
                      {registration.customerEmail}
                    </div>
                    {registration.customerPhone && (
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        <Phone size={12} />
                        {registration.customerPhone}
                      </div>
                    )}
                  </div>
                </Cell>
                
                <Cell>
                  <div style={{ fontWeight: '500' }}>
                    {workshop?.title || t('workshopRegistrations.workshopNotFound')}
                  </div>
                </Cell>
                
                <Cell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} />
                    {formatDate(registration.registrationDate)}
                  </div>
                </Cell>
                
                <Cell>
                  <StatusBadge $status={registration.status}>
                    {t(`workshopRegistrations.status.${registration.status}`)}
                  </StatusBadge>
                </Cell>
                
                <Cell>
                  <PaymentBadge $status={registration.paymentStatus}>
                    {t(`workshopRegistrations.payment.${registration.paymentStatus}`)}
                  </PaymentBadge>
                </Cell>
                
                <Cell>
                  <div style={{ fontWeight: '500' }}>
                    {formatCurrency(registration.totalAmount)}
                  </div>
                </Cell>
                
                <Cell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CreditCard size={14} />
                    {t(`workshopRegistrations.paymentMethods.${registration.paymentMethod}`)}
                  </div>
                </Cell>
                
                <Cell>
                  <ActionButtons>
                    {registration.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(registration.id, 'confirmed')}
                      >
                        <CheckCircle size={14} />
                      </Button>
                    )}
                    {registration.status === 'confirmed' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(registration.id, 'completed')}
                      >
                        <Clock size={14} />
                      </Button>
                    )}
                    {registration.paymentStatus === 'pending' && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handlePaymentChange(registration.id, 'paid')}
                      >
                        <CheckCircle size={14} />
                      </Button>
                    )}
                  </ActionButtons>
                </Cell>
              </TableRow>
            );
          })}
        </RegistrationsTable>
      )}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={t('workshopRegistrations.addRegistration')}
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
              onClick={() => setIsAddModalOpen(false)}
              size="sm"
            >
              {t('common.cancel')}
            </Button>
            <Button 
              type="submit" 
              form="quick-registration-form"
              loading={loading}
              disabled={loading}
              size="sm"
            >
              {t('common.add')}
            </Button>
          </div>
        }
      >
        <form id="quick-registration-form" onSubmit={handleQuickFormSubmit}>
          <QuickRegistrationForm>
            <FormRow>
              <FormGroup>
                <Label>{t('workshops.customerName')} *</Label>
                <Input
                  value={quickFormData.customerName}
                  onChange={(e) => handleQuickFormChange('customerName', e.target.value)}
                  placeholder={t('workshops.customerNamePlaceholder')}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>{t('workshops.customerEmail')} *</Label>
                <Input
                  type="email"
                  value={quickFormData.customerEmail}
                  onChange={(e) => handleQuickFormChange('customerEmail', e.target.value)}
                  placeholder={t('workshops.customerEmailPlaceholder')}
                  required
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>{t('workshops.customerPhone')}</Label>
              <Input
                type="tel"
                value={quickFormData.customerPhone}
                onChange={(e) => handleQuickFormChange('customerPhone', e.target.value)}
                placeholder={t('workshops.customerPhonePlaceholder')}
              />
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label>{t('workshops.workshop')} *</Label>
                <Select
                  value={quickFormData.workshopId}
                  onChange={(e) => {
                    handleQuickFormChange('workshopId', e.target.value);
                    handleQuickFormChange('scheduleId', ''); // Reset schedule when workshop changes
                  }}
                  required
                >
                  <option value="">{t('workshops.selectWorkshop')}</option>
                  {workshops.map(workshop => (
                    <option key={workshop.id} value={workshop.id}>
                      {workshop.title}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label>{t('workshops.schedules')} *</Label>
                <Select
                  value={quickFormData.scheduleId}
                  onChange={(e) => handleQuickFormChange('scheduleId', e.target.value)}
                  required
                  disabled={!quickFormData.workshopId}
                >
                  <option value="">{t('workshops.selectSchedule')}</option>
                  {getAvailableSchedules().map((schedule: WorkshopSchedule) => (
                    <option key={schedule.id} value={schedule.id}>
                      {new Intl.DateTimeFormat('ru-RU', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      }).format(schedule.startDate)} - {schedule.startTime} ({schedule.location})
                    </option>
                  ))}
                </Select>
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>{t('workshops.paymentMethod')} *</Label>
              <Select
                value={quickFormData.paymentMethod}
                onChange={(e) => handleQuickFormChange('paymentMethod', e.target.value)}
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
                value={quickFormData.notes}
                onChange={(e) => handleQuickFormChange('notes', e.target.value)}
                placeholder={t('workshops.notesPlaceholder')}
              />
            </FormGroup>

            <FormGroup>
              <Label>{t('workshops.specialRequests')}</Label>
              <TextArea
                value={quickFormData.specialRequests}
                onChange={(e) => handleQuickFormChange('specialRequests', e.target.value)}
                placeholder={t('workshops.specialRequestsPlaceholder')}
              />
            </FormGroup>
          </QuickRegistrationForm>
        </form>
      </Modal>
    </PageContainer>
  );
};
