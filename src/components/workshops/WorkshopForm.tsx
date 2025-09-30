import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWorkshopStore, useInstructorStore } from '../../stores';
import { useLanguage } from '../../contexts/LanguageContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Workshop, WorkshopFormData } from '../../types';

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

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
`;

const SkillLevelContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const SkillLevelOption = styled.label`
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

interface WorkshopFormProps {
  workshop?: Workshop;
  onClose: () => void;
  onSuccess: () => void;
}

export const WorkshopForm: React.FC<WorkshopFormProps> = ({
  workshop,
  onClose,
  onSuccess
}) => {
  const { t } = useLanguage();
  const { addWorkshop, updateWorkshop, loading } = useWorkshopStore();
  const { instructors, fetchInstructors } = useInstructorStore();
  
  const [formData, setFormData] = useState<WorkshopFormData>({
    title: '',
    description: '',
    shortDescription: '',
    instructorId: '',
    category: '',
    skillLevel: 'beginner',
    duration: 2,
    maxParticipants: 10,
    price: 0,
    materialsCost: 0,
    imageUrl: '',
    requirements: [],
    materials: [],
    isRecurring: false,
    recurringPattern: 'weekly',
    tags: []
  });

  const [newRequirement, setNewRequirement] = useState('');
  const [newMaterial, setNewMaterial] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchInstructors();
  }, [fetchInstructors]);

  useEffect(() => {
    if (workshop) {
      setFormData({
        title: workshop.title,
        description: workshop.description,
        shortDescription: workshop.shortDescription,
        instructorId: workshop.instructorId,
        category: workshop.category,
        skillLevel: workshop.skillLevel,
        duration: workshop.duration,
        maxParticipants: workshop.maxParticipants,
        price: workshop.price,
        materialsCost: workshop.materialsCost || 0,
        imageUrl: workshop.imageUrl || '',
        requirements: workshop.requirements || [],
        materials: workshop.materials || [],
        isRecurring: workshop.isRecurring,
        recurringPattern: workshop.recurringPattern || 'weekly',
        tags: workshop.tags || []
      });
    }
  }, [workshop]);

  const handleInputChange = (field: keyof WorkshopFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addItem = (type: 'requirements' | 'materials' | 'tags') => {
    const newItem = type === 'requirements' ? newRequirement : 
                   type === 'materials' ? newMaterial : newTag;
    
    const currentArray = formData[type] || [];
    if (newItem.trim() && !currentArray.includes(newItem.trim())) {
      setFormData(prev => ({
        ...prev,
        [type]: [...currentArray, newItem.trim()]
      }));
      
      if (type === 'requirements') setNewRequirement('');
      else if (type === 'materials') setNewMaterial('');
      else setNewTag('');
    }
  };

  const removeItem = (type: 'requirements' | 'materials' | 'tags', item: string) => {
    const currentArray = formData[type] || [];
    setFormData(prev => ({
      ...prev,
      [type]: currentArray.filter(i => i !== item)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (workshop) {
        await updateWorkshop(workshop.id, formData);
      } else {
        await addWorkshop(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving workshop:', error);
    }
  };

  return (
    <form id="workshop-form" onSubmit={handleSubmit}>
      <FormContainer>
        <FormGroup>
          <Label>{t('workshops.title')} *</Label>
          <Input
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder={t('workshops.titlePlaceholder')}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('workshops.shortDescription')} *</Label>
          <Input
            value={formData.shortDescription}
            onChange={(e) => handleInputChange('shortDescription', e.target.value)}
            placeholder={t('workshops.shortDescriptionPlaceholder')}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('workshops.description')} *</Label>
          <TextArea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder={t('workshops.descriptionPlaceholder')}
            required
          />
        </FormGroup>

        <FormRow>
          <FormGroup>
            <Label>{t('workshops.instructor')} *</Label>
            <Select
              value={formData.instructorId}
              onChange={(e) => handleInputChange('instructorId', e.target.value)}
              required
            >
              <option value="">{t('workshops.selectInstructor')}</option>
              {instructors.map(instructor => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </option>
              ))}
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>{t('workshops.category')} *</Label>
            <Select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              required
            >
              <option value="">{t('workshops.selectCategory')}</option>
              <option value="Искусство и творчество">{t('workshops.categories.art')}</option>
              <option value="Ремесла и рукоделие">{t('workshops.categories.crafts')}</option>
              <option value="Кулинария">{t('workshops.categories.cooking')}</option>
              <option value="Музыка и танцы">{t('workshops.categories.music')}</option>
              <option value="Языки и образование">{t('workshops.categories.education')}</option>
              <option value="Технологии">{t('workshops.categories.technology')}</option>
            </Select>
          </FormGroup>
        </FormRow>

        <FormGroup>
          <Label>{t('workshops.skillLevel')} *</Label>
          <SkillLevelContainer>
            <SkillLevelOption>
              <RadioInput
                type="radio"
                name="skillLevel"
                value="beginner"
                checked={formData.skillLevel === 'beginner'}
                onChange={(e) => handleInputChange('skillLevel', e.target.value)}
              />
              {t('workshops.skillLevels.beginner')}
            </SkillLevelOption>
            <SkillLevelOption>
              <RadioInput
                type="radio"
                name="skillLevel"
                value="intermediate"
                checked={formData.skillLevel === 'intermediate'}
                onChange={(e) => handleInputChange('skillLevel', e.target.value)}
              />
              {t('workshops.skillLevels.intermediate')}
            </SkillLevelOption>
            <SkillLevelOption>
              <RadioInput
                type="radio"
                name="skillLevel"
                value="advanced"
                checked={formData.skillLevel === 'advanced'}
                onChange={(e) => handleInputChange('skillLevel', e.target.value)}
              />
              {t('workshops.skillLevels.advanced')}
            </SkillLevelOption>
          </SkillLevelContainer>
        </FormGroup>

        <FormRow>
          <FormGroup>
            <Label>{t('workshops.duration')} * (часы)</Label>
            <Input
              type="number"
              value={formData.duration}
              onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
              placeholder={t('workshops.durationPlaceholder')}
              required
              min="1"
            />
          </FormGroup>
          <FormGroup>
            <Label>{t('workshops.maxParticipants')} *</Label>
            <Input
              type="number"
              value={formData.maxParticipants}
              onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value) || 0)}
              placeholder={t('workshops.maxParticipantsPlaceholder')}
              required
              min="1"
            />
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup>
            <Label>{t('workshops.price')} *</Label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              placeholder={t('workshops.pricePlaceholder')}
              required
              min="0"
              step="0.01"
            />
          </FormGroup>
          <FormGroup>
            <Label>{t('workshops.materialsCost')}</Label>
            <Input
              type="number"
              value={formData.materialsCost}
              onChange={(e) => handleInputChange('materialsCost', parseFloat(e.target.value) || 0)}
              placeholder={t('workshops.materialsCostPlaceholder')}
              min="0"
              step="0.01"
            />
          </FormGroup>
        </FormRow>

        <FormGroup>
          <Label>{t('workshops.imageUrl')}</Label>
          <Input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => handleInputChange('imageUrl', e.target.value)}
            placeholder={t('workshops.imageUrlPlaceholder')}
          />
        </FormGroup>

        <FormGroup>
          <Label>{t('workshops.requirements')}</Label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <TagInput
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              placeholder={t('workshops.addRequirement')}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('requirements'))}
            />
            <Button type="button" onClick={() => addItem('requirements')} size="sm">
              {t('common.add')}
            </Button>
          </div>
          <TagsContainer>
            {(formData.requirements || []).map((requirement, index) => (
              <Tag key={index}>
                {requirement}
                <RemoveTagButton
                  type="button"
                  onClick={() => removeItem('requirements', requirement)}
                >
                  ×
                </RemoveTagButton>
              </Tag>
            ))}
          </TagsContainer>
        </FormGroup>

        <FormGroup>
          <Label>{t('workshops.materials')}</Label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <TagInput
              value={newMaterial}
              onChange={(e) => setNewMaterial(e.target.value)}
              placeholder={t('workshops.addMaterial')}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('materials'))}
            />
            <Button type="button" onClick={() => addItem('materials')} size="sm">
              {t('common.add')}
            </Button>
          </div>
          <TagsContainer>
            {(formData.materials || []).map((material, index) => (
              <Tag key={index}>
                {material}
                <RemoveTagButton
                  type="button"
                  onClick={() => removeItem('materials', material)}
                >
                  ×
                </RemoveTagButton>
              </Tag>
            ))}
          </TagsContainer>
        </FormGroup>

        <FormGroup>
          <Label>{t('workshops.tags')}</Label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <TagInput
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder={t('workshops.addTag')}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('tags'))}
            />
            <Button type="button" onClick={() => addItem('tags')} size="sm">
              {t('common.add')}
            </Button>
          </div>
          <TagsContainer>
            {(formData.tags || []).map((tag, index) => (
              <Tag key={index}>
                {tag}
                <RemoveTagButton
                  type="button"
                  onClick={() => removeItem('tags', tag)}
                >
                  ×
                </RemoveTagButton>
              </Tag>
            ))}
          </TagsContainer>
        </FormGroup>

        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            checked={formData.isRecurring}
            onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
          />
          <Label>{t('workshops.isRecurring')}</Label>
        </CheckboxContainer>

        {formData.isRecurring && (
          <FormGroup>
            <Label>{t('workshops.recurringPattern')}</Label>
            <Select
              value={formData.recurringPattern}
              onChange={(e) => handleInputChange('recurringPattern', e.target.value)}
            >
              <option value="weekly">{t('workshops.recurringPatterns.weekly')}</option>
              <option value="monthly">{t('workshops.recurringPatterns.monthly')}</option>
              <option value="custom">{t('workshops.recurringPatterns.custom')}</option>
            </Select>
          </FormGroup>
        )}
      </FormContainer>
    </form>
  );
};
