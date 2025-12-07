import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Info, Github, Mail, Bug, Heart, Code, Sparkles } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { gradients } from '../theme/colors';

interface AboutScreenProps {
  onBack?: () => void;
}

export const AboutScreen = ({ onBack }: AboutScreenProps) => {
  const { colors } = useTheme();

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Modern Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <View style={[styles.backButtonCircle, { backgroundColor: colors.cardBackground }]}>
            <ArrowLeft size={24} color={colors.text.primary} strokeWidth={2.5} />
          </View>
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.subtitle, { color: colors.text.tertiary }]}>Uygulama</Text>
          <Text style={[styles.screenTitle, { color: colors.text.primary }]}>Hakkında</Text>
        </View>
        <View style={[styles.headerIcon, { backgroundColor: 'rgba(147, 51, 234, 0.15)' }]}>
          <Info size={28} color={colors.purple.light} strokeWidth={2} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <View style={styles.heroCardContainer}>
          <LinearGradient
            colors={gradients.purple}
            style={styles.heroCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.logoContainer}>
              <Sparkles size={48} color="#FFFFFF" strokeWidth={2} />
            </View>
            <Text style={styles.appTitle}>Financial AI</Text>
            <View style={styles.versionBadge}>
              <Text style={styles.appVersion}>v1.0.0</Text>
            </View>
            <Text style={styles.appDescription}>Kişisel finans yönetiminin geleceği</Text>
          </LinearGradient>
        </View>

        {/* Info Cards */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Uygulama Bilgileri</Text>

          <View style={[styles.infoCard, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <View style={[styles.infoIconCircle, { backgroundColor: 'rgba(147, 51, 234, 0.15)' }]}>
                  <Code size={20} color={colors.purple.light} strokeWidth={2.5} />
                </View>
                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Versiyon</Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>1.0.0</Text>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border.secondary }]} />

            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <View style={[styles.infoIconCircle, { backgroundColor: 'rgba(147, 51, 234, 0.15)' }]}>
                  <Heart size={20} color={colors.purple.light} strokeWidth={2.5} />
                </View>
                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Geliştirici</Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>Financial AI Team</Text>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border.secondary }]} />

            <View style={styles.infoRow}>
              <View style={styles.infoLeft}>
                <View style={[styles.infoIconCircle, { backgroundColor: 'rgba(147, 51, 234, 0.15)' }]}>
                  <Info size={20} color={colors.purple.light} strokeWidth={2.5} />
                </View>
                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Lisans</Text>
              </View>
              <Text style={[styles.infoValue, { color: colors.text.primary }]}>GPL-3.0</Text>
            </View>
          </View>
        </View>

        {/* Contribute Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Katkıda Bulun</Text>

          <TouchableOpacity
            style={[styles.linkButton, { backgroundColor: colors.cardBackground }]}
            onPress={() => openLink('https://github.com/financialai')}
          >
            <View style={styles.linkButtonContent}>
              <View style={[styles.linkIconCircle, { backgroundColor: 'rgba(147, 51, 234, 0.15)' }]}>
                <Github size={20} color={colors.purple.light} strokeWidth={2.5} />
              </View>
              <View style={styles.linkTextContainer}>
                <Text style={[styles.linkTitle, { color: colors.text.primary }]}>GitHub Reposu</Text>
                <Text style={[styles.linkSubtitle, { color: colors.text.tertiary }]}>
                  Kaynak kodunu incele
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.linkButton, { backgroundColor: colors.cardBackground }]}
            onPress={() => openLink('https://github.com/financialai/issues')}
          >
            <View style={styles.linkButtonContent}>
              <View style={[styles.linkIconCircle, { backgroundColor: 'rgba(147, 51, 234, 0.15)' }]}>
                <Bug size={20} color={colors.purple.light} strokeWidth={2.5} />
              </View>
              <View style={styles.linkTextContainer}>
                <Text style={[styles.linkTitle, { color: colors.text.primary }]}>Hata Bildir</Text>
                <Text style={[styles.linkSubtitle, { color: colors.text.tertiary }]}>
                  Sorun bildirin veya öneride bulunun
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>İletişim</Text>

          <TouchableOpacity
            style={[styles.linkButton, { backgroundColor: colors.cardBackground }]}
            onPress={() => openLink('mailto:contact@financialai.com')}
          >
            <View style={styles.linkButtonContent}>
              <View style={[styles.linkIconCircle, { backgroundColor: 'rgba(147, 51, 234, 0.15)' }]}>
                <Mail size={20} color={colors.purple.light} strokeWidth={2.5} />
              </View>
              <View style={styles.linkTextContainer}>
                <Text style={[styles.linkTitle, { color: colors.text.primary }]}>E-posta Gönder</Text>
                <Text style={[styles.linkSubtitle, { color: colors.text.tertiary }]}>
                  contact@financialai.com
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footerSection}>
          <Text style={[styles.footerText, { color: colors.text.secondary }]}>
            Made with
          </Text>
          <Heart size={16} color={colors.purple.primary} fill={colors.purple.primary} style={styles.heartIcon} />
          <Text style={[styles.footerText, { color: colors.text.secondary }]}>
            by Financial AI Team
          </Text>
        </View>
        <Text style={[styles.copyright, { color: colors.text.tertiary }]}>
          © {new Date().getFullYear()} Financial AI. Tüm hakları saklıdır.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 12,
  },
  backButtonCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTextContainer: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  screenTitle: {
    fontSize: 28,
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

  // Content
  content: {
    padding: 24,
    paddingTop: 0,
    paddingBottom: 100,
  },

  // Hero Card
  heroCardContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  heroCard: {
    padding: 32,
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  versionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  appVersion: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  appDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Section
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: -0.3,
  },

  // Info Card
  infoCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },

  // Link Buttons
  linkButton: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  linkButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  linkTextContainer: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  linkSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Footer
  footerSection: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  heartIcon: {
    marginHorizontal: 4,
  },
  copyright: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});
