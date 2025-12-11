import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../config/supabase';
import { Session, User } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const GUEST_USER_KEY = 'guest_user';

interface AuthContextType {
  isAuthenticated: boolean | null;
  session: Session | null;
  user: User | null;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null means loading
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check for guest user first
        const guestUser = await AsyncStorage.getItem(GUEST_USER_KEY);

        // Get current Supabase session
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (currentSession?.user) {
          setIsAuthenticated(true);
          setSession(currentSession);
          setUser(currentSession.user);
          setIsGuest(false);
        } else if (guestUser) {
          setIsAuthenticated(true);
          setIsGuest(true);
          setSession(null);
          setUser(null);
        } else {
          setIsAuthenticated(false);
          setIsGuest(false);
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
        setIsGuest(false);
        setSession(null);
        setUser(null);
      }
    };

    checkAuthStatus();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('🔔 Auth state changed:', event, {
        hasSession: !!currentSession,
        hasUser: !!currentSession?.user,
        email: currentSession?.user?.email
      });

      if (currentSession?.user) {
        console.log('✅ User authenticated via listener:', currentSession.user.email);
        setIsAuthenticated(true);
        setSession(currentSession);
        setUser(currentSession.user);
        setIsGuest(false);
        // Clear guest status if exists
        await AsyncStorage.removeItem(GUEST_USER_KEY);
      } else {
        console.log('❌ No session in listener');
        // Check if guest mode is active
        const guestUser = await AsyncStorage.getItem(GUEST_USER_KEY);
        if (guestUser) {
          setIsAuthenticated(true);
          setIsGuest(true);
        } else {
          setIsAuthenticated(false);
          setIsGuest(false);
        }
        setSession(null);
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Remove any guest status when logging in normally
      await AsyncStorage.removeItem(GUEST_USER_KEY);

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
      }

      if (data.session && data.user) {
        setSession(data.session);
        setUser(data.user);
        setIsAuthenticated(true);
        setIsGuest(false);
        return { success: true };
      }

      return { success: false, error: 'Giriş başarısız oldu.' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Bir hata oluştu. Lütfen tekrar deneyin.' };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      // Remove any guest status when logging in
      await AsyncStorage.removeItem(GUEST_USER_KEY);

      // Create redirect URI
      const redirectTo = makeRedirectUri({
        scheme: 'financialai',
      });

      console.log('Redirect URI:', redirectTo);

      // Sign in with Google OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });

      if (error) {
        console.error('Google login error:', error);
        return { success: false, error: error.message };
      }

      if (data?.url) {
        // Open browser for OAuth
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectTo
        );

        console.log('OAuth result:', result);

        if (result.type === 'success') {
          const url = result.url;

          // Extract tokens from URL
          const hashParams = new URLSearchParams(url.split('#')[1]);
          const queryParams = new URLSearchParams(url.split('?')[1]);

          const access_token = hashParams.get('access_token') || queryParams.get('access_token');
          const refresh_token = hashParams.get('refresh_token') || queryParams.get('refresh_token');

          console.log('Tokens found:', {
            hasAccessToken: !!access_token,
            hasRefreshToken: !!refresh_token
          });

          if (access_token && refresh_token) {
            // Set session with the tokens
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

            console.log('Session data:', {
              hasSession: !!sessionData?.session,
              hasUser: !!sessionData?.user,
              error: sessionError
            });

            if (sessionError) {
              console.error('Session error:', sessionError);
              return { success: false, error: sessionError.message };
            }

            if (sessionData.session && sessionData.user) {
              console.log('Setting auth state - User:', sessionData.user.email);
              setSession(sessionData.session);
              setUser(sessionData.user);
              setIsAuthenticated(true);
              setIsGuest(false);

              console.log('Auth state updated - isAuthenticated should be true');
              return { success: true };
            } else {
              console.error('Session data incomplete:', sessionData);
              return { success: false, error: 'Session oluşturulamadı.' };
            }
          } else {
            console.error('No tokens found in URL:', url);
            return { success: false, error: 'Token alınamadı.' };
          }
        } else if (result.type === 'cancel') {
          return { success: false, error: 'Google girişi iptal edildi.' };
        }
      }

      return { success: false, error: 'Google ile giriş başarısız oldu.' };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: 'Bir hata oluştu. Lütfen tekrar deneyin.' };
    }
  };

  const loginAsGuest = async () => {
    try {
      // Sign out from Supabase if logged in
      await supabase.auth.signOut();

      // Set guest user flag
      await AsyncStorage.setItem(GUEST_USER_KEY, 'true');

      setIsAuthenticated(true);
      setIsGuest(true);
      setSession(null);
      setUser(null);
      return true;
    } catch (error) {
      console.error('Guest login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();

      // Remove guest user flag
      await AsyncStorage.removeItem(GUEST_USER_KEY);

      setSession(null);
      setUser(null);
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
        session,
        user,
        isGuest,
        login,
        loginWithGoogle,
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
