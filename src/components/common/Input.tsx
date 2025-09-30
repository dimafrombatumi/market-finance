import React from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const InputBase = styled.input<{ $error?: boolean }>`
  padding: 12px 16px;
  border: 1px solid ${props => props.$error ? '#ef4444' : '#d1d5db'};
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  min-height: 48px; /* Better touch target */
  
  &:focus {
    outline: none;
    border-color: ${props => props.$error ? '#ef4444' : '#3b82f6'};
    box-shadow: 0 0 0 3px ${props => props.$error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }
  
  &:disabled {
    background-color: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 14px 16px;
    font-size: 16px; /* Prevent zoom on iOS */
    min-height: 52px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 14px;
    min-height: 48px;
  }
`;

const TextAreaBase = styled.textarea<{ $error?: boolean }>`
  padding: 12px 16px;
  border: 1px solid ${props => props.$error ? '#ef4444' : '#d1d5db'};
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$error ? '#ef4444' : '#3b82f6'};
    box-shadow: 0 0 0 3px ${props => props.$error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }
  
  &:disabled {
    background-color: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 14px 16px;
    font-size: 16px; /* Prevent zoom on iOS */
    min-height: 120px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 14px;
    min-height: 100px;
  }
`;

const SelectBase = styled.select<{ $error?: boolean }>`
  padding: 12px 16px;
  border: 1px solid ${props => props.$error ? '#ef4444' : '#d1d5db'};
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 48px; /* Better touch target */
  
  &:focus {
    outline: none;
    border-color: ${props => props.$error ? '#ef4444' : '#3b82f6'};
    box-shadow: 0 0 0 3px ${props => props.$error ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'};
  }
  
  &:disabled {
    background-color: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 14px 16px;
    font-size: 16px; /* Prevent zoom on iOS */
    min-height: 52px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 14px;
    min-height: 48px;
  }
`;

const ErrorMessage = styled.span`
  font-size: 12px;
  color: #ef4444;
`;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options: { value: string; label: string }[];
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  ...props
}) => {
  return (
    <InputContainer style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && <Label>{label}</Label>}
      <InputBase $error={!!error} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  fullWidth = false,
  ...props
}) => {
  return (
    <InputContainer style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && <Label>{label}</Label>}
      <TextAreaBase $error={!!error} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  fullWidth = false,
  options,
  ...props
}) => {
  return (
    <InputContainer style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && <Label>{label}</Label>}
      <SelectBase $error={!!error} {...props}>
        <option value="">Select an option</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectBase>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};
