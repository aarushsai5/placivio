import { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('placivio_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const { data } = await apiClient.get('/auth/me');
      setUser({ ...data, userType: data.userType });
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (tokenValue, userData) => {
    localStorage.setItem('placivio_token', tokenValue);
    localStorage.setItem('placivio_userType', userData.userType);
    if (userData.userType === 'student') {
      localStorage.setItem('placivio_studentId', userData.id);
    }
    setToken(tokenValue);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('placivio_token');
    localStorage.removeItem('placivio_userType');
    localStorage.removeItem('placivio_studentId');
    setToken(null);
    setUser(null);
  };

  const isStudent = user?.userType === 'student';
  const isTpo = user?.userType === 'tpo';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isStudent, isTpo, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
