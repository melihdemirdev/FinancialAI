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
  totalLimit?: number; // For credit cards
  currentDebt: number;
  dueDate?: string; // For credit cards (kesim tarihi)
  debtorName?: string; // For personal debts
  details?: string;
}

// Receivables (Alacaklar): Kimden, Tutar, Vade Tarihi (Örn: Annemin Kocası)
export interface Receivable {
  id: string;
  debtor: string; // Kimden
  amount: number; // Tutar
  dueDate: string; // Vade Tarihi
  details?: string;
}

// StrategicInstallments: Taksit tutarı, Bitiş tarihi, Kalan ay
export interface StrategicInstallment {
  id: string;
  installmentAmount: number; // Taksit tutarı
  endDate: string; // Bitiş tarihi
  remainingMonths: number; // Kalan ay
  name?: string;
  details?: string;
}