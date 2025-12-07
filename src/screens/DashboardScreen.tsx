import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFinanceStore } from '../store/useFinanceStore';
import { SummaryCard } from '../components/Dashboard/SummaryCard';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { gradients } from '../theme/colors';
import { Wallet, TrendingUp, TrendingDown, PieChart } from 'lucide-react-native';

export const DashboardScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const { colors } = useTheme();
  const { currencySymbol } = useCurrency(); // Get currency symbol from context

  const { getTotalAssets, getTotalLiabilities, getNetWorth, getSafeToSpend } = useFinanceStore();

  const totalAssets = getTotalAssets();
  const totalLiabilities = getTotalLiabilities();
  const netWorth = getNetWorth();
  const safeToSpend = getSafeToSpend();

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.purple.primary}
          />
        }
      >
        {/* Modern Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.greeting, { color: colors.text.tertiary }]}>
                Hoş Geldiniz 👋
              </Text>
              <Text style={[styles.title, { color: colors.text.primary }]}>
                Finansal Özet
              </Text>
            </View>
            <View style={[styles.headerIcon, { backgroundColor: 'rgba(147, 51, 234, 0.15)' }]}>
              <Wallet size={28} color={colors.purple.light} strokeWidth={2} />
            </View>
          </View>
        </View>

        {/* Hero Card - Safe to Spend */}
        <View style={styles.heroCardContainer}>
          <LinearGradient
            colors={gradients.purple}
            style={styles.heroCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroHeader}>
                <View style={styles.heroIconContainer}>
                  <Wallet size={24} color="rgba(255, 255, 255, 0.95)" strokeWidth={2.5} />
                </View>
                <Text style={styles.heroLabel}>Harcayabileceğiniz</Text>
              </View>
              <Text style={styles.heroValue}>
                {currencySymbol}{safeToSpend.toFixed(2)}
              </Text>
              <Text style={styles.heroSubtext}>
                Güvenli harcama limitiniz
              </Text>
            </View>

            {/* Decorative elements */}
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />
          </LinearGradient>
        </View>

        {/* Financial Overview Grid */}
        <View style={styles.overviewSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Finansal Durum
          </Text>

          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              <View style={[styles.miniCard, { backgroundColor: colors.cardBackground }]}>
                <View style={[styles.miniCardIcon, { backgroundColor: 'rgba(0, 255, 157, 0.15)' }]}>
                  <TrendingUp size={20} color={colors.success} strokeWidth={2.5} />
                </View>
                <Text style={[styles.miniCardLabel, { color: colors.text.secondary }]}>
                  Toplam Varlıklar
                </Text>
                <Text style={[styles.miniCardValue, { color: colors.success }]}>
                  {currencySymbol}{totalAssets.toFixed(2)}
                </Text>
              </View>

              <View style={[styles.miniCard, { backgroundColor: colors.cardBackground }]}>
                <View style={[styles.miniCardIcon, { backgroundColor: 'rgba(255, 71, 87, 0.15)' }]}>
                  <TrendingDown size={20} color={colors.error} strokeWidth={2.5} />
                </View>
                <Text style={[styles.miniCardLabel, { color: colors.text.secondary }]}>
                  Toplam Borçlar
                </Text>
                <Text style={[styles.miniCardValue, { color: colors.error }]}>
                  {currencySymbol}{totalLiabilities.toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={[styles.netWorthCard, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.netWorthHeader}>
                <View style={[styles.miniCardIcon, { backgroundColor: 'rgba(147, 51, 234, 0.15)' }]}>
                  <PieChart size={20} color={colors.purple.light} strokeWidth={2.5} />
                </View>
                <Text style={[styles.miniCardLabel, { color: colors.text.secondary }]}>
                  Net Değeriniz
                </Text>
              </View>
              <Text style={[
                styles.netWorthValue,
                { color: netWorth >= 0 ? colors.success : colors.error }
              ]}>
                {currencySymbol}{netWorth.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Analytics Section */}
        <View style={styles.analyticsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            Finansal Analiz
          </Text>

          <View style={styles.analyticsGrid}>
            <View style={[styles.analyticsCard, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.analyticsHeader}>
                <Text style={[styles.analyticsLabel, { color: colors.text.secondary }]}>
                  Varlık/Borç Oranı
                </Text>
                <View style={styles.analyticsBadge}>
                  <Text style={[styles.analyticsBadgeText, { color: colors.purple.light }]}>
                    {totalLiabilities > 0 ? 'Oran' : 'İdeal'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.analyticsValue, { color: colors.purple.light }]}>
                {totalLiabilities > 0
                  ? (totalAssets / totalLiabilities).toFixed(2)
                  : '∞'}
              </Text>
              <View style={[styles.analyticsBar, { backgroundColor: 'rgba(147, 51, 234, 0.2)' }]}>
                <View
                  style={[
                    styles.analyticsBarFill,
                    {
                      backgroundColor: colors.purple.primary,
                      width: totalLiabilities > 0
                        ? `${Math.min((totalAssets / totalLiabilities) * 20, 100)}%`
                        : '100%'
                    }
                  ]}
                />
              </View>
            </View>

            <View style={[styles.analyticsCard, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.analyticsHeader}>
                <Text style={[styles.analyticsLabel, { color: colors.text.secondary }]}>
                  Borçlanma Oranı
                </Text>
                <View style={styles.analyticsBadge}>
                  <Text style={[styles.analyticsBadgeText, { color: colors.accent.cyan }]}>
                    Yüzde
                  </Text>
                </View>
              </View>
              <Text style={[styles.analyticsValue, { color: colors.accent.cyan }]}>
                {totalAssets > 0
                  ? `${((totalLiabilities / totalAssets) * 100).toFixed(1)}%`
                  : '0%'}
              </Text>
              <View style={[styles.analyticsBar, { backgroundColor: 'rgba(6, 182, 212, 0.2)' }]}>
                <View
                  style={[
                    styles.analyticsBarFill,
                    {
                      backgroundColor: colors.accent.cyan,
                      width: totalAssets > 0
                        ? `${Math.min((totalLiabilities / totalAssets) * 100, 100)}%`
                        : '0%'
                    }
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },

  // Header Styles
  header: {
    marginBottom: 32,
    paddingTop: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 15,
    marginBottom: 8,
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

  // Hero Card Styles
  heroCardContainer: {
    marginBottom: 28,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  heroCard: {
    padding: 32,
    minHeight: 200,
    position: 'relative',
    overflow: 'hidden',
  },
  heroContent: {
    zIndex: 10,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  heroIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  heroLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  heroValue: {
    fontSize: 56,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    letterSpacing: -1,
  },
  heroSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    letterSpacing: 0.3,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -50,
    right: -50,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    bottom: -30,
    left: -30,
  },

  // Overview Section
  overviewSection: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  gridContainer: {
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  // Mini Cards
  miniCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  miniCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  miniCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  miniCardValue: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },

  // Net Worth Card
  netWorthCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  netWorthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  netWorthValue: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },

  // Analytics Section
  analyticsSection: {
    marginBottom: 20,
  },
  analyticsGrid: {
    gap: 16,
  },
  analyticsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  analyticsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  analyticsLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  analyticsBadge: {
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  analyticsBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  analyticsValue: {
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  analyticsBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  analyticsBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});
