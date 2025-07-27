import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { 
  Shield, 
  CheckCircle, 
  Star, 
  Clock, 
  Users, 
  Award,
  Heart,
  Target,
  Zap
} from 'lucide-react-native';
import { COLORS, SHADOWS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function AboutScreen() {
  const router = useRouter();
  
  const values = [
    {
      icon: Shield,
      title: 'Vertrauen',
      description: 'Wir prüfen jeden Handwerker sorgfältig und stellen sicher, dass nur qualifizierte Fachkräfte auf unserer Plattform arbeiten.',
    },
    {
      icon: CheckCircle,
      title: 'Qualität',
      description: 'Höchste Qualitätsstandards sind unser Anspruch. Wir arbeiten nur mit den besten Handwerkern der Schweiz zusammen.',
    },
    {
      icon: Heart,
      title: 'Kundenzufriedenheit',
      description: 'Die Zufriedenheit unserer Kunden steht im Mittelpunkt. Wir sorgen für eine reibungslose Vermittlung und faire Preise.',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Wir nutzen moderne Technologie, um die Handwerkersuche so einfach und effizient wie möglich zu gestalten.',
    },
  ];
  
  const features = [
    {
      icon: Users,
      title: 'Über 1.000 geprüfte Handwerker',
      description: 'Schweizweit verfügbar',
    },
    {
      icon: Star,
      title: '4.8/5 Sterne Bewertung',
      description: 'Von zufriedenen Kunden',
    },
    {
      icon: Clock,
      title: '24h Antwortzeit',
      description: 'Schnelle Vermittlung garantiert',
    },
    {
      icon: Award,
      title: '100% Schweizer Qualität',
      description: 'Nur lokale Unternehmen',
    },
  ];
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Über uns',
          headerStyle: { backgroundColor: COLORS.white },
          headerTitleStyle: { color: COLORS.text },
        }} 
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
            style={styles.heroImage}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Handwerker-Plattform</Text>
            <Text style={styles.heroSubtitle}>
              Die moderne Plattform für Handwerkerdienstleistungen in der Schweiz
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Unsere Vision</Text>
          <Card style={styles.visionCard}>
            <Text style={styles.visionText}>
              Wir möchten die erste Anlaufstelle für alle Handwerkerdienstleistungen in der Schweiz werden. 
              Unser Ziel ist es, Kunden und qualifizierte Handwerker auf einfache, transparente und 
              vertrauensvolle Weise zusammenzubringen.
            </Text>
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Warum unsere Plattform?</Text>
          <Text style={styles.sectionSubtitle}>
            Wir haben diese Plattform gegründet, weil wir die Probleme bei der Handwerkersuche aus eigener Erfahrung kennen:
          </Text>
          
          <Card style={styles.problemCard}>
            <Text style={styles.problemTitle}>Die Herausforderungen:</Text>
            <Text style={styles.problemText}>
              • Lange Wartezeiten auf Angebote{'\n'}
              • Unzuverlässige Handwerker{'\n'}
              • Intransparente Preise{'\n'}
              • Schwierige Qualitätsbewertung{'\n'}
              • Komplizierte Kontaktaufnahme
            </Text>
          </Card>
          
          <Card style={styles.solutionCard}>
            <Text style={styles.solutionTitle}>Unsere Lösung:</Text>
            <Text style={styles.solutionText}>
              Unsere Plattform löst diese Probleme durch eine moderne, benutzerfreundliche Lösung, 
              die Transparenz, Qualität und Effizienz in den Mittelpunkt stellt.
            </Text>
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Unsere Werte</Text>
          
          {values.map((value, index) => (
            <Card key={index} style={styles.valueCard}>
              <View style={styles.valueHeader}>
                <View style={styles.valueIcon}>
                  <value.icon size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.valueTitle}>{value.title}</Text>
              </View>
              <Text style={styles.valueDescription}>{value.description}</Text>
            </Card>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Unsere Plattform in Zahlen</Text>
          
          <View style={styles.statsGrid}>
            {features.map((feature, index) => (
              <Card key={index} style={styles.statCard}>
                <View style={styles.statIcon}>
                  <feature.icon size={28} color={COLORS.primary} />
                </View>
                <Text style={styles.statTitle}>{feature.title}</Text>
                <Text style={styles.statDescription}>{feature.description}</Text>
              </Card>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Unser Versprechen</Text>
          <Card style={styles.promiseCard}>
            <Text style={styles.promiseText}>
              Wir verpflichten uns, nur mit seriösen, qualifizierten Handwerkern zusammenzuarbeiten. 
              Jeder Handwerker wird von uns persönlich geprüft und verifiziert. Ihre Zufriedenheit 
              ist unser Erfolg.
            </Text>
            
            <View style={styles.promiseFeatures}>
              <View style={styles.promiseFeature}>
                <CheckCircle size={20} color={COLORS.success} />
                <Text style={styles.promiseFeatureText}>Geprüfte Handwerker</Text>
              </View>
              <View style={styles.promiseFeature}>
                <CheckCircle size={20} color={COLORS.success} />
                <Text style={styles.promiseFeatureText}>Faire Preise</Text>
              </View>
              <View style={styles.promiseFeature}>
                <CheckCircle size={20} color={COLORS.success} />
                <Text style={styles.promiseFeatureText}>Schnelle Vermittlung</Text>
              </View>
              <View style={styles.promiseFeature}>
                <CheckCircle size={20} color={COLORS.success} />
                <Text style={styles.promiseFeatureText}>Schweizer Qualität</Text>
              </View>
            </View>
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bereit loszulegen?</Text>
          <Card style={styles.ctaCard}>
            <Text style={styles.ctaTitle}>Finden Sie jetzt Ihren Handwerker</Text>
            <Text style={styles.ctaText}>
              Erstellen Sie Ihr erstes Projekt und erhalten Sie Angebote von qualifizierten Handwerkern.
            </Text>
            <Button 
              title="Projekt erstellen" 
              onPress={() => {
                router.back();
                router.push('/create-project');
              }}
              style={styles.ctaButton}
            />
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
  heroSection: {
    position: 'relative',
    height: 250,
    marginBottom: SPACING.l,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: SPACING.l,
  },
  heroTitle: {
    ...FONTS.h1,
    fontSize: 32,
    color: COLORS.white,
    fontWeight: '700' as const,
    marginBottom: SPACING.s,
  },
  heroSubtitle: {
    ...FONTS.body1,
    color: COLORS.white,
    lineHeight: 24,
  },
  section: {
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  sectionSubtitle: {
    ...FONTS.body1,
    color: COLORS.textLight,
    marginBottom: SPACING.m,
    lineHeight: 22,
  },
  visionCard: {
    padding: SPACING.l,
    backgroundColor: COLORS.primary + '10',
  },
  visionText: {
    ...FONTS.body1,
    color: COLORS.text,
    lineHeight: 24,
    textAlign: 'center',
  },
  problemCard: {
    padding: SPACING.l,
    backgroundColor: COLORS.error + '10',
    marginBottom: SPACING.m,
  },
  problemTitle: {
    ...FONTS.h3,
    color: COLORS.error,
    marginBottom: SPACING.s,
  },
  problemText: {
    ...FONTS.body1,
    color: COLORS.text,
    lineHeight: 22,
  },
  solutionCard: {
    padding: SPACING.l,
    backgroundColor: COLORS.success + '10',
  },
  solutionTitle: {
    ...FONTS.h3,
    color: COLORS.success,
    marginBottom: SPACING.s,
  },
  solutionText: {
    ...FONTS.body1,
    color: COLORS.text,
    lineHeight: 22,
  },
  valueCard: {
    padding: SPACING.l,
    marginBottom: SPACING.m,
  },
  valueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  valueIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  valueTitle: {
    ...FONTS.h3,
    color: COLORS.text,
  },
  valueDescription: {
    ...FONTS.body1,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: SPACING.m,
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.s,
  },
  statTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  statDescription: {
    ...FONTS.body2,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  promiseCard: {
    padding: SPACING.l,
  },
  promiseText: {
    ...FONTS.body1,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: SPACING.l,
  },
  promiseFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  promiseFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: SPACING.s,
  },
  promiseFeatureText: {
    ...FONTS.body2,
    color: COLORS.text,
    marginLeft: SPACING.s,
  },
  ctaCard: {
    padding: SPACING.l,
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
  },
  ctaTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SPACING.s,
    textAlign: 'center',
  },
  ctaText: {
    ...FONTS.body1,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.l,
    lineHeight: 22,
  },
  ctaButton: {
    minWidth: 200,
  },
});