import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { gradients } from '../theme/colors';
import { User, Lock, Eye, EyeOff, ArrowRight, Shield, LogIn, UserRound } from 'lucide-react-native';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

interface LoginScreenProps {}

export const LoginScreen: React.FC<LoginScreenProps> = () => {
  const { colors } = useTheme();
  const { login, loginAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGuest, setIsLoadingGuest] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurunuz.');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        // Navigate to main app after successful login
        // Instead of resetting, we'll let the auth state change handle navigation
        Alert.alert('Giriş Başarılı', 'Hoş geldiniz!', [
          { text: 'Tamam', onPress: () => {
              // The AuthNavigator will automatically switch to AppStack due to auth state change
              // No explicit navigation needed here
            }
          }
        ]);
      } else {
        Alert.alert('Giriş Başarısız', 'Lütfen bilgilerinizi kontrol edin.');
      }
    } catch (error) {
      Alert.alert('Giriş Başarısız', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoadingGuest(true);

    try {
      const success = await loginAsGuest();
      if (success) {
        Alert.alert('Misafir Girişi', 'Misafir olarak giriş yapıldı!', [
          { text: 'Tamam', onPress: () => {
              // The AuthNavigator will automatically switch to AppStack due to auth state change
              // No explicit navigation needed here
            }
          }
        ]);
      } else {
        Alert.alert('Misafir Girişi Başarısız', 'Misafir olarak giriş yapılamadı.');
      }
    } catch (error) {
      Alert.alert('Misafir Girişi Başarısız', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoadingGuest(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true);

    // Simulate Google login process
    setTimeout(() => {
      setIsLoadingGoogle(false);
      Alert.alert('Google ile Giriş', 'Google hesabınızla giriş yapıldı!', [
        { text: 'Tamam', onPress: () => {
            // The AuthNavigator will automatically switch to AppStack due to auth state change
            // No explicit navigation needed here
          }
        }
      ]);
    }, 1000);
  };

  const handleForgotPassword = () => {
    Alert.alert('Şifremi Unuttum', 'Lütfen destek ekibine başvurunuz.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Gradient Header */}
          <View style={styles.headerContainer}>
            <LinearGradient
              colors={gradients.purple}
              style={styles.headerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.headerContent}>
                <View style={styles.headerIcon}>
                  <Shield size={32} color="#FFFFFF" strokeWidth={2.5} />
                </View>
                <Text style={styles.headerTitle}>Finansal AI</Text>
                <Text style={styles.headerSubtitle}>Güvenli Giriş</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Hoş Geldiniz
            </Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              Hesabınıza erişmek için giriş yapın
            </Text>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text.primary }]}>
                E-posta Adresi
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border.secondary }]}>
                <User size={20} color={colors.text.tertiary} strokeWidth={2} />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="ornek@email.com"
                  placeholderTextColor={colors.text.tertiary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text.primary }]}>
                Şifre
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border.secondary }]}>
                <Lock size={20} color={colors.text.tertiary} strokeWidth={2} />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={colors.text.tertiary}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color={colors.text.tertiary} strokeWidth={2} />
                  ) : (
                    <Eye size={20} color={colors.text.tertiary} strokeWidth={2} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPasswordContainer} onPress={handleForgotPassword}>
              <Text style={[styles.forgotPasswordText, { color: colors.purple.light }]}>
                Şifremi Unuttum
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <LinearGradient
                colors={gradients.purple}
                style={styles.loginButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {isLoading ? (
                  <Text style={styles.loginButtonText}>Giriş Yapılıyor...</Text>
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Giriş Yap</Text>
                    <ArrowRight size={20} color="#FFFFFF" strokeWidth={2} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border.secondary }]} />
              <Text style={[styles.dividerText, { color: colors.text.secondary }]}>
                veya
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border.secondary }]} />
            </View>

            {/* Social Login Options */}
            <View style={styles.socialLoginContainer}>
              {/* Google Login Button */}
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGoogleLogin}
                disabled={isLoadingGoogle}
              >
                <LinearGradient
                  colors={['#4285F4', '#34A853', '#FBBC05', '#EA4335']}
                  style={styles.socialButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.socialButtonContent}>
                    <View style={styles.googleLogoContainer}>
                      <Image
                        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg' }}
                        style={styles.googleLogo}
                      />
                    </View>
                    <Text style={styles.socialButtonText}>
                      {isLoadingGoogle ? 'Giriş Yapılıyor...' : 'Google ile Giriş'}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Guest Login Button */}
              <TouchableOpacity
                style={styles.guestButton}
                onPress={handleGuestLogin}
                disabled={isLoadingGuest}
              >
                <LinearGradient
                  colors={['#6B7280', '#4B5563', '#374151']}
                  style={styles.guestButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.socialButtonContent}>
                    <UserRound size={20} color="#FFFFFF" strokeWidth={2.5} />
                    <Text style={styles.socialButtonText}>
                      {isLoadingGuest ? 'Giriş Yapılıyor...' : 'Misafir Olarak Devam Et'}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Sign Up Option */}
            <View style={styles.signupContainer}>
              <Text style={[styles.signupText, { color: colors.text.secondary }]}>
                Hesabınız yok mu?
              </Text>
              <TouchableOpacity>
                <Text style={[styles.signupLink, { color: colors.purple.light }]}>
                  {' '}Kayıt Ol
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerContainer: {
    overflow: 'hidden',
    paddingTop: 50,
    paddingBottom: 40,
  },
  headerGradient: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 0.3,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 40,
    flex: 1,
    paddingBottom: 32, // Add padding at the bottom to account for safe area
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 32,
    letterSpacing: 0.2,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 16,
    fontWeight: '500',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  loginButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    marginBottom: 24,
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 15,
    fontWeight: '500',
  },
  signupLink: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  // Divider Styles
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 12,
    letterSpacing: 0.3,
  },
  // Social Login Styles
  socialLoginContainer: {
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  socialButtonGradient: {
    paddingVertical: 16,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  googleLogoContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  googleLogo: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  guestButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  guestButtonGradient: {
    paddingVertical: 16,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});