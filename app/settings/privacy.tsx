import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Lock, 
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Globe,
  Database
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { useAuth } from '@/hooks/auth-store';
import { PrivacySettings } from '@/types';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function PrivacyScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    dataCollection: true,
    analytics: true,
    marketing: false,
  });

  // Load user's privacy settings
  useEffect(() => {
    if (user?.privacySettings) {
      setPrivacy(user.privacySettings);
    }
  }, [user]);

  const updatePrivacy = (key: keyof typeof privacy) => {
    const newPrivacy = {
      ...privacy,
      [key]: !privacy[key]
    };
    
    setPrivacy(newPrivacy);
    
    // Save to user profile
    if (user) {
      updateUser({
        privacySettings: newPrivacy
      });
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Konto löschen',
      'Sind Sie sicher, dass Sie Ihr Konto dauerhaft löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
      [
        {
          text: 'Abbrechen',
          style: 'cancel',
        },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Info', 'Kontolöschung wird in Kürze verfügbar sein.');
          },
        },
      ]
    );
  };

  const handleDownloadData = () => {
    Alert.alert(
      'Daten herunterladen',
      'Wir bereiten Ihre Daten zum Download vor. Sie erhalten eine E-Mail mit einem Download-Link.',
      [
        {
          text: 'OK',
          onPress: () => {
            Alert.alert('Info', 'Datenexport wird in Kürze verfügbar sein.');
          },
        },
      ]
    );
  };

  const privacySections = [
    {
      title: 'Profil-Sichtbarkeit',
      items: [
        {
          key: 'profileVisible' as keyof typeof privacy,
          title: 'Profil öffentlich sichtbar',
          subtitle: 'Ihr Profil kann von anderen Nutzern gefunden werden',
          icon: Globe,
        },
        {
          key: 'showEmail' as keyof typeof privacy,
          title: 'E-Mail-Adresse anzeigen',
          subtitle: 'E-Mail in Ihrem öffentlichen Profil anzeigen',
          icon: Eye,
        },
        {
          key: 'showPhone' as keyof typeof privacy,
          title: 'Telefonnummer anzeigen',
          subtitle: 'Telefonnummer in Ihrem öffentlichen Profil anzeigen',
          icon: Eye,
        },
      ]
    },
    {
      title: 'Datenverarbeitung',
      items: [
        {
          key: 'dataCollection' as keyof typeof privacy,
          title: 'Datensammlung',
          subtitle: 'Sammlung von Nutzungsdaten zur App-Verbesserung',
          icon: Database,
        },
        {
          key: 'analytics' as keyof typeof privacy,
          title: 'Analyse & Statistiken',
          subtitle: 'Anonyme Nutzungsstatistiken zur Optimierung',
          icon: UserCheck,
        },
        {
          key: 'marketing' as keyof typeof privacy,
          title: 'Marketing-Personalisierung',
          subtitle: 'Personalisierte Werbung basierend auf Ihrem Verhalten',
          icon: Eye,
        },
      ]
    }
  ];

  const actionItems = [
    {
      title: 'Passwort ändern',
      subtitle: 'Ihr Passwort für mehr Sicherheit aktualisieren',
      icon: Lock,
      onPress: () => Alert.alert('Info', 'Passwort ändern wird in Kürze verfügbar sein.'),
    },
    {
      title: 'Meine Daten herunterladen',
      subtitle: 'Alle Ihre gespeicherten Daten als ZIP-Datei erhalten',
      icon: Download,
      onPress: handleDownloadData,
    },
  ];

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Datenschutz & Sicherheit',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={24} color={COLORS.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Datenschutz & Sicherheit</Text>
          <Text style={styles.subtitle}>
            Verwalten Sie Ihre Privatsphäre-Einstellungen und Kontosicherheit
          </Text>
        </View>

        {privacySections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            
            <Card style={styles.settingsCard}>
              {section.items.map((item, itemIndex) => (
                <View key={item.key}>
                  <View style={styles.settingItem}>
                    <View style={styles.settingIcon}>
                      <item.icon size={20} color={COLORS.primary} />
                    </View>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>{item.title}</Text>
                      <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                    </View>
                    <Switch
                      value={privacy[item.key]}
                      onValueChange={() => updatePrivacy(item.key)}
                      trackColor={{ false: COLORS.gray[300], true: COLORS.primary + '40' }}
                      thumbColor={privacy[item.key] ? COLORS.primary : COLORS.gray[400]}
                    />
                  </View>
                  {itemIndex < section.items.length - 1 && <View style={styles.separator} />}
                </View>
              ))}
            </Card>
          </View>
        ))}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Konto-Aktionen</Text>
          
          <Card style={styles.settingsCard}>
            {actionItems.map((item, itemIndex) => (
              <View key={itemIndex}>
                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={item.onPress}
                >
                  <View style={styles.settingIcon}>
                    <item.icon size={20} color={COLORS.primary} />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                  </View>
                  <ChevronRight size={20} color={COLORS.gray[400]} />
                </TouchableOpacity>
                {itemIndex < actionItems.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </Card>
        </View>

        <View style={styles.dangerSection}>
          <Text style={styles.sectionTitle}>Gefährliche Aktionen</Text>
          
          <Card style={styles.dangerCard}>
            <View style={styles.dangerContent}>
              <Trash2 size={24} color={COLORS.error} />
              <Text style={styles.dangerTitle}>Konto löschen</Text>
              <Text style={styles.dangerSubtitle}>
                Ihr Konto und alle damit verbundenen Daten werden dauerhaft gelöscht. 
                Diese Aktion kann nicht rückgängig gemacht werden.
              </Text>
              <Button
                title="Konto löschen"
                onPress={handleDeleteAccount}
                variant="outline"
                style={styles.deleteButton}
                textStyle={styles.deleteButtonText}
              />
            </View>
          </Card>
        </View>

        <View style={styles.infoSection}>
          <Card style={styles.infoCard}>
            <Shield size={24} color={COLORS.primary} />
            <Text style={styles.infoTitle}>Ihre Daten sind sicher</Text>
            <Text style={styles.infoText}>
              Wir verwenden modernste Verschlüsselungstechnologien, um Ihre 
              persönlichen Daten zu schützen. Weitere Informationen finden 
              Sie in unserer Datenschutzerklärung.
            </Text>
          </Card>
        </View>
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
  },
  title: {
    ...FONTS.h1,
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  subtitle: {
    ...FONTS.body1,
    color: COLORS.textLight,
  },
  section: {
    padding: SPACING.m,
    marginBottom: SPACING.s,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  settingsCard: {
    padding: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '600' as const,
  },
  settingSubtitle: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.gray[200],
    marginLeft: 56,
  },
  dangerSection: {
    padding: SPACING.m,
    marginBottom: SPACING.s,
  },
  dangerCard: {
    borderColor: COLORS.error + '30',
    borderWidth: 1,
  },
  dangerContent: {
    padding: SPACING.l,
    alignItems: 'center',
  },
  dangerTitle: {
    ...FONTS.h3,
    color: COLORS.error,
    marginTop: SPACING.m,
    marginBottom: SPACING.s,
  },
  dangerSubtitle: {
    ...FONTS.body2,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.l,
  },
  deleteButton: {
    borderColor: COLORS.error,
    backgroundColor: 'transparent',
  },
  deleteButtonText: {
    color: COLORS.error,
  },
  infoSection: {
    padding: SPACING.m,
    marginBottom: SPACING.xl,
  },
  infoCard: {
    padding: SPACING.l,
    alignItems: 'center',
    textAlign: 'center',
  },
  infoTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginTop: SPACING.m,
    marginBottom: SPACING.s,
  },
  infoText: {
    ...FONTS.body2,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});