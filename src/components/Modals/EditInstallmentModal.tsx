import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Calendar, TrendingDown, Clock, DollarSign } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useCurrency } from '../../context/CurrencyContext';
import { gradients } from '../../theme/colors';
import { StrategicInstallment } from '../../types';

interface EditInstallmentModalProps {
  visible: boolean;
  onClose: () => void;
  installment: StrategicInstallment | null;
  onUpdate: (id: string, updatedInstallment: Partial<StrategicInstallment>) => void;
}

export const EditInstallmentModal: React.FC<EditInstallmentModalProps> = ({ visible, onClose, installment, onUpdate }) => {
  const { colors } = useTheme();
  const { currencySymbol } = useCurrency();
  const [name, setName] = useState('');
  const [installmentAmount, setInstallmentAmount] = useState('');
  const [endDate, setEndDate] = useState('');
  const [remainingMonths, setRemainingMonths] = useState('');
  const [details, setDetails] = useState('');

  // Populate form when installment changes
  useEffect(() => {
    if (installment) {
      setName(installment.name || '');
      setInstallmentAmount(installment.installmentAmount.toString());
      setEndDate(installment.endDate);
      setRemainingMonths(installment.remainingMonths.toString());
      setDetails(installment.details || '');
    } else {
      resetForm();
    }
  }, [installment]);

  const resetForm = () => {
    setName('');
    setInstallmentAmount('');
    setEndDate('');
    setRemainingMonths('');
    setDetails('');
  };

  const handleUpdate = () => {
    if (!installment || !installmentAmount.trim() || !endDate.trim() || !remainingMonths.trim()) {
      return;
    }

    onUpdate(installment.id, {
      name: name.trim() || undefined,
      installmentAmount: parseFloat(installmentAmount) || 0,
      endDate: endDate.trim(),
      remainingMonths: parseInt(remainingMonths) || 0,
      details: details.trim() || undefined,
    });

    resetForm();
    onClose();
  };

  if (!installment) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <LinearGradient
              colors={['#EC4899', '#A855F7']}
              style={styles.headerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.headerContent}>
                <View style={styles.headerIcon}>
                  <TrendingDown size={28} color="#FFFFFF" strokeWidth={2.5} />
                </View>
                <Text style={styles.modalTitle}>Taksit Düzenle</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#FFFFFF" strokeWidth={2.5} />
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Name */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text.primary }]}>İsim (Opsiyonel)</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
                <DollarSign size={20} color={colors.text.tertiary} strokeWidth={2} />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Örn: Telefon Taksiti"
                  placeholderTextColor={colors.text.tertiary}
                />
              </View>
            </View>

            {/* Installment Amount */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text.primary }]}>Aylık Taksit Tutarı</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
                <Text style={[styles.currencyPrefix, { color: colors.text.tertiary }]}>{currencySymbol}</Text>
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  value={installmentAmount}
                  onChangeText={setInstallmentAmount}
                  placeholder="0.00"
                  placeholderTextColor={colors.text.tertiary}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Remaining Months */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text.primary }]}>Kalan Ay</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
                <Clock size={20} color={colors.text.tertiary} strokeWidth={2} />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  value={remainingMonths}
                  onChangeText={setRemainingMonths}
                  placeholder="Örn: 12"
                  placeholderTextColor={colors.text.tertiary}
                  keyboardType="number-pad"
                />
              </View>
            </View>

            {/* End Date */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text.primary }]}>Bitiş Tarihi</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
                <Calendar size={20} color={colors.text.tertiary} strokeWidth={2} />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="Örn: 15/12/2025"
                  placeholderTextColor={colors.text.tertiary}
                />
              </View>
            </View>

            {/* Details */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text.primary }]}>Detaylar (Opsiyonel)</Text>
              <View style={[styles.inputContainer, styles.textAreaContainer, { backgroundColor: colors.background }]}>
                <TextInput
                  style={[styles.input, styles.textArea, { color: colors.text.primary }]}
                  value={details}
                  onChangeText={setDetails}
                  placeholder="Ek bilgiler..."
                  placeholderTextColor={colors.text.tertiary}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
          </ScrollView>

          {/* Update Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdate}
              disabled={!installmentAmount.trim() || !endDate.trim() || !remainingMonths.trim()}
            >
              <LinearGradient
                colors={!installmentAmount.trim() || !endDate.trim() || !remainingMonths.trim() ? ['#666', '#666'] : ['#EC4899', '#A855F7']}
                style={styles.updateButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.updateButtonText}>Güncelle</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: '92%',
    overflow: 'hidden',
  },

  // Header Styles
  headerContainer: {
    overflow: 'hidden',
  },
  headerGradient: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Form Styles
  form: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.2,
  },

  // Input Styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    fontWeight: '600',
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '700',
  },
  textAreaContainer: {
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 0,
  },

  // Button Styles
  buttonContainer: {
    padding: 24,
    paddingBottom: 32,
  },
  updateButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  updateButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
});
