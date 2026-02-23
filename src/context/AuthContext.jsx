import { useEffect, useState } from 'react';
import { AuthContext } from './authContext';

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
      const mockUser = {
        id: 1,
        username,
        email: `${username}@duelodehuevos.com`,
        rankPoints: 1250,
        wins: 23,
        losses: 12,
        gold: 2450,
        avatar: null,
      };

      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', 'mock_jwt_token_123');
      setUser(mockUser);
      return { success: true };
    } catch {
      return { success: false, error: 'Credenciales inválidas' };
    }
  };

  const register = async (username, email) => {
    try {
      const mockUser = {
        id: Date.now(),
        username,
        email,
        rankPoints: 0,
        wins: 0,
        losses: 0,
        gold: 1000,
        avatar: null,
      };

      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('token', `mock_jwt_token_${Date.now()}`);
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
