import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Form = styled.form`
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;
  
  h1 {
    margin: 0 0 8px 0;
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
  }
  
  p {
    margin: 0;
    font-size: 16px;
    color: #64748b;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
`;

const InputContainer = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  z-index: 1;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s ease;
  
  &:hover {
    color: #6b7280;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  color: #16a34a;
  font-size: 14px;
`;

const FormFooter = styled.div`
  text-align: center;
  margin-top: 24px;
`;

const LinkButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
  
  &:hover {
    color: #2563eb;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #e2e8f0;
  }
  
  span {
    padding: 0 16px;
    color: #64748b;
    font-size: 14px;
  }
`;

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { signIn, signUp, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Successfully signed in!');
          onSuccess?.();
          navigate('/');
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Check your email for verification link!');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await resetPassword(email);
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Password reset email sent! Check your inbox.');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit}>
        <FormHeader>
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p>{isLogin ? 'Sign in to your account' : 'Sign up for a new account'}</p>
        </FormHeader>

        <FormGroup>
          <Label htmlFor="email">Email Address</Label>
          <InputContainer>
            <InputIcon>
              <Mail size={18} />
            </InputIcon>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              style={{ paddingLeft: '40px' }}
            />
          </InputContainer>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">Password</Label>
          <InputContainer>
            <InputIcon>
              <Lock size={18} />
            </InputIcon>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{ paddingLeft: '40px', paddingRight: '40px' }}
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </PasswordToggle>
          </InputContainer>
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Button
          type="submit"
          disabled={loading}
          style={{ width: '100%', marginBottom: '16px' }}
        >
          {loading ? (
            <>
              <Loader size={18} className="animate-spin" />
              {isLogin ? 'Signing In...' : 'Creating Account...'}
            </>
          ) : (
            isLogin ? 'Sign In' : 'Create Account'
          )}
        </Button>

        {isLogin && (
          <FormFooter>
            <LinkButton type="button" onClick={handleForgotPassword}>
              Forgot your password?
            </LinkButton>
          </FormFooter>
        )}

        <Divider>
          <span>or</span>
        </Divider>

        <FormFooter>
          <LinkButton type="button" onClick={toggleMode}>
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Sign in"
            }
          </LinkButton>
        </FormFooter>
      </Form>
    </FormContainer>
  );
};
