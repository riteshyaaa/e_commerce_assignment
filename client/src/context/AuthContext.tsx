import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Admin } from '../types';
import { api } from '../lib/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('nova_admin_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { success, error } = useToast();

  const fetchProfile = useCallback(async () => {
    const savedToken = localStorage.getItem('nova_admin_token');
    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const adminData = await api.auth.getProfile();
      setAdmin(adminData);
      setToken(savedToken);
    } catch (err) {
      console.warn('[AUTH] Token validation failed or expired. Logging out.');
      localStorage.removeItem('nova_admin_token');
      setAdmin(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      const res = await api.auth.login(credentials);
      localStorage.setItem('nova_admin_token', res.token);
      setToken(res.token);
      setAdmin(res.admin);
      success(`Welcome back, ${res.admin.name}!`, 'Authentication Successful');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials';
      error(msg, 'Login Failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('nova_admin_token');
    setAdmin(null);
    setToken(null);
    success('You have been logged out securely.', 'Signed Out');
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!admin && !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
