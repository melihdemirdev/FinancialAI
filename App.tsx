import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { CurrencyProvider } from './src/context/CurrencyContext';
import { ProfileProvider } from './src/context/ProfileContext';
import { NotificationProvider } from './src/context/NotificationContext';
import { ApiKeyProvider } from './src/context/ApiKeyContext';
import { AuthProvider } from './src/hooks/useAuth';
import { AuthenticatedNavigator } from './src/navigation/AuthNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/navigation/RootNavigation';

const AppContent = () => {
  const { theme, colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <NavigationContainer ref={navigationRef}>
        <AuthenticatedNavigator />
      </NavigationContainer>
    </View>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <CurrencyProvider>
            <ProfileProvider>
              <NotificationProvider>
                <ApiKeyProvider>
                  <AuthProvider>
                    <AppContent />
                  </AuthProvider>
                </ApiKeyProvider>
              </NotificationProvider>
            </ProfileProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});