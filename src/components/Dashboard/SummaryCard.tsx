import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

interface SummaryCardProps {
  title: string;
  value: number;
  isPrimary?: boolean;
  isAsset?: boolean;
  isLiability?: boolean;
  currencySymbol?: string; // Add currency symbol prop
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  isPrimary = false,
  isAsset = false,
  isLiability = false,
  currencySymbol = '$' // Default to $ if not provided
}) => {
  const { colors } = useTheme();

  const getValueColor = () => {
    if (isAsset) return colors.success;
    if (isLiability) return colors.error;
    if (isPrimary) return colors.purple.light;
    return colors.text.primary;
  };

  const getBackgroundStyle = () => {
    if (isAsset) {
      return {
        backgroundColor: 'rgba(0, 255, 157, 0.08)',
        borderLeftColor: colors.success,
      };
    } else if (isLiability) {
      return {
        backgroundColor: 'rgba(255, 71, 87, 0.08)',
        borderLeftColor: colors.error,
      };
    } else if (isPrimary) {
      return {
        backgroundColor: 'rgba(147, 51, 234, 0.08)',
        borderLeftColor: colors.purple.primary,
      };
    }
    return {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderLeftColor: colors.border.secondary,
    };
  };

  const getIcon = () => {
    if (isAsset) {
      return (
        <View style={[styles.icon, { backgroundColor: 'rgba(0, 255, 157, 0.15)' }]}>
          <TrendingUp size={18} color={colors.success} strokeWidth={2.5} />
        </View>
      );
    } else if (isLiability) {
      return (
        <View style={[styles.icon, { backgroundColor: 'rgba(255, 71, 87, 0.15)' }]}>
          <TrendingDown size={18} color={colors.error} strokeWidth={2.5} />
        </View>
      );
    } else if (isPrimary) {
      return (
        <View style={[styles.icon, { backgroundColor: 'rgba(147, 51, 234, 0.15)' }]}>
          <Wallet size={18} color={colors.purple.light} strokeWidth={2.5} />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={[styles.card, getBackgroundStyle(), styles.cardBorder, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardLabel, { color: colors.text.secondary }]}>{title}</Text>
        {getIcon()}
      </View>
      <Text style={[styles.cardValue, { color: getValueColor() }]}>
        {currencySymbol}{value.toFixed(2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardBorder: {
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    flex: 1,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 2,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  iconText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});