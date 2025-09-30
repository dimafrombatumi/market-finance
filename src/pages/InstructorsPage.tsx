import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Edit, Trash2, User, Mail, Phone, ExternalLink } from 'lucide-react';
import { useInstructorStore } from '../stores';
import { useLanguage } from '../contexts/LanguageContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { InstructorFormModal } from '../components/instructors/InstructorFormModal';
import { Instructor } from '../types';

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

const InstructorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;

const InstructorCard = styled.div`
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

const CardHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Avatar = styled.div<{ $imageUrl?: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.$imageUrl ? `url(${props.$imageUrl})` : '#e5e7eb'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 24px;
  font-weight: 600;
`;

const InstructorInfo = styled.div`
  flex: 1;
`;

const InstructorName = styled.h3`
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
`;

const InstructorEmail = styled.div`
  font-size: 14px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 4px;
`;

const InstructorPhone = styled.div`
  font-size: 14px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const Bio = styled.p`
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SpecialtiesContainer = styled.div`
  margin-bottom: 16px;
`;

const SpecialtiesLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SpecialtiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const SpecialtyTag = styled.span`
  background: #e5e7eb;
  color: #374151;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const SocialLink = styled.a`
  color: #6b7280;
  text-decoration: none;
  font-size: 16px;
  
  &:hover {
    color: #3b82f6;
  }
`;

const CardFooter = styled.div`
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatusBadge = styled.span<{ $active: boolean }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => props.$active ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.$active ? '#166534' : '#991b1b'};
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

export const InstructorsPage: React.FC = () => {
  const { t } = useLanguage();
  const { 
    instructors, 
    loading, 
    error, 
    fetchInstructors, 
    deleteInstructor 
  } = useInstructorStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [instructorToDelete, setInstructorToDelete] = useState<Instructor | null>(null);

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  const filteredInstructors = instructors.filter(instructor =>
    instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddInstructor = () => {
    setSelectedInstructor(null);
    setIsFormModalOpen(true);
  };

  const handleEditInstructor = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setIsFormModalOpen(true);
  };

  const handleDeleteInstructor = (instructor: Instructor) => {
    setInstructorToDelete(instructor);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (instructorToDelete) {
      await deleteInstructor(instructorToDelete.id);
      setIsDeleteDialogOpen(false);
      setInstructorToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setSelectedInstructor(null);
  };

  if (loading) {
    return <LoadingSpinner text={t('common.loading')} />;
  }

  if (error) {
    return (
      <PageContainer>
        <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
          <p>{error}</p>
          <Button onClick={fetchInstructors} style={{ marginTop: '16px' }}>
            {t('common.retry')}
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>{t('instructors.title')}</PageTitle>
        <Button onClick={handleAddInstructor}>
          <Plus size={16} />
          {t('instructors.addInstructor')}
        </Button>
      </PageHeader>

      <SearchContainer>
        <SearchInput
          type="text"
          placeholder={t('instructors.searchInstructors')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchContainer>

      {filteredInstructors.length === 0 ? (
        <EmptyState>
          <User size={48} />
          <h3>{t('instructors.noInstructors')}</h3>
          <p>{t('instructors.startByAdding')}</p>
          <Button onClick={handleAddInstructor}>
            <Plus size={16} />
            {t('instructors.addInstructor')}
          </Button>
        </EmptyState>
      ) : (
        <InstructorsGrid>
          {filteredInstructors.map(instructor => (
            <InstructorCard key={instructor.id}>
              <CardHeader>
                <Avatar $imageUrl={instructor.imageUrl}>
                  {!instructor.imageUrl && instructor.name.charAt(0).toUpperCase()}
                </Avatar>
                <InstructorInfo>
                  <InstructorName>{instructor.name}</InstructorName>
                  <InstructorEmail>
                    <Mail size={14} />
                    {instructor.email}
                  </InstructorEmail>
                  {instructor.phone && (
                    <InstructorPhone>
                      <Phone size={14} />
                      {instructor.phone}
                    </InstructorPhone>
                  )}
                </InstructorInfo>
              </CardHeader>

              <CardContent>
                {instructor.bio && <Bio>{instructor.bio}</Bio>}
                
                {instructor.specialties.length > 0 && (
                  <SpecialtiesContainer>
                    <SpecialtiesLabel>{t('instructors.specialties')}</SpecialtiesLabel>
                    <SpecialtiesList>
                      {instructor.specialties.map((specialty, index) => (
                        <SpecialtyTag key={index}>{specialty}</SpecialtyTag>
                      ))}
                    </SpecialtiesList>
                  </SpecialtiesContainer>
                )}

                <StatsContainer>
                  <StatItem>
                    <StatValue>{instructor.experience}</StatValue>
                    <StatLabel>{t('instructors.yearsExperience')}</StatLabel>
                  </StatItem>
                  <StatItem>
                    <StatValue>${instructor.hourlyRate}/hr</StatValue>
                    <StatLabel>{t('instructors.hourlyRate')}</StatLabel>
                  </StatItem>
                </StatsContainer>

                {(instructor.socialLinks?.instagram || 
                  instructor.socialLinks?.facebook || 
                  instructor.socialLinks?.website) && (
                  <SocialLinks>
                    {instructor.socialLinks?.instagram && (
                      <SocialLink 
                        href={`https://instagram.com/${instructor.socialLinks.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={16} />
                      </SocialLink>
                    )}
                    {instructor.socialLinks?.facebook && (
                      <SocialLink 
                        href={instructor.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={16} />
                      </SocialLink>
                    )}
                    {instructor.socialLinks?.website && (
                      <SocialLink 
                        href={instructor.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={16} />
                      </SocialLink>
                    )}
                  </SocialLinks>
                )}
              </CardContent>

              <CardFooter>
                <StatusBadge $active={instructor.isActive}>
                  {instructor.isActive ? t('instructors.active') : t('instructors.inactive')}
                </StatusBadge>
                <ActionButtons>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditInstructor(instructor)}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteInstructor(instructor)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </ActionButtons>
              </CardFooter>
            </InstructorCard>
          ))}
        </InstructorsGrid>
      )}

      <InstructorFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        instructor={selectedInstructor || undefined}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title={t('instructors.deleteInstructor')}
        message={t('instructors.deleteConfirm', { name: instructorToDelete?.name })}
        type="danger"
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
      />
    </PageContainer>
  );
};
