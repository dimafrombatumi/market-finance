import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Edit, Trash2, Calendar, Users, Clock, MapPin, Star } from 'lucide-react';
import { useWorkshopStore } from '../stores';
import { useLanguage } from '../contexts/LanguageContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { WorkshopFormModal } from '../components/workshops/WorkshopFormModal';
import { WorkshopRegistrationModal } from '../components/workshops/WorkshopRegistrationModal';
import { WorkshopScheduleModal } from '../components/workshops/WorkshopScheduleModal';
import { Workshop, WorkshopSchedule } from '../types';

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

const SearchContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
`;

const SearchInput = styled.input`
  flex: 1;
  max-width: 400px;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
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

const WorkshopsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
`;

const WorkshopCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const CardImage = styled.div<{ $imageUrl?: string }>`
  height: 200px;
  background: ${props => props.$imageUrl ? `url(${props.$imageUrl})` : '#e5e7eb'};
  background-size: cover;
  background-position: center;
  position: relative;
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const WorkshopTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
`;

const WorkshopDescription = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const WorkshopDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #64748b;
`;

const InstructorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #374151;
`;

const Avatar = styled.div<{ $imageUrl?: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$imageUrl ? `url(${props.$imageUrl})` : '#e5e7eb'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 12px;
  font-weight: 600;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
`;

const Tag = styled.span`
  background: #e5e7eb;
  color: #374151;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
`;

const PriceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Price = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
`;

const MaterialsCost = styled.div`
  font-size: 12px;
  color: #64748b;
`;

const SchedulesContainer = styled.div`
  margin-bottom: 16px;
`;

const SchedulesLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ScheduleItem = styled.div`
  background: #f8fafc;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 14px;
`;

const ScheduleDate = styled.div`
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4px;
`;

const ScheduleDetails = styled.div`
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #64748b;
`;

const CardFooter = styled.div`
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.$status) {
      case 'published': return '#dcfce7';
      case 'draft': return '#fef3cd';
      case 'cancelled': return '#fee2e2';
      case 'completed': return '#e0e7ff';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'published': return '#166534';
      case 'draft': return '#92400e';
      case 'cancelled': return '#991b1b';
      case 'completed': return '#3730a3';
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
    margin: 0 0 24px 0;
    font-size: 14px;
  }
