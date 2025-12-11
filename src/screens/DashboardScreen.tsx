import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import Markdown from 'react-native-markdown-display';
import { useFinanceStore } from "../store/useFinanceStore";
import { useTheme } from "../context/ThemeContext";
import { useCurrency } from "../context/CurrencyContext";
import { useApiKey } from "../context/ApiKeyContext";
import { useProfile } from "../context/ProfileContext";
import { gradients } from "../theme/colors";
import { Wallet, TrendingUp, TrendingDown, PieChart, Sparkles, BarChart3, Lightbulb, Target, AlertCircle } from "lucide-react-native";
import { geminiService } from "../services/geminiService";
import { CFOReportModal } from "../components/CFOReport/CFOReportModal";
import { FinancialCharts } from "../components/Charts/FinancialCharts";
import { formatCurrency, formatNumber, formatPercentage, formatCurrencySmart } from "../utils/formatters";

export const DashboardScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<{ 
    summary: string;
    risks: string[];
    actions: string[];
    rawText: string;
  } | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const { colors } = useTheme();
  const { currencySymbol } = useCurrency();
  const { getActiveApiKey } = useApiKey();
  const { profile } = useProfile();

  // Tilt animation
  const tiltAnim = useRef(new Animated.Value(0)).current;

  const {
    assets,
    liabilities,
    receivables,
    installments,
    getTotalAssets,
    getTotalLiabilities,
    getNetWorth,
    getSafeToSpend,
  } = useFinanceStore();

  const totalAssets = getTotalAssets();
  const totalLiabilities = getTotalLiabilities();
  const netWorth = getNetWorth();
  const safeToSpend = getSafeToSpend();
  const totalReceivables = useMemo(
    () => receivables.reduce((t, i) => t + (Number(i.amount) || 0), 0),
    [receivables]
  );
  const totalInstallments = useMemo(
    () => installments.reduce((t, i) => t + (Number(i.installmentAmount) || 0), 0),
    [installments]
  );

  // Son CFO analizini yükle
  useEffect(() => {
    loadLastCFOAnalysis();
  }, []);

  const loadLastCFOAnalysis = async () => {
    try {
      const savedAnalysis = await AsyncStorage.getItem('@last_cfo_analysis');
      if (savedAnalysis) {
        const parsed = JSON.parse(savedAnalysis);
        setAiResult(parsed);
      }
    } catch (error) {
      console.log('CFO analizi yüklenemedi:', error);
    }
  };

  const saveCFOAnalysis = async (analysis: any) => {
    try {
      await AsyncStorage.setItem('@last_cfo_analysis', JSON.stringify(analysis));
    } catch (error) {
      console.log('CFO analizi kaydedilemedi:', error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Tüm finansal önerileri hesapla
  const getAllFinancialTips = () => {
    const debtRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
    const tips = [];

    // Borç oranı yüksekse
    if (debtRatio > 50) {
      tips.push({
        icon: AlertCircle,
        color: '#F59E0B',
        gradient: ['#F59E0B', '#F97316'],
        title: 'Borç Oranınız Yüksek',
        description: `Toplam borçlarınız varlıklarınızın %${debtRatio.toFixed(0)}'ini oluşturuyor. Öncelikle borç azaltmaya odaklanın.`,
      });
    }

    // Güvenli harcama yüksekse
    if (safeToSpend > totalAssets * 0.3 && totalAssets > 0) {
      tips.push({
        icon: Target,
        color: '#10B981',
        gradient: ['#10B981', '#059669'],
        title: 'Yatırım Zamanı',
        description: `${formatCurrencySmart(safeToSpend, currencySymbol)} güvenli harcama limitiniz var. Bir kısmını yatırıma yönlendirebilirsiniz.`,
      });
    }

    // Alacaklar fazlaysa
    if (totalReceivables > totalAssets * 0.2 && totalReceivables > 0) {
      tips.push({
        icon: TrendingUp,
        color: '#06B6D4',
        gradient: ['#06B6D4', '#0891B2'],
        title: 'Alacak Takibi',
        description: `${formatCurrencySmart(totalReceivables, currencySymbol)} alacağınız var. Tahsilatlarınızı takip etmeyi unutmayın.`,
      });
    }

    // Net değer pozitif ve iyi durumda
    if (netWorth > 0 && debtRatio < 30) {
      tips.push({
        icon: Lightbulb,
        color: '#8B5CF6',
        gradient: gradients.purple,
        title: 'Harika Gidiyorsunuz!',
        description: `Net değeriniz ${formatCurrencySmart(netWorth, currencySymbol)}. Finansal hedeflerinize düzenli tasarrufla devam edin.`,
      });
    }

    // Taksit yükü yüksekse
    if (totalInstallments > safeToSpend * 0.5 && totalInstallments > 0) {
      tips.push({
        icon: AlertCircle,
        color: '#EF4444',
        gradient: ['#EF4444', '#DC2626'],
        title: 'Taksit Yükü Ağır',
        description: `Aylık ${formatCurrencySmart(totalInstallments, currencySymbol)} taksitiniz var. Yeni borçlanmadan kaçının.`,
      });
    }

    // Ek genel öneriler (her zaman göster)
    tips.push({
      icon: Lightbulb,
      color: '#8B5CF6',
      gradient: gradients.purple,
      title: 'Acil Durum Fonu',
      description: '3-6 aylık giderinizi karşılayacak bir acil durum fonu oluşturmayı hedefleyin. Beklenmedik durumlar için hazırlıklı olun.',
    });

    tips.push({
      icon: Target,
      color: '#10B981',
      gradient: ['#10B981', '#059669'],
      title: 'Bütçe Planlama',
      description: '50/30/20 kuralını deneyin: Gelirinizin %50 ihtiyaçlara, %30 isteklere, %20 tasarrufa ayırın.',
    });

    tips.push({
      icon: TrendingUp,
      color: '#06B6D4',
      gradient: ['#06B6D4', '#0891B2'],
      title: 'Uzun Vadeli Düşünün',
      description: 'Emeklilik planlamasına erken başlamak, bileşik faizin gücünden maksimum yararlanmanızı sağlar.',
    });

    tips.push({
      icon: Lightbulb,
      color: '#F59E0B',
      gradient: ['#F59E0B', '#F97316'],
      title: 'Küçük Tasarruflar Büyük Sonuçlar',
      description: 'Günde sadece 50₺ tasarruf etseniz, yılda 18.250₺ biriktirebilirsiniz. Her küçük adım önemli!',
    });

    tips.push({
      icon: Target,
      color: '#8B5CF6',
      gradient: gradients.purple,
      title: 'Otomatik Tasarruf',
      description: 'Maaş gününüzde otomatik olarak bir miktar paranızı tasarruf hesabına aktarın. Görmediğiniz parayı harcamazsınız.',
    });

    tips.push({
      icon: AlertCircle,
      color: '#EF4444',
      gradient: ['#EF4444', '#DC2626'],
      title: 'Kredi Kartı Faizi Tuzağı',
      description: 'Kredi kartı borcunuzu minimum ödemeyle kapatmayın. Faiz oranları %40\'a kadar çıkabilir!',
    });

    tips.push({
      icon: TrendingUp,
      color: '#10B981',
      gradient: ['#10B981', '#059669'],
      title: 'Çeşitlendirme Önemlidir',
      description: 'Tüm yumurtalarınızı bir sepete koymayın. Yatırımlarınızı farklı alanlara dağıtarak riski azaltın.',
    });

    tips.push({
      icon: Lightbulb,
      color: '#06B6D4',
      gradient: ['#06B6D4', '#0891B2'],
      title: 'Enflasyon Etkisi',
      description: 'Paranızı sadece banka hesabında tutmak, enflasyon nedeniyle değer kaybetmesine neden olur. Yatırım yapın!',
    });

    tips.push({
      icon: Target,
      color: '#F59E0B',
      gradient: ['#F59E0B', '#F97316'],
      title: '24 Saat Kuralı',
      description: 'Büyük alışverişlerden önce 24 saat bekleyin. Bu, dürtüsel harcamaları %70 oranında azaltır.',
    });

    tips.push({
      icon: Lightbulb,
      color: '#8B5CF6',
      gradient: gradients.purple,
      title: 'Sigorta İhmali',
      description: 'Sağlık, hayat ve kasko sigortalarınızı ihmal etmeyin. Küçük primler, büyük felaketlere karşı korur.',
    });

    tips.push({
      icon: TrendingUp,
      color: '#10B981',
      gradient: ['#10B981', '#059669'],
      title: 'Pasif Gelir Yaratın',
      description: 'Kira geliri, temettü hisseleri veya online içerik gibi pasif gelir kaynakları oluşturmayı hedefleyin.',
    });

    tips.push({
      icon: Target,
      color: '#06B6D4',
      gradient: ['#06B6D4', '#0891B2'],
      title: 'Finansal Eğitim',
      description: 'Ayda en az bir finansal kitap okuyun veya podcast dinleyin. Bilgi, en değerli yatırımdır.',
    });

    tips.push({
      icon: Lightbulb,
      color: '#EF4444',
      gradient: ['#EF4444', '#DC2626'],
      title: 'Abonelik Kontrol',
      description: 'Kullanmadığınız abonelikleri iptal edin. Ortalama kişi ayda 200₺+ gereksiz abonelik için ödüyor.',
    });

    tips.push({
      icon: Target,
      color: '#10B981',
      gradient: ['#10B981', '#059669'],
      title: 'Hedefinizi Belirleyin',
      description: 'Kısa, orta ve uzun vadeli finansal hedefler belirleyin. Net hedefler, motivasyonu artırır.',
    });

    tips.push({
      icon: TrendingUp,
      color: '#8B5CF6',
      gradient: gradients.purple,
      title: 'Zam Kuralı',
      description: 'Maaşınız arttığında, artışın en az yarısını tasarrufa yönlendirin. Yaşam standardınızı her zaman artırmayın.',
    });

    // En az bir öneri olmalı
    if (tips.length === 0) {
      tips.push({
        icon: Lightbulb,
        color: '#8B5CF6',
        gradient: gradients.purple,
        title: 'Finansal Planınızı Güçlendirin',
        description: 'Düzenli tasarruf yaparak ve harcamalarınızı takip ederek mali durumunuzu iyileştirebilirsiniz.',
      });
    }

    return tips;
  };

  const allTips = useMemo(() => getAllFinancialTips(), [
    totalAssets,
    totalLiabilities,
    netWorth,
    safeToSpend,
    totalReceivables,
    totalInstallments,
    currencySymbol,
  ]);

  const currentTip = allTips[currentTipIndex];

  // Her 10 saniyede bir sonraki öneriye geç
  useEffect(() => {
    if (allTips.length <= 1) return; // Tek öneri varsa döndürme

    const interval = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % allTips.length);
    }, 10000); // 10 saniye

    return () => clearInterval(interval);
  }, [allTips.length]);

  // Manuel olarak sonraki öneriye geç
  const handleTipPress = () => {
    if (allTips.length > 1) {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % allTips.length);
    }
  };

  const handleHeroPress = () => {
    Animated.sequence([
      Animated.timing(tiltAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(tiltAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const tiltInterpolate = tiltAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '8deg'],
  });

  const parseCfoReport = (rawText: string) => {
    // Markdown başlıklarını da destekleyecek şekilde daha esnek pattern
    const summaryMatch = rawText.match(/\*?\*?Yönetici Özeti:?\*?\*?\s*([\s\S]*?)(?=\*?\*?Finansal Sağlık Notu|\*?\*?Detaylı Analiz|\*?\*?Stratejik Öneriler|$)/i);
    const risksMatch = rawText.match(/\*?\*?Potansiyel Riskler:?\*?\*?\s*([\s\S]*?)(?=\*?\*?Stratejik Öneriler|\*?\*?Sonuç ve Genel|$)/i);
    const actionsMatch = rawText.match(/\*?\*?Stratejik Öneriler:?\*?\*?\s*([\s\S]*?)(?=\*?\*?Potansiyel Riskler|\*?\*?Sonuç ve Genel|$)/i);

    const parseList = (text: string | undefined) => {
      if (!text) return [];

      const lines = text.split('\n');
      const items: string[] = [];
      let currentItem = '';
      let inItem = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Boş satırları atla
        if (!line) continue;

        // Ana başlıkları atla (**Kısa Vade:**, **Orta Vade:** gibi)
        if (line.match(/^\*\*.+?:?\*\*$/)) {
          continue;
        }

        // Yeni madde başlangıcı mı kontrol et (1. veya * veya - ile başlıyor mu?)
        const isNewItem = line.match(/^[\*\-\•]\s+/) || line.match(/^\d+\.\s+/);

        if (isNewItem) {
          // Önceki maddeyi kaydet
          if (inItem && currentItem.trim()) {
            items.push(currentItem.trim());
          }

          // Yeni maddeyi başlat - madde işareti/numarayı kaldır
          currentItem = line.replace(/^[\*\-\•]\s+/, '').replace(/^\d+\.\s+/, '');
          inItem = true;
        } else if (inItem) {
          // Devam eden satır - mevcut maddeye ekle
          currentItem += ' ' + line;
        }
      }

      // Son maddeyi kaydet
      if (inItem && currentItem.trim()) {
        items.push(currentItem.trim());
      }

      // İçerikleri temizle ve filtrele
      return items
        .map(item => {
          // Başındaki ve sonundaki gereksiz karakterleri temizle
          let cleaned = item.trim();

          // Kalın yazı işaretlerini temizle (başlangıç kısmında varsa)
          // Eğer zaten : varsa sadece ** kaldır, yoksa : ekle
          if (cleaned.match(/^\*\*([^*]+)\*\*:\s*/)) {
            cleaned = cleaned.replace(/^\*\*([^*]+)\*\*:\s*/, '$1: ');
          } else {
            cleaned = cleaned.replace(/^\*\*([^*]+)\*\*\s*/, '$1: ');
          }

          // Tüm :: durumlarını : ile değiştir (nereden gelirse gelsin)
          cleaned = cleaned.replace(/::/g, ':');

          return cleaned;
        })
        .filter(item => {
          // En az 10 karakter olmalı (çok kısa anlamsız parçaları filtrele)
          if (item.length < 10) return false;

          // Sadece noktalama işareti veya sayı içermemeli
          if (item.match(/^[\d\s\.,;:\-\–—]+$/)) return false;

          return true;
        });
    };

    return {
      summary: summaryMatch ? summaryMatch[1].trim() : rawText,
      risks: parseList(risksMatch ? risksMatch[1] : ''),
      actions: parseList(actionsMatch ? actionsMatch[1] : ''),
      rawText,
    };
  };
  
  const handleAiAnalyze = async () => {
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);
    try {
      const reportContext = {
        totalAssets,
        totalLiabilities,
        netWorth,
        safeToSpend,
        totalReceivables,
        totalInstallments,
        currencySymbol,
        findeksScore: profile.findeksScore,
        salary: profile.salary,
        additionalIncome: profile.additionalIncome,
      };

      const response = await geminiService.generateCfoReport(reportContext);
      
      if (response.success && response.content) {
        const analysis = parseCfoReport(response.content);
        setAiResult(analysis);
        await saveCFOAnalysis(analysis); // Analizi kaydet
        setShowReport(true);
      } else {
        throw new Error(response.error || "AI analizi başarısız oldu.");
      }

    } catch (error: any) {
      const errorMsg = error?.message || "AI analizi başarısız.";

      // Kullanıcı dostu hata mesajları
      if (errorMsg.includes('quota') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
        setAiError('📊 API kotanız doldu. Lütfen daha sonra tekrar deneyin.');
      } else if (errorMsg.includes('429')) {
        setAiError('⏱️ Çok fazla istek. Birkaç saniye bekleyip tekrar deneyin.');
      } else if (errorMsg.includes('503') || errorMsg.includes('overloaded')) {
        setAiError('🔧 Servis meşgul. Lütfen kısa bir süre sonra tekrar deneyin.');
      } else if (errorMsg.includes('API_KEY') || errorMsg.includes('Invalid')) {
        setAiError('🔑 API anahtarı geçersiz. Ayarlardan kontrol edin.');
      } else {
        setAiError(errorMsg);
      }
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.purple.primary}
          />
        }
      >
        <View style={styles.modernHeader}>
          <LinearGradient
            colors={['#FF0080', '#7928CA', '#0070F3', '#00DFD8']}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.decorativePattern}>
              <View style={styles.patternCircle1} />
              <View style={styles.patternCircle2} />
              <View style={styles.patternCircle3} />
            </View>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <View style={styles.headerTextContainer}>
                  <Text style={styles.greeting}>
                    {(() => {
                      const hour = new Date().getHours();
                      if (hour >= 6 && hour < 12) return '🌅 Günaydın';
                      if (hour >= 12 && hour < 18) return '☀️ İyi Günler';
                      if (hour >= 18 && hour < 24) return '🌙 İyi Akşamlar';
                      return '🌙 İyi Geceler';
                    })()}
                  </Text>
                  <Text style={styles.title}>
                    {profile.name || 'Finansal Özet'}
                  </Text>
                  <View style={styles.dateContainer}>
                    <Text style={styles.dateText}>
                      {new Date().toLocaleDateString('tr-TR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.headerRight}>
                <View style={styles.modernHeaderIcon}>
                  <Wallet size={34} color="#FFFFFF" strokeWidth={2.5} />
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        <Pressable onPress={handleHeroPress} style={styles.heroCardContainer}>
          <Animated.View
            style={[ 
              styles.heroCardWrapper,
              {
                transform: [
                  { perspective: 800 },
                  { rotateX: tiltInterpolate },
                  { rotateY: tiltAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '-8deg'],
                  })},
                  { scale: tiltAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.02],
                  })},
                ],
              },
            ]}
          >
            <LinearGradient
              colors={['#9333EA', '#7C3AED', '#6D28D9']}
              style={styles.heroCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.heroContent}>
                <View style={styles.heroHeader}>
                  <View style={styles.heroIconContainer}>
                    <Wallet size={24} color="rgba(255, 255, 255, 0.95)" strokeWidth={2.5} />
                  </View>
                  <Text style={styles.heroLabel}>Harcayabileceğiniz</Text>
                </View>
                <Text style={styles.heroValue}>{formatCurrencySmart(safeToSpend, currencySymbol)}</Text>
                <Text style={styles.heroSubtext}>Güvenli harcama limitiniz</Text>
              </View>
              <View style={styles.decorativeCircle1} />
              <View style={styles.decorativeCircle2} />
              <View style={styles.decorativeCircle3} />
            </LinearGradient>
          </Animated.View>
        </Pressable>

        {/* Finansal Öneri Banner */}
        <TouchableOpacity
          style={styles.tipBannerContainer}
          onPress={handleTipPress}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={currentTip.gradient}
            style={styles.tipBanner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.tipIconContainer}>
              {React.createElement(currentTip.icon, { size: 24, color: "#FFFFFF", strokeWidth: 2.5 })}
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>{currentTip.title}</Text>
              <Text style={styles.tipDescription}>{currentTip.description}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.overviewSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Finansal Durum</Text>
          <View style={styles.gridContainer}>
            <View style={styles.gridRow}>
              <View style={[styles.miniCard, { backgroundColor: colors.cardBackground }]}>
                <View style={[styles.miniCardIcon, { backgroundColor: "rgba(0, 255, 157, 0.15)" }]}>
                  <TrendingUp size={20} color={colors.success} strokeWidth={2.5} />
                </View>
                <Text style={[styles.miniCardLabel, { color: colors.text.secondary }]}>Toplam Varlıklar</Text>
                <Text style={[styles.miniCardValue, { color: colors.success }]}>{formatCurrencySmart(totalAssets, currencySymbol)}</Text>
              </View>

              <View style={[styles.miniCard, { backgroundColor: colors.cardBackground }]}>
                <View style={[styles.miniCardIcon, { backgroundColor: "rgba(255, 71, 87, 0.15)" }]}>
                  <TrendingDown size={20} color={colors.error} strokeWidth={2.5} />
                </View>
                <Text style={[styles.miniCardLabel, { color: colors.text.secondary }]}>Toplam Borçlar</Text>
                <Text style={[styles.miniCardValue, { color: colors.error }]}>{formatCurrencySmart(totalLiabilities, currencySymbol)}</Text>
              </View>
            </View>

            <View style={[styles.netWorthCard, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.netWorthHeader}>
                <View style={[styles.miniCardIcon, { backgroundColor: "rgba(147, 51, 234, 0.15)" }]}>
                  <PieChart size={20} color={colors.purple.light} strokeWidth={2.5} />
                </View>
                <Text style={[styles.miniCardLabel, { color: colors.text.secondary }]}>Net Değeriniz</Text>
              </View>
              <Text style={[styles.netWorthValue, { color: netWorth >= 0 ? colors.success : colors.error }]}>
                {formatCurrencySmart(netWorth, currencySymbol)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.analyticsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Finansal Analiz</Text>

          <View style={styles.analyticsGrid}>
            <View style={[styles.analyticsCard, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.analyticsHeader}>
                <Text style={[styles.analyticsLabel, { color: colors.text.secondary }]}>Varlık/Borç Oranı</Text>
                <View style={styles.analyticsBadge}>
                  <Text style={[styles.analyticsBadgeText, { color: colors.purple.light }]}>
                    {totalLiabilities > 0 ? "Oran" : "İdeal"}
                  </Text>
                </View>
              </View>
              <Text style={[styles.analyticsValue, { color: colors.purple.light }]}>
                {totalLiabilities > 0 ? formatNumber(totalAssets / totalLiabilities, 2) : "∞"}
              </Text>
              <View style={[styles.analyticsBar, { backgroundColor: "rgba(147, 51, 234, 0.2)" }]}>
                <View
                  style={[ 
                    styles.analyticsBarFill,
                    {
                      backgroundColor: colors.purple.primary,
                      width: totalLiabilities > 0 ? `${Math.min((totalAssets / totalLiabilities) * 20, 100)}%` : "100%",
                    },
                  ]}
                />
              </View>
            </View>

            <View style={[styles.analyticsCard, { backgroundColor: colors.cardBackground }]}>
              <View style={styles.analyticsHeader}>
                <Text style={[styles.analyticsLabel, { color: colors.text.secondary }]}>Borçlanma Oranı</Text>
                <View style={styles.analyticsBadge}>
                  <Text style={[styles.analyticsBadgeText, { color: colors.accent.cyan }]}>Yüzde</Text>
                </View>
              </View>
              <Text style={[styles.analyticsValue, { color: colors.accent.cyan }]}>
                {totalAssets > 0 ? formatPercentage((totalLiabilities / totalAssets) * 100, 1) : "%0"}
              </Text>
              <View style={[styles.analyticsBar, { backgroundColor: "rgba(6, 182, 212, 0.2)" }]}>
                <View
                  style={[ 
                    styles.analyticsBarFill,
                    {
                      backgroundColor: colors.accent.cyan,
                      width: totalAssets > 0 ? `${Math.min((totalLiabilities / totalAssets) * 100, 100)}%` : "0%",
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Grafikler Bölümü */}
        <View style={styles.chartsSection}>
          <View style={styles.chartsSectionHeader}>
            <BarChart3 size={24} color={colors.purple.light} strokeWidth={2.5} />
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Grafiksel Analiz</Text>
          </View>
          <FinancialCharts
            totalAssets={totalAssets}
            totalLiabilities={totalLiabilities}
            totalReceivables={totalReceivables}
            totalInstallments={totalInstallments}
            netWorth={netWorth}
          />
        </View>

        {/* AI Analiz */}
        <View style={styles.analyticsSection}>
          <View style={[styles.aiCard, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.aiHeader}>
              <View style={[styles.aiIcon, { backgroundColor: "rgba(147, 51, 234, 0.12)" }]}>
                <Sparkles size={18} color={colors.purple.light} strokeWidth={2.5} />
              </View>
              <Text style={[styles.aiTitle, { color: colors.text.primary }]}>Yapay CFO Analizi</Text>
            </View>
            <Text style={[styles.aiSubtitle, { color: colors.text.primary }]}>
              {aiResult ? "Son analiziniz aşağıda. Yeni analiz için tıklayın." : "Gemini'den kısa bir CFO yorumu al."}
            </Text>
            <TouchableOpacity
              style={[styles.aiButton, { backgroundColor: colors.purple.primary }]}
              onPress={handleAiAnalyze}
              disabled={aiLoading}
            >
              <Text style={styles.aiButtonText}>
                {aiLoading ? "Analiz ediliyor..." : aiResult ? "Yeni Analiz Al" : "Analiz Al"}
              </Text>
            </TouchableOpacity>
            {aiError ? <Text style={[styles.aiError, { color: colors.error }]}>{aiError}</Text> : null}
            {aiResult ? (
              <View style={styles.aiResult}>
                <Markdown
                  style={{
                    body: {
                      color: colors.text.primary,
                      fontSize: 15,
                      lineHeight: 22,
                      marginBottom: 12
                    },
                    strong: {
                      color: colors.text.primary,
                      fontWeight: '700'
                    },
                    paragraph: {
                      marginTop: 0,
                      marginBottom: 8
                    },
                    text: {
                      color: colors.text.primary
                    },
                    bullet_list: {
                      marginBottom: 8
                    },
                    list_item: {
                      marginBottom: 4
                    }
                  }}
                >
                  {aiResult.summary}
                </Markdown>

                {/* Madde sayılarını göster */}
                {(aiResult.risks.length > 0 || aiResult.actions.length > 0) && (
                  <View style={styles.aiStatsContainer}>
                    {aiResult.risks.length > 0 && (
                      <View style={[styles.aiStatBadge, { backgroundColor: 'rgba(255, 71, 87, 0.1)' }]}>
                        <Text style={[styles.aiStatNumber, { color: colors.error }]}>{aiResult.risks.length}</Text>
                        <Text style={[styles.aiStatLabel, { color: colors.error }]}>Risk</Text>
                      </View>
                    )}
                    {aiResult.actions.length > 0 && (
                      <View style={[styles.aiStatBadge, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
                        <Text style={[styles.aiStatNumber, { color: colors.success }]}>{aiResult.actions.length}</Text>
                        <Text style={[styles.aiStatLabel, { color: colors.success }]}>Öneri</Text>
                      </View>
                    )}
                  </View>
                )}

                {!aiResult.risks.length && !aiResult.actions.length && aiResult.rawText && (
                  <Markdown
                    style={{
                      body: {
                        color: colors.text.primary,
                        fontSize: 13,
                        lineHeight: 18
                      },
                      paragraph: {
                        marginTop: 0,
                        marginBottom: 8
                      }
                    }}
                  >
                    {aiResult.rawText}
                  </Markdown>
                )}
                <TouchableOpacity
                  style={[styles.reportButton, { borderColor: colors.purple.primary }]}
                  onPress={() => setShowReport(true)}
                >
                  <Text style={[styles.reportButtonText, { color: colors.purple.primary }]}>Detaylı raporu aç</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>

      <CFOReportModal
        visible={showReport}
        onClose={() => setShowReport(false)}
        reportData={aiResult}
        metrics={{
          totalAssets,
          totalLiabilities,
          netWorth,
          safeToSpend,
          totalReceivables,
          totalInstallments,
          findeksScore: profile.findeksScore,
          salary: profile.salary,
          additionalIncome: profile.additionalIncome,
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  modernHeader: {
    marginBottom: 24,
    overflow: 'hidden',
    borderRadius: 32,
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 36,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativePattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -80,
    right: -60,
  },
  patternCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -50,
    left: -40,
  },
  patternCircle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    top: 50,
    left: '40%',
  },
  neonLine1: {
    position: 'absolute',
    width: '60%',
    height: 2,
    backgroundColor: 'rgba(0, 223, 216, 0.4)',
    top: 30,
    right: 0,
    shadowColor: '#00DFD8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  neonLine2: {
    position: 'absolute',
    width: '40%',
    height: 2,
    backgroundColor: 'rgba(255, 0, 128, 0.4)',
    bottom: 40,
    left: 0,
    shadowColor: '#FF0080',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    zIndex: 10,
  },
  headerLeft: {
    flex: 1,
  },
  headerTextContainer: {
    gap: 6,
  },
  headerRight: {
    marginLeft: 16,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: 0.3,
    color: 'rgba(255, 255, 255, 0.95)',
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -0.8,
    marginBottom: 8,
    color: '#FFFFFF',
  },
  dateContainer: {
    marginTop: 4,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.2,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  modernHeaderIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  heroCardContainer: {
    marginBottom: 28,
  },
  heroCardWrapper: {
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#9333EA",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 16,
  },
  heroCard: {
    padding: 32,
    minHeight: 200,
    position: "relative",
    overflow: "hidden",
  },
  heroContent: {
    zIndex: 10,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  heroIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  heroLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.95)",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  heroValue: {
    fontSize: 56,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -1,
  },
  heroSubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    letterSpacing: 0.3,
  },
  decorativeCircle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: -50,
    right: -50,
  },
  decorativeCircle2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    bottom: -30,
    left: -30,
  },
  decorativeCircle3: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    top: 100,
    right: 20,
  },
  tipBannerContainer: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  tipBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    paddingBottom: 32,
    gap: 16,
  },
  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  tipDescription: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.9)",
    lineHeight: 18,
    letterSpacing: 0.1,
  },
  tipIndicators: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  tipIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  tipIndicatorDotActive: {
    width: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  overviewSection: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  gridContainer: {
    gap: 12,
  },
  gridRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  miniCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  miniCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  miniCardLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  miniCardValue: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  netWorthCard: {
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  netWorthHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  netWorthValue: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  analyticsSection: {
    marginBottom: 20,
  },
  chartsSection: {
    marginBottom: 28,
  },
  chartsSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  analyticsGrid: {
    gap: 16,
  },
  analyticsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  analyticsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  analyticsLabel: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  analyticsBadge: {
    backgroundColor: "rgba(147, 51, 234, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  analyticsBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  analyticsValue: {
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  analyticsBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  analyticsBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  aiCard: {
    marginTop: 8,
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  aiSubtitle: {
    fontSize: 13,
    marginBottom: 10,
  },
  aiButton: {
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  aiButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  aiError: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
  },
  aiResult: {
    marginTop: 6,
    gap: 6,
  },
  aiResultTitle: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  aiSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 4,
    letterSpacing: 0.1,
  },
  aiList: {
    gap: 4,
    marginTop: 4,
  },
  aiListItem: {
    fontSize: 13,
    lineHeight: 18,
    flexWrap: "wrap",
  },
  aiStatsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  aiStatBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  aiStatNumber: {
    fontSize: 20,
    fontWeight: '800',
  },
  aiStatLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  reportButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  reportButtonText: {
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});