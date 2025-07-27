import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Crown, Check, Star, Zap, TrendingUp, CreditCard, Shield, Award, Users, Clock, Sparkles, Lock } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { useCredits } from '@/hooks/credits-store';
import { Subscription } from '@/types';
import Card from '@/components/Card';
import Button from '@/components/Button';
import SubscriptionCard from '@/components/SubscriptionCard';

const { width } = Dimensions.get('window');

export default function PremiumScreen() {
  const router = useRouter();
  const { 
    subscription, 
    subscriptionOptions,
    subscribe,
    cancelSubscription,
    hasPremium
  } = useCredits();
  
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(
    subscriptionOptions.find(sub => sub.billingCycle === 'monthly') || null
  );
  
  const handleSubscribe = () => {
    if (!selectedSubscription) {
      Alert.alert('Fehler', 'Bitte wählen Sie ein Abonnement aus.');
      return;
    }
    
    Alert.alert(
      'Premium-Abo abschließen',
      `Möchten Sie das ${selectedSubscription.name} für CHF ${selectedSubscription.price} abschließen?`,
      [
        {
          text: 'Abbrechen',
          style: 'cancel',
        },
        {
          text: 'Abonnieren',
          onPress: () => {
            subscribe(selectedSubscription);
            Alert.alert(
              'Willkommen bei Premium!',
              `Sie haben erfolgreich das ${selectedSubscription.name} abgeschlossen.`,
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };
  
  const handleCancelSubscription = () => {
    Alert.alert(
      'Abo kündigen',
      'Möchten Sie Ihr Premium-Abo wirklich kündigen? Sie verlieren alle Premium-Vorteile.',
      [
        {
          text: 'Abbrechen',
          style: 'cancel',
        },
        {
          text: 'Kündigen',
          onPress: () => {
            cancelSubscription();
            Alert.alert(
              'Abo gekündigt',
              'Ihr Premium-Abo wurde erfolgreich gekündigt.',
              [{ text: 'OK' }]
            );
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Premium Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroBackground}>
          <View style={styles.sparkleContainer}>
            <Sparkles size={20} color={COLORS.warning} style={styles.sparkle1} />
            <Sparkles size={16} color={COLORS.warning} style={styles.sparkle2} />
            <Sparkles size={18} color={COLORS.warning} style={styles.sparkle3} />
          </View>
          <View style={styles.heroIcon}>
            <Crown size={40} color={COLORS.warning} />
          </View>
          <Text style={styles.heroTitle}>Premium Mitgliedschaft</Text>
          <Text style={styles.heroSubtitle}>
            Werden Sie zum bevorzugten Handwerker und maximieren Sie Ihren Erfolg
          </Text>
          
          {/* Trust Badges */}
          <View style={styles.trustBadges}>
            <View style={styles.trustBadge}>
              <Shield size={16} color={COLORS.success} />
              <Text style={styles.trustBadgeText}>100% Sicher</Text>
            </View>
            <View style={styles.trustBadge}>
              <Award size={16} color={COLORS.success} />
              <Text style={styles.trustBadgeText}>Verifiziert</Text>
            </View>
            <View style={styles.trustBadge}>
              <Users size={16} color={COLORS.success} />
              <Text style={styles.trustBadgeText}>2000+ Mitglieder</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Success Stats */}
      <View style={styles.statsSection}>
        <View style={styles.separatorLine} />
        <Text style={styles.statsTitle}>Premium-Mitglieder sind erfolgreicher</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3x</Text>
            <Text style={styles.statLabel}>Mehr Anfragen</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>40%</Text>
            <Text style={styles.statLabel}>Höhere Erfolgsrate</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24h</Text>
            <Text style={styles.statLabel}>Vorab-Zugang</Text>
          </View>
        </View>
      </View>
      
      {hasPremium ? (
        <View style={styles.activePremiumSection}>
          <Card style={styles.currentSubscriptionCard}>
            <View style={styles.premiumBadge}>
              <Crown size={20} color={COLORS.white} />
              <Text style={styles.premiumBadgeText}>PREMIUM AKTIV</Text>
            </View>
            
            <Text style={styles.currentSubscriptionTitle}>Ihr Premium-Abo</Text>
            <Text style={styles.currentSubscriptionName}>{subscription?.name}</Text>
            <Text style={styles.currentSubscriptionPrice}>
              CHF {subscription?.price} / {subscription?.billingCycle === 'monthly' ? 'Monat' : 'Jahr'}
            </Text>
            
            <View style={styles.benefitsActive}>
              <Text style={styles.benefitsTitle}>Ihre aktiven Vorteile:</Text>
              {subscription?.features.map((feature, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Check size={16} color={COLORS.success} />
                  <Text style={styles.benefitText}>{feature}</Text>
                </View>
              ))}
              <View style={styles.creditDiscountHighlight}>
                <Text style={styles.creditDiscountTitle}>
                  🎉 Sie sparen {subscription?.creditDiscount}% bei jedem Credit-Kauf!
                </Text>
                <Text style={styles.creditDiscountSubtitle}>
                  Ihr Premium-Rabatt wird automatisch beim Kauf angewendet.
                </Text>
              </View>
            </View>
            
            <Button 
              title="Abo verwalten" 
              onPress={handleCancelSubscription}
              variant="outline"
              style={styles.manageButton}
            />
          </Card>
        </View>
      ) : (
        <>
          {/* Premium Benefits */}
          <View style={styles.benefitsSection}>
            <Text style={styles.sectionTitle}>Exklusive Premium-Vorteile</Text>
            <Text style={styles.sectionSubtitle}>
              Alles was Sie brauchen, um mehr Kunden zu gewinnen und erfolgreicher zu werden
            </Text>
            
            <View style={styles.benefitsGrid}>
              <Card style={[styles.benefitCard, styles.primaryBenefit]}>
                <View style={styles.benefitHeader}>
                  <View style={styles.benefitIcon}>
                    <Clock size={24} color={COLORS.warning} />
                  </View>
                  <View style={styles.benefitBadge}>
                    <Text style={styles.benefitBadgeText}>EXKLUSIV</Text>
                  </View>
                </View>
                <Text style={styles.benefitCardTitle}>24h Vorab-Zugang</Text>
                <Text style={styles.benefitCardText}>
                  Sehen Sie neue Projekte einen ganzen Tag früher als andere Handwerker. Erste Angebote haben die höchste Erfolgsrate!
                </Text>
                <View style={styles.benefitStats}>
                  <Text style={styles.benefitStatsText}>⚡ 85% höhere Erfolgsrate bei ersten Angeboten</Text>
                </View>
              </Card>
              
              <Card style={styles.benefitCard}>
                <View style={styles.benefitIcon}>
                  <TrendingUp size={24} color={COLORS.success} />
                </View>
                <Text style={styles.benefitCardTitle}>Bevorzugte Platzierung</Text>
                <Text style={styles.benefitCardText}>
                  Ihr Profil wird in Suchergebnissen und Projektempfehlungen bevorzugt angezeigt. Kunden sehen Sie zuerst!
                </Text>
                <View style={styles.benefitStats}>
                  <Text style={styles.benefitStatsText}>📈 3x mehr Profilaufrufe garantiert</Text>
                </View>
              </Card>
              
              <Card style={styles.benefitCard}>
                <View style={styles.benefitIcon}>
                  <Star size={24} color={COLORS.warning} />
                </View>
                <Text style={styles.benefitCardTitle}>Premium-Badge</Text>
                <Text style={styles.benefitCardText}>
                  Das goldene Premium-Badge zeigt Kunden Ihre Professionalität und Zuverlässigkeit. Vertrauen schafft Aufträge!
                </Text>
                <View style={styles.benefitStats}>
                  <Text style={styles.benefitStatsText}>⭐ 40% mehr Kundenanfragen</Text>
                </View>
              </Card>
              
              <Card style={[styles.benefitCard, styles.savingsCard]}>
                <View style={styles.benefitIcon}>
                  <CreditCard size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.benefitCardTitle}>Credit-Rabatte</Text>
                <Text style={styles.benefitCardText}>
                  Sparen Sie bei jedem Credit-Kauf und reduzieren Sie Ihre Akquisitionskosten erheblich.
                </Text>
                <View style={styles.savingsHighlight}>
                  <Text style={styles.savingsAmount}>Bis zu 25% Rabatt</Text>
                  <Text style={styles.savingsText}>auf alle Credit-Pakete</Text>
                </View>
              </Card>
            </View>
          </View>

          {/* Money Back Guarantee */}
          <View style={styles.guaranteeSection}>
            <Card style={styles.guaranteeCard}>
              <View style={styles.guaranteeIcon}>
                <Shield size={32} color={COLORS.success} />
              </View>
              <Text style={styles.guaranteeTitle}>14-Tage Geld-zurück-Garantie</Text>
              <Text style={styles.guaranteeText}>
                Nicht zufrieden? Kein Problem! Sie erhalten Ihr Geld innerhalb von 14 Tagen vollständig zurück. Ohne Fragen, ohne Aufwand.
              </Text>
              <View style={styles.guaranteeFeatures}>
                <View style={styles.guaranteeFeature}>
                  <Check size={16} color={COLORS.success} />
                  <Text style={styles.guaranteeFeatureText}>100% Geld-zurück</Text>
                </View>
                <View style={styles.guaranteeFeature}>
                  <Check size={16} color={COLORS.success} />
                  <Text style={styles.guaranteeFeatureText}>Keine Fragen gestellt</Text>
                </View>
                <View style={styles.guaranteeFeature}>
                  <Check size={16} color={COLORS.success} />
                  <Text style={styles.guaranteeFeatureText}>Sofortige Bearbeitung</Text>
                </View>
              </View>
            </Card>
          </View>
          
          {/* Subscription Plans */}
          <View style={styles.subscriptionSection}>
            <Text style={styles.sectionTitle}>Wählen Sie Ihr Premium-Paket</Text>
            <Text style={styles.sectionSubtitle}>
              Alle Pläne beinhalten die gleichen Premium-Vorteile. Sparen Sie mit längeren Laufzeiten!
            </Text>
            
            <View style={styles.plansContainer}>
              {subscriptionOptions.map(sub => (
                <SubscriptionCard
                  key={sub.id}
                  subscription={sub}
                  onPress={(s) => setSelectedSubscription(s)}
                  selected={selectedSubscription?.id === sub.id}
                />
              ))}
            </View>
            
            {/* Security Features */}
            <View style={styles.securityFeatures}>
              <View style={styles.securityFeature}>
                <Lock size={16} color={COLORS.success} />
                <Text style={styles.securityText}>SSL-verschlüsselt</Text>
              </View>
              <View style={styles.securityFeature}>
                <Shield size={16} color={COLORS.success} />
                <Text style={styles.securityText}>Sichere Zahlung</Text>
              </View>
              <View style={styles.securityFeature}>
                <Award size={16} color={COLORS.success} />
                <Text style={styles.securityText}>Schweizer Qualität</Text>
              </View>
            </View>
            
            <Button 
              title={selectedSubscription ? `Premium werden - CHF ${selectedSubscription.price}` : "Premium werden"} 
              onPress={handleSubscribe}
              style={[styles.subscribeButton, selectedSubscription && styles.subscribeButtonActive]}
              disabled={!selectedSubscription}
            />
            
            <Text style={styles.subscribeDisclaimer}>
              Jederzeit kündbar • 14-Tage Geld-zurück-Garantie • Keine versteckten Kosten
            </Text>
          </View>
        </>
      )}
      
      {/* Testimonials */}
      <View style={styles.testimonialsSection}>
        <Text style={styles.sectionTitle}>Was unsere Premium-Mitglieder sagen</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.testimonialsScroll}>
          <Card style={styles.testimonialCard}>
            <View style={styles.testimonialHeader}>
              <View style={styles.testimonialAvatar}>
                <Text style={styles.testimonialInitials}>MK</Text>
              </View>
              <View>
                <Text style={styles.testimonialName}>Marco K.</Text>
                <Text style={styles.testimonialRole}>Elektriker, Zürich</Text>
              </View>
            </View>
            <Text style={styles.testimonialText}>
              "Seit ich Premium bin, erhalte ich 3x mehr Anfragen. Der 24h Vorab-Zugang ist Gold wert!"
            </Text>
            <View style={styles.testimonialRating}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} color={COLORS.warning} fill={COLORS.warning} />
              ))}
            </View>
          </Card>
          
          <Card style={styles.testimonialCard}>
            <View style={styles.testimonialHeader}>
              <View style={styles.testimonialAvatar}>
                <Text style={styles.testimonialInitials}>SB</Text>
              </View>
              <View>
                <Text style={styles.testimonialName}>Stefan B.</Text>
                <Text style={styles.testimonialRole}>Sanitär, Basel</Text>
              </View>
            </View>
            <Text style={styles.testimonialText}>
              "Die Credit-Rabatte haben sich bereits nach einem Monat amortisiert. Klare Empfehlung!"
            </Text>
            <View style={styles.testimonialRating}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} color={COLORS.warning} fill={COLORS.warning} />
              ))}
            </View>
          </Card>
          
          <Card style={styles.testimonialCard}>
            <View style={styles.testimonialHeader}>
              <View style={styles.testimonialAvatar}>
                <Text style={styles.testimonialInitials}>LM</Text>
              </View>
              <View>
                <Text style={styles.testimonialName}>Lisa M.</Text>
                <Text style={styles.testimonialRole}>Malerin, Bern</Text>
              </View>
            </View>
            <Text style={styles.testimonialText}>
              "Das Premium-Badge schafft sofort Vertrauen. Kunden kontaktieren mich viel häufiger!"
            </Text>
            <View style={styles.testimonialRating}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} color={COLORS.warning} fill={COLORS.warning} />
              ))}
            </View>
          </Card>
        </ScrollView>
      </View>

      {/* FAQ Section */}
      <View style={styles.faqSection}>
        <Text style={styles.sectionTitle}>Häufige Fragen</Text>
        
        <Card style={styles.faqCard}>
          <Text style={styles.faqQuestion}>Kann ich mein Abo jederzeit kündigen?</Text>
          <Text style={styles.faqAnswer}>
            Ja, Sie können Ihr Premium-Abo jederzeit mit einem Klick kündigen. Die Kündigung wird zum Ende der aktuellen Abrechnungsperiode wirksam.
          </Text>
        </Card>
        
        <Card style={styles.faqCard}>
          <Text style={styles.faqQuestion}>Wie funktioniert die Geld-zurück-Garantie?</Text>
          <Text style={styles.faqAnswer}>
            Innerhalb von 14 Tagen nach dem Kauf erhalten Sie Ihr Geld vollständig zurück - ohne Fragen, ohne Aufwand. Einfach eine E-Mail genügt.
          </Text>
        </Card>
        
        <Card style={styles.faqCard}>
          <Text style={styles.faqQuestion}>Wann werden die Credit-Rabatte angewendet?</Text>
          <Text style={styles.faqAnswer}>
            Ihre Premium-Rabatte werden automatisch beim Credit-Kauf angewendet. Sie sehen die Ersparnis direkt im Warenkorb.
          </Text>
        </Card>
        
        <Card style={styles.faqCard}>
          <Text style={styles.faqQuestion}>Ist die Zahlung sicher?</Text>
          <Text style={styles.faqAnswer}>
            Ja, alle Zahlungen sind SSL-verschlüsselt und werden über sichere Schweizer Zahlungsanbieter abgewickelt. Ihre Daten sind bei uns sicher.
          </Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Hero Section
  heroSection: {
    backgroundColor: COLORS.white,
    paddingBottom: SPACING.xl,
  },
  heroBackground: {
    background: `linear-gradient(135deg, ${COLORS.primary}05 0%, ${COLORS.warning}10 100%)`,
    alignItems: 'center',
    padding: SPACING.xl,
    position: 'relative',
  },
  sparkleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sparkle1: {
    position: 'absolute',
    top: 30,
    left: 40,
  },
  sparkle2: {
    position: 'absolute',
    top: 60,
    right: 50,
  },
  sparkle3: {
    position: 'absolute',
    bottom: 80,
    left: 60,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.warning + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.m,
    shadowColor: COLORS.warning,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  heroTitle: {
    ...FONTS.h1,
    color: COLORS.text,
    marginBottom: SPACING.s,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '800' as const,
  },
  heroSubtitle: {
    ...FONTS.body1,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.l,
    lineHeight: 24,
  },
  trustBadges: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: SPACING.s,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.success + '20',
  },
  trustBadgeText: {
    ...FONTS.caption,
    color: COLORS.success,
    fontWeight: '600' as const,
    marginLeft: 4,
  },

  // Stats Section
  statsSection: {
    backgroundColor: COLORS.white,
    padding: SPACING.l,
    marginBottom: SPACING.m,
  },
  statsTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.l,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    ...FONTS.body2,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  
  // Separator Line
  separatorLine: {
    height: 1,
    backgroundColor: COLORS.gray[200],
    marginHorizontal: SPACING.l,
    marginVertical: SPACING.m,
  },

  // Active Premium Section
  activePremiumSection: {
    padding: SPACING.m,
  },
  currentSubscriptionCard: {
    alignItems: 'center',
    padding: SPACING.l,
    backgroundColor: COLORS.warning + '10',
    borderWidth: 2,
    borderColor: COLORS.warning,
    shadowColor: COLORS.warning,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    marginBottom: SPACING.m,
    shadowColor: COLORS.warning,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  premiumBadgeText: {
    color: COLORS.white,
    fontWeight: '700' as const,
    marginLeft: 6,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  currentSubscriptionTitle: {
    ...FONTS.body1,
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  currentSubscriptionName: {
    ...FONTS.h2,
    color: COLORS.warning,
    marginBottom: SPACING.xs,
  },
  currentSubscriptionPrice: {
    ...FONTS.body1,
    color: COLORS.textLight,
    marginBottom: SPACING.l,
  },
  benefitsActive: {
    width: '100%',
    marginBottom: SPACING.l,
  },
  benefitsTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  benefitText: {
    ...FONTS.body2,
    color: COLORS.text,
    marginLeft: SPACING.s,
    flex: 1,
  },
  manageButton: {
    minWidth: 200,
  },
  // Benefits Section
  benefitsSection: {
    paddingVertical: SPACING.l,
    paddingHorizontal: SPACING.m,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SPACING.s,
    textAlign: 'center',
  },
  sectionSubtitle: {
    ...FONTS.body1,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.l,
    lineHeight: 22,
  },
  benefitsGrid: {
    gap: SPACING.m,
    marginHorizontal: SPACING.xs,
  },
  benefitCard: {
    padding: SPACING.l,
    alignItems: 'center',
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  primaryBenefit: {
    backgroundColor: COLORS.warning + '05',
    borderWidth: 2,
    borderColor: COLORS.warning + '30',
  },
  benefitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: SPACING.m,
  },
  benefitIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignSelf: 'center',
    marginBottom: SPACING.m,
  },
  benefitBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  benefitBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  benefitCardTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.s,
    textAlign: 'center',
    fontWeight: '700' as const,
  },
  benefitCardText: {
    ...FONTS.body1,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.m,
  },
  benefitStats: {
    backgroundColor: COLORS.accent + '10',
    borderRadius: 12,
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.accent + '20',
    width: '100%',
  },
  benefitStatsText: {
    ...FONTS.body2,
    color: COLORS.accent,
    textAlign: 'center',
    fontWeight: '600' as const,
  },
  savingsCard: {
    backgroundColor: COLORS.primary + '05',
    borderWidth: 2,
    borderColor: COLORS.primary + '20',
  },
  savingsHighlight: {
    backgroundColor: COLORS.primary + '10',
    borderRadius: 12,
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
    width: '100%',
    alignItems: 'center',
  },
  savingsAmount: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: COLORS.primary,
    marginBottom: 4,
  },
  savingsText: {
    ...FONTS.body2,
    color: COLORS.primary,
    fontWeight: '600' as const,
  },

  // Guarantee Section
  guaranteeSection: {
    padding: SPACING.l,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.m,
  },
  guaranteeCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.success + '05',
    borderWidth: 2,
    borderColor: COLORS.success + '20',
  },
  guaranteeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.m,
  },
  guaranteeTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SPACING.s,
    textAlign: 'center',
    fontWeight: '800' as const,
  },
  guaranteeText: {
    ...FONTS.body1,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.l,
  },
  guaranteeFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    flexWrap: 'wrap',
    gap: SPACING.m,
  },
  guaranteeFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.success + '20',
  },
  guaranteeFeatureText: {
    ...FONTS.body2,
    color: COLORS.success,
    marginLeft: 6,
    fontWeight: '600' as const,
  },
  // Subscription Section
  subscriptionSection: {
    padding: SPACING.l,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.m,
  },
  plansContainer: {
    marginBottom: SPACING.l,
  },
  securityFeatures: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: SPACING.m,
    marginBottom: SPACING.l,
  },
  securityFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  securityText: {
    ...FONTS.caption,
    color: COLORS.textLight,
    marginLeft: 4,
    fontWeight: '500' as const,
  },
  subscribeButton: {
    marginBottom: SPACING.s,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  subscribeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  subscribeDisclaimer: {
    ...FONTS.caption,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Testimonials Section
  testimonialsSection: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.l,
    marginBottom: SPACING.m,
  },
  testimonialsScroll: {
    paddingLeft: SPACING.l,
  },
  testimonialCard: {
    width: width * 0.8,
    marginRight: SPACING.m,
    padding: SPACING.l,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  testimonialAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  testimonialInitials: {
    color: COLORS.white,
    fontWeight: '700' as const,
    fontSize: 16,
  },
  testimonialName: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: 2,
  },
  testimonialRole: {
    ...FONTS.caption,
    color: COLORS.textLight,
  },
  testimonialText: {
    ...FONTS.body1,
    color: COLORS.textLight,
    lineHeight: 22,
    marginBottom: SPACING.m,
    fontStyle: 'italic',
  },
  testimonialRating: {
    flexDirection: 'row',
    gap: 2,
  },
  // FAQ Section
  faqSection: {
    padding: SPACING.l,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.xl,
  },
  faqCard: {
    marginBottom: SPACING.m,
    padding: SPACING.l,
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  faqQuestion: {
    ...FONTS.h4,
    color: COLORS.text,
    marginBottom: SPACING.s,
    fontWeight: '700' as const,
  },
  faqAnswer: {
    ...FONTS.body1,
    color: COLORS.textLight,
    lineHeight: 24,
  },
  creditDiscountHighlight: {
    backgroundColor: COLORS.warning + '20',
    borderRadius: 12,
    padding: SPACING.l,
    marginTop: SPACING.m,
    borderWidth: 2,
    borderColor: COLORS.warning + '40',
    shadowColor: COLORS.warning,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  creditDiscountTitle: {
    ...FONTS.h3,
    color: COLORS.warning,
    marginBottom: SPACING.xs,
    textAlign: 'center',
    fontWeight: '800' as const,
  },
  creditDiscountSubtitle: {
    ...FONTS.body2,
    color: COLORS.textLight,
    textAlign: 'center',
    fontWeight: '500' as const,
  },
});