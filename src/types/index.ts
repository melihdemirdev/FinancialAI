// Assets: Likit (Nakit), Vadeli, Altın/Döviz, Fonlar
export interface Asset {
  id: string;
  type: 'liquid' | 'term' | 'gold_currency' | 'funds';
  name: string;
  value: number;
  currency: string;
  details?: string;
}

// Liabilities: Kredi Kartı (Toplam Limit, Güncel Borç, Kesim Tarihi), Şahıs Borçları
export interface Liability {
  id: string;
  type: 'credit_card' | 'personal_debt';
  name: string;
  totalLimit?: number;
  currentDebt: number;
  dueDate?: string;
  debtorName?: string;
  details?: string;
}

// Receivables (Alacaklar): Kimden, Tutar, Vade Tarihi
export interface Receivable {
  id: string;
  debtor: string;
  amount: number;
  dueDate: string;
  details?: string;
}

// StrategicInstallments: Taksit tutarı, Bitiş tarihi, Kalan ay
export interface StrategicInstallment {
  id: string;
  installmentAmount: number;
  endDate: string;
  remainingMonths: number;
  name?: string;
  details?: string;
}