`;

export const WorkshopsPage: React.FC = () => {
  const { t } = useLanguage();
  const { 
    workshops, 
    schedules,
    loading, 
    error, 
    fetchWorkshops,
    fetchSchedules,
    deleteWorkshop 
  } = useWorkshopStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<WorkshopSchedule | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [workshopToDelete, setWorkshopToDelete] = useState<Workshop | null>(null);
  const [scheduleToEdit, setScheduleToEdit] = useState<WorkshopSchedule | null>(null);

  useEffect(() => {
    fetchWorkshops();
    fetchSchedules();
  }, [fetchWorkshops, fetchSchedules]);

  const filteredWorkshops = workshops.filter(workshop => {
    const matchesSearch = workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workshop.instructor?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || workshop.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddWorkshop = () => {
    setSelectedWorkshop(null);
    setIsFormModalOpen(true);
  };

  const handleEditWorkshop = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setIsFormModalOpen(true);
  };

  const handleManageSchedule = (workshop: Workshop) => {
    setSelectedWorkshop(workshop);
    setScheduleToEdit(null);
    setIsScheduleModalOpen(true);
  };

  const handleEditSchedule = (schedule: WorkshopSchedule) => {
    setScheduleToEdit(schedule);
    setIsScheduleModalOpen(true);
  };

  const handleDeleteWorkshop = (workshop: Workshop) => {
    setWorkshopToDelete(workshop);
    setIsDeleteDialogOpen(true);
  };

  const handleRegisterForWorkshop = (workshop: Workshop, schedule: WorkshopSchedule) => {
    setSelectedWorkshop(workshop);
    setSelectedSchedule(schedule);
    setIsRegistrationModalOpen(true);
  };

  const confirmDelete = async () => {
    if (workshopToDelete) {
      await deleteWorkshop(workshopToDelete.id);
      setIsDeleteDialogOpen(false);
      setWorkshopToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setSelectedWorkshop(null);
  };

  const handleRegistrationSuccess = () => {
    setIsRegistrationModalOpen(false);
    setSelectedWorkshop(null);
    setSelectedSchedule(null);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (time: string) => {
    return time;
  };

  if (loading) {
    return <LoadingSpinner text={t('common.loading')} />;
  }

  if (error) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
          <p>{error}</p>
          <Button onClick={fetchWorkshops} style={{ marginTop: '16px' }}>
            {t('common.retry')}
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>{t('workshops.title')}</PageTitle>
        <Button onClick={handleAddWorkshop}>
          <Plus size={16} />
          {t('workshops.addWorkshop')}
        </Button>
      </PageHeader>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder={t('workshops.searchWorkshops')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterSelect
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">{t('workshops.allCategories')}</option>
          <option value="art">{t('workshops.categories.art')}</option>
          <option value="crafts">{t('workshops.categories.crafts')}</option>
          <option value="cooking">{t('workshops.categories.cooking')}</option>
          <option value="music">{t('workshops.categories.music')}</option>
          <option value="dance">{t('workshops.categories.dance')}</option>
          <option value="photography">{t('workshops.categories.photography')}</option>
          <option value="technology">{t('workshops.categories.technology')}</option>
          <option value="business">{t('workshops.categories.business')}</option>
          <option value="other">{t('workshops.categories.other')}</option>
        </FilterSelect>
      </SearchContainer>

      {filteredWorkshops.length === 0 ? (
        <EmptyState>
          <Calendar size={48} />
          <h3>{t('workshops.noWorkshops')}</h3>
          <p>{t('workshops.startByAdding')}</p>
          <Button onClick={handleAddWorkshop}>
            <Plus size={16} />
            {t('workshops.addWorkshop')}
          </Button>
        </EmptyState>
      ) : (
        <WorkshopsGrid>
          {filteredWorkshops.map(workshop => {
            const workshopSchedules = schedules.filter(s => s.workshopId === workshop.id);
            
            return (
              <WorkshopCard key={workshop.id}>
                <CardImage $imageUrl={workshop.imageUrl}>
                  <ImageOverlay>
                    {t(`workshops.skillLevels.${workshop.skillLevel || 'beginner'}`)}
                  </ImageOverlay>
                </CardImage>

                <CardContent>
                  <WorkshopTitle>{workshop.title}</WorkshopTitle>
                  <WorkshopDescription>{workshop.shortDescription}</WorkshopDescription>

                  <InstructorInfo>
                    <Avatar $imageUrl={workshop.instructor?.imageUrl}>
                      {!workshop.instructor?.imageUrl && workshop.instructor?.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <span>{workshop.instructor?.name}</span>
                  </InstructorInfo>

                  <WorkshopDetails>
                    <DetailItem>
                      <Clock size={14} />
                      {workshop.duration} {t('workshops.hours')}
                    </DetailItem>
                    <DetailItem>
                      <Users size={14} />
                      {workshop.maxParticipants} {t('workshops.participants')}
                    </DetailItem>
                    <DetailItem>
                      <Star size={14} />
                      {t(`workshops.categories.${workshop.category}`)}
                    </DetailItem>
                    <DetailItem>
                      <MapPin size={14} />
                      {workshopSchedules[0]?.location || t('workshops.locationTBD')}
                    </DetailItem>
                  </WorkshopDetails>

                  {workshop.tags.length > 0 && (
                    <TagsContainer>
                      {workshop.tags.map((tag, index) => (
                        <Tag key={index}>{tag}</Tag>
                      ))}
                    </TagsContainer>
                  )}

                  <PriceContainer>
                    <Price>${workshop.price}</Price>
                    {workshop.materialsCost && (
                      <MaterialsCost>
                        + ${workshop.materialsCost} {t('workshops.materials')}
                      </MaterialsCost>
                    )}
                  </PriceContainer>

                  {workshopSchedules.length > 0 && (
                    <SchedulesContainer>
                      <SchedulesLabel>{t('workshops.schedules')}</SchedulesLabel>
                      {workshopSchedules.slice(0, 2).map(schedule => (
                        <ScheduleItem key={schedule.id}>
                          <ScheduleDate>{formatDate(schedule.startDate)}</ScheduleDate>
                          <ScheduleDetails>
                            <span>{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</span>
                            <span>{schedule.location}</span>
                            <span>{schedule.currentParticipants}/{schedule.maxParticipants} {t('workshops.participants')}</span>
                          </ScheduleDetails>
                        </ScheduleItem>
                      ))}
                      {workshopSchedules.length > 2 && (
                        <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
                          +{workshopSchedules.length - 2} {t('workshops.moreSchedules')}
                        </div>
                      )}
                    </SchedulesContainer>
                  )}
                </CardContent>

                <CardFooter>
                  <StatusBadge $status={workshop.status}>
                    {t(`workshops.status.${workshop.status}`)}
                  </StatusBadge>
                  <ActionButtons>
                    {workshopSchedules.length > 0 && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleRegisterForWorkshop(workshop, workshopSchedules[0])}
                      >
                        {t('workshops.register')}
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleManageSchedule(workshop)}
                    >
                      <Calendar size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditWorkshop(workshop)}
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteWorkshop(workshop)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </ActionButtons>
                </CardFooter>
              </WorkshopCard>
            );
          })}
        </WorkshopsGrid>
      )}

      <WorkshopFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        workshop={selectedWorkshop || undefined}
      />

      {selectedWorkshop && (
        <WorkshopScheduleModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          workshopId={selectedWorkshop.id}
          schedule={scheduleToEdit || undefined}
        />
      )}

      {selectedWorkshop && selectedSchedule && (
        <WorkshopRegistrationModal
          isOpen={isRegistrationModalOpen}
          onClose={() => setIsRegistrationModalOpen(false)}
          workshop={selectedWorkshop}
          schedule={selectedSchedule}
        />
      )}

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title={t('workshops.deleteWorkshop')}
        message={t('workshops.deleteConfirm', { name: workshopToDelete?.title })}
        type="danger"
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
      />
    </PageContainer>
  );
};
