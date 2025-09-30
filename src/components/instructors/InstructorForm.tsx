import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useInstructorStore } from '../../stores';
import { useLanguage } from '../../contexts/LanguageContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Instructor, InstructorFormData } from '../../types';

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
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const Tag = styled.span`
  background: #e5e7eb;
  color: #374151;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TagInput = styled.input`
  padding: 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 12px;
  min-width: 100px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;
  
  &:hover {
    color: #ef4444;
  }
`;

const SocialLinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SocialLinkRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SocialLabel = styled.span`
  font-size: 12px;
  color: #6b7280;
  min-width: 60px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
`;

interface InstructorFormProps {
  instructor?: Instructor;
  onClose: () => void;
  onSuccess: () => void;
}

export const InstructorForm: React.FC<InstructorFormProps> = ({
  instructor,
  onClose,
  onSuccess
}) => {
  const { t } = useLanguage();
  const { addInstructor, updateInstructor, loading } = useInstructorStore();
  
  const [formData, setFormData] = useState<InstructorFormData>({
    name: '',
    email: '',
    phone: '',
    bio: '',
    specialties: [],
    experience: 0,
    imageUrl: '',
    socialLinks: {
      instagram: '',
      facebook: '',
      website: ''
    },
    hourlyRate: 0,
    isActive: true
  });

  const [newSpecialty, setNewSpecialty] = useState('');

  useEffect(() => {
    if (instructor) {
      setFormData({
        name: instructor.name,
        email: instructor.email,
        phone: instructor.phone || '',
        bio: instructor.bio || '',
        specialties: instructor.specialties,
        experience: instructor.experience,
        imageUrl: instructor.imageUrl || '',
        socialLinks: instructor.socialLinks || {
          instagram: '',
          facebook: '',
          website: ''
        },
        hourlyRate: instructor.hourlyRate,
        isActive: instructor.isActive
      });
    }
  }, [instructor]);

  const handleInputChange = (field: keyof InstructorFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: keyof NonNullable<InstructorFormData['socialLinks']>, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (instructor) {
        await updateInstructor(instructor.id, formData);
      } else {
        await addInstructor(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving instructor:', error);
    }
  };

  return (
    <form id="instructor-form" onSubmit={handleSubmit}>
      <FormContainer>
        <FormRow>
          <FormGroup>
            <Label>{t('instructors.name')} *</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={t('instructors.namePlaceholder')}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>{t('instructors.email')} *</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder={t('instructors.emailPlaceholder')}
              required
            />
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <Label>{t('instructors.phone')}</Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder={t('instructors.phonePlaceholder')}
            />
          </FormGroup>
          <FormGroup>
            <Label>{t('instructors.hourlyRate')} *</Label>
            <Input
              type="number"
              value={formData.hourlyRate}
              onChange={(e) => handleInputChange('hourlyRate', parseFloat(e.target.value) || 0)}
              placeholder={t('instructors.hourlyRatePlaceholder')}
              required
              min="0"
              step="0.01"
            />
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <Label>{t('instructors.experience')} *</Label>
            <Input
              type="number"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
              placeholder={t('instructors.experiencePlaceholder')}
              required
              min="0"
            />
          </FormGroup>
          <FormGroup>
            <Label>{t('instructors.imageUrl')}</Label>
            <Input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleInputChange('imageUrl', e.target.value)}
              placeholder={t('instructors.imageUrlPlaceholder')}
            />
          </FormGroup>
        </FormRow>

        <FormGroup>
          <Label>{t('instructors.bio')}</Label>
          <TextArea
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder={t('instructors.bioPlaceholder')}
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('instructors.specialties')}</Label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <TagInput
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              placeholder={t('instructors.addSpecialty')}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
            />
            <Button type="button" onClick={addSpecialty} size="sm">
              {t('common.add')}
            </Button>
          </div>
          <TagsContainer>
            {formData.specialties.map((specialty, index) => (
              <Tag key={index}>
                {specialty}
                <RemoveTagButton
                  type="button"
                  onClick={() => removeSpecialty(specialty)}
                >
                  ×
                </RemoveTagButton>
              </Tag>
            ))}
          </TagsContainer>
        </FormGroup>

        <FormGroup>
          <Label>{t('instructors.socialLinks')}</Label>
          <SocialLinksContainer>
            <SocialLinkRow>
              <SocialLabel>Instagram:</SocialLabel>
              <Input
                value={formData.socialLinks?.instagram || ''}
                onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                placeholder="@username"
              />
            </SocialLinkRow>
            <SocialLinkRow>
              <SocialLabel>Facebook:</SocialLabel>
              <Input
                value={formData.socialLinks?.facebook || ''}
                onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                placeholder="facebook.com/username"
              />
            </SocialLinkRow>
            <SocialLinkRow>
              <SocialLabel>Website:</SocialLabel>
              <Input
                value={formData.socialLinks?.website || ''}
                onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                placeholder="https://example.com"
              />
            </SocialLinkRow>
          </SocialLinksContainer>
        </FormGroup>

        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => handleInputChange('isActive', e.target.checked)}
          />
          <Label>{t('instructors.isActive')}</Label>
        </CheckboxContainer>
      </FormContainer>
    </form>
  );
};
