import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Briefcase, 
  Star,
  ChevronLeft,
  Smartphone
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { useAuth } from '@/hooks/auth-store';
import { NotificationSettings } from '@/types';
import Card from '@/components/Card';

export default function NotificationsScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  
  const [notifications, setNotifications] = useState({
    pushEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    newProjects: true,
    projectUpdates: true,
    messages: true,
    reviews: true,
    marketing: false,
    weeklyDigest: true,
  });

  // Load user's notification settings
  useEffect(() => {
    if (user?.notificationSettings) {
      setNotifications(user.notificationSettings);
    }
  }, [user]);

  const updateNotification = (key: keyof typeof notifications) => {
    const newNotifications = {
      ...notifications,
      [key]: !notifications[key]
    };
    
    setNotifications(newNotifications);
    
    // Save to user profile
    if (user) {
      updateUser({
        notificationSettings: newNotifications
      });
    }
  };

  const notificationSections = [
    {
      title: 'Benachrichtigungskanäle',
      items: [
        {
          key: 'pushEnabled' as keyof typeof notifications,
          title: 'Push-Benachrichtigungen',
          subtitle: 'Benachrichtigungen auf diesem Gerät erhalten',
          icon: Smartphone,
        },
        {
          key: 'emailEnabled' as keyof typeof notifications,
          title: 'E-Mail-Benachrichtigungen',
          subtitle: 'Benachrichtigungen per E-Mail erhalten',
          icon: Mail,
        },
        {
          key: 'smsEnabled' as keyof typeof notifications,
          title: 'SMS-Benachrichtigungen',
          subtitle: 'Wichtige Updates per SMS (kostenpflichtig)',
          icon: MessageSquare,
        },
      ]
    },
    {
      title: 'Projektbenachrichtigungen',
      items: [
        {
          key: 'newProjects' as keyof typeof notifications,
          title: 'Neue Projekte',
          subtitle: 'Benachrichtigung bei passenden neuen Projekten',
          icon: Briefcase,
        },
        {
          key: 'projectUpdates' as keyof typeof notifications,
          title: 'Projekt-Updates',
          subtitle: 'Updates zu Ihren aktiven Projekten',
          icon: Bell,
        },
        {
          key: 'messages' as keyof typeof notifications,
          title: 'Neue Nachrichten',
          subtitle: 'Nachrichten von Kunden oder Handwerkern',
          icon: MessageSquare,
        },
        {
          key: 'reviews' as keyof typeof notifications,
          title: 'Bewertungen',
          subtitle: 'Neue Bewertungen und Feedback',
          icon: Star,
        },
      ]
    },
    {
      title: 'Weitere Benachrichtigungen',
      items: [
        {
          key: 'marketing' as keyof typeof notifications,
          title: 'Marketing & Angebote',
          subtitle: 'Informationen über neue Features und Angebote',
          icon: Mail,
        },
        {
          key: 'weeklyDigest' as keyof typeof notifications,
          title: 'Wöchentliche Zusammenfassung',
          subtitle: 'Übersicht Ihrer Aktivitäten der letzten Woche',
          icon: Bell,
        },
      ]
    }
  ];

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Benachrichtigungen',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={24} color={COLORS.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Benachrichtigungseinstellungen</Text>
          <Text style={styles.subtitle}>
            Verwalten Sie, wie und wann Sie benachrichtigt werden möchten
          </Text>
        </View>

        {notificationSections.map((section, sectionIndex) => (
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
                      value={notifications[item.key]}
                      onValueChange={() => updateNotification(item.key)}
                      trackColor={{ false: COLORS.gray[300], true: COLORS.primary + '40' }}
                      thumbColor={notifications[item.key] ? COLORS.primary : COLORS.gray[400]}
                    />
                  </View>
                  {itemIndex < section.items.length - 1 && <View style={styles.separator} />}
                </View>
              ))}
            </Card>
          </View>
        ))}

        <View style={styles.infoSection}>
          <Card style={styles.infoCard}>
            <Bell size={24} color={COLORS.primary} />
            <Text style={styles.infoTitle}>Benachrichtigungen verwalten</Text>
            <Text style={styles.infoText}>
              Sie können Benachrichtigungen jederzeit in den Geräteeinstellungen 
              vollständig deaktivieren. Wichtige Sicherheitsmeldungen werden 
              weiterhin zugestellt.
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