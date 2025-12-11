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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { gradients } from '../theme/colors';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, UserPlus, ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../config/supabase';

export const RegisterScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurunuz.');
      return;
    }

    if (name.length < 2) {
      Alert.alert('Hata', 'İsim en az 2 karakter olmalıdır.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }

    setIsLoading(true);

    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        console.error('Registration error:', error);
        Alert.alert('Kayıt Hatası', error.message || 'Hesap oluşturulurken bir hata oluştu.');
        return;
      }

      if (data.user) {
        Alert.alert(
          'Kayıt Başarılı!',
          'Hesabınız oluşturuldu. E-posta adresinizi doğruladıktan sonra giriş yapabilirsiniz.',
          [
            {
              text: 'Tamam',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Kayıt Hatası', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <LinearGradient
        colors={gradients.purple}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
            <View style={styles.headerIcon}>
              <UserPlus size={40} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <Text style={styles.headerTitle}>Kayıt Ol</Text>
            <Text style={styles.headerSubtitle}>Yeni Hesap Oluştur</Text>
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
          <View style={styles.formContainer}>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Hesap Oluştur
            </Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              Finansal yolculuğunuza başlamak için bilgilerinizi girin
            </Text>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text.primary }]}>
                Ad Soyad
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border.secondary }]}>
                <User size={20} color={colors.text.tertiary} strokeWidth={2} />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Adınız Soyadınız"
                  placeholderTextColor={colors.text.tertiary}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text.primary }]}>
                E-posta Adresi
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border.secondary }]}>
                <Mail size={20} color={colors.text.tertiary} strokeWidth={2} />
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
                  placeholder="En az 6 karakter"
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

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text.primary }]}>
                Şifre Tekrar
              </Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.cardBackground, borderColor: colors.border.secondary }]}>
                <Lock size={20} color={colors.text.tertiary} strokeWidth={2} />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Şifrenizi tekrar girin"
                  placeholderTextColor={colors.text.tertiary}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={colors.text.tertiary} strokeWidth={2} />
                  ) : (
                    <Eye size={20} color={colors.text.tertiary} strokeWidth={2} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <LinearGradient
                colors={gradients.purple}
                style={styles.registerButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {isLoading ? (
                  <Text style={styles.registerButtonText}>Kayıt Yapılıyor...</Text>
                ) : (
                  <>
                    <Text style={styles.registerButtonText}>Kayıt Ol</Text>
                    <ArrowRight size={20} color="#FFFFFF" strokeWidth={2} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Terms */}
            <View style={styles.termsContainer}>
              <Text style={[styles.termsText, { color: colors.text.tertiary }]}>
                Kayıt olarak{' '}
                <Text
                  style={[styles.termsLink, { color: colors.purple.light }]}
                  onPress={() => navigation.navigate('TermsOfService' as never)}
                >
                  Kullanım Koşulları
                </Text>{' '}
                ve{' '}
                <Text
                  style={[styles.termsLink, { color: colors.purple.light }]}
                  onPress={() => navigation.navigate('PrivacyPolicy' as never)}
                >
                  Gizlilik Politikası
                </Text>
                'nı kabul etmiş olursunuz.
              </Text>
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: colors.text.secondary }]}>
                Zaten hesabınız var mı?
              </Text>
              <TouchableOpacity onPress={handleGoBack}>
                <Text style={[styles.loginLink, { color: colors.purple.light }]}>
                  {' '}Giriş Yap
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
  backButton: {
    position: 'absolute',
    left: 24,
    top: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 20,
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
  registerButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  registerButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  termsLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 15,
    fontWeight: '500',
  },
  loginLink: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  bottomSpacer: {
    height: 20,
  },
});
