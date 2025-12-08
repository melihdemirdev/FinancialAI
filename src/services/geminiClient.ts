import { AI_CONFIG, CFO_ANALYSIS_PROMPT } from '../config/ai';
import type { Asset, Liability, Receivable, StrategicInstallment } from '../types';

export interface CfoAnalysisInput {
  totals: {
    assets: number;
    liabilities: number;
    receivables: number;
    installments: number;
    netWorth: number;
    safeToSpend: number;
  };
  ratios: {
    debtToAsset: number;
    liquidity: number;
    installmentBurden: number;
  };
  counts: {
    assetCount: number;
    liabilityCount: number;
    receivableCount: number;
    installmentCount: number;
  };
  sampleItems: {
    assets: Asset[];
    liabilities: Liability[];
    receivables: Receivable[];
    installments: StrategicInstallment[];
  };
  currencySymbol?: string;
}

export interface CfoAnalysisResult {
  summary: string;
  risks: string[];
  actions: string[];
  rawText: string;
}

const extractFirstText = (data: any): string | undefined => {
  return data?.candidates?.[0]?.content?.parts?.[0]?.text;
};

const parseCfoText = (text: string): CfoAnalysisResult => {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  let section: 'none' | 'risk' | 'action' = 'none';
  const risks: string[] = [];
  const actions: string[] = [];

  lines.forEach((line) => {
    const lower = line.toLowerCase();
    if (lower.startsWith('özet')) {
      section = 'none';
      return;
    }
    if (lower.startsWith('risk')) {
      section = 'risk';
      return;
    }
    if (lower.startsWith('aksiyon')) {
      section = 'action';
      return;
    }
    if (section === 'risk' && line.length > 0) {
      risks.push(line.replace(/^-+\s*/, '').trim());
    } else if (section === 'action' && line.length > 0) {
      actions.push(line.replace(/^-+\s*/, '').trim());
    }
  });

  const summary =
    lines.find((l) => l.toLowerCase().startsWith('özet')) || 'Özet bulunamadı.';

  const unique = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

  return {
    summary,
    risks: unique(risks),
    actions: unique(actions.filter((a) => !risks.includes(a))),
    rawText: text,
  };
};

export async function generateCfoAnalysis(input: CfoAnalysisInput): Promise<CfoAnalysisResult> {
  const apiKey = AI_CONFIG.gemini.apiKey;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    throw new Error('Gemini API anahtarı bulunamadı. .env içine EXPO_PUBLIC_GEMINI_API_KEY ekleyin.');
  }

  const prompt = [
    CFO_ANALYSIS_PROMPT,
    'Input JSON:',
    JSON.stringify(input, null, 2),
  ].join('\n');

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
  };

  const url = `${AI_CONFIG.gemini.endpoint}/models/${AI_CONFIG.gemini.model}:generateContent?key=${apiKey}`;
  console.log('Gemini URL:', url);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Hata detayı alınamadı');
    console.error(`Gemini Error (${res.status}):`, errorText);
    throw new Error(`Gemini isteği başarısız (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const text = extractFirstText(data)?.trim();
  if (!text) {
    throw new Error('Gemini yanıtı boş veya beklenen formatta değil.');
  }

  return parseCfoText(text);
}

export async function generateCfoAnalysisStream(
  input: CfoAnalysisInput,
  onToken: (partial: string) => void
): Promise<CfoAnalysisResult> {
  const apiKey = AI_CONFIG.gemini.apiKey;
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
    throw new Error('Gemini API anahtarı bulunamadı. .env içine EXPO_PUBLIC_GEMINI_API_KEY ekleyin.');
  }

  const prompt = [
    CFO_ANALYSIS_PROMPT,
    'Input JSON:',
    JSON.stringify(input, null, 2),
  ].join('\n');

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
  };

  const res = await fetch(
    `${AI_CONFIG.gemini.endpoint}/models/${AI_CONFIG.gemini.model}:streamGenerateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini isteği başarısız (${res.status}): ${text || 'bilinmeyen hata'}`);
  }

  if (!res.body || typeof (res.body as any).getReader !== 'function') {
    const fallback = await res.json();
    const text = extractFirstText(fallback)?.trim();
    if (!text) throw new Error('Gemini yanıtı boş veya beklenen formatta değil.');
    onToken(text);
    return parseCfoText(text);
  }

  const reader = (res.body as ReadableStream).getReader();
  const decoder = new TextDecoder();
  let accumulated = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(Boolean);
    for (const line of lines) {
      try {
        const json = JSON.parse(line);
        const piece = extractFirstText(json) || '';
        if (piece) {
          accumulated += piece;
          onToken(accumulated);
        }
      } catch (_err) {
        // ignore malformed line
      }
    }
  }

  if (!accumulated) {
    throw new Error('Gemini stream yanıtı alınamadı.');
  }

  return parseCfoText(accumulated);
}
