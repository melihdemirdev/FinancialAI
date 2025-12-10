import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { TermsOfServiceScreen } from '../screens/TermsOfServiceScreen';
import { PrivacyPolicyScreen } from '../screens/PrivacyPolicyScreen';
import { BottomTabNavigator } from './BottomTabNavigator';
import { ProfileSettingsScreen } from '../screens/ProfileSettingsScreen';
import { NotificationSettingsScreen } from '../screens/NotificationSettingsScreen';
import { ApiKeySettingsScreen } from '../screens/ApiKeySettingsScreen';
import { useAuth } from '../hooks/useAuth';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} options={{
      headerShown: false,
      gestureEnabled: false,
    }} />
    <Stack.Screen name="Register" component={RegisterScreen} options={{
      headerShown: false,
      gestureEnabled: true,
    }} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{
      headerShown: false,
      gestureEnabled: true,
    }} />
    <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} options={{
      headerShown: false,
      gestureEnabled: true,
    }} />
    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{
      headerShown: false,
      gestureEnabled: true,
    }} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Main" component={BottomTabNavigator} />
    <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
    <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
    <Stack.Screen name="ApiKeySettings" component={ApiKeySettingsScreen} />
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
