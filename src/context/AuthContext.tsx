import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateUser: (updated: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check sessionStorage for current session user
    const stored = sessionStorage.getItem('spaced_auth_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse user from session:', e);
        sessionStorage.removeItem('spaced_auth_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    setUser(res.user);
    sessionStorage.setItem('spaced_auth_user', JSON.stringify(res.user));
  };

  const register = async (fullName: string, email: string, password: string, phone?: string) => {
    const res = await api.register({ full_name: fullName, email, password, phone });
    setUser(res.user);
    sessionStorage.setItem('spaced_auth_user', JSON.stringify(res.user));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('spaced_auth_user');
  };

  const updateUser = (updated: User) => {
    setUser(updated);
    sessionStorage.setItem('spaced_auth_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
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
