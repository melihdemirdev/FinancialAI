import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  X,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Activity,
  Shield,
  Zap,
  Target,
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useCurrency } from '../../context/CurrencyContext';

const { width } = Dimensions.get('window');

interface CFOReportData {
  summary: string;
  risks: string[];
  actions: string[];
  rawText: string;
}

interface FinancialMetrics {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  safeToSpend: number;
  totalReceivables: number;
  totalInstallments: number;
}

interface CFOReportModalProps {
  visible: boolean;
  onClose: () => void;
  reportData: CFOReportData | null;
  metrics: FinancialMetrics;
}

export const CFOReportModal: React.FC<CFOReportModalProps> = ({
  visible,
  onClose,
  reportData,
  metrics,
}) => {
  const { colors } = useTheme();
  const { currencySymbol } = useCurrency();

  // Finansal Sağlık Skoru Hesaplama (0-100)
  const calculateHealthScore = (): number => {
    let score = 50; // Başlangıç

    // Net değer pozitifse +20
    if (metrics.netWorth > 0) score += 20;
    else score -= 20;

    // Borç/Varlık oranı
    const debtRatio = metrics.totalAssets > 0 ? metrics.totalLiabilities / metrics.totalAssets : 1;
    if (debtRatio < 0.3) score += 15;
    else if (debtRatio < 0.5) score += 10;
    else if (debtRatio < 0.7) score += 5;
    else score -= 10;

    // Likidite durumu
    const liquidityRatio = metrics.totalLiabilities > 0 ? metrics.safeToSpend / metrics.totalLiabilities : 2;
    if (liquidityRatio > 1.5) score += 15;
    else if (liquidityRatio > 1) score += 10;
    else if (liquidityRatio > 0.5) score += 5;
    else score -= 5;

    return Math.max(0, Math.min(100, score));
  };

  const healthScore = calculateHealthScore();

  // Skor kategorisi
  const getScoreCategory = (score: number) => {
    if (score >= 80) return { text: 'Mükemmel', color: colors.success, icon: CheckCircle };
    if (score >= 60) return { text: 'İyi', color: colors.accent.cyan, icon: TrendingUp };
    if (score >= 40) return { text: 'Orta', color: '#F59E0B', icon: Activity };
    return { text: 'Dikkat', color: colors.error, icon: AlertTriangle };
  };

  const scoreCategory = getScoreCategory(healthScore);

  // Kategori skorları
  const liquidityScore = metrics.totalLiabilities > 0
    ? Math.min(100, (metrics.safeToSpend / metrics.totalLiabilities) * 100)
    : 100;

  const debtScore = metrics.totalAssets > 0
    ? Math.max(0, 100 - (metrics.totalLiabilities / metrics.totalAssets) * 100)
    : 50;

  const assetScore = metrics.netWorth > 0 ? Math.min(100, (metrics.netWorth / 10000) * 100) : 0;

  const installmentScore = metrics.totalAssets > 0
    ? Math.max(0, 100 - (metrics.totalInstallments / metrics.totalAssets) * 100)
    : 50;

  const CategoryCard = ({
    title,
    score,
    icon: Icon,
    color,
    description,
  }: {
    title: string;
    score: number;
    icon: any;
    color: string;
    description: string;
  }) => (
    <View style={[styles.categoryCard, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.categoryHeader}>
        <View style={[styles.categoryIcon, { backgroundColor: `${color}20` }]}>
          <Icon size={20} color={color} strokeWidth={2.5} />
        </View>
        <Text style={[styles.categoryTitle, { color: colors.text.primary }]}>{title}</Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={[styles.scoreValue, { color }]}>{Math.round(score)}</Text>
        <Text style={[styles.scoreMax, { color: colors.text.tertiary }]}>/100</Text>
      </View>
      <View style={[styles.progressBar, { backgroundColor: `${color}20` }]}>
        <View style={[styles.progressFill, { width: `${score}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.categoryDesc, { color: colors.text.secondary }]}>{description}</Text>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <LinearGradient
          colors={['#9333EA', '#7C3AED']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerSubtitle}>Yapay Zeka CFO</Text>
              <Text style={styles.headerTitle}>Finansal Sağlık Raporu</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#FFFFFF" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* Genel Skor */}
          <View style={styles.scoreSection}>
            <View style={styles.scoreCircle}>
              <View style={styles.scoreInner}>
                <scoreCategory.icon size={32} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.mainScore}>{Math.round(healthScore)}</Text>
                <Text style={styles.scoreLabel}>Skor</Text>
              </View>
            </View>
            <View style={styles.scoreInfo}>
              <View style={[styles.scoreBadge, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                <Text style={styles.scoreBadgeText}>{scoreCategory.text}</Text>
              </View>
              <Text style={styles.scoreDescription}>
                Finansal sağlığınız {scoreCategory.text.toLowerCase()} durumda
              </Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* AI Özet */}
          {reportData && (
            <View style={[styles.summaryCard, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.summaryHeader}>
                <Zap size={20} color={colors.purple.light} strokeWidth={2.5} />
                <Text style={[styles.summaryTitle, { color: colors.text.primary }]}>
                  AI Analiz Özeti
                </Text>
              </View>
              <Text style={[styles.summaryText, { color: colors.text.secondary }]}>
                {reportData.summary}
              </Text>
            </View>
          )}

          {/* Kategori Skorları */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Detaylı Analiz
            </Text>
            <View style={styles.categoriesGrid}>
              <CategoryCard
                title="Likidite"
                score={liquidityScore}
                icon={Activity}
                color={colors.accent.cyan}
                description="Nakit akışı ve ödeme gücü"
              />
              <CategoryCard
                title="Borçlanma"
                score={debtScore}
                icon={Shield}
                color={debtScore > 60 ? colors.success : colors.error}
                description="Borç yönetimi kalitesi"
              />
              <CategoryCard
                title="Varlık Kalitesi"
                score={assetScore}
                icon={TrendingUp}
                color={colors.success}
                description="Net varlık değeri"
              />
              <CategoryCard
                title="Taksit Yükü"
                score={installmentScore}
                icon={Target}
                color={installmentScore > 70 ? colors.success : '#F59E0B'}
                description="Aylık taksit oranı"
              />
            </View>
          </View>

          {/* Riskler */}
          {reportData && reportData.risks.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <AlertTriangle size={20} color={colors.error} strokeWidth={2.5} />
                <Text style={[styles.sectionTitle, { color: colors.text.primary, marginLeft: 8 }]}>
                  Tespit Edilen Riskler
                </Text>
              </View>
              {reportData.risks.map((risk, idx) => (
                <View
                  key={`risk-${idx}`}
                  style={[styles.listItem, { backgroundColor: colors.cardBackground }]}
                >
                  <View style={[styles.listIcon, { backgroundColor: `${colors.error}20` }]}>
                    <Text style={styles.listNumber}>{idx + 1}</Text>
                  </View>
                  <Text style={[styles.listText, { color: colors.text.secondary }]}>{risk}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Aksiyonlar */}
          {reportData && reportData.actions.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <CheckCircle size={20} color={colors.success} strokeWidth={2.5} />
                <Text style={[styles.sectionTitle, { color: colors.text.primary, marginLeft: 8 }]}>
                  Önerilen Aksiyonlar
                </Text>
              </View>
              {reportData.actions.map((action, idx) => (
                <View
                  key={`action-${idx}`}
                  style={[styles.listItem, { backgroundColor: colors.cardBackground }]}
                >
                  <View style={[styles.listIcon, { backgroundColor: `${colors.success}20` }]}>
                    <CheckCircle size={16} color={colors.success} strokeWidth={2.5} />
                  </View>
                  <Text style={[styles.listText, { color: colors.text.secondary }]}>{action}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Finansal Özet */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
              Finansal Özet
            </Text>
            <View style={[styles.metricsCard, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.metricRow}>
                <Text style={[styles.metricLabel, { color: colors.text.secondary }]}>
                  Toplam Varlıklar
                </Text>
                <Text style={[styles.metricValue, { color: colors.success }]}>
                  {currencySymbol}
                  {metrics.totalAssets.toFixed(2)}
                </Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricRow}>
                <Text style={[styles.metricLabel, { color: colors.text.secondary }]}>
                  Toplam Borçlar
                </Text>
                <Text style={[styles.metricValue, { color: colors.error }]}>
                  {currencySymbol}
                  {metrics.totalLiabilities.toFixed(2)}
                </Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricRow}>
                <Text style={[styles.metricLabel, { color: colors.text.secondary }]}>Net Değer</Text>
                <Text
                  style={[
                    styles.metricValue,
                    { color: metrics.netWorth >= 0 ? colors.success : colors.error },
                  ]}
                >
                  {currencySymbol}
                  {metrics.netWorth.toFixed(2)}
                </Text>
              </View>
              <View style={styles.metricDivider} />
              <View style={styles.metricRow}>
                <Text style={[styles.metricLabel, { color: colors.text.secondary }]}>
                  Güvenli Harcama
                </Text>
                <Text style={[styles.metricValue, { color: colors.purple.light }]}>
                  {currencySymbol}
                  {metrics.safeToSpend.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 4,
  },
  scoreInner: {
    flex: 1,
    borderRadius: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainScore: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  scoreLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  scoreInfo: {
    flex: 1,
    marginLeft: 20,
  },
  scoreBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  scoreBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scoreDescription: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  categoriesGrid: {
    gap: 12,
  },
  categoryCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '800',
  },
  scoreMax: {
    fontSize: 16,
    marginLeft: 4,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  categoryDesc: {
    fontSize: 13,
  },
  listItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  listIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  listText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  metricsCard: {
    padding: 20,
    borderRadius: 16,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  metricLabel: {
    fontSize: 14,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  metricDivider: {
    height: 1,
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
  },
});
