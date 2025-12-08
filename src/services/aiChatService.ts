import { AI_CONFIG } from '../config/ai';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface FinancialContext {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  safeToSpend: number;
  totalReceivables: number;
  totalInstallments: number;
  currencySymbol: string;
}

export class AIChatService {
  private apiKey: string;
  private endpoint: string;
  private conversationHistory: ChatMessage[] = [];

  constructor() {
    this.apiKey = AI_CONFIG.gemini.apiKey;
    this.endpoint = AI_CONFIG.gemini.endpoint;
  }

  private buildSystemPrompt(context: FinancialContext): string {
    return `Sen finansal danışmansın. Kısa ve net tavsiyelerde bulun.

FİNANSAL DURUM:
Varlık: ${context.currencySymbol}${context.totalAssets.toFixed(0)} | Borç: ${context.currencySymbol}${context.totalLiabilities.toFixed(0)} | Net: ${context.currencySymbol}${context.netWorth.toFixed(0)}
Güvenli Limit: ${context.currencySymbol}${context.safeToSpend.toFixed(0)} | Alacak: ${context.currencySymbol}${context.totalReceivables.toFixed(0)} | Taksit: ${context.currencySymbol}${context.totalInstallments.toFixed(0)}

KURALLAR:
- Türkçe, samimi, max 100 kelime
- Rakamlarla örnekle
- Risk varsa söyle
- Net cevap ver`;
  }

  async sendMessage(
    userMessage: string,
    context: FinancialContext,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Gemini API anahtarı yapılandırılmamış.');
    }

    // Kullanıcı mesajını ekle
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    };
    this.conversationHistory.push(userMsg);

    // Gemini API'ye gönderilecek içeriği hazırla
    const contents = [
      {
        role: 'user',
        parts: [{ text: this.buildSystemPrompt(context) }],
      },
      ...this.conversationHistory.slice(-4).map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })),
    ];

    const modelsToTry = [AI_CONFIG.gemini.model, ...(AI_CONFIG.gemini.fallbackModels || [])];

    for (let i = 0; i < modelsToTry.length; i++) {
      const model = modelsToTry[i];

      try {
        // React Native'de streaming çalışmıyor, normal endpoint kullan
        const url = `${this.endpoint}/models/${model}:generateContent?key=${this.apiKey}`;

        const requestBody = {
          contents,
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE',
            },
          ],
        };

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        // Non-streaming endpoint kullanıyoruz, direkt JSON al
        const data = await response.json();

        if (!data.candidates || !data.candidates[0]) {
          console.error('Unexpected API response:', JSON.stringify(data, null, 2));
          throw new Error('API yanıtı beklenmeyen formatta');
        }

        const candidate = data.candidates[0];
        const finishReason = candidate.finishReason || 'STOP';

        // Yan?t STOP de?ilse (MAX_TOKENS, SAFETY vb.) k?smi i?erik g?stermeden fallback/hata
        if (finishReason !== 'STOP') {
          console.warn('Finish reason:', finishReason, 'Prompt feedback:', data?.promptFeedback);
          const blockReason =
            data?.promptFeedback?.blockReason || candidate?.safetyFeedback?.[0]?.blockReason;
          const reasonText =
            finishReason === 'MAX_TOKENS'
              ? 'Token limiti doldu, yan?t kesildi.'
              : blockReason === 'SAFETY'
              ? 'G?venlik filtresi yan?t? kesti.'
              : 'Yan?t tamamlanamad?.';

          if (i < modelsToTry.length - 1) {
            console.log(`Finish reason ${finishReason}, sonraki modeli deniyorum...`);
            continue;
          }

          throw new Error(`${reasonText} Mesaj? k?salt?p tekrar dener misin?`);
        }

        // T?m parts'lar? birle?tir
        if (!candidate.content?.parts || candidate.content.parts.length === 0) {
          console.error('No parts in response:', JSON.stringify(data, null, 2));
          throw new Error('API yan?t?nda metin yok');
        }

        const fullContent = candidate.content.parts
          .map((part: any) => part.text || '')
          .join('');

        if (!fullContent.trim()) {
          console.error('Empty content from API:', JSON.stringify(data, null, 2));
          throw new Error('API bo? yan?t d?nd?');
        }

        // Direkt t?m yan?t? g?ster (streaming efekti yok)
        onChunk(fullContent);

        const assistantMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: fullContent.trim(),
          timestamp: Date.now(),
        };
        this.conversationHistory.push(assistantMsg);

        return fullContent.trim();

      } catch (error: any) {
        console.error(`Chat error with ${model}:`, error);

        if (
          (error.message?.includes('503') || error.message?.includes('overloaded')) &&
          i < modelsToTry.length - 1
        ) {
          console.log(`Model ${model} overloaded, trying next model...`);
          continue;
        }

        throw error;
      }
    }

    throw new Error('All models failed');
  }

  clearHistory() {
    this.conversationHistory = [];
  }

  getHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  isConfigured(): boolean {
    return this.apiKey !== 'YOUR_GEMINI_API_KEY_HERE' && this.apiKey.length > 0;
  }
}

export const aiChatService = new AIChatService();
