import React from 'react';
import styled from 'styled-components';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const SwitcherContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const SwitcherButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #64748b;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const LanguageList = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 50;
  min-width: 120px;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

const LanguageOption = styled.button<{ $isActive: boolean }>`
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  background: ${props => props.$isActive ? '#f1f5f9' : 'transparent'};
  color: ${props => props.$isActive ? '#1e293b' : '#64748b'};
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: #f8fafc;
  }
  
  &:first-child {
    border-radius: 8px 8px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 8px 8px;
  }
`;

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' }
];

export const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <SwitcherContainer>
      <SwitcherButton onClick={() => setIsOpen(!isOpen)}>
        <Globe size={16} />
        <span>{currentLang.flag}</span>
        <span>{currentLang.name}</span>
      </SwitcherButton>
      
      <LanguageList $isOpen={isOpen}>
        {languages.map((language) => (
          <LanguageOption
            key={language.code}
            $isActive={language.code === currentLanguage}
            onClick={() => handleLanguageChange(language.code)}
          >
            <span style={{ marginRight: '8px' }}>{language.flag}</span>
            {language.name}
          </LanguageOption>
        ))}
      </LanguageList>
    </SwitcherContainer>
  );
};
