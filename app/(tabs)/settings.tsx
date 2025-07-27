import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  User, 
  Bell, 
  Shield, 
  HelpCircle, 
  FileText, 
  LogOut, 
  ChevronRight,
  Settings as SettingsIcon,
  Mail,
  Phone
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { useAuth } from '@/hooks/auth-store';
import Card from '@/components/Card';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    Alert.alert(
      'Abmelden',
      'Möchten Sie sich wirklich abmelden?',
      [
        {
          text: 'Abbrechen',
          style: 'cancel',
        },
        {
          text: 'Abmelden',
          onPress: () => {
            logout();
            router.replace('/login');
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const settingsOptions = [
    {
      id: 'profile',
      title: 'Profil bearbeiten',
      subtitle: 'Name, E-Mail und persönliche Daten',
      icon: User,
      onPress: () => router.push('/profile/edit'),
    },
    {
      id: 'notifications',
      title: 'Benachrichtigungen',
      subtitle: 'Push-Nachrichten und E-Mail-Einstellungen',
      icon: Bell,
      onPress: () => router.push('/settings/notifications'),
    },
    {
      id: 'privacy',
      title: 'Datenschutz & Sicherheit',
      subtitle: 'Datenschutzeinstellungen verwalten',
      icon: Shield,
      onPress: () => router.push('/settings/privacy'),
    },
    {
      id: 'help',
      title: 'Hilfe & Support',
      subtitle: 'FAQ und Kontakt zum Support',
      icon: HelpCircle,
      onPress: () => router.push('/settings/help'),
    },
    {
      id: 'terms',
      title: 'AGB & Datenschutz',
      subtitle: 'Nutzungsbedingungen und Datenschutzerklärung',
      icon: FileText,
      onPress: () => Alert.alert('Info', 'AGB und Datenschutzerklärung werden bald verfügbar sein.'),
    },
  ];
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Einstellungen</Text>
        <Text style={styles.subtitle}>
          Verwalten Sie Ihr Konto und Ihre Präferenzen
        </Text>
      </View>
      
      <Card style={styles.profileCard}>
        <View style={styles.profileInfo}>
          <View style={styles.profileAvatar}>
            <User size={32} color={COLORS.primary} />
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{user?.name || 'Benutzer'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'benutzer@example.com'}</Text>
          </View>
        </View>
      </Card>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Konto</Text>
        
        {settingsOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.settingItem}
            onPress={option.onPress}
          >
            <View style={styles.settingIcon}>
              <option.icon size={20} color={COLORS.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>{option.title}</Text>
              <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
            </View>
            <ChevronRight size={20} color={COLORS.gray[400]} />
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kontakt</Text>
        <Text style={styles.contactDescription}>
          Wenn Sie Hilfe brauchen, sind wir für Sie erreichbar.
        </Text>
        
        <Card style={styles.contactCard}>
          <View style={styles.contactItem}>
            <Mail size={20} color={COLORS.primary} />
            <Text style={styles.contactText}>support@schweizwerker.ch</Text>
          </View>
          <View style={styles.contactItem}>
            <Phone size={20} color={COLORS.primary} />
            <Text style={styles.contactText}>+41 44 123 45 67</Text>
          </View>
        </Card>
        
        <View style={styles.faqSection}>
          <Text style={styles.faqTitle}>Häufig gestellte Fragen (FAQ)</Text>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Wie erstelle ich ein Projekt?</Text>
            <Text style={styles.faqAnswer}>
              Gehen Sie zum Tab "Projekt erstellen" und folgen Sie den Schritten. Sie können Ihr Projekt detailliert beschreiben und Bilder hinzufügen.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Wie finde ich den richtigen Handwerker?</Text>
            <Text style={styles.faqAnswer}>
              Alle Handwerker auf unserer Plattform sind geprüft. Sie können Bewertungen lesen und Profile vergleichen, um den besten für Ihr Projekt zu finden.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Ist die Nutzung kostenlos?</Text>
            <Text style={styles.faqAnswer}>
              Ja, das Erstellen von Projekten und das Erhalten von Angeboten ist für Kunden völlig kostenlos.
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>v1.0.0</Text>
        <Text style={styles.footerText}>© 2025 Alle Rechte vorbehalten.</Text>
      </View>
    </ScrollView>
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
  profileCard: {
    margin: SPACING.m,
    padding: SPACING.l,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  profileEmail: {
    ...FONTS.body1,
    color: COLORS.textLight,
  },
  section: {
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    borderRadius: 12,
    marginBottom: SPACING.s,
    ...SHADOWS.small,
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
  contactCard: {
    padding: SPACING.m,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  contactDescription: {
    ...FONTS.body1,
    color: COLORS.textLight,
    marginBottom: SPACING.m,
    textAlign: 'center',
  },
  contactText: {
    ...FONTS.body1,
    color: COLORS.text,
    marginLeft: SPACING.s,
  },
  faqSection: {
    marginTop: SPACING.l,
  },
  faqTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.m,
    textAlign: 'center',
  },
  faqItem: {
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    borderRadius: 12,
    marginBottom: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  faqQuestion: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '600' as const,
    marginBottom: SPACING.xs,
  },
  faqAnswer: {
    ...FONTS.body2,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.error + '30',
    ...SHADOWS.small,
  },
  logoutText: {
    ...FONTS.body1,
    color: COLORS.error,
    fontWeight: '600' as const,
    marginLeft: SPACING.s,
  },
  footer: {
    padding: SPACING.l,
    alignItems: 'center',
  },
  footerText: {
    ...FONTS.body2,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 4,
  },
});