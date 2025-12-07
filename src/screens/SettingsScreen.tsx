import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Moon, Sun, User, Bell, Download, Upload, Info, Trash2, DollarSign, Settings as SettingsIcon, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import CurrencyModal from '../../components/CurrencyModal';
import { AboutScreen } from './AboutScreen';
import { gradients } from '../theme/colors';

export const SettingsScreen = () => {
  const { theme, toggleTheme, colors } = useTheme();
  const { currency, currencySymbol } = useCurrency();
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const settingsOptions = [
    { id: '1', title: 'Profil Ayarları', icon: User },
    { id: '3', title: 'Bildirimler', icon: Bell },
    { id: '5', title: 'Verileri Dışa Aktar', icon: Download },
    { id: '6', title: 'Verileri İçe Aktar', icon: Upload },
    { id: '7', title: 'Hakkında', icon: Info },
  ];

  if (showAbout) {
    return (
      <AboutScreen onBack={() => setShowAbout(false)} />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Modern Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.subtitle, { color: colors.text.tertiary }]}>
                Uygulama
              </Text>
              <Text style={[styles.title, { color: colors.text.primary }]}>
                Ayarlar
              </Text>
            </View>
            <View style={[styles.headerIcon, { backgroundColor: 'rgba(147, 51, 234, 0.15)' }]}>
              <SettingsIcon size={28} color={colors.purple.light} strokeWidth={2} />
            </View>
          </View>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCardContainer}>
          <LinearGradient
            colors={gradients.purple}
            style={styles.profileCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.avatar}>
              <User size={36} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Kullanıcı</Text>
              <Text style={styles.profileEmail}>user@example.com</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Görünüm</Text>

          <View style={[styles.option, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(147, 51, 234, 0.15)' }]}>
                {theme === 'dark' ? (
                  <Moon size={20} color={colors.purple.light} strokeWidth={2.5} />
                ) : (
                  <Sun size={20} color={colors.purple.light} strokeWidth={2.5} />
                )}
              </View>
              <Text style={[styles.optionTitle, { color: colors.text.primary }]}>
                {theme === 'dark' ? 'Koyu Tema' : 'Açık Tema'}
              </Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border.secondary, true: colors.purple.primary }}
              thumbColor={colors.text.primary}
            />
          </View>
        </View>

        {/* General Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Genel</Text>

          <TouchableOpacity
            style={[styles.option, { backgroundColor: colors.cardBackground }]}
            onPress={() => setCurrencyModalVisible(true)}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(147, 51, 234, 0.15)' }]}>
                <DollarSign size={20} color={colors.purple.light} strokeWidth={2.5} />
              </View>
              <View>
                <Text style={[styles.optionTitle, { color: colors.text.primary }]}>Para Birimi</Text>
                <Text style={[styles.optionSubtitle, { color: colors.text.tertiary }]}>
                  {currency} ({currencySymbol})
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.text.secondary} strokeWidth={2} />
          </TouchableOpacity>

          {settingsOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.option, { backgroundColor: colors.cardBackground }]}
              onPress={() => {
                if (option.title === 'Hakkında') {
                  setShowAbout(true);
                }
              }}
            >
              <View style={styles.optionLeft}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(147, 51, 234, 0.15)' }]}>
                  {option.icon && <option.icon size={20} color={colors.purple.light} strokeWidth={2.5} />}
                </View>
                <Text style={[styles.optionTitle, { color: colors.text.primary }]}>{option.title}</Text>
              </View>
              <ChevronRight size={20} color={colors.text.secondary} strokeWidth={2} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Tehlikeli Alan</Text>
          <TouchableOpacity style={[styles.dangerOption, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(255, 71, 87, 0.15)' }]}>
                <Trash2 size={20} color={colors.error} strokeWidth={2.5} />
              </View>
              <Text style={[styles.dangerText, { color: colors.error }]}>Tüm Verileri Sil</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.text.secondary }]}>Finansal AI v1.0.0</Text>
          <Text style={[styles.footerSubtext, { color: colors.text.tertiary }]}>
            Kişisel finans yönetim aracınız
          </Text>
        </View>
      </ScrollView>

      {/* Currency modal */}
      <CurrencyModal
        visible={currencyModalVisible}
        onClose={() => setCurrencyModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 100,
  },

  // Header Styles
  header: {
    marginBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  // Profile Card
  profileCardContainer: {
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  profileCard: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  // Section
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: -0.3,
  },

  // Option Styles
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  optionSubtitle: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },

  // Danger Option
  dangerOption: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 71, 87, 0.3)',
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dangerText: {
    fontSize: 16,
    fontWeight: '700',
  },

  // Footer
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
  },
  footerText: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  footerSubtext: {
    fontSize: 13,
  },
});