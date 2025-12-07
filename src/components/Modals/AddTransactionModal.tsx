import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface AddTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (name: string, amount: number, type: 'asset' | 'liability') => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  visible,
  onClose,
  onAdd
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'asset' | 'liability'>('asset');

  const handleSubmit = () => {
    if (!name.trim() || !amount.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    onAdd(name.trim(), numericAmount, type);
    setName('');
    setAmount('');
    setType('asset');
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Transaction</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>×</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Transaction name"
              placeholderTextColor="#888"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Amount"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleOption, type === 'asset' && styles.activeToggleOption]}
                onPress={() => setType('asset')}
              >
                <View style={styles.toggleIcon}>
                  <Text style={[
                    styles.toggleIconText,
                    type === 'asset' ? { color: '#000' } : { color: '#00ff9d' }
                  ]}>💰</Text>
                </View>
                <Text
                  style={[
                    styles.toggleText,
                    type === 'asset' ? styles.activeToggleText : { color: '#00ff9d' }
                  ]}
                >
                  Asset
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.toggleOption, type === 'liability' && styles.activeToggleOption]}
                onPress={() => setType('liability')}
              >
                <View style={styles.toggleIcon}>
                  <Text style={[
                    styles.toggleIconText,
                    type === 'liability' ? { color: '#000' } : { color: '#ff4757' }
                  ]}>💳</Text>
                </View>
                <Text
                  style={[
                    styles.toggleText,
                    type === 'liability' ? styles.activeToggleText : { color: '#ff4757' }
                  ]}
                >
                  Liability
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
              <Text style={styles.addButtonText}>Add Transaction</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    width: '100%',
  },
  modalContent: {
    width: Dimensions.get('window').width - 40,
    backgroundColor: '#0f0f0f',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    overflow: 'hidden',
  },
  toggleOption: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1a1a1a',
  },
  activeToggleOption: {
    backgroundColor: '#00ff9d',
  },
  toggleText: {
    fontSize: 16,
    color: '#00ff9d',
  },
  activeToggleText: {
    color: '#000',
    fontWeight: 'bold',
  },
  toggleIcon: {
    marginRight: 5,
  },
  toggleIconText: {
    fontSize: 20,
  },
  addButton: {
    backgroundColor: '#00ff9d',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});