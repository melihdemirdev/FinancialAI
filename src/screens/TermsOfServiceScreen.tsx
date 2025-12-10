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

export const TermsOfServiceScreen = ({ navigation }: any) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Gradient Background */}
      <LinearGradient
        colors={[colors.purple.primary, colors.purple.secondary]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <FileText size={24} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.headerTitle}>Kullanım Koşulları</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>
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
    </View>
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
    padding: 20,
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
