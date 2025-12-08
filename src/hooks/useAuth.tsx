import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'auth_token';
const GUEST_USER_KEY = 'guest_user';

interface AuthContextType {
  isAuthenticated: boolean | null;
  token: string | null;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsGuest: () => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null means loading
  const [token, setToken] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        const guestUser = await AsyncStorage.getItem(GUEST_USER_KEY);

        if (storedToken) {
          setIsAuthenticated(true);
          setToken(storedToken);
          setIsGuest(!!guestUser);
        } else if (guestUser) {
          setIsAuthenticated(true);
          setIsGuest(true);
        } else {
          setIsAuthenticated(false);
          setIsGuest(false);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
        setIsGuest(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, you would call an API to authenticate
    // For now, we'll simulate authentication with a mock token
    try {
      // Remove any guest status when logging in normally
      await AsyncStorage.removeItem(GUEST_USER_KEY);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication - in a real app, you'd verify credentials with backend
      if (email && password) {
        const mockToken = `mock_token_${Date.now()}`;
        await AsyncStorage.setItem(AUTH_TOKEN_KEY, mockToken);
        setToken(mockToken);
        setIsAuthenticated(true);
        setIsGuest(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const loginAsGuest = async () => {
    try {
      // Remove any existing token
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);

      // Set guest user flag
      await AsyncStorage.setItem(GUEST_USER_KEY, 'true');

      setIsAuthenticated(true);
      setIsGuest(true);
      setToken(null);
      return true;
    } catch (error) {
      console.error('Guest login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(GUEST_USER_KEY);
      setToken(null);
      setIsAuthenticated(false);
      setIsGuest(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        isGuest,
        login,
        loginAsGuest,
        logout,
        loading: isAuthenticated === null, // still checking auth status
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
