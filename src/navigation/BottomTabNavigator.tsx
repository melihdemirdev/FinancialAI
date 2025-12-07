import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  LayoutDashboard,
  Coins,
  CreditCard,
  HandCoins,
  Calendar,
  Settings
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { DashboardScreen } from '../screens/DashboardScreen';
import { AssetsScreen } from '../screens/AssetsScreen';
import { LiabilitiesScreen } from '../screens/LiabilitiesScreen';
import { ReceivablesScreen } from '../screens/ReceivablesScreen';
import { InstallmentsScreen } from '../screens/InstallmentsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useTheme } from '../context/ThemeContext';
import { gradients } from '../theme/colors';

const Tab = createBottomTabNavigator();

const TabIcon = ({
  Icon,
  focused,
  activeColor,
  inactiveColor
}: {
  Icon: LucideIcon;
  focused: boolean;
  activeColor: string;
  inactiveColor: string;
}) => (
  <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
    {focused && (
      <LinearGradient
        colors={gradients.purple}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    )}
    <Icon
      size={20}
      color={focused ? activeColor : inactiveColor}
      strokeWidth={2.5}
    />
  </View>
);

export const BottomTabNavigator = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const getActiveIconColor = (focused: boolean) => {
    return focused ? '#FFFFFF' : colors.text.secondary;
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 5,
        },
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: colors.cardBackground,
            shadowColor: colors.purple.primary,
            height: 40 + insets.bottom,
            paddingBottom: insets.bottom,
          }
        ],
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarLabelStyle: styles.tabLabel,
        headerStyle: [styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border.secondary }],
        headerTintColor: colors.text.primary,
        headerTitleStyle: styles.headerTitle,
        tabBarBackground: () => (
          <View style={[styles.tabBarBackground, { backgroundColor: colors.cardBackground }]}>
            <View style={[styles.tabBarBorder, { backgroundColor: colors.border.primary }]} />
          </View>
        ),
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Ana Sayfa',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon Icon={LayoutDashboard} focused={focused} activeColor={getActiveIconColor(focused)} inactiveColor={colors.text.secondary} />,
        }}
      />
      <Tab.Screen
        name="Assets"
        component={AssetsScreen}
        options={{
          title: 'Varlıklar',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon Icon={Coins} focused={focused} activeColor={getActiveIconColor(focused)} inactiveColor={colors.text.secondary} />,
        }}
      />
      <Tab.Screen
        name="Liabilities"
        component={LiabilitiesScreen}
        options={{
          title: 'Borçlar',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon Icon={CreditCard} focused={focused} activeColor={getActiveIconColor(focused)} inactiveColor={colors.text.secondary} />,
        }}
      />
      <Tab.Screen
        name="Receivables"
        component={ReceivablesScreen}
        options={{
          title: 'Alacaklar',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon Icon={HandCoins} focused={focused} activeColor={getActiveIconColor(focused)} inactiveColor={colors.text.secondary} />,
        }}
      />
      <Tab.Screen
        name="Installments"
        component={InstallmentsScreen}
        options={{
          title: 'Taksitler',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon Icon={Calendar} focused={focused} activeColor={getActiveIconColor(focused)} inactiveColor={colors.text.secondary} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Ayarlar',
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon Icon={Settings} focused={focused} activeColor={getActiveIconColor(focused)} inactiveColor={colors.text.secondary} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 0,
    borderTopWidth: 0,
    elevation: 0,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  tabBarBackground: {
    flex: 1,
    borderRadius: 0,
  },
  tabBarBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    opacity: 0.1,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
    paddingBottom: 5,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconContainerFocused: {
    transform: [{ scale: 1.05 }],
  },
  header: {
    borderBottomWidth: 1,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});