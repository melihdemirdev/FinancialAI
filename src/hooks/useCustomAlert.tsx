import { useState } from 'react';
import { CustomAlert } from '../components/CustomAlert';
import React from 'react';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

interface AlertConfig {
  title: string;
  message: string;
  buttons: AlertButton[];
  type?: 'info' | 'success' | 'error' | 'warning';
}

export const useCustomAlert = () => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);

  const showAlert = (
    title: string,
    message: string,
    buttons: AlertButton[] = [{ text: 'Tamam' }],
    type: 'info' | 'success' | 'error' | 'warning' = 'info'
  ) => {
    // Auto-close alert when button is pressed
    const wrappedButtons = buttons.map((button) => ({
      ...button,
      onPress: () => {
        button.onPress?.();
        setAlertConfig(null);
      },
    }));

    setAlertConfig({
      title,
      message,
      buttons: wrappedButtons,
      type,
    });
  };

  const AlertComponent = alertConfig ? (
    <CustomAlert
      visible={!!alertConfig}
      title={alertConfig.title}
      message={alertConfig.message}
      buttons={alertConfig.buttons}
      type={alertConfig.type}
    />
  ) : null;

  return { showAlert, AlertComponent };
};
