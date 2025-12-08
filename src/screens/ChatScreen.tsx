import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Send, Bot, Trash2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useCurrency } from '../context/CurrencyContext';
import { useFinanceStore } from '../store/useFinanceStore';
import { aiChatService, ChatMessage, FinancialContext } from '../services/aiChatService';

export const ChatScreen = () => {
  const { colors } = useTheme();
  const { currencySymbol } = useCurrency();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    getTotalAssets,
    getTotalLiabilities,
    getNetWorth,
    getSafeToSpend,
    receivables,
    installments,
  } = useFinanceStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    // İlk karşılama mesajı
    const welcomeMsg: ChatMessage = {
      id: '0',
      role: 'assistant',
      content: `Merhaba! Ben senin AI finansal danışmanınım 💰\n\nFinansal durumunu analiz edip sorularına yanıt verebilirim. Mesela:\n\n"iPhone alsam sorun olur mu?"\n"Tatile ne kadar harcayabilirim?"\n"Acil durum fonu nasıl oluştururum?"\n\nNe öğrenmek istersin?`,
      timestamp: Date.now(),
    };
    setMessages([welcomeMsg]);

    // Klavye listener'ları
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const buildContext = (): FinancialContext => {
    const totalReceivables = receivables.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
    const totalInstallments = installments.reduce(
      (sum, i) => sum + (Number(i.installmentAmount) || 0),
      0
    );

    return {
      totalAssets: getTotalAssets(),
      totalLiabilities: getTotalLiabilities(),
      netWorth: getNetWorth(),
      safeToSpend: getSafeToSpend(),
      totalReceivables,
      totalInstallments,
      currencySymbol,
    };
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setStreamingMessage('');

    try {
      const context = buildContext();
      let fullResponse = '';

      await aiChatService.sendMessage(userMessage.content, context, (chunk) => {
        fullResponse += chunk;
        setStreamingMessage(fullResponse);
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullResponse,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingMessage('');
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Üzgünüm, bir hata oluştu: ${error.message || 'Bilinmeyen hata'}`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleClearChat = () => {
    aiChatService.clearHistory();
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content: `Chat temizlendi! Yeni bir konuşma başlatalım. Ne öğrenmek istersin?`,
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.botIcon, { backgroundColor: colors.purple.primary }]}>
            <Bot size={24} color="#FFFFFF" strokeWidth={2.5} />
          </View>
          <View>
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
              AI Finansal Danışman
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.text.tertiary }]}>
              Gemini Destekli
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleClearChat} style={styles.clearButton}>
          <Trash2 size={20} color={colors.text.secondary} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={[styles.messagesContent, { paddingBottom: 80 }]}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userBubble : styles.assistantBubble,
              message.role === 'user'
                ? { backgroundColor: colors.purple.primary }
                : { backgroundColor: colors.cardBackground },
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.role === 'user'
                  ? { color: '#FFFFFF' }
                  : { color: colors.text.primary },
              ]}
            >
              {message.content}
            </Text>
            <Text
              style={[
                styles.messageTime,
                message.role === 'user'
                  ? { color: 'rgba(255, 255, 255, 0.7)' }
                  : { color: colors.text.tertiary },
              ]}
            >
              {new Date(message.timestamp).toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        ))}

        {/* Streaming mesaj */}
        {streamingMessage && (
          <View style={[styles.messageBubble, styles.assistantBubble, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.messageText, { color: colors.text.primary }]}>
              {streamingMessage}
            </Text>
          </View>
        )}

        {/* Loading */}
        {isLoading && !streamingMessage && (
          <View style={[styles.messageBubble, styles.assistantBubble, { backgroundColor: colors.cardBackground }]}>
            <ActivityIndicator size="small" color={colors.purple.primary} />
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={[
        styles.inputContainer,
        {
          backgroundColor: colors.cardBackground,
          paddingBottom: insets.bottom + 4,
          marginBottom: keyboardHeight > 0 ? keyboardHeight + 10 : 35
        }
      ]}>
        <TextInput
          style={[styles.input, { color: colors.text.primary, backgroundColor: colors.background }]}
          placeholder="Mesajını yaz..."
          placeholderTextColor={colors.text.tertiary}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
          editable={!isLoading}
        />
        <TouchableOpacity
          onPress={handleSend}
          style={[
            styles.sendButton,
            { backgroundColor: inputText.trim() && !isLoading ? colors.purple.primary : colors.text.tertiary + '40' },
          ]}
          disabled={!inputText.trim() || isLoading}
        >
          <Send size={20} color="#FFFFFF" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  botIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  clearButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 100,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
