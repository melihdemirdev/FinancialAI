import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { ArrowLeft, Shield } from 'lucide-react-native';
import { gradients } from '../theme/colors';

export const PrivacyPolicyScreen = ({ navigation }: any) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <LinearGradient
        colors={gradients.purple}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <View style={styles.backButtonCircle}>
              <ArrowLeft size={20} color="#FFFFFF" strokeWidth={2.5} />
            </View>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.subtitle}>Yasal</Text>
            <Text style={styles.screenTitle}>Gizlilik Politikası</Text>
          </View>
          <View style={styles.headerIcon}>
            <Shield size={22} color="#FFFFFF" strokeWidth={2} />
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Giriş
          </Text>
          <Text style={[styles.sectionText, { color: colors.text.secondary }]}>
            Financial AI olarak gizliliğinize önem veriyoruz. Bu gizlilik politikası,
            uygulamayı kullanırken toplanan, kullanılan ve korunan bilgiler hakkında
            sizi bilgilendirmek amacıyla hazırlanmıştır.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            1. Toplanan Bilgiler
          </Text>
          <Text style={[styles.sectionText, { color: colors.text.secondary }]}>
            <Text style={{ fontWeight: '700' }}>Kişisel Bilgiler:{'\n'}</Text>
            • İsim ve e-posta adresi (kayıt sırasında){'\n'}
            • Telefon numarası (isteğe bağlı){'\n'}
            • Profil fotoğrafı (isteğe bağlı){'\n\n'}
            <Text style={{ fontWeight: '700' }}>Finansal Bilgiler:{'\n'}</Text>
            • Varlık bilgileri{'\n'}
            • Borç ve taksit bilgileri{'\n'}
            • Alacak bilgileri{'\n'}
            • Finansal hedefler ve bütçe bilgileri
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            2. Bilgilerin Kullanımı
          </Text>
          <Text style={[styles.sectionText, { color: colors.text.secondary }]}>
            Toplanan bilgiler aşağıdaki amaçlarla kullanılır:{'\n\n'}
            • Uygulama hizmetlerini sağlamak ve geliştirmek{'\n'}
            • Kişiselleştirilmiş finansal analiz ve öneriler sunmak{'\n'}
            • AI danışman hizmetini iyileştirmek{'\n'}
            • Kullanıcı deneyimini optimize etmek{'\n'}
            • Teknik destek sağlamak{'\n'}
            • Güvenlik ve dolandırıcılık önleme
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            3. Veri Saklama ve Güvenlik
          </Text>
          <Text style={[styles.sectionText, { color: colors.text.secondary }]}>
            <Text style={{ fontWeight: '700' }}>Yerel Depolama:{'\n'}</Text>
            Tüm finansal verileriniz öncelikli olarak cihazınızda güvenli bir şekilde
            saklanır. Bu veriler şifreleme teknolojileri ile korunmaktadır.{'\n\n'}
            <Text style={{ fontWeight: '700' }}>Güvenlik Önlemleri:{'\n'}</Text>
            • AES-256 şifreleme{'\n'}
            • Biyometrik kimlik doğrulama (Face ID/Touch ID){'\n'}
            • Güvenli veri aktarımı (SSL/TLS){'\n'}
            • Düzenli güvenlik güncellemeleri
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            4. Üçüncü Taraf Paylaşımı
          </Text>
          <Text style={[styles.sectionText, { color: colors.text.secondary }]}>
            Finansal bilgilerinizi üçüncü taraflarla <Text style={{ fontWeight: '700' }}>paylaşmıyoruz</Text>.
            Ancak, aşağıdaki durumlar istisnadır:{'\n\n'}
            • Yasal zorunluluklar{'\n'}
            • Açık onayınız ile{'\n'}
            • Hizmet sağlayıcılar (örn: AI API'leri) - Yalnızca anonim veriler
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            5. AI ve Makine Öğrenimi
          </Text>
          <Text style={[styles.sectionText, { color: colors.text.secondary }]}>
            AI danışman hizmeti için Google Gemini API kullanılmaktadır. AI ile paylaşılan
            veriler anonim hale getirilir ve kişisel kimlik bilgileriniz içermez. AI
            sağlayıcıları bu verileri sadece yanıt üretmek için kullanır ve saklamaz.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            6. Çerezler ve Takip Teknolojileri
          </Text>
          <Text style={[styles.sectionText, { color: colors.text.secondary }]}>
            Uygulama, kullanıcı deneyimini iyileştirmek için minimal düzeyde yerel
            depolama (AsyncStorage) kullanır. Bu veriler yalnızca cihazınızda saklanır
            ve izleme amaçlı kullanılmaz.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            7. Kullanıcı Hakları
          </Text>
          <Text style={[styles.sectionText, { color: colors.text.secondary }]}>
            Verileriniz üzerinde tam kontrole sahipsiniz:{'\n\n'}
            • <Text style={{ fontWeight: '700' }}>Erişim:</Text> Verilerinize her zaman uygulama içinden erişebilirsiniz{'\n'}
            • <Text style={{ fontWeight: '700' }}>Dışa Aktarma:</Text> Verilerinizi JSON veya PDF formatında dışa aktarabilirsiniz{'\n'}
            • <Text style={{ fontWeight: '700' }}>Silme:</Text> Tüm verilerinizi kalıcı olarak silebilirsiniz{'\n'}
            • <Text style={{ fontWeight: '700' }}>Düzenleme:</Text> Bilgilerinizi istediğiniz zaman güncelleyebilirsiniz
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            8. Çocukların Gizliliği
          </Text>
          <Text style={[styles.sectionText, { color: colors.text.secondary }]}>
            Uygulamamız 18 yaş altındaki kullanıcılara yönelik değildir. Bilerek
            18 yaş altındaki kişilerden kişisel bilgi toplamıyoruz. Eğer 18 yaşından
            küçükseniz, lütfen bu uygulamayı kullanmayınız.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            9. Politika Değişiklikleri
          </Text>
          <Text style={[styles.sectionText, { color: colors.text.secondary }]}>
            Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler
            uygulama içinde bildirilecektir. Politikayı düzenli olarak gözden geçirmenizi
            öneririz.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            10. İletişim
          </Text>
          <Text style={[styles.sectionText, { color: colors.text.secondary }]}>
            Gizlilik politikamız veya verilerinizin işlenmesi hakkında sorularınız varsa:{'\n\n'}
            E-posta: privacy@financialai.com{'\n'}
            Web: www.financialai.com/privacy{'\n'}
            Adres: İstanbul, Türkiye
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.text.tertiary }]}>
            Son Güncelleme: 9 Aralık 2025
          </Text>
          <Text style={[styles.footerSubtext, { color: colors.text.tertiary }]}>
            Verileriniz bizim için değerlidir ve güvenliğiniz önceliğimizdir.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Header Styles
  headerGradient: {
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 8,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 2,
    letterSpacing: 0.5,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 12,
    fontWeight: '500',
    fontStyle: 'italic',
  },
});
