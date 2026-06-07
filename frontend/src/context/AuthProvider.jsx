import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import api from '../lib/axios';

const AuthContext = createContext(null);
let sharedRefreshRequest = null;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('shortify_access_token'));
  const [loading, setLoading] = useState(true);
  const initialRestoreStartedRef = useRef(false);

  const applySession = useCallback((session) => {
    const nextToken = session?.accessToken ?? null;

    if (!nextToken || !session?.user) {
      localStorage.removeItem('shortify_access_token');
      setAccessToken(null);
      setUser(null);
      return null;
    }

    localStorage.setItem('shortify_access_token', nextToken);
    setAccessToken(nextToken);
    setUser(session.user);
    return session;
  }, []);

  const restoreSession = useCallback(async () => {
    if (!sharedRefreshRequest) {
      sharedRefreshRequest = api.post('/auth/refresh')
        .then((response) => response.data?.data ?? null)
        .finally(() => {
          sharedRefreshRequest = null;
        });
    }

    try {
      const session = await sharedRefreshRequest;
      return applySession(session);
    } catch {
      localStorage.removeItem('shortify_access_token');
      setAccessToken(null);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [applySession]);

  useEffect(() => {
    if (initialRestoreStartedRef.current) {
      return;
    }

    initialRestoreStartedRef.current = true;
    restoreSession();
  }, [restoreSession]);

  const login = useCallback(async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    applySession(response.data?.data ?? null);
    return response.data;
  }, [applySession]);

  const register = useCallback(async (credentials) => {
    const response = await api.post('/auth/register', credentials);
    applySession(response.data?.data ?? null);
    return response.data;
  }, [applySession]);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Local session must still be cleared if the server session is already gone.
    } finally {
      localStorage.removeItem('shortify_access_token');
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, accessToken, loading, login, register, logout, restoreSession }),
    [accessToken, loading, login, logout, register, restoreSession, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
