import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ApiKeyContextType {
  customApiKey: string;
  setCustomApiKey: (key: string) => Promise<void>;
  clearCustomApiKey: () => Promise<void>;
  hasCustomApiKey: boolean;
  getActiveApiKey: () => string;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

const API_KEY_STORAGE_KEY = '@custom_gemini_api_key';

// Varsayılan API Key
const DEFAULT_API_KEY = 'AIzaSyBxIedxKfSTDE8OFp_Dd5Xr7yGYEHp3hUY';

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customApiKey, setCustomApiKeyState] = useState<string>('');

  useEffect(() => {
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    try {
      const stored = await AsyncStorage.getItem(API_KEY_STORAGE_KEY);
      if (stored) {
        setCustomApiKeyState(stored);
      }
    } catch (error) {
      console.error('Error loading API key:', error);
    }
  };

  const setCustomApiKey = async (key: string) => {
    try {
      const trimmedKey = key.trim();
      setCustomApiKeyState(trimmedKey);

      if (trimmedKey) {
        await AsyncStorage.setItem(API_KEY_STORAGE_KEY, trimmedKey);
      } else {
        await AsyncStorage.removeItem(API_KEY_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error saving API key:', error);
      throw error;
    }
  };

  const clearCustomApiKey = async () => {
    try {
      setCustomApiKeyState('');
      await AsyncStorage.removeItem(API_KEY_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing API key:', error);
      throw error;
    }
  };

  const getActiveApiKey = () => {
    // Eğer custom key varsa onu kullan, yoksa varsayılanı kullan
    return customApiKey || DEFAULT_API_KEY;
  };

  const hasCustomApiKey = customApiKey.length > 0;

  return (
    <ApiKeyContext.Provider
      value={{
        customApiKey,
        setCustomApiKey,
        clearCustomApiKey,
        hasCustomApiKey,
        getActiveApiKey,
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error('useApiKey must be used within ApiKeyProvider');
  }
  return context;
};
