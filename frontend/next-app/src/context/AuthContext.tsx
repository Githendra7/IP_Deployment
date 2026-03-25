"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (token: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  signOut: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Simple decode to get user info (assuming JWT payload has sub/email)
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.sub, email: payload.email });
      } catch (e) {
        console.error('Failed to parse token:', e);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const payload = JSON.parse(atob(token.split('.')[1]));
    setUser({ id: payload.sub, email: payload.email });
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };


  return (
    <AuthContext.Provider value={{ user, loading, login, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

