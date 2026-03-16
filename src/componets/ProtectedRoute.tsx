import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Props = { children: React.ReactNode };

/**
 * Redirects to login (/) if user is not authenticated.
 * Required by task: "If a user manually types /list without logging in, they must be redirected."
 */
export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// ProtectedRoute wraps private routes and checks AuthContext.
// If the user is not authenticated, it redirects them back to the login screen.
