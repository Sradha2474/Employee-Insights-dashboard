import React, { createContext, useCallback, useContext, useState } from 'react';

const AUTH_STORAGE_KEY = 'employee_dashboard_auth';

type AuthState = {
  username: string | null;
  authenticated: boolean;
};

type AuthContextValue = {
  auth: AuthState;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
};

function readStoredAuth(): AuthState {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { username: null, authenticated: false };
    const parsed = JSON.parse(raw) as { username?: string; authenticated?: boolean };
    if (parsed.authenticated && parsed.username) {
      return { username: parsed.username, authenticated: true };
    }
  } catch {
    // ignore
  }
  return { username: null, authenticated: false };
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(readStoredAuth);

  const login = useCallback((username: string, password: string) => {
    const valid = username === 'testuser' && password === 'Test123';
    if (valid) {
      const next = { username, authenticated: true };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next));
      setAuth(next);
    }
    return valid;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuth({ username: null, authenticated: false });
  }, []);

  const value: AuthContextValue = {
    auth,
    login,
    logout,
    isAuthenticated: auth.authenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// AuthContext centralizes authentication state (user info + login/logout)
// so that any component in the app can easily check whether the user is logged in.
