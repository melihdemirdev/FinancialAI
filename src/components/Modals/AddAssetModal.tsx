import React, { useState } from 'react';
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
import { X, Wallet, TrendingUp, Check } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { gradients } from '../../theme/colors';

interface AddAssetModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (asset: {
    type: 'liquid' | 'term' | 'gold_currency' | 'funds';
    name: string;
    value: number;
    currency: string;
    details?: string;
  }) => void;
}

export const AddAssetModal: React.FC<AddAssetModalProps> = ({ visible, onClose, onAdd }) => {
  const { colors } = useTheme();
  const [type, setType] = useState<'liquid' | 'term' | 'gold_currency' | 'funds'>('liquid');
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [currency, setCurrency] = useState('TRY');
  const [details, setDetails] = useState('');

  const assetTypes = [
    { id: 'liquid', label: 'Likit (Nakit)' },
    { id: 'term', label: 'Vadeli' },
    { id: 'gold_currency', label: 'Altın/Döviz' },
    { id: 'funds', label: 'Fonlar' },
  ] as const;

  const handleAdd = () => {
    if (!name.trim() || !value.trim()) {
      return;
    }

    onAdd({
      type,
      name: name.trim(),
      value: parseFloat(value) || 0,
      currency,
      details: details.trim() || undefined,
    });

    // Reset form
    setType('liquid');
    setName('');
    setValue('');
    setCurrency('TRY');
    setDetails('');
    onClose();
  };

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
              colors={['#22c55e', '#10b981']}
              style={styles.headerGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.headerContent}>
                <View style={styles.headerIcon}>
                  <TrendingUp size={28} color="#FFFFFF" strokeWidth={2.5} />
                </View>
                <Text style={styles.modalTitle}>Yeni Varlık Ekle</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#FFFFFF" strokeWidth={2.5} />
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Asset Type */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text.primary }]}>Varlık Tipi</Text>
              <View style={styles.typeContainer}>
                {assetTypes.map((assetType) => (
                  <TouchableOpacity
                    key={assetType.id}
                    style={[
                      styles.typeButton,
                      {
                        backgroundColor: type === assetType.id ? 'rgba(34, 197, 94, 0.15)' : colors.background,
                        borderColor: type === assetType.id ? '#22c55e' : colors.border.secondary,
                      },
                    ]}
                    onPress={() => setType(assetType.id)}
                  >
                    {type === assetType.id && (
                      <View style={styles.checkIcon}>
                        <Check size={16} color="#22c55e" strokeWidth={3} />
                      </View>
                    )}
                    <Text
                      style={[
                        styles.typeButtonText,
                        { color: type === assetType.id ? '#22c55e' : colors.text.primary },
                      ]}
                    >
                      {assetType.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Name */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text.primary }]}>İsim</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
                <Wallet size={20} color={colors.text.tertiary} strokeWidth={2} />
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Örn: Banka Hesabı"
                  placeholderTextColor={colors.text.tertiary}
                />
              </View>
            </View>

            {/* Amount */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.text.primary }]}>Tutar</Text>
              <View style={[styles.inputContainer, { backgroundColor: colors.background }]}>
                <Text style={[styles.currencyPrefix, { color: colors.text.tertiary }]}>₺</Text>
                <TextInput
                  style={[styles.input, { color: colors.text.primary }]}
                  value={value}
                  onChangeText={setValue}
                  placeholder="0.00"
                  placeholderTextColor={colors.text.tertiary}
                  keyboardType="decimal-pad"
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

          {/* Add Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAdd}
              disabled={!name.trim() || !value.trim()}
            >
              <LinearGradient
                colors={!name.trim() || !value.trim() ? ['#666', '#666'] : ['#22c55e', '#10b981']}
                style={styles.addButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.addButtonText}>Varlık Ekle</Text>
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

  // Type Selection
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    marginRight: 6,
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.1,
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
  addButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  addButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
});
