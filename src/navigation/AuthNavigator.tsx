import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/LoginScreen';
import { BottomTabNavigator } from './BottomTabNavigator';
import { useAuth } from '../hooks/useAuth';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} options={{
      headerShown: false,
      gestureEnabled: false, // Disable swipe back to prevent going back from login
    }} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Main" component={BottomTabNavigator} />
  </Stack.Navigator>
);

export const AuthenticatedNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show nothing while checking auth status
  if (loading) {
    return null; // In a real app, you might want to show a loading spinner here
  }

  return isAuthenticated ? <AppStack /> : <AuthStack />;
};
