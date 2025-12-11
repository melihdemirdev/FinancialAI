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
import { ArrowLeft, FileText } from 'lucide-react-native';
import { gradients } from '../theme/colors';

export const TermsOfServiceScreen = ({ navigation }: any) => {
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
            <Text style={styles.screenTitle}>Kullanım Koşulları</Text>
          </View>
          <View style={styles.headerIcon}>
            <FileText size={22} color="#FFFFFF" strokeWidth={2} />
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
            1. Kabul ve Onay
          </Text>
          <Text style={[styles.sectionText, { color: colors.text.secondary }]}>
            Financial AI uygulamasını kullanarak, bu kullanım koşullarını okuduğunuzu,
            anladığınızı ve kabul ettiğinizi beyan edersiniz. Bu koşulları kabul etmiyorsanız,
            lütfen uygulamayı kullanmayınız.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            2. Hizmet Tanımı
          </Text>
          <Text style={[styles.sectionText, { color: colors.text.secondary }]}>
            Financial AI, kişisel finans yönetimi için tasarlanmış bir mobil uygulamadır.
            Uygulama, varlıklarınızı, borçlarınızı, alacaklarınızı ve taksitlerinizi
            takip etmenize yardımcı olur. Ayrıca yapay zeka destekli finansal danışmanlık
            hizmeti sunar.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            3. Kullanıcı Sorumlulukları
          </Text>
          <Text style={[styles.sectionText, { color: colors.text.secondary }]}>
            • Uygulamaya girdiğiniz tüm finansal bilgilerin doğruluğundan siz sorumlusunuz.{'\n'}
            • Hesap güvenliğinizi korumakla yükümlüsünüz.{'\n'}
            • Uygulamayı yasa dışı amaçlarla kullanmayacağınızı kabul edersiniz.{'\n'}
            • Başkalarının hesaplarına yetkisiz erişim sağlamayacağınızı taahhüt edersiniz.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            4. Veri Güvenliği
          </Text>
          <Text style={[styles.sectionText, { color: colors.text.secondary }]}>
            Tüm finansal verileriniz cihazınızda güvenli bir şekilde saklanır. Verileriniz,
            şifreleme teknolojileri ile korunmaktadır. Ancak, internet üzerinden yapılan
            iletişimin %100 güvenli olmadığını unutmayınız.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            5. AI Danışman Hizmeti
          </Text>
          <Text style={[styles.sectionText, { color: colors.text.secondary }]}>
            AI danışman tarafından sağlanan bilgiler yalnızca genel bilgilendirme amaçlıdır
            ve profesyonel finansal danışmanlık yerine geçmez. Finansal kararlarınızı
            almadan önce profesyonel bir danışmana başvurmanızı öneririz.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            6. Fikri Mülkiyet Hakları
          </Text>
          <Text style={[styles.sectionText, { color: colors.text.secondary }]}>
            Financial AI uygulaması ve içeriği, telif hakları, ticari markalar ve diğer
            fikri mülkiyet yasaları ile korunmaktadır. Uygulamanın izinsiz kopyalanması,
            dağıtılması veya değiştirilmesi yasaktır.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            7. Sorumluluk Reddi
          </Text>
          <Text style={[styles.sectionText, { color: colors.text.secondary }]}>
            Financial AI, uygulamanın kesintisiz veya hatasız çalışacağını garanti etmez.
            Uygulamanın kullanımından kaynaklanan doğrudan veya dolaylı zararlardan
            sorumlu değiliz.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            8. Değişiklikler
          </Text>
          <Text style={[styles.sectionText, { color: colors.text.secondary }]}>
            Bu kullanım koşullarını herhangi bir zamanda değiştirme hakkını saklı tutarız.
            Değişiklikler uygulama içinde duyurulacaktır. Değişikliklerden sonra uygulamayı
            kullanmaya devam etmeniz, yeni koşulları kabul ettiğiniz anlamına gelir.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            9. İletişim
          </Text>
          <Text style={[styles.sectionText, { color: colors.text.secondary }]}>
            Bu kullanım koşulları hakkında sorularınız varsa, lütfen bizimle iletişime geçin:{'\n\n'}
            E-posta: support@financialai.com{'\n'}
            Web: www.financialai.com
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.text.tertiary }]}>
            Son Güncelleme: 9 Aralık 2025
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
  },
});
