import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Linking, Platform, Image, RefreshControl } from 'react-native';
import { useRouter, Stack, useFocusEffect } from 'expo-router';
import { Phone, Mail, Copy, MapPin, User } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { COLORS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import Card from '@/components/Card';
import { useCredits } from '@/hooks/credits-store';



export default function UnlockedContactsScreen() {
  const router = useRouter();
  const { unlockedContacts, refreshUnlockedContacts, isLoading } = useCredits();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Refresh data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.log('UnlockedContacts screen focused, refreshing data...');
      refreshUnlockedContacts();
    }, [refreshUnlockedContacts])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    refreshUnlockedContacts();
    // Add a small delay to show the refresh indicator
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handlePhoneCall = (phoneNumber: string) => {
    if (Platform.OS === 'web') {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(phoneNumber);
        Alert.alert('Kopiert', 'Telefonnummer wurde in die Zwischenablage kopiert.');
      } else {
        Alert.alert('Telefonnummer', phoneNumber);
      }
      return;
    }

    const phoneUrl = `tel:${phoneNumber}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Fehler', 'Telefon-App konnte nicht geöffnet werden.');
        }
      })
      .catch(() => Alert.alert('Fehler', 'Beim Öffnen der Telefon-App ist ein Fehler aufgetreten.'));
  };

  const handleEmailCopy = async (email: string) => {
    try {
      if (Platform.OS === 'web') {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(email);
          Alert.alert('Kopiert', 'E-Mail-Adresse wurde in die Zwischenablage kopiert.');
        } else {
          Alert.alert('E-Mail-Adresse', email);
        }
      } else {
        await Clipboard.setStringAsync(email);
        Alert.alert('Kopiert', 'E-Mail-Adresse wurde in die Zwischenablage kopiert.');
      }
    } catch {
      Alert.alert('Fehler', 'E-Mail-Adresse konnte nicht kopiert werden.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Freigeschaltete Kontakte',
          headerBackTitle: 'Profil',
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            color: COLORS.white,
          },
        }} 
      />
      
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ihre freigeschalteten Kontakte</Text>
          <Text style={styles.headerSubtitle}>
            Hier finden Sie alle Kundenkontakte, die Sie mit Credits freigeschaltet haben.
          </Text>
        </View>

        {unlockedContacts
          .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
          .map((contact) => (
          <Card key={contact.id} style={styles.contactCard}>
            <View style={styles.contactHeader}>
              <View style={styles.contactHeaderLeft}>
                <View style={styles.profileImageContainer}>
                  {contact.profileImage ? (
                    <Image source={{ uri: contact.profileImage }} style={styles.profileImage} />
                  ) : (
                    <View style={styles.profileImagePlaceholder}>
                      <User size={20} color={COLORS.white} />
                    </View>
                  )}
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.projectTitle}>{contact.projectTitle}</Text>
                  <Text style={styles.unlockedDate}>
                    Freigeschaltet am {formatDate(contact.unlockedAt)}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.viewProjectButton}
                onPress={() => router.push(`/projects/${contact.projectId}`)}
              >
                <Text style={styles.viewProjectText}>Projekt anzeigen</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.contactDetails}>
              {contact.phone && (
                <TouchableOpacity 
                  style={styles.contactItem}
                  onPress={() => handlePhoneCall(contact.phone)}
                  activeOpacity={0.7}
                >
                  <Phone size={20} color={COLORS.primary} />
                  <Text style={[styles.contactText, styles.clickableText]}>{contact.phone}</Text>
                  <Copy size={16} color={COLORS.textLight} style={styles.copyIcon} />
                </TouchableOpacity>
              )}

              {contact.email && (
                <TouchableOpacity 
                  style={styles.contactItem}
                  onPress={() => handleEmailCopy(contact.email)}
                  activeOpacity={0.7}
                >
                  <Mail size={20} color={COLORS.primary} />
                  <Text style={[styles.contactText, styles.clickableText]}>{contact.email}</Text>
                  <Copy size={16} color={COLORS.textLight} style={styles.copyIcon} />
                </TouchableOpacity>
              )}

              <View style={styles.contactItem}>
                <MapPin size={20} color={COLORS.textLight} />
                <Text style={styles.contactText}>{contact.address}</Text>
              </View>

              <View style={styles.budgetSection}>
                <Text style={styles.budgetLabel}>Projektbudget</Text>
                <Text style={styles.budgetValue}>{contact.budget}</Text>
              </View>
            </View>
          </Card>
        ))}

        {unlockedContacts.length === 0 && !isLoading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Keine freigeschalteten Kontakte</Text>
            <Text style={styles.emptyStateText}>
              Sie haben noch keine Kundenkontakte freigeschaltet. Schauen Sie sich verfügbare Projekte an und schalten Sie Kontakte frei, um direkt mit Kunden in Verbindung zu treten.
            </Text>
            <TouchableOpacity 
              style={styles.browseProjectsButton}
              onPress={() => router.push('/(tabs)/projects')}
            >
              <Text style={styles.browseProjectsText}>Projekte durchsuchen</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    padding: SPACING.l,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  headerTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    ...FONTS.body2,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  contactCard: {
    margin: SPACING.m,
    padding: SPACING.l,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.m,
    paddingBottom: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  contactHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  profileImageContainer: {
    marginRight: SPACING.m,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  projectTitle: {
    ...FONTS.body1,
    color: COLORS.primary,
    fontWeight: '600' as const,
    marginBottom: SPACING.xs,
  },
  unlockedDate: {
    ...FONTS.caption,
    color: COLORS.textLight,
  },
  viewProjectButton: {
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  viewProjectText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: '600' as const,
  },
  contactDetails: {
    gap: SPACING.m,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    padding: SPACING.m,
    borderRadius: 8,
  },
  contactText: {
    ...FONTS.body1,
    color: COLORS.text,
    marginLeft: SPACING.s,
    flex: 1,
  },
  clickableText: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  copyIcon: {
    marginLeft: SPACING.s,
  },
  budgetSection: {
    backgroundColor: COLORS.primary + '10',
    padding: SPACING.m,
    borderRadius: 8,
    alignItems: 'center',
  },
  budgetLabel: {
    ...FONTS.caption,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
  },
  budgetValue: {
    ...FONTS.h3,
    color: COLORS.primary,
    fontWeight: '700' as const,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    margin: SPACING.l,
  },
  emptyStateTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SPACING.s,
    textAlign: 'center',
  },
  emptyStateText: {
    ...FONTS.body1,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.l,
  },
  browseProjectsButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
    borderRadius: 8,
  },
  browseProjectsText: {
    ...FONTS.body1,
    color: COLORS.white,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
});