import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { CreditCard, Zap, Star, Crown, Check, Shield, Lock, Award, Sparkles, TrendingUp, Users } from 'lucide-react-native';
import { COLORS, SHADOWS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { useCredits } from '@/hooks/credits-store';
import { CreditPackage } from '@/types';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function CreditsScreen() {
  const router = useRouter();
  const { 
    credits, 
    subscription, 
    creditPackages,
    purchaseCredits,
    hasPremium
  } = useCredits();
  
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  
  const trustBadges = [
    { icon: Shield, text: 'SSL Verschlüsselt', color: COLORS.success },
    { icon: Lock, text: 'Sichere Zahlung', color: COLORS.primary },
    { icon: Award, text: 'Schweizer Qualität', color: COLORS.accent },
    { icon: Users, text: '10.000+ Kunden', color: COLORS.warning },
  ];
  
  const handlePurchaseCredits = () => {
    if (!selectedPackage) {
      Alert.alert('Fehler', 'Bitte wählen Sie ein Credit-Paket aus.');
      return;
    }
    
    const premiumDiscount = hasPremium ? subscription?.creditDiscount || 0 : 0;
    const finalPrice = premiumDiscount > 0 ? selectedPackage.price * (1 - premiumDiscount / 100) : selectedPackage.price;
    const discountText = premiumDiscount > 0 ? ` (${premiumDiscount}% Premium-Rabatt)` : '';
    
    Alert.alert(
      'Credits kaufen',
      `Möchten Sie ${selectedPackage.credits} Credits für CHF ${finalPrice.toFixed(2)} kaufen?${discountText}`,
      [
        {
          text: 'Abbrechen',
          style: 'cancel',
        },
        {
          text: 'Kaufen',
          onPress: () => {
            purchaseCredits(selectedPackage);
            const creditsReceived = premiumDiscount > 0 ? Math.floor(selectedPackage.credits * (1 + premiumDiscount / 100)) : selectedPackage.credits;
            Alert.alert(
              'Erfolg',
              `Sie haben erfolgreich ${selectedPackage.credits} Credits gekauft${premiumDiscount > 0 ? ` und ${creditsReceived - selectedPackage.credits} Bonus-Credits erhalten!` : '.'}`,
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };
  

  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <View style={styles.heroIcon}>
            <Sparkles size={32} color={COLORS.white} />
          </View>
          <Text style={styles.heroTitle}>Credits kaufen</Text>
          <Text style={styles.heroSubtitle}>
            Schalten Sie Kundenkontakte frei und gewinnen Sie neue Aufträge
          </Text>
        </View>
        
        <View style={styles.trustBadgesContainer}>
          {trustBadges.map((badge, index) => (
            <View key={index} style={styles.trustBadge}>
              <badge.icon size={16} color={badge.color} />
              <Text style={styles.trustBadgeText}>{badge.text}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.balanceSection}>
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <View style={styles.balanceIconContainer}>
              <Zap size={28} color={COLORS.accent} />
            </View>
            <View style={styles.balanceContent}>
              <Text style={styles.balanceValue}>{credits}</Text>
              <Text style={styles.balanceLabel}>Verfügbare Credits</Text>
            </View>
            <View style={styles.trendingContainer}>
              <TrendingUp size={20} color={COLORS.success} />
              <Text style={styles.trendingText}>Aktiv</Text>
            </View>
          </View>
          <View style={styles.balanceStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Budget</Text>
              <Text style={styles.statLabel}>basierte Credits</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24h</Text>
              <Text style={styles.statLabel}>Gültigkeitsdauer</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeaderContainer}>
          <View style={styles.sectionHeader}>
            <CreditCard size={24} color={COLORS.primary} />
            <Text style={[styles.sectionTitle, { marginLeft: SPACING.s, marginBottom: 0 }]}>Credit-Pakete</Text>
          </View>
          {hasPremium && (
            <View style={styles.premiumBadgeSmall}>
              <Crown size={14} color={COLORS.white} />
              <Text style={styles.premiumBadgeSmallText}>Premium Rabatt</Text>
            </View>
          )}
        </View>
        <Text style={styles.sectionSubtitle}>
          Wählen Sie das perfekte Paket für Ihre Bedürfnisse
        </Text>
        
        <View style={styles.packagesGrid}>
          {creditPackages.map((pkg, index) => {
            const premiumDiscount = hasPremium ? subscription?.creditDiscount || 0 : 0;
            const originalPrice = pkg.price;
            const finalPrice = premiumDiscount > 0 ? originalPrice * (1 - premiumDiscount / 100) : originalPrice;
            const isPopular = index === 1;
            const savings = originalPrice - finalPrice;
            
            return (
              <TouchableOpacity
                key={pkg.id}
                style={[
                  styles.packageCard,
                  selectedPackage?.id === pkg.id && styles.packageCardSelected,
                  isPopular && styles.packageCardPopular
                ]}
                onPress={() => setSelectedPackage(pkg)}
              >
                {isPopular && (
                  <View style={styles.popularBadge}>
                    <Star size={12} color={COLORS.primary} />
                    <Text style={styles.popularText}>Meist gewählt</Text>
                  </View>
                )}
                {hasPremium && savings > 0 && (
                  <View style={styles.savingsBadge}>
                    <Text style={styles.savingsText}>Sie sparen CHF {savings.toFixed(2)}</Text>
                  </View>
                )}
                
                <View style={styles.packageHeader}>
                  <Text style={styles.packageCredits}>{pkg.credits}</Text>
                  <Text style={styles.packageCreditsLabel}>Credits</Text>
                </View>
                
                <View style={styles.packagePricing}>
                  {hasPremium && savings > 0 ? (
                    <View style={styles.priceContainer}>
                      <Text style={styles.originalPrice}>CHF {originalPrice}</Text>
                      <Text style={styles.packagePrice}>CHF {finalPrice.toFixed(2)}</Text>
                    </View>
                  ) : (
                    <Text style={styles.packagePrice}>CHF {pkg.price}</Text>
                  )}
                  <Text style={styles.pricePerCredit}>
                    CHF {(finalPrice / pkg.credits).toFixed(2)} pro Credit
                  </Text>
                </View>
                
                {pkg.discountPercent && !hasPremium && (
                  <View style={styles.discountBadge}>
                    <Text style={styles.packageDiscount}>-{pkg.discountPercent}% Rabatt</Text>
                  </View>
                )}
                
                <View style={styles.packageFeatures}>
                  <View style={styles.featureItem}>
                    <Check size={14} color={COLORS.success} />
                    <Text style={styles.featureText}>Sofort verfügbar</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Check size={14} color={COLORS.success} />
                    <Text style={styles.featureText}>Kein Ablaufdatum</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        
        <Button 
          title={selectedPackage ? (() => {
            const premiumDiscount = hasPremium ? subscription?.creditDiscount || 0 : 0;
            const finalPrice = premiumDiscount > 0 ? selectedPackage.price * (1 - premiumDiscount / 100) : selectedPackage.price;
            return `Jetzt kaufen - CHF ${finalPrice.toFixed(2)}`;
          })() : "Paket auswählen"} 
          onPress={handlePurchaseCredits}
          style={[styles.purchaseButton, selectedPackage && styles.purchaseButtonActive]}
          disabled={!selectedPackage}
        />
        
        <View style={styles.paymentMethods}>
          <Text style={styles.paymentMethodsTitle}>Sichere Zahlungsmethoden:</Text>
          <View style={styles.paymentIcons}>
            <View style={styles.paymentIcon}>
              <Text style={styles.paymentIconText}>💳</Text>
            </View>
            <View style={styles.paymentIcon}>
              <Text style={styles.paymentIconText}>🏦</Text>
            </View>
            <View style={styles.paymentIcon}>
              <Text style={styles.paymentIconText}>📱</Text>
            </View>
          </View>
        </View>
      </View>
      
      {!hasPremium && (
        <View style={styles.premiumTeaser}>
          <View style={styles.premiumTeaserHeader}>
            <View style={styles.premiumTeaserIcon}>
              <Crown size={28} color={COLORS.warning} />
            </View>
            <Text style={styles.premiumTeaserTitle}>Werden Sie Premium-Mitglied</Text>
          </View>
          
          <View style={styles.premiumBenefitsList}>
            <View style={styles.premiumBenefitItem}>
              <View style={styles.benefitIconSmall}>
                <Zap size={16} color={COLORS.accent} />
              </View>
              <Text style={styles.premiumBenefitText}>
                <Text style={styles.premiumBenefitBold}>24h früher:</Text> Sehen Sie neue Projekte vor allen anderen
              </Text>
            </View>
            
            <View style={styles.premiumBenefitItem}>
              <View style={styles.benefitIconSmall}>
                <TrendingUp size={16} color={COLORS.success} />
              </View>
              <Text style={styles.premiumBenefitText}>
                <Text style={styles.premiumBenefitBold}>Höhere Sichtbarkeit:</Text> Ihr Profil wird bevorzugt angezeigt
              </Text>
            </View>
            
            <View style={styles.premiumBenefitItem}>
              <View style={styles.benefitIconSmall}>
                <CreditCard size={16} color={COLORS.primary} />
              </View>
              <Text style={styles.premiumBenefitText}>
                <Text style={styles.premiumBenefitBold}>Credit-Rabatt:</Text> Sparen Sie bis zu 20% bei jedem Kauf
              </Text>
            </View>
            
            <View style={styles.premiumBenefitItem}>
              <View style={styles.benefitIconSmall}>
                <Star size={16} color={COLORS.warning} />
              </View>
              <Text style={styles.premiumBenefitText}>
                <Text style={styles.premiumBenefitBold}>Premium-Badge:</Text> Zeigen Sie Ihre Professionalität
              </Text>
            </View>
          </View>
          
          <View style={styles.premiumCTA}>
            <Text style={styles.premiumCTAText}>
              Mehr Aufträge, weniger Kosten - starten Sie noch heute!
            </Text>
            <Button 
              title="Premium werden" 
              onPress={() => router.push('/premium')}
              style={styles.premiumTeaserButton}
            />
          </View>
        </View>
      )}
      
      <View style={styles.howItWorksSection}>
        <Text style={styles.sectionTitle}>So funktioniert unser Credit-System</Text>
        
        <View style={styles.creditExplanationCard}>
          <View style={styles.creditExplanationHeader}>
            <View style={styles.creditExplanationIcon}>
              <Sparkles size={24} color={COLORS.accent} />
            </View>
            <Text style={styles.creditExplanationTitle}>
              Credits basieren auf dem Kundenbudget
            </Text>
          </View>
          
          <Text style={styles.creditExplanationText}>
            Unser faires System berechnet die benötigten Credits basierend auf dem Projektbudget des Kunden. 
            Je höher das Budget, desto mehr Credits werden benötigt - so zahlen Sie nur angemessen für wertvolle Kontakte.
          </Text>
          
          <View style={styles.budgetExamples}>
            <View style={styles.budgetExample}>
              <Text style={styles.budgetRange}>bis CHF 250</Text>
              <Text style={styles.budgetCredits}>1 Credit</Text>
            </View>
            <View style={styles.budgetExample}>
              <Text style={styles.budgetRange}>bis CHF 500</Text>
              <Text style={styles.budgetCredits}>2 Credits</Text>
            </View>
            <View style={styles.budgetExample}>
              <Text style={styles.budgetRange}>bis CHF 750</Text>
              <Text style={styles.budgetCredits}>3 Credits</Text>
            </View>
            <View style={styles.budgetExample}>
              <Text style={styles.budgetRange}>bis CHF 1000</Text>
              <Text style={styles.budgetCredits}>4 Credits</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.stepsContainer}>
          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Credits kaufen</Text>
              <Text style={styles.stepText}>
                Wählen Sie das passende Credit-Paket für Ihre Bedürfnisse
              </Text>
            </View>
          </View>
          
          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Projekte entdecken</Text>
              <Text style={styles.stepText}>
                Durchsuchen Sie kostenlos alle verfügbaren Projekte und deren Budgets
              </Text>
            </View>
          </View>
          
          <View style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Kontakt freischalten</Text>
              <Text style={styles.stepText}>
                Nutzen Sie die entsprechende Anzahl Credits basierend auf dem Projektbudget
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.guaranteeSection}>
          <View style={styles.guaranteeIcon}>
            <Shield size={24} color={COLORS.success} />
          </View>
          <View style={styles.guaranteeContent}>
            <Text style={styles.guaranteeTitle}>100% Geld-zurück-Garantie</Text>
            <Text style={styles.guaranteeText}>
              Nicht zufrieden? Wir erstatten Ihnen innerhalb von 30 Tagen den vollen Betrag zurück.
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingBottom: 90,
  },
  heroSection: {
    backgroundColor: COLORS.primary,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.l,
    paddingHorizontal: SPACING.l,
  },
  heroContent: {
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary + '40',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.m,
  },
  heroTitle: {
    ...FONTS.h1,
    color: COLORS.white,
    marginBottom: SPACING.s,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...FONTS.body1,
    color: COLORS.white + 'CC',
    textAlign: 'center',
    lineHeight: 22,
  },
  trustBadgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.s,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white + '20',
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.white + '30',
  },
  trustBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500' as const,
    marginLeft: 4,
  },
  balanceSection: {
    padding: SPACING.m,
    marginTop: -SPACING.l,
  },
  balanceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SPACING.l,
    ...SHADOWS.medium,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  balanceIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  balanceContent: {
    flex: 1,
  },
  balanceValue: {
    ...FONTS.h1,
    fontSize: 32,
    color: COLORS.text,
    fontWeight: '700' as const,
  },
  balanceLabel: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginTop: 2,
  },
  trendingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: SPACING.s,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendingText: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '600' as const,
    marginLeft: 4,
  },
  balanceStats: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    padding: SPACING.m,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...FONTS.h3,
    color: COLORS.primary,
    fontWeight: '700' as const,
  },
  statLabel: {
    ...FONTS.body2,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.gray[200],
    marginHorizontal: SPACING.m,
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning,
    paddingHorizontal: SPACING.s,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumBadgeSmallText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '600' as const,
    marginLeft: 4,
  },
  packagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.l,
  },
  packageCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.l,
    marginBottom: SPACING.m,
    borderWidth: 2,
    borderColor: COLORS.gray[200],
    ...SHADOWS.small,
    position: 'relative',
  },
  packageCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '08',
    transform: [{ scale: 1.02 }],
  },
  packageCardPopular: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '08',
    transform: [{ scale: 1.02 }],
  },
  packageHeader: {
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    ...SHADOWS.small,
  },
  popularText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700' as const,
    marginLeft: 4,
  },
  savingsBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.success,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  savingsText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '600' as const,
  },
  packageCredits: {
    ...FONTS.h1,
    fontSize: 28,
    color: COLORS.text,
    fontWeight: '800' as const,
  },
  packageCreditsLabel: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginTop: 2,
  },
  packagePricing: {
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  packagePrice: {
    ...FONTS.h2,
    color: COLORS.primary,
    fontWeight: '700' as const,
  },
  pricePerCredit: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginTop: 2,
  },
  discountBadge: {
    backgroundColor: COLORS.success + '15',
    borderRadius: 12,
    paddingHorizontal: SPACING.s,
    paddingVertical: 6,
    marginBottom: SPACING.s,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: COLORS.success + '30',
  },
  packageDiscount: {
    ...FONTS.body2,
    color: COLORS.success,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  packageFeatures: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureText: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
    flex: 1,
  },
  creditBalanceCard: {
    margin: SPACING.m,
    alignItems: 'center',
    padding: SPACING.l,
  },
  creditBalanceTitle: {
    ...FONTS.body1,
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  creditBalance: {
    ...FONTS.h1,
    fontSize: 48,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  creditBalanceSubtitle: {
    ...FONTS.body2,
    color: COLORS.textLight,
  },
  section: {
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    ...FONTS.body1,
    color: COLORS.textLight,
    marginBottom: SPACING.m,
  },
  purchaseButton: {
    marginTop: SPACING.l,
    backgroundColor: COLORS.gray[300],
  },
  purchaseButtonActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  paymentMethods: {
    alignItems: 'center',
    marginTop: SPACING.l,
    paddingTop: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  paymentMethodsTitle: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginBottom: SPACING.s,
  },
  paymentIcons: {
    flexDirection: 'row',
    gap: SPACING.s,
  },
  paymentIcon: {
    width: 40,
    height: 28,
    backgroundColor: COLORS.gray[100],
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  paymentIconText: {
    fontSize: 16,
  },
  premiumTeaser: {
    backgroundColor: COLORS.warning + '08',
    borderRadius: 20,
    padding: SPACING.l,
    margin: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.warning + '20',
    ...SHADOWS.medium,
  },
  premiumTeaserHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  premiumTeaserIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.warning + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  premiumTeaserTitle: {
    ...FONTS.h2,
    color: COLORS.warning,
    flex: 1,
  },
  premiumBenefitsList: {
    marginBottom: SPACING.l,
  },
  premiumBenefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.s,
  },
  benefitIconSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.s,
    ...SHADOWS.small,
  },
  premiumBenefitText: {
    ...FONTS.body2,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  premiumBenefitBold: {
    fontWeight: '600' as const,
    color: COLORS.warning,
  },
  premiumCTA: {
    alignItems: 'center',
    paddingTop: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.warning + '20',
  },
  premiumCTAText: {
    ...FONTS.body1,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.m,
    fontWeight: '500' as const,
  },
  premiumTeaserButton: {
    minWidth: 160,
    backgroundColor: COLORS.warning,
  },
  howItWorksSection: {
    padding: SPACING.m,
    marginBottom: SPACING.xl,
  },
  stepsContainer: {
    marginBottom: SPACING.l,
  },
  creditExplanationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.l,
    marginBottom: SPACING.l,
    ...SHADOWS.medium,
  },
  creditExplanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  creditExplanationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accent + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  creditExplanationTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    flex: 1,
  },
  creditExplanationText: {
    ...FONTS.body1,
    color: COLORS.textLight,
    lineHeight: 22,
    marginBottom: SPACING.m,
  },
  budgetExamples: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  budgetExample: {
    width: '48%',
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    padding: SPACING.m,
    alignItems: 'center',
    marginBottom: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  budgetRange: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  budgetCredits: {
    ...FONTS.h3,
    color: COLORS.primary,
    fontWeight: '700' as const,
  },
  stepCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.l,
    marginBottom: SPACING.m,
    flexDirection: 'row',
    alignItems: 'flex-start',
    ...SHADOWS.small,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  stepNumberText: {
    color: COLORS.white,
    fontWeight: '700' as const,
    fontSize: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 4,
  },
  stepText: {
    ...FONTS.body2,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  guaranteeSection: {
    backgroundColor: COLORS.success + '10',
    borderRadius: 16,
    padding: SPACING.l,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.success + '30',
  },
  guaranteeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  guaranteeContent: {
    flex: 1,
  },
  guaranteeTitle: {
    ...FONTS.h3,
    color: COLORS.success,
    marginBottom: 4,
  },
  guaranteeText: {
    ...FONTS.body2,
    color: COLORS.textLight,
    lineHeight: 18,
  },

  priceContainer: {
    alignItems: 'center',
  },
  originalPrice: {
    ...FONTS.body2,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
});