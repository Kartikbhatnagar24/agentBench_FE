import React from 'react';
import { Navigate } from 'react-router-dom';
import { AuthPage } from '../pages/auth';
import { AnalysisPage } from '../pages/analysis';
import { DashboardPage } from '../pages/dashboard';
import { ROUTES } from './paths';
import type { SignUpDto, SignInDto, UserSession } from '../types/chat';
import type { ToastMessage } from '../components/common/feedback/Toast';

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  protected?: boolean;
  publicOnly?: boolean;
}

interface GetRoutesConfigProps {
  user: UserSession | null;
  onLogout: () => void;
  addToast: (text: string, type: ToastMessage['type']) => void;
  onLogin: (data: SignInDto) => Promise<void>;
  onSignUp: (data: SignUpDto) => Promise<void>;
}

/**
 * Returns the central route configuration array.
 * To add a new page/route:
 * 1. Define a path constant in `paths.ts`
 * 2. Add an entry to the array below.
 */
export const getRoutesConfig = (props: GetRoutesConfigProps): RouteConfig[] => [
  {
    path: ROUTES.AUTH,
    element: <AuthPage onLogin={props.onLogin} onSignUp={props.onSignUp} />,
    publicOnly: true,
  },
  {
    path: ROUTES.DASHBOARD,
    element: <Navigate to="/chat" replace />,
    protected: true,
  },
  {
    path: ROUTES.CHAT,
    element: props.user ? <DashboardPage user={props.user} onLogout={props.onLogout} addToast={props.addToast} /> : null,
    protected: true,
  },
  {
    path: ROUTES.ANALYSIS,
    element: props.user ? <AnalysisPage user={props.user} addToast={props.addToast} /> : null,
    protected: true,
  },
];
