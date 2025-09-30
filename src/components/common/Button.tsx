import React from 'react';
import styled from 'styled-components';

const ButtonBase = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  $size?: 'sm' | 'md' | 'lg';
  $fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${props => {
    switch (props.$size) {
      case 'sm': return '8px 12px';
      case 'lg': return '16px 24px';
      default: return '10px 16px';
    }
  }};
  border: none;
  border-radius: 8px;
  font-size: ${props => {
    switch (props.$size) {
      case 'sm': return '14px';
      case 'lg': return '16px';
      default: return '14px';
    }
  }};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  min-height: 40px; /* Better touch target */
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    min-height: 48px;
    font-size: ${props => {
      switch (props.$size) {
        case 'sm': return '15px';
        case 'lg': return '17px';
        default: return '15px';
      }
    }};
    padding: ${props => {
      switch (props.$size) {
        case 'sm': return '10px 14px';
        case 'lg': return '18px 26px';
        default: return '12px 18px';
      }
    }};
  }
  
  @media (max-width: 480px) {
    min-height: 44px;
    font-size: ${props => {
      switch (props.$size) {
        case 'sm': return '14px';
        case 'lg': return '16px';
        default: return '14px';
      }
    }};
  }
  
  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background-color: #3b82f6;
          color: white;
          &:hover:not(:disabled) {
            background-color: #2563eb;
          }
        `;
      case 'secondary':
        return `
          background-color: #6b7280;
          color: white;
          &:hover:not(:disabled) {
            background-color: #4b5563;
          }
        `;
      case 'danger':
        return `
          background-color: #ef4444;
          color: white;
          &:hover:not(:disabled) {
            background-color: #dc2626;
          }
        `;
      case 'success':
        return `
          background-color: #10b981;
          color: white;
          &:hover:not(:disabled) {
            background-color: #059669;
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: #3b82f6;
          border: 1px solid #3b82f6;
          &:hover:not(:disabled) {
            background-color: #3b82f6;
            color: white;
          }
        `;
      default:
        return `
          background-color: #f3f4f6;
          color: #374151;
          &:hover:not(:disabled) {
            background-color: #e5e7eb;
          }
        `;
    }
  }}
`;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  children,
  disabled,
  ...props
}) => {
  return (
    <ButtonBase
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div style={{
          width: '16px',
          height: '16px',
          border: '2px solid transparent',
          borderTop: '2px solid currentColor',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      )}
      {children}
    </ButtonBase>
  );
};
