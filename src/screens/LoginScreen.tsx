import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
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
import { GoogleIcon } from '../components/GoogleIcon';
import { useCustomAlert } from '../hooks/useCustomAlert';

interface LoginScreenProps {}

export const LoginScreen: React.FC<LoginScreenProps> = () => {
  const { colors } = useTheme();
  const { login, loginWithGoogle, loginAsGuest } = useAuth();
  const { showAlert, AlertComponent } = useCustomAlert();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGuest, setIsLoadingGuest] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Hata', 'Lütfen tüm alanları doldurunuz.', [{ text: 'Tamam' }], 'error');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showAlert('Hata', 'Lütfen geçerli bir e-posta adresi giriniz.', [{ text: 'Tamam' }], 'error');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        showAlert('Giriş Başarılı', 'Hoş geldiniz!', [{ text: 'Tamam' }], 'success');
      } else {
        showAlert('Giriş Başarısız', result.error || 'Lütfen bilgilerinizi kontrol edin.', [{ text: 'Tamam' }], 'error');
      }
    } catch (error) {
      showAlert('Giriş Başarısız', 'Bir hata oluştu. Lütfen tekrar deneyin.', [{ text: 'Tamam' }], 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoadingGuest(true);

    try {
      const success = await loginAsGuest();
      if (success) {
        showAlert('Misafir Girişi', 'Misafir olarak giriş yapıldı!', [{ text: 'Tamam' }], 'success');
      } else {
        showAlert('Misafir Girişi Başarısız', 'Misafir olarak giriş yapılamadı.', [{ text: 'Tamam' }], 'error');
      }
    } catch (error) {
      showAlert('Misafir Girişi Başarısız', 'Bir hata oluştu. Lütfen tekrar deneyin.', [{ text: 'Tamam' }], 'error');
    } finally {
      setIsLoadingGuest(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoadingGoogle(true);

    try {
      const result = await loginWithGoogle();
      if (result.success) {
        showAlert('Giriş Başarılı', 'Google hesabınızla giriş yapıldı!', [{ text: 'Tamam' }], 'success');
      } else {
        if (result.error !== 'Google girişi iptal edildi.') {
          showAlert('Giriş Başarısız', result.error || 'Google ile giriş yapılamadı.', [{ text: 'Tamam' }], 'error');
        }
      }
    } catch (error) {
      showAlert('Giriş Başarısız', 'Bir hata oluştu. Lütfen tekrar deneyin.', [{ text: 'Tamam' }], 'error');
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword' as never);
  };

  const handleRegister = () => {
    navigation.navigate('Register' as never);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Full Screen Gradient Header */}
      <LinearGradient
        colors={gradients.purple}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <Shield size={40} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <Text style={styles.headerTitle}>Financial AI</Text>
            <Text style={styles.headerSubtitle}>Akıllı Finans Yönetimi</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >

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
              {/* Google Login Button - Official Design */}
              <TouchableOpacity
                style={[styles.googleButton, { backgroundColor: '#FFFFFF', borderColor: colors.border.secondary }]}
                onPress={handleGoogleLogin}
                disabled={isLoadingGoogle}
                activeOpacity={0.8}
              >
                <View style={styles.googleButtonContent}>
                  {/* Google Logo - Official */}
                  <GoogleIcon size={20} />
                  <Text style={styles.googleButtonText}>
                    {isLoadingGoogle ? 'Giriş yapılıyor...' : 'Google ile giriş yap'}
                  </Text>
                </View>
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
                  <View style={styles.guestButtonContent}>
                    <UserRound size={20} color="#FFFFFF" strokeWidth={2.5} />
                    <Text style={styles.guestButtonText}>
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
              <TouchableOpacity onPress={handleRegister}>
                <Text style={[styles.signupLink, { color: colors.purple.light }]}>
                  {' '}Kayıt Ol
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Safe Area Spacer */}
            <SafeAreaView edges={['bottom']}>
              <View style={styles.bottomSpacer} />
            </SafeAreaView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Alert */}
      {AlertComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: 48,
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },
  headerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    flex: 1,
    paddingBottom: 32,
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
  // Google Button - Official Design Standards
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3c4043',
    letterSpacing: 0.3,
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
    paddingHorizontal: 20,
  },
  guestButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  guestButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  bottomSpacer: {
    height: 20,
  },
});