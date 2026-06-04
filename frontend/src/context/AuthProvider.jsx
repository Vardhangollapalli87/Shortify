import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api from '../lib/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('shortify_access_token'));
  const [loading, setLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    try {
      const response = await api.post('/auth/refresh');
      const nextToken = response.data?.data?.accessToken ?? null;

      if (nextToken) {
        localStorage.setItem('shortify_access_token', nextToken);
        setAccessToken(nextToken);
        setUser(response.data?.data?.user ?? null);
        return response.data?.data ?? null;
      }

      localStorage.removeItem('shortify_access_token');
      setAccessToken(null);
      setUser(null);
      return null;
    } catch {
      localStorage.removeItem('shortify_access_token');
      setAccessToken(null);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const nextToken = response.data?.data?.accessToken ?? null;

    if (nextToken) {
      localStorage.setItem('shortify_access_token', nextToken);
      setAccessToken(nextToken);
      setUser(response.data?.data?.user ?? null);
    }

    return response.data;
  };

  const register = async (credentials) => {
    const response = await api.post('/auth/register', credentials);
    const nextToken = response.data?.data?.accessToken ?? null;

    if (nextToken) {
      localStorage.setItem('shortify_access_token', nextToken);
      setAccessToken(nextToken);
      setUser(response.data?.data?.user ?? null);
    }

    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('shortify_access_token');
      setAccessToken(null);
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({ user, accessToken, loading, login, register, logout, restoreSession }),
    [accessToken, loading, login, logout, register, restoreSession, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
