import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { X } from 'lucide-react';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideIn = keyframes`
  from { 
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to { 
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 90vw;
  max-height: 90vh;
  width: 100%;
  animation: ${slideIn} 0.2s ease-out;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    max-width: 95vw;
    max-height: 95vh;
    border-radius: 8px;
    margin: 8px;
  }
  
  @media (max-width: 480px) {
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
    margin: 0;
  }
`;

const ModalHeader = styled.div`
  padding: 24px 24px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    padding: 20px 20px 0;
    margin-bottom: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 16px 16px 0;
    margin-bottom: 12px;
  }
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s ease;
  min-height: 40px; /* Better touch target */
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #f1f5f9;
    color: #1e293b;
  }
  
  @media (max-width: 480px) {
    min-height: 44px;
    min-width: 44px;
  }
`;

const ModalContent = styled.div`
  padding: 0 24px 24px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  
  @media (max-width: 768px) {
    padding: 0 20px 20px;
  }
  
  @media (max-width: 480px) {
    padding: 0 16px 16px;
  }
`;

const ModalFooter = styled.div`
  padding: 20px 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    padding: 16px 20px;
    gap: 10px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 16px;
    flex-direction: column;
    gap: 8px;
    
    button {
      width: 100%;
      min-height: 48px; /* Better touch target */
    }
  }
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md'
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getModalWidth = () => {
    switch (size) {
      case 'sm': return 'min(400px, 90vw)';
      case 'md': return 'min(600px, 90vw)';
      case 'lg': return 'min(800px, 90vw)';
      case 'xl': return 'min(1000px, 95vw)';
      default: return 'min(600px, 90vw)';
    }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer 
        style={{ maxWidth: getModalWidth() }}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>
        
        <ModalContent>
          {children}
        </ModalContent>
        
        {footer && (
          <ModalFooter>
            {footer}
          </ModalFooter>
        )}
      </ModalContainer>
    </Overlay>
  );
};
