import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof darkColors | typeof lightColors;
}

const darkColors = {
  background: '#000000',
  cardBackground: '#0a0a0a',
  purple: {
    primary: '#9333EA',
    secondary: '#A855F7',
    light: '#C084FC',
    dark: '#7E22CE',
    darker: '#6B21A8',
  },
  accent: {
    cyan: '#06B6D4',
    pink: '#EC4899',
    green: '#10B981',
    red: '#EF4444',
  },
  success: '#00ff9d',
  error: '#ff4757',
  warning: '#FCD34D',
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA',
    tertiary: '#71717A',
  },
  border: {
    primary: 'rgba(147, 51, 234, 0.3)',
    secondary: 'rgba(255, 255, 255, 0.1)',
  },
};

const lightColors = {
  background: '#FFFFFF',
  cardBackground: '#F9FAFB',
  purple: {
    primary: '#9333EA',
    secondary: '#A855F7',
    light: '#C084FC',
    dark: '#7E22CE',
    darker: '#6B21A8',
  },
  accent: {
    cyan: '#06B6D4',
    pink: '#EC4899',
    green: '#10B981',
    red: '#EF4444',
  },
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
  },
  border: {
    primary: 'rgba(147, 51, 234, 0.3)',
    secondary: 'rgba(0, 0, 0, 0.1)',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export { darkColors, lightColors };
