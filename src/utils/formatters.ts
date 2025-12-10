/**
 * Sayıları Türkçe formatında biçimlendirir
 * Binlikler için nokta (.), ondalıklar için virgül (,) kullanır
 *
 * @param num - Formatlanacak sayı
 * @param decimals - Ondalık basamak sayısı (varsayılan: 2)
 * @returns Formatlanmış sayı string olarak
 *
 * @example
 * formatNumber(1000.323, 3) // "1.000,323"
 * formatNumber(1234567.89, 2) // "1.234.567,89"
 */
export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toLocaleString('tr-TR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Para birimi sembolü ile birlikte sayıyı formatlar
 *
 * @param num - Formatlanacak sayı
 * @param currencySymbol - Para birimi sembolü (₺, $, €, vb.)
 * @param decimals - Ondalık basamak sayısı (varsayılan: 2)
 * @returns Formatlanmış para birimi string'i
 *
 * @example
 * formatCurrency(1234.56, '₺') // "₺1.234,56"
 * formatCurrency(1000000, '$') // "$1.000.000,00"
 */
export const formatCurrency = (
  num: number,
  currencySymbol: string,
  decimals: number = 2
): string => {
  return `${currencySymbol}${formatNumber(num, decimals)}`;
};

/**
 * Büyük sayıları kısaltılmış formatta gösterir (Mlr, Mn, B, M, K)
 * Binlikler ve ondalıklar için Türkçe format kullanır
 *
 * @param num - Formatlanacak sayı
 * @returns Kısaltılmış formatlanmış sayı
 *
 * @example
 * formatNumberAbbreviated(1500000000) // "1,5Mlr"
 * formatNumberAbbreviated(1500000) // "1,5Mn"
 * formatNumberAbbreviated(2500) // "2,5B"
 * formatNumberAbbreviated(500) // "500"
 */
export const formatNumberAbbreviated = (num: number): string => {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}Mlr`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}Mn`;
  } else if (num >= 1000) {
    return `${(num / 1000).toLocaleString('tr-TR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}B`;
  }
  return num.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

/**
 * Para birimi ile birlikte büyük sayıları kısaltılmış formatta gösterir
 *
 * @param num - Formatlanacak sayı
 * @param currencySymbol - Para birimi sembolü (₺, $, €, vb.)
 * @returns Kısaltılmış formatlanmış para birimi string'i
 *
 * @example
 * formatCurrencyAbbreviated(1500000000, '₺') // "₺1,5Mlr"
 * formatCurrencyAbbreviated(1500000, '₺') // "₺1,5Mn"
 * formatCurrencyAbbreviated(2500, '₺') // "₺2,5B"
 */
export const formatCurrencyAbbreviated = (num: number, currencySymbol: string): string => {
  return `${currencySymbol}${formatNumberAbbreviated(num)}`;
};

/**
 * Para birimi ile akıllı formatlama - büyük sayılar için kısaltma, küçük sayılar için tam format
 *
 * @param num - Formatlanacak sayı
 * @param currencySymbol - Para birimi sembolü (₺, $, €, vb.)
 * @param threshold - Kısaltma başlangıç eşiği (varsayılan: 100000)
 * @returns Formatlanmış para birimi string'i
 *
 * @example
 * formatCurrencySmart(1500000, '₺') // "₺1,5Mn"
 * formatCurrencySmart(50000, '₺') // "₺50.000,00"
 */
export const formatCurrencySmart = (
  num: number,
  currencySymbol: string,
  threshold: number = 100000
): string => {
  if (Math.abs(num) >= threshold) {
    return formatCurrencyAbbreviated(num, currencySymbol);
  }
  return formatCurrency(num, currencySymbol);
};

/**
 * Yüzde değerini formatlar
 *
 * @param num - Formatlanacak yüzde değeri (0-100 arası)
 * @param decimals - Ondalık basamak sayısı (varsayılan: 0)
 * @returns Formatlanmış yüzde string'i
 *
 * @example
 * formatPercentage(75.5, 1) // "%75,5"
 * formatPercentage(100) // "%100"
 */
export const formatPercentage = (num: number, decimals: number = 0): string => {
  return `%${formatNumber(num, decimals)}`;
};
