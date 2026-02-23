import { useEffect, useState } from 'react';
import { AuthContext } from './authContext';
import { AUTH_DEFAULTS, createLoginMockUser, createRegisterMockUser } from '../mocks/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (username) => {
    try {
      const mockUser = createLoginMockUser(username);

      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', AUTH_DEFAULTS.loginToken);
      setUser(mockUser);
      return { success: true };
    } catch {
      return { success: false, error: 'Credenciales inválidas' };
    }
  };

  const register = async (username, email) => {
    try {
      const mockUser = createRegisterMockUser(username, email);

      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', `${AUTH_DEFAULTS.registerTokenPrefix}${Date.now()}`);
      setUser(mockUser);
      return { success: true };
    } catch {
      return { success: false, error: 'Error al registrar usuario' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
