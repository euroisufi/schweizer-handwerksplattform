import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Book,
  Video,
  ExternalLink
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function HelpScreen() {
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const contactOptions = [
    {
      title: 'Live Chat',
      subtitle: 'Sofortige Hilfe von unserem Support-Team',
      icon: MessageCircle,
      onPress: () => Alert.alert('Info', 'Live Chat wird in Kürze verfügbar sein.'),
      available: 'Mo-Fr 8:00-18:00',
    },
    {
      title: 'E-Mail Support',
      subtitle: 'Detaillierte Anfragen per E-Mail',
      icon: Mail,
      onPress: () => Linking.openURL('mailto:support@schweizwerker.ch'),
      available: 'Antwort innerhalb 24h',
    },
    {
      title: 'Telefon Support',
      subtitle: 'Direkter Kontakt für dringende Fragen',
      icon: Phone,
      onPress: () => Linking.openURL('tel:+41441234567'),
      available: 'Mo-Fr 9:00-17:00',
    },
  ];

  const helpResources = [
    {
      title: 'Benutzerhandbuch',
      subtitle: 'Vollständige Anleitung zur App-Nutzung',
      icon: Book,
      onPress: () => Alert.alert('Info', 'Benutzerhandbuch wird in Kürze verfügbar sein.'),
    },
    {
      title: 'Video-Tutorials',
      subtitle: 'Schritt-für-Schritt Anleitungen',
      icon: Video,
      onPress: () => Alert.alert('Info', 'Video-Tutorials werden in Kürze verfügbar sein.'),
    },
    {
      title: 'Community Forum',
      subtitle: 'Austausch mit anderen Nutzern',
      icon: MessageCircle,
      onPress: () => Alert.alert('Info', 'Community Forum wird in Kürze verfügbar sein.'),
    },
  ];

  const faqItems = [
    {
      question: 'Wie erstelle ich ein Projekt?',
      answer: 'Gehen Sie auf die Startseite und tippen Sie auf "Projekt erstellen". Folgen Sie den Schritten im Formular, um alle notwendigen Informationen anzugeben. Nach der Veröffentlichung können Handwerker Ihr Projekt sehen und Angebote abgeben.',
    },
    {
      question: 'Wie finde ich den richtigen Handwerker?',
      answer: 'Schauen Sie sich die Profile der interessierten Handwerker an. Achten Sie auf Bewertungen, Referenzen und die Fotogalerie. Sie können auch direkt Kontakt aufnehmen, um Details zu besprechen.',
    },
    {
      question: 'Sind die Handwerker geprüft?',
      answer: 'Ja, alle Handwerker auf unserer Plattform durchlaufen einen Verifizierungsprozess. Wir prüfen Qualifikationen, Versicherungen und Referenzen, bevor sie auf der Plattform aktiv werden können.',
    },
    {
      question: 'Wie funktioniert die Bezahlung?',
      answer: 'Die Bezahlung erfolgt direkt zwischen Ihnen und dem Handwerker. Unsere Plattform fungiert als Vermittlungsplattform. Besprechen Sie Zahlungsmodalitäten direkt mit Ihrem gewählten Handwerker.',
    },
    {
      question: 'Was passiert bei Problemen mit einem Projekt?',
      answer: 'Kontaktieren Sie zunächst direkt den Handwerker. Falls keine Lösung gefunden wird, können Sie sich an unseren Support wenden. Wir helfen bei der Vermittlung und Problemlösung.',
    },
    {
      question: 'Kann ich mein Projekt nachträglich ändern?',
      answer: 'Ja, Sie können Ihr Projekt bearbeiten, solange es noch aktiv ist. Gehen Sie zu "Meine Projekte" und wählen Sie das entsprechende Projekt aus. Beachten Sie, dass bereits interessierte Handwerker über Änderungen informiert werden.',
    },
    {
      question: 'Wie kann ich Handwerker bewerten?',
      answer: 'Nach Projektabschluss erhalten Sie eine Benachrichtigung zur Bewertung. Sie können auch jederzeit über das Handwerker-Profil eine Bewertung abgeben. Ihre Bewertung hilft anderen Kunden bei der Auswahl.',
    },
    {
      question: 'Ist die Nutzung der Plattform kostenlos?',
      answer: 'Für Kunden ist die Nutzung komplett kostenlos. Sie können Projekte erstellen, Handwerker kontaktieren und die Plattform ohne Gebühren nutzen. Handwerker zahlen nur für Kontaktfreischaltungen.',
    },
  ];

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Hilfe & Support',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={24} color={COLORS.primary} />
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Hilfe & Support</Text>
          <Text style={styles.subtitle}>
            Wir sind hier, um Ihnen zu helfen. Finden Sie Antworten oder kontaktieren Sie uns direkt.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kontakt aufnehmen</Text>
          
          {contactOptions.map((option, index) => (
            <Card key={index} style={styles.contactCard}>
              <TouchableOpacity
                style={styles.contactItem}
                onPress={option.onPress}
              >
                <View style={styles.contactIcon}>
                  <option.icon size={20} color={COLORS.primary} />
                </View>
                <View style={styles.contactContent}>
                  <Text style={styles.contactTitle}>{option.title}</Text>
                  <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
                  <Text style={styles.contactAvailable}>{option.available}</Text>
                </View>
                <ExternalLink size={20} color={COLORS.gray[400]} />
              </TouchableOpacity>
            </Card>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hilfe-Ressourcen</Text>
          
          <Card style={styles.resourcesCard}>
            {helpResources.map((resource, index) => (
              <View key={index}>
                <TouchableOpacity
                  style={styles.resourceItem}
                  onPress={resource.onPress}
                >
                  <View style={styles.resourceIcon}>
                    <resource.icon size={20} color={COLORS.primary} />
                  </View>
                  <View style={styles.resourceContent}>
                    <Text style={styles.resourceTitle}>{resource.title}</Text>
                    <Text style={styles.resourceSubtitle}>{resource.subtitle}</Text>
                  </View>
                  <ChevronRight size={20} color={COLORS.gray[400]} />
                </TouchableOpacity>
                {index < helpResources.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </Card>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Häufig gestellte Fragen</Text>
          
          {faqItems.map((faq, index) => (
            <Card key={index} style={styles.faqCard}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => toggleFaq(index)}
              >
                <View style={styles.faqIcon}>
                  <HelpCircle size={20} color={COLORS.primary} />
                </View>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                {expandedFaq === index ? (
                  <ChevronUp size={20} color={COLORS.gray[400]} />
                ) : (
                  <ChevronDown size={20} color={COLORS.gray[400]} />
                )}
              </TouchableOpacity>
              
              {expandedFaq === index && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </Card>
          ))}
        </View>

        <View style={styles.emergencySection}>
          <Card style={styles.emergencyCard}>
            <View style={styles.emergencyContent}>
              <Phone size={24} color={COLORS.error} />
              <Text style={styles.emergencyTitle}>Notfall-Support</Text>
              <Text style={styles.emergencySubtitle}>
                Bei dringenden technischen Problemen oder Sicherheitsfragen
              </Text>
              <Button
                title="Notfall-Hotline anrufen"
                onPress={() => Linking.openURL('tel:+41441234567')}
                variant="outline"
                style={styles.emergencyButton}
                textStyle={styles.emergencyButtonText}
              />
            </View>
          </Card>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Weitere Informationen finden Sie in unseren AGB und der Datenschutzerklärung.
          </Text>
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
  contactCard: {
    marginBottom: SPACING.s,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '600' as const,
  },
  contactSubtitle: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginTop: 2,
  },
  contactAvailable: {
    ...FONTS.caption,
    color: COLORS.primary,
    marginTop: 4,
    fontWeight: '500' as const,
  },
  resourcesCard: {
    padding: 0,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '600' as const,
  },
  resourceSubtitle: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.gray[200],
    marginLeft: 56,
  },
  faqCard: {
    marginBottom: SPACING.s,
    padding: 0,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
  },
  faqIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  faqQuestion: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '600' as const,
    flex: 1,
  },
  faqAnswer: {
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.m,
    paddingLeft: 56,
  },
  faqAnswerText: {
    ...FONTS.body2,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  emergencySection: {
    padding: SPACING.m,
    marginBottom: SPACING.s,
  },
  emergencyCard: {
    borderColor: COLORS.error + '30',
    borderWidth: 1,
  },
  emergencyContent: {
    padding: SPACING.l,
    alignItems: 'center',
  },
  emergencyTitle: {
    ...FONTS.h3,
    color: COLORS.error,
    marginTop: SPACING.m,
    marginBottom: SPACING.s,
  },
  emergencySubtitle: {
    ...FONTS.body2,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.l,
  },
  emergencyButton: {
    borderColor: COLORS.error,
    backgroundColor: 'transparent',
  },
  emergencyButtonText: {
    color: COLORS.error,
  },
  footer: {
    padding: SPACING.l,
    marginBottom: SPACING.xl,
  },
  footerText: {
    ...FONTS.body2,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});