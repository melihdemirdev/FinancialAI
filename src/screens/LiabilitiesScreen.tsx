import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MoreVertical, Edit, Trash2, TrendingDown, CreditCard, Plus } from 'lucide-react-native';
import { useFinanceStore } from '../store/useFinanceStore';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { gradients } from '../theme/colors';
import { AddLiabilityModal } from '../components/Modals/AddLiabilityModal';
import { EditLiabilityModal } from '../components/Modals/EditLiabilityModal';

export const LiabilitiesScreen = () => {
  const { colors } = useTheme();
  const { currencySymbol } = useCurrency(); // Get currency symbol from context
  const { liabilities, getTotalLiabilities, addLiability, updateLiability, removeLiability } = useFinanceStore();
  const totalLiabilities = getTotalLiabilities();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedLiability, setSelectedLiability] = useState(null);
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const liabilityTypeLabels = {
    credit_card: 'Kredi Kartı',
    personal_debt: 'Şahıs Borcu',
  };

  const handleEditLiability = (liability) => {
    setSelectedLiability(liability);
    setEditModalVisible(true);
    setOptionsModalVisible(false);
  };

  const handleDeleteLiability = (id) => {
    removeLiability(id);
    setOptionsModalVisible(false);
  };

  const handleLiabilityPress = (liability) => {
    setSelectedItem(liability);
    setOptionsModalVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Modern Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.subtitle, { color: colors.text.tertiary }]}>
              Toplam Borç
            </Text>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              Borçlarım
            </Text>
          </View>
          <View style={[styles.headerIcon, { backgroundColor: 'rgba(255, 71, 87, 0.15)' }]}>
            <CreditCard size={28} color={colors.error} strokeWidth={2} />
          </View>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCardContainer}>
          <LinearGradient
            colors={['#ff4757', '#ff6348']}
            style={styles.heroCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroIconContainer}>
                <TrendingDown size={24} color="rgba(255, 255, 255, 0.95)" strokeWidth={2.5} />
              </View>
              <View>
                <Text style={styles.heroLabel}>Toplam Borç</Text>
                <Text style={styles.heroValue}>
                  {currencySymbol}{totalLiabilities.toFixed(2)}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>

      <FlatList
        data={liabilities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.cardHeader}>
              <View style={styles.cardLeft}>
                <View style={[styles.iconCircle, { backgroundColor: 'rgba(255, 71, 87, 0.15)' }]}>
                  <CreditCard size={20} color={colors.error} strokeWidth={2.5} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
                    {item.name}
                  </Text>
                  <View style={styles.typeTag}>
                    <Text style={[styles.typeText, { color: colors.error }]}>
                      {liabilityTypeLabels[item.type as keyof typeof liabilityTypeLabels]}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.optionsButton}
                onPress={() => handleLiabilityPress(item)}
              >
                <MoreVertical size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.cardBottom}>
              <Text style={[styles.cardValue, { color: colors.error }]}>
                {currencySymbol}{item.currentDebt.toFixed(2)}
              </Text>

              {item.type === 'credit_card' && item.totalLimit && (
                <View style={[styles.creditInfo, { borderTopColor: colors.border.secondary }]}>
                  <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Toplam Limit</Text>
                  <Text style={[styles.infoValue, { color: colors.text.primary }]}>{currencySymbol}{item.totalLimit.toFixed(2)}</Text>
                </View>
              )}

              {item.dueDate && (
                <View style={[styles.creditInfo, { borderTopColor: colors.border.secondary }]}>
                  <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Kesim Tarihi</Text>
                  <Text style={[styles.infoValue, { color: colors.text.primary }]}>{item.dueDate}</Text>
                </View>
              )}

              {item.debtorName && (
                <View style={[styles.creditInfo, { borderTopColor: colors.border.secondary }]}>
                  <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>Borç Veren</Text>
                  <Text style={[styles.infoValue, { color: colors.text.primary }]}>{item.debtorName}</Text>
                </View>
              )}

              {item.details && (
                <Text style={[styles.cardDetails, { color: colors.text.secondary }]}>{item.details}</Text>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIcon, { backgroundColor: 'rgba(255, 71, 87, 0.1)' }]}>
              <CreditCard size={48} color={colors.error} strokeWidth={1.5} />
            </View>
            <Text style={[styles.emptyText, { color: colors.text.primary }]}>
              Henüz borç eklenmemiş
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.text.tertiary }]}>
              Borçlarınızı eklemek için + butonuna tıklayın
            </Text>
          </View>
        }
      />

      {/* Options Modal */}
      <Modal
        visible={optionsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setOptionsModalVisible(false)}
        >
          <View style={[styles.optionsModal, { backgroundColor: colors.cardBackground }]}>
            <TouchableOpacity
              style={[styles.optionButton, { borderBottomColor: colors.border.secondary }]}
              onPress={() => handleEditLiability(selectedItem)}
            >
              <Edit size={22} color={colors.text.primary} strokeWidth={2} />
              <Text style={[styles.optionText, { color: colors.text.primary }]}>Düzenle</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, styles.deleteOption]}
              onPress={() => handleDeleteLiability(selectedItem.id)}
            >
              <Trash2 size={22} color={colors.error} strokeWidth={2} />
              <Text style={[styles.optionText, { color: colors.error }]}>Sil</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* FAB Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setAddModalVisible(true)}
      >
        <LinearGradient
          colors={['#ff4757', '#ff6348']}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Plus size={28} color="#FFFFFF" strokeWidth={3} />
        </LinearGradient>
      </TouchableOpacity>

      <AddLiabilityModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAdd={(liability) => addLiability(liability)}
      />

      <EditLiabilityModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        liability={selectedLiability}
        onUpdate={(id, updatedLiability) => {
          updateLiability(id, updatedLiability);
          setSelectedLiability(null);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Header Styles
  header: {
    padding: 24,
    paddingTop: 60,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 4,
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
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  // Hero Card
  heroCardContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  heroCard: {
    padding: 24,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  heroLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
    fontWeight: '600',
  },
  heroValue: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },

  // List
  list: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 100,
  },

  // Card Styles
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  typeTag: {
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  typeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  cardBottom: {
    paddingLeft: 60,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  creditInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  cardDetails: {
    fontSize: 13,
    marginTop: 8,
  },
  optionsButton: {
    padding: 8,
    marginLeft: 8,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsModal: {
    width: 280,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  deleteOption: {
    borderBottomWidth: 0,
  },
  optionText: {
    marginLeft: 16,
    fontSize: 17,
    fontWeight: '600',
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 40,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 24,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  fabGradient: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
