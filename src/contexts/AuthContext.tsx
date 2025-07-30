import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:3001/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          if (response.data.user) {
            setUser(response.data.user);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false); // Fix: It should set loading to false when no token is found.
    }
  }, []);

const login = async (email: string, password: string) => {
  try {
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email,
      password
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = response.data;

    localStorage.setItem('token', data.token);
    setUser(data.user);
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Login failed');
  }
};

const register = async (email: string, password: string, name: string) => {
  try {
    const response = await axios.post('http://localhost:3001/api/auth/register', {
      email,
      password,
      name
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = response.data;

    localStorage.setItem('token', data.token);
    setUser(data.user);
  } catch (error) {
    console.error('Registration failed:', error);
    throw new Error('Registration failed');
  }
};


  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};