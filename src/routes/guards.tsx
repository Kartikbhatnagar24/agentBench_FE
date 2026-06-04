import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { ROUTES } from './paths';

interface GuardProps {
  children?: React.ReactNode;
}

/**
 * Guard for routes that require an authenticated session.
 * Redirects to `/auth` if the user is not signed in.
 */
export const ProtectedRoute: React.FC<GuardProps> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to={ROUTES.AUTH} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

/**
 * Guard for routes that are only visible when unauthenticated (e.g. login/signup page).
 * Redirects to `/` if the user is already signed in.
 */
export const PublicRoute: React.FC<GuardProps> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
