import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './guards';
import { getRoutesConfig } from './config';
import type { SignUpDto, SignInDto, UserSession } from '../types/chat';
import type { ToastMessage } from '../components/common/feedback/Toast';
import { ROUTES } from './paths';

interface AppRouterProps {
  user: UserSession | null;
  onLogout: () => void;
  addToast: (text: string, type: ToastMessage['type']) => void;
  onLogin: (data: SignInDto) => Promise<void>;
  onSignUp: (data: SignUpDto) => Promise<void>;
}

/**
 * Centrally binds the routes config array, applies Protected/Public guards,
 * and handles standard fallback redirects.
 */
export const AppRouter: React.FC<AppRouterProps> = (props) => {
  const routes = getRoutesConfig(props);

  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => {
          let element = route.element;

          // Apply access guards dynamically
          if (route.protected) {
            element = <ProtectedRoute>{element}</ProtectedRoute>;
          } else if (route.publicOnly) {
            element = <PublicRoute>{element}</PublicRoute>;
          }

          return (
            <Route
              key={route.path}
              path={route.path}
              element={element}
            />
          );
        })}

        {/* Fallback to Dashboard/Base path if route does not exist */}
        <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </BrowserRouter>
  );
};
