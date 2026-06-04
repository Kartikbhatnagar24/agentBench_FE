import React from 'react';
import { AuthCard } from './components/AuthCard';
import type { SignInDto, SignUpDto } from '../../types/chat';

interface AuthPageProps {
  onLogin: (data: SignInDto) => Promise<void>;
  onSignUp: (data: SignUpDto) => Promise<void>;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSignUp }) => {
  return (
    <div className="py-12 w-full flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
      <AuthCard onLogin={onLogin} onSignUp={onSignUp} />
    </div>
  );
};
