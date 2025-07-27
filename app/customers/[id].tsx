import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  User,
  Star,
  Clock,
  CheckCircle,
  Lock,
  Unlock,
  CreditCard,
  Shield,
  Zap,
  Award
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { CUSTOMERS } from '@/mocks/users';
import { PROJECTS } from '@/mocks/projects';
import { useCredits } from '@/hooks/credits-store';

export default function CustomerDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { credits, useCreditsForContact, calculateCreditsForProject, hasEnoughCredits } = useCredits();
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // Find customer by ID (in a real app, this would be an API call)
  const customer = CUSTOMERS.find(c => c.id === id);
  
  // Find customer's projects to calculate required credits
  const customerProjects = PROJECTS.filter(p => p.customerId === id);
  const latestProject = customerProjects[0]; // Use latest project for credit calculation
  const requiredCredits = calculateCreditsForProject(latestProject?.budget);
  const hasCredits = hasEnoughCredits(latestProject?.budget);
  
  if (!customer) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Kunde nicht gefunden</Text>
      </View>
    );
  }

  const handleUnlockContact = async () => {
    if (!hasCredits) {
      Alert.alert(
        'Nicht genügend Credits',
        `Sie benötigen ${requiredCredits} Credits, um diese Kontaktdaten freizuschalten. Sie haben derzeit ${credits} Credits.`,
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      if (latestProject) {
        await useCreditsForContact({ projectId: latestProject.id, projectBudget: latestProject.budget });
        setIsUnlocked(true);
        Alert.alert('Erfolg', 'Kontaktdaten wurden freigeschaltet!');
      }
    } catch (error) {
      Alert.alert('Fehler', 'Kontaktdaten konnten nicht freigeschaltet werden.');
    }
  };

  const handleCall = () => {
    if (!isUnlocked) {
      Alert.alert('Kontakt gesperrt', 'Schalten Sie zuerst die Kontaktdaten frei.');
      return;
    }
    console.log('Calling customer:', customer.phone);
  };

  const handleEmail = () => {
    if (!isUnlocked) {
      Alert.alert('Kontakt gesperrt', 'Schalten Sie zuerst die Kontaktdaten frei.');
      return;
    }
    console.log('Emailing customer:', customer.email);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Kundenprofil',
          headerStyle: { backgroundColor: COLORS.white },
          headerTitleStyle: { color: COLORS.text },
        }} 
      />
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.unlockHeader}>
          <Text style={styles.unlockHeaderTitle}>Kundenkontakt freischalten</Text>
          <Text style={styles.unlockHeaderSubtitle}>
            Erhalten Sie Zugang zu den vollständigen Kontaktdaten
          </Text>
        </View>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceNumber}>{requiredCredits}</Text>
            <Text style={styles.priceLabel}>Credits</Text>
          </View>
          <Text style={styles.priceDescription}>
            Benötigt für die Freischaltung
          </Text>
        </View>

        {/* Available Credits */}
        <View style={styles.availableCredits}>
          <View style={styles.creditsRow}>
            <CreditCard size={20} color={COLORS.primary} />
            <Text style={styles.creditsText}>
              Verfügbare Credits: <Text style={styles.creditsNumber}>{credits}</Text>
            </Text>
          </View>
          {!hasCredits && (
            <Text style={styles.creditsWarning}>
              Sie benötigen {requiredCredits - credits} weitere Credits
            </Text>
          )}
        </View>

        {/* Benefits List */}
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>Was Sie erhalten:</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Phone size={16} color={COLORS.success} />
              <Text style={styles.benefitText}>Direkte Telefonnummer</Text>
            </View>
            <View style={styles.benefitItem}>
              <Mail size={16} color={COLORS.success} />
              <Text style={styles.benefitText}>E-Mail-Adresse</Text>
            </View>
            <View style={styles.benefitItem}>
              <MapPin size={16} color={COLORS.success} />
              <Text style={styles.benefitText}>Vollständige Adresse</Text>
            </View>
            <View style={styles.benefitItem}>
              <Shield size={16} color={COLORS.success} />
              <Text style={styles.benefitText}>Verifizierte Kontaktdaten</Text>
            </View>
          </View>
        </View>

        {/* Customer Card with Lock Overlay */}
        <View style={styles.customerCardSection}>
          <Card style={styles.customerCard}>
            <View style={styles.customerHeader}>
              <View style={styles.avatarContainer}>
                {customer.profileImage ? (
                  <Image source={{ uri: customer.profileImage }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <User size={24} color={COLORS.white} />
                  </View>
                )}
              </View>
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{customer.name}</Text>
                <Text style={styles.customerLocation}>
                  {customer.location?.city}, {customer.location?.canton}
                </Text>
              </View>
            </View>

            {/* Contact Information - Blurred if locked */}
            <View style={[styles.contactInfo, !isUnlocked && styles.lockedContent]}>
              <View style={styles.contactRow}>
                <Mail size={16} color={COLORS.textLight} />
                <Text style={styles.contactText}>
                  {isUnlocked ? customer.email : '••••••@••••••.ch'}
                </Text>
              </View>
              {customer.phone && (
                <View style={styles.contactRow}>
                  <Phone size={16} color={COLORS.textLight} />
                  <Text style={styles.contactText}>
                    {isUnlocked ? customer.phone : '+41 •• ••• •• ••'}
                  </Text>
                </View>
              )}
              <View style={styles.contactRow}>
                <MapPin size={16} color={COLORS.textLight} />
                <Text style={styles.contactText}>
                  {isUnlocked 
                    ? `${customer.location?.address}, ${customer.location?.city}` 
                    : '••••••••••••, ••••••••'
                  }
                </Text>
              </View>
            </View>

            {/* Lock Overlay */}
            {!isUnlocked && (
              <View style={styles.lockOverlay}>
                <View style={styles.lockIcon}>
                  <Lock size={24} color={COLORS.white} />
                </View>
              </View>
            )}
          </Card>
        </View>

        {/* Unlock Button */}
        <View style={styles.unlockButtonSection}>
          <Button
            title={isUnlocked 
              ? "Kontakt freigeschaltet" 
              : `Antippen zum Freischalten - ${requiredCredits} Credits`
            }
            onPress={handleUnlockContact}
            disabled={isUnlocked}
            icon={isUnlocked 
              ? <Unlock size={16} color={COLORS.white} /> 
              : <Lock size={16} color={COLORS.white} />
            }
            style={[
              styles.unlockButton,
              isUnlocked && styles.unlockedButton,
              !hasCredits && styles.disabledButton
            ]}
          />
          
          {isUnlocked && (
            <View style={styles.contactActions}>
              <Button
                title="Anrufen"
                onPress={handleCall}
                icon={<Phone size={16} color={COLORS.white} />}
                style={styles.actionButton}
              />
              <Button
                title="E-Mail"
                onPress={handleEmail}
                variant="outline"
                icon={<Mail size={16} color={COLORS.primary} />}
                style={styles.actionButton}
              />
            </View>
          )}
        </View>

        {/* Additional Information - Only shown after unlock */}
        {isUnlocked && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Projekthistorie</Text>
              
              <Card style={styles.historyCard}>
                <View style={styles.historyStats}>
                  <View style={styles.historyStat}>
                    <Text style={styles.historyStatValue}>{customer.projects?.length || 0}</Text>
                    <Text style={styles.historyStatLabel}>Projekte erstellt</Text>
                  </View>
                  <View style={styles.historyStat}>
                    <Text style={styles.historyStatValue}>4.2</Text>
                    <Text style={styles.historyStatLabel}>Ø Bewertung</Text>
                  </View>
                  <View style={styles.historyStat}>
                    <Text style={styles.historyStatValue}>95%</Text>
                    <Text style={styles.historyStatLabel}>Abschlussrate</Text>
                  </View>
                </View>
              </Card>
            </View>

            {customer.preferredContactMethod && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Bevorzugte Kontaktart</Text>
                
                <Card style={styles.preferenceCard}>
                  <View style={styles.preferenceIcon}>
                    {customer.preferredContactMethod === 'phone' ? (
                      <Phone size={24} color={COLORS.success} />
                    ) : customer.preferredContactMethod === 'email' ? (
                      <Mail size={24} color={COLORS.success} />
                    ) : (
                      <CheckCircle size={24} color={COLORS.success} />
                    )}
                  </View>
                  <View style={styles.preferenceContent}>
                    <Text style={styles.preferenceTitle}>
                      {customer.preferredContactMethod === 'phone' 
                        ? 'Telefonisch' 
                        : customer.preferredContactMethod === 'email'
                        ? 'Per E-Mail'
                        : 'Telefon oder E-Mail'
                      }
                    </Text>
                    <Text style={styles.preferenceText}>
                      {customer.preferredContactMethod === 'phone' 
                        ? 'Dieser Kunde bevorzugt telefonischen Kontakt.'
                        : customer.preferredContactMethod === 'email'
                        ? 'Dieser Kunde bevorzugt E-Mail-Kontakt.'
                        : 'Dieser Kunde ist sowohl telefonisch als auch per E-Mail erreichbar.'
                      }
                    </Text>
                  </View>
                </Card>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tipps für die Kontaktaufnahme</Text>
              
              <Card style={styles.tipsCard}>
                <View style={styles.tip}>
                  <Clock size={16} color={COLORS.info} />
                  <Text style={styles.tipText}>
                    Antworten Sie schnell - Kunden schätzen eine zeitnahe Rückmeldung.
                  </Text>
                </View>
                <View style={styles.tip}>
                  <Star size={16} color={COLORS.warning} />
                  <Text style={styles.tipText}>
                    Stellen Sie konkrete Fragen zum Projekt, um ein präzises Angebot zu erstellen.
                  </Text>
                </View>
                <View style={styles.tip}>
                  <CheckCircle size={16} color={COLORS.success} />
                  <Text style={styles.tipText}>
                    Seien Sie professionell und höflich in der Kommunikation.
                  </Text>
                </View>
              </Card>
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  
  // Header Section
  unlockHeader: {
    backgroundColor: COLORS.white,
    padding: SPACING.l,
    paddingTop: SPACING.xl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[100],
  },
  unlockHeaderTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  unlockHeaderSubtitle: {
    ...FONTS.body2,
    color: COLORS.textLight,
    textAlign: 'center',
  },

  // Price Section
  priceSection: {
    backgroundColor: COLORS.white,
    padding: SPACING.l,
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  priceNumber: {
    fontSize: 48,
    fontWeight: '700' as const,
    color: COLORS.primary,
    lineHeight: 56,
  },
  priceLabel: {
    ...FONTS.h3,
    color: COLORS.primary,
    marginTop: -SPACING.xs,
  },
  priceDescription: {
    ...FONTS.body2,
    color: COLORS.textLight,
    textAlign: 'center',
  },

  // Available Credits
  availableCredits: {
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    borderRadius: 12,
    marginHorizontal: SPACING.m,
    ...SHADOWS.small,
  },
  creditsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  creditsText: {
    ...FONTS.body1,
    color: COLORS.text,
    marginLeft: SPACING.s,
  },
  creditsNumber: {
    fontWeight: '600' as const,
    color: COLORS.primary,
  },
  creditsWarning: {
    ...FONTS.body2,
    color: COLORS.error,
    fontStyle: 'italic',
  },

  // Benefits Section
  benefitsSection: {
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    borderRadius: 12,
    marginHorizontal: SPACING.m,
    ...SHADOWS.small,
  },
  benefitsTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  benefitsList: {
    gap: SPACING.s,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    ...FONTS.body2,
    color: COLORS.text,
    marginLeft: SPACING.s,
  },

  // Customer Card Section
  customerCardSection: {
    marginHorizontal: SPACING.m,
    marginBottom: SPACING.m,
  },
  customerCard: {
    position: 'relative',
    padding: SPACING.m,
    ...SHADOWS.medium,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  avatarContainer: {
    marginRight: SPACING.m,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  customerLocation: {
    ...FONTS.body2,
    color: COLORS.textLight,
  },
  contactInfo: {
    gap: SPACING.s,
  },
  lockedContent: {
    opacity: 0.5,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    ...FONTS.body2,
    color: COLORS.text,
    marginLeft: SPACING.s,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  lockIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Unlock Button Section
  unlockButtonSection: {
    padding: SPACING.m,
    paddingBottom: SPACING.xl,
  },
  unlockButton: {
    marginBottom: SPACING.m,
  },
  unlockedButton: {
    backgroundColor: COLORS.success,
  },
  disabledButton: {
    opacity: 0.6,
  },
  contactActions: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  actionButton: {
    flex: 1,
  },

  // Additional sections
  section: {
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  preferenceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
  },
  preferenceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  preferenceContent: {
    flex: 1,
  },
  preferenceTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  preferenceText: {
    ...FONTS.body2,
    color: COLORS.textLight,
  },
  historyCard: {
    padding: SPACING.m,
  },
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  historyStat: {
    alignItems: 'center',
  },
  historyStatValue: {
    ...FONTS.h2,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  historyStatLabel: {
    ...FONTS.body2,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  tipsCard: {
    padding: SPACING.m,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.m,
  },
  tipText: {
    ...FONTS.body2,
    color: COLORS.text,
    marginLeft: SPACING.s,
    flex: 1,
    lineHeight: 20,
  },
  errorText: {
    ...FONTS.h3,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
});