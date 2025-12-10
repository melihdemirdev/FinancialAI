import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { useCustomAlert } from '../hooks/useCustomAlert';
import { ArrowLeft, Bell, Clock, TrendingUp, Calendar, DollarSign, Send } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

export const NotificationSettingsScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { settings, updateSettings, requestPermissions, hasPermission } = useNotifications();
  const { showAlert, AlertComponent } = useCustomAlert();
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleToggleNotifications = async (value: boolean) => {
    if (value && !hasPermission) {
      const granted = await requestPermissions();
      if (!granted) {
        showAlert(
          'İzin Gerekli',
          'Bildirimler için uygulama izni vermeniz gerekmektedir. Lütfen ayarlardan bildirimleri açınız.',
          [{ text: 'Tamam' }],
          'warning'
        );
        return;
      }
    }

    await updateSettings({ enabled: value });

    if (value) {
      showAlert(
        'Bildirimler Açıldı',
        'Artık önemli finansal hatırlatmalar alacaksınız.',
        [{ text: 'Tamam' }],
        'success'
      );
    }
  };

  const handleToggleSetting = async (key: keyof typeof settings, value: boolean) => {
    if (!settings.enabled && value) {
      showAlert(
        'Bildirimler Kapalı',
        'Bu özelliği kullanmak için önce bildirimleri açmanız gerekmektedir.',
        [{ text: 'Tamam' }],
        'warning'
      );
      return;
    }

    await updateSettings({ [key]: value });
  };

  const handleTimeChange = async (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');

    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;

      await updateSettings({ dailyReminderTime: timeString });
    }
  };

  const getTimeDate = () => {
    const [hours, minutes] = settings.dailyReminderTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date;
  };

  const sendTestNotification = async () => {
    if (!hasPermission) {
      const granted = await requestPermissions();
      if (!granted) {
        showAlert(
          'İzin Gerekli',
          'Test bildirimi göndermek için bildirim izni vermeniz gerekmektedir.',
          [{ text: 'Tamam' }],
          'warning'
        );
        return;
      }
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '💰 Test Bildirimi',
          body: 'Harika! Bildirimler düzgün çalışıyor. Financial AI ile finansal hedeflerinize ulaşın!',
          sound: true,
          data: { type: 'test' },
        },
        trigger: {
          seconds: 2,
        },
      });

      showAlert(
        'Test Bildirimi Gönderildi',
        'Bildirim 2 saniye içinde gelecek!',
        [{ text: 'Tamam' }],
        'success'
      );
    } catch (error) {
      showAlert(
        'Hata',
        'Test bildirimi gönderilemedi. Lütfen tekrar deneyin.',
        [{ text: 'Tamam' }],
        'error'
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Header with Gradient Background */}
      <LinearGradient
        colors={[colors.purple.primary, colors.purple.secondary]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Bell size={24} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.headerTitle}>Bildirimler</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Master Toggle */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Genel
          </Text>
          <View style={[styles.option, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(147, 51, 234, 0.15)' }]}>
                <Bell size={20} color={colors.purple.light} strokeWidth={2.5} />
              </View>
              <View>
                <Text style={[styles.optionTitle, { color: colors.text.primary }]}>
                  Bildirimleri Aç
                </Text>
                <Text style={[styles.optionSubtitle, { color: colors.text.tertiary }]}>
                  Tüm bildirimleri {settings.enabled ? 'kapat' : 'aç'}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.enabled}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: colors.border.secondary, true: colors.purple.primary }}
              thumbColor={colors.text.primary}
            />
          </View>
        </View>

        {/* Permission Status */}
        {!hasPermission && (
          <View style={[styles.warningCard, { backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: '#f59e0b' }]}>
            <Text style={[styles.warningText, { color: colors.text.primary }]}>
              ⚠️ Bildirim izni verilmedi. Bildirimler çalışmayacaktır. Lütfen uygulama ayarlarından izin veriniz.
            </Text>
          </View>
        )}

        {/* Notification Types */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Bildirim Türleri
          </Text>

          {/* Daily Reminder */}
          <View style={[styles.option, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(147, 51, 234, 0.15)' }]}>
                <Clock size={20} color={colors.purple.light} strokeWidth={2.5} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.optionTitle, { color: colors.text.primary }]}>
                  Günlük Hatırlatma
                </Text>
                <Text style={[styles.optionSubtitle, { color: colors.text.tertiary }]}>
                  Her gün {settings.dailyReminderTime} - Finansal kontrol hatırlatması
                </Text>
              </View>
            </View>
            <Switch
              value={settings.dailyReminder}
              onValueChange={(value) => handleToggleSetting('dailyReminder', value)}
              trackColor={{ false: colors.border.secondary, true: colors.purple.primary }}
              thumbColor={colors.text.primary}
              disabled={!settings.enabled}
            />
          </View>

          {/* Time Picker for Daily Reminder */}
          {settings.dailyReminder && settings.enabled && (
            <TouchableOpacity
              style={[styles.timePickerButton, { backgroundColor: colors.cardBackground }]}
              onPress={() => setShowTimePicker(true)}
            >
              <Clock size={18} color={colors.purple.light} strokeWidth={2.5} />
              <Text style={[styles.timePickerText, { color: colors.text.primary }]}>
                Hatırlatma Saati: {settings.dailyReminderTime}
              </Text>
            </TouchableOpacity>
          )}

          {showTimePicker && (
            <DateTimePicker
              value={getTimeDate()}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={handleTimeChange}
            />
          )}

          {/* Payment Reminders */}
          <View style={[styles.option, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(147, 51, 234, 0.15)' }]}>
                <DollarSign size={20} color={colors.purple.light} strokeWidth={2.5} />
              </View>
              <View>
                <Text style={[styles.optionTitle, { color: colors.text.primary }]}>
                  Ödeme Hatırlatmaları
                </Text>
                <Text style={[styles.optionSubtitle, { color: colors.text.tertiary }]}>
                  Yaklaşan taksit ve borç ödemeleri
                </Text>
              </View>
            </View>
            <Switch
              value={settings.paymentReminders}
              onValueChange={(value) => handleToggleSetting('paymentReminders', value)}
              trackColor={{ false: colors.border.secondary, true: colors.purple.primary }}
              thumbColor={colors.text.primary}
              disabled={!settings.enabled}
            />
          </View>

          {/* Budget Alerts */}
          <View style={[styles.option, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(147, 51, 234, 0.15)' }]}>
                <TrendingUp size={20} color={colors.purple.light} strokeWidth={2.5} />
              </View>
              <View>
                <Text style={[styles.optionTitle, { color: colors.text.primary }]}>
                  Bütçe Uyarıları
                </Text>
                <Text style={[styles.optionSubtitle, { color: colors.text.tertiary }]}>
                  Bütçe aşımı ve hedef bildirimleri
                </Text>
              </View>
            </View>
            <Switch
              value={settings.budgetAlerts}
              onValueChange={(value) => handleToggleSetting('budgetAlerts', value)}
              trackColor={{ false: colors.border.secondary, true: colors.purple.primary }}
              thumbColor={colors.text.primary}
              disabled={!settings.enabled}
            />
          </View>

          {/* Weekly Reports */}
          <View style={[styles.option, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.optionLeft}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(147, 51, 234, 0.15)' }]}>
                <Calendar size={20} color={colors.purple.light} strokeWidth={2.5} />
              </View>
              <View>
                <Text style={[styles.optionTitle, { color: colors.text.primary }]}>
                  Haftalık Raporlar
                </Text>
                <Text style={[styles.optionSubtitle, { color: colors.text.tertiary }]}>
                  Her Pazartesi finansal özet raporu
                </Text>
              </View>
            </View>
            <Switch
              value={settings.weeklyReports}
              onValueChange={(value) => handleToggleSetting('weeklyReports', value)}
              trackColor={{ false: colors.border.secondary, true: colors.purple.primary }}
              thumbColor={colors.text.primary}
              disabled={!settings.enabled}
            />
          </View>
        </View>

        {/* Test Notification Button */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Test
          </Text>
          <TouchableOpacity
            style={styles.testButton}
            onPress={sendTestNotification}
          >
            <LinearGradient
              colors={[colors.purple.primary, colors.purple.secondary]}
              style={styles.testButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Send size={20} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.testButtonText}>Test Bildirimi Gönder</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.infoTitle, { color: colors.text.primary }]}>
            📱 Bildirim İpuçları
          </Text>
          <Text style={[styles.infoText, { color: colors.text.secondary }]}>
            • Bildirimleri kapatırsanız, önemli ödeme hatırlatmalarını kaçırabilirsiniz.{'\n'}
            • Günlük hatırlatmalar, finansal disiplininizi korumanıza yardımcı olur.{'\n'}
            • Tüm bildirimler tamamen opsiyoneldir ve istediğiniz zaman değiştirebilirsiniz.
          </Text>
        </View>
      </ScrollView>

      {/* Custom Alert */}
      {AlertComponent}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    width: '100%',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  timePickerText: {
    fontSize: 15,
    fontWeight: '600',
  },
  warningCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  testButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  testButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  infoCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
});
