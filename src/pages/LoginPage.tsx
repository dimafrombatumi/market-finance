import React from 'react';
import styled from 'styled-components';
import { LoginForm } from '../components/auth/LoginForm';

const LoginPageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 500px;
`;

const BrandSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
  color: white;
  
  h1 {
    font-size: 48px;
    font-weight: 800;
    margin: 0 0 16px 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  p {
    font-size: 20px;
    margin: 0;
    opacity: 0.9;
    font-weight: 300;
  }
`;

export const LoginPage: React.FC = () => {
  return (
    <LoginPageContainer>
      <BackgroundPattern />
      <Content>
        <BrandSection>
          <h1>Handmade Store</h1>
          <p>Management System</p>
        </BrandSection>
        <LoginForm />
      </Content>
    </LoginPageContainer>
  );
};
