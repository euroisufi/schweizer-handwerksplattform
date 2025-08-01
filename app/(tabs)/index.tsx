import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, FlatList, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, ArrowRight, Award, Plus, User, Shield, CheckCircle, Star, Clock, FileText, MessageSquare, UserCheck, Zap, Target, Sparkles, Users, TrendingUp, MapPin, Phone, Check, Crown } from 'lucide-react-native';
import { COLORS, SHADOWS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { useAuth } from '@/hooks/auth-store';
import { useProjects } from '@/hooks/projects-store';
import { useCredits } from '@/hooks/credits-store';
import Card from '@/components/Card';
import Button from '@/components/Button';
import ProjectCard from '@/components/ProjectCard';
import { SERVICES } from '@/mocks/services';
import { BUSINESSES } from '@/mocks/users';
import ServiceItem from '@/components/ServiceItem';
import BusinessCard from '@/components/BusinessCard';
import Logo from '@/components/Logo';

export default function HomeScreen() {
  const router = useRouter();
  const { userType, user, isLoggedIn } = useAuth();
  const { projects } = useProjects();
  const { credits, subscription } = useCredits();
  
  // Render different home screens based on user type
  if (userType === 'customer') {
    return <CustomerHomeScreen />;
  }
  
  // Only show business view to logged-in craftsmen
  if (userType === 'business' && isLoggedIn) {
    return <BusinessHomeScreen />;
  }
  
  // Default to customer view for non-logged in users or invalid states
  return <CustomerHomeScreen />;
}

function CustomerHomeScreen() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  
  const handleProjectSearch = () => {
    // Allow users to start creating projects without being logged in
    router.push('/create-project');
  };
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Was soll gemacht werden?</Text>
          <Text style={styles.heroSubtitle}>
            Für welche Leistung möchten Sie einen geprüften Handwerker finden?
          </Text>
          
          <View style={styles.searchContainer}>
            <TouchableOpacity 
              style={styles.searchInput}
              onPress={handleProjectSearch}
            >
              <Text style={styles.searchPlaceholder}>z.B. Maler, Elektriker, Gärtner...</Text>
              <View style={styles.searchButton}>
                <ArrowRight size={20} color={COLORS.white} />
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.heroFeatures}>
            <View style={styles.heroFeature}>
              <View style={styles.heroFeatureIcon}>
                <CheckCircle size={20} color={COLORS.success} />
              </View>
              <Text style={styles.heroFeatureText}>
                Erstellen Sie Ihren Auftrag kostenlos und unverbindlich
              </Text>
            </View>
            
            <View style={styles.heroFeature}>
              <View style={styles.heroFeatureIcon}>
                <User size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.heroFeatureText}>
                Mehr als 5.509 registrierte Handwerker
              </Text>
            </View>
            
            <View style={styles.heroFeature}>
              <View style={styles.heroFeatureIcon}>
                <Star size={20} color={COLORS.warning} />
              </View>
              <Text style={styles.heroFeatureText}>
                Mehr als 59.824 unabhängige Bewertungen
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>5.509+</Text>
            <Text style={styles.heroStatLabel}>Handwerker</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>59.824+</Text>
            <Text style={styles.heroStatLabel}>Bewertungen</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatValue}>4.8★</Text>
            <Text style={styles.heroStatLabel}>Durchschnitt</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.contentSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Beliebte Dienstleistungen</Text>
        </View>
      
      <FlatList
        data={SERVICES.slice(0, 6)}
        renderItem={({ item }) => (
          <ServiceItem 
            service={item} 
            onPress={() => {}}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.servicesList}
      />
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Beliebte Handwerker</Text>
        <TouchableOpacity onPress={() => router.push('/businesses')}>
          <Text style={styles.seeAllText}>Alle anzeigen</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={BUSINESSES.slice(0, 3)}
        renderItem={({ item }) => (
          <BusinessCard 
            business={item} 
            onPress={(business) => router.push(`/businesses/${business.id}`)}
            style={styles.businessCardItem}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.businessesList}
      />
        
        <View style={styles.howItWorksSection}>
          <View style={styles.howItWorksHeader}>
            <View style={styles.howItWorksIconContainer}>
              <Sparkles size={28} color={COLORS.secondary} />
            </View>
            <Text style={styles.howItWorksTitle}>Wie es funktioniert</Text>
            <Text style={styles.howItWorksSubtitle}>
              In nur 3 einfachen Schritten zum perfekten Handwerker
            </Text>
          </View>
          
          <View style={styles.stepsContainer}>
            <View style={styles.stepCard}>
              <View style={styles.stepIconContainer}>
                <FileText size={24} color={COLORS.white} />
              </View>
              <View style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeText}>1</Text>
                  </View>
                  <Text style={styles.stepTitle}>Projekt erstellen</Text>
                </View>
                <Text style={styles.stepDescription}>
                  Beschreiben Sie Ihr Vorhaben detailliert und fügen Sie Fotos hinzu. 
                  Je genauer Ihre Angaben, desto passender die Angebote.
                </Text>
                <View style={styles.stepFeatures}>
                  <View style={styles.stepFeature}>
                    <CheckCircle size={16} color={COLORS.success} />
                    <Text style={styles.stepFeatureText}>Kostenlos & unverbindlich</Text>
                  </View>
                  <View style={styles.stepFeature}>
                    <Clock size={16} color={COLORS.success} />
                    <Text style={styles.stepFeatureText}>Nur 2 Minuten</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.stepConnector}>
              <View style={styles.stepConnectorLine} />
              <View style={styles.stepConnectorDot} />
            </View>
            
            <View style={styles.stepCard}>
              <View style={[styles.stepIconContainer, { backgroundColor: COLORS.secondary }]}>
                <MessageSquare size={24} color={COLORS.white} />
              </View>
              <View style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <View style={[styles.stepBadge, { backgroundColor: COLORS.secondary }]}>
                    <Text style={styles.stepBadgeText}>2</Text>
                  </View>
                  <Text style={styles.stepTitle}>Angebote erhalten</Text>
                </View>
                <Text style={styles.stepDescription}>
                  Qualifizierte Handwerker aus Ihrer Region melden sich bei Ihnen 
                  mit individuellen Angeboten und Kostenvoranschlägen.
                </Text>
                <View style={styles.stepFeatures}>
                  <View style={styles.stepFeature}>
                    <Target size={16} color={COLORS.secondary} />
                    <Text style={styles.stepFeatureText}>Nur geprüfte Profis</Text>
                  </View>
                  <View style={styles.stepFeature}>
                    <Zap size={16} color={COLORS.secondary} />
                    <Text style={styles.stepFeatureText}>Innerhalb 24h</Text>
                  </View>
                </View>
              </View>
            </View>
            
            <View style={styles.stepConnector}>
              <View style={styles.stepConnectorLine} />
              <View style={styles.stepConnectorDot} />
            </View>
            
            <View style={styles.stepCard}>
              <View style={[styles.stepIconContainer, { backgroundColor: COLORS.accent }]}>
                <UserCheck size={24} color={COLORS.white} />
              </View>
              <View style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <View style={[styles.stepBadge, { backgroundColor: COLORS.accent }]}>
                    <Text style={styles.stepBadgeText}>3</Text>
                  </View>
                  <Text style={styles.stepTitle}>Handwerker auswählen</Text>
                </View>
                <Text style={styles.stepDescription}>
                  Vergleichen Sie Angebote, Bewertungen und Profile. 
                  Wählen Sie den Handwerker, der am besten zu Ihrem Projekt passt.
                </Text>
                <View style={styles.stepFeatures}>
                  <View style={styles.stepFeature}>
                    <Star size={16} color={COLORS.accent} />
                    <Text style={styles.stepFeatureText}>Echte Bewertungen</Text>
                  </View>
                  <View style={styles.stepFeature}>
                    <Shield size={16} color={COLORS.accent} />
                    <Text style={styles.stepFeatureText}>100% sicher</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.howItWorksFooter}>
            <Text style={styles.howItWorksFooterText}>
              💡 Durchschnittlich erhalten Sie 3-5 qualifizierte Angebote
            </Text>
            <View style={styles.howItWorksButtonContainer}>
              <Button 
                title="Jetzt kostenlos starten" 
                onPress={handleProjectSearch}
                style={styles.howItWorksButton}
              />
            </View>
          </View>
        </View>
      
      <View style={styles.aboutSection}>
        <View style={styles.aboutHeader}>
          <Text style={styles.aboutTitle}>Über uns</Text>
          <Text style={styles.aboutSubtitle}>
            Die führende Plattform für Handwerksdienstleistungen in der Schweiz
          </Text>
        </View>
        
        <View style={styles.companyStats}>
          <View style={styles.companyStat}>
            <Text style={styles.companyStatValue}>2019</Text>
            <Text style={styles.companyStatLabel}>Gegründet</Text>
          </View>
          <View style={styles.companyStat}>
            <Text style={styles.companyStatValue}>50.000+</Text>
            <Text style={styles.companyStatLabel}>Projekte</Text>
          </View>
          <View style={styles.companyStat}>
            <Text style={styles.companyStatValue}>26</Text>
            <Text style={styles.companyStatLabel}>Kantone</Text>
          </View>
        </View>
        
        <View style={styles.missionSection}>
          <Text style={styles.missionTitle}>Unsere Mission</Text>
          <Text style={styles.missionText}>
            Wir verbinden Schweizer Hausbesitzer mit qualifizierten, lokalen Handwerkern. 
            Seit 2019 haben wir über 50.000 erfolgreiche Projekte vermittelt und dabei 
            höchste Standards für Qualität und Zuverlässigkeit gesetzt.
          </Text>
        </View>
        
        <View style={styles.trustFeatures}>
          <View style={styles.trustFeature}>
            <View style={styles.trustFeatureIconContainer}>
              <Shield size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.trustFeatureTitle}>Geprüfte Handwerker</Text>
            <Text style={styles.trustFeatureText}>
              Jeder Handwerker durchläuft unseren strengen Verifizierungsprozess mit 
              Überprüfung von Qualifikationen, Versicherung und Referenzen.
            </Text>
          </View>
          
          <View style={styles.trustFeature}>
            <View style={styles.trustFeatureIconContainer}>
              <MapPin size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.trustFeatureTitle}>100% Schweizer Qualität</Text>
            <Text style={styles.trustFeatureText}>
              Ausschließlich registrierte Schweizer Unternehmen mit gültiger 
              Gewerbeberechtigung und lokaler Präsenz in allen 26 Kantonen.
            </Text>
          </View>
          
          <View style={styles.trustFeature}>
            <View style={styles.trustFeatureIconContainer}>
              <Users size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.trustFeatureTitle}>Transparente Bewertungen</Text>
            <Text style={styles.trustFeatureText}>
              Über 59.000 echte Kundenbewertungen helfen Ihnen bei der Auswahl 
              des perfekten Handwerkers für Ihr Projekt.
            </Text>
          </View>
          
          <View style={styles.trustFeature}>
            <View style={styles.trustFeatureIconContainer}>
              <TrendingUp size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.trustFeatureTitle}>Schnelle Vermittlung</Text>
            <Text style={styles.trustFeatureText}>
              Erhalten Sie garantiert innerhalb von 24 Stunden qualifizierte 
              Angebote oder wir erstatten Ihnen die Kosten.
            </Text>
          </View>
          
          <View style={styles.trustFeature}>
            <View style={styles.trustFeatureIconContainer}>
              <Phone size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.trustFeatureTitle}>Persönlicher Support</Text>
            <Text style={styles.trustFeatureText}>
              Unser Kundenservice steht Ihnen bei Fragen zur Verfügung und 
              unterstützt Sie während des gesamten Projektverlaufs.
            </Text>
          </View>
          
          <View style={styles.trustFeature}>
            <View style={styles.trustFeatureIconContainer}>
              <Award size={24} color={COLORS.primary} />
            </View>
            <Text style={styles.trustFeatureTitle}>Qualitätsgarantie</Text>
            <Text style={styles.trustFeatureText}>
              Wir garantieren höchste Qualitätsstandards und bieten bei 
              Problemen eine kostenlose Nachbesserung oder Geld-zurück-Garantie.
            </Text>
          </View>
        </View>
        
        <View style={styles.certificationSection}>
          <Text style={styles.certificationTitle}>Zertifiziert & Vertrauenswürdig</Text>
          <View style={styles.certifications}>
            <View style={styles.certification}>
              <Text style={styles.certificationText}>🏆 Swiss Quality Award 2023</Text>
            </View>
            <View style={styles.certification}>
              <Text style={styles.certificationText}>🔒 SSL-verschlüsselt</Text>
            </View>
            <View style={styles.certification}>
              <Text style={styles.certificationText}>✅ DSGVO-konform</Text>
            </View>
          </View>
        </View>
        
        <Button 
          title="Mehr über uns erfahren" 
          onPress={() => router.push('/about')}
          variant="outline"
          style={styles.featuredButton}
        />
      </View>
      </View>
    </ScrollView>
  );
}

function BusinessHomeScreen() {
  const router = useRouter();
  const { projects } = useProjects();
  const { credits, subscription } = useCredits();
  const { user } = useAuth();
  
  // Get recent projects (would be filtered by location in a real app)
  // Filter out completed projects for handwerker ansicht
  const recentProjects = projects.filter(project => project.status !== 'completed').slice(0, 3);
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.businessHeader}>
        <View style={styles.businessHeaderContent}>
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Willkommen beim Dashboard zurück</Text>
            <View style={styles.businessNameContainer}>
              <Text style={styles.businessName}>{user?.name || 'Handwerker'}</Text>
              {(user?.profileImage || (user as any)?.logo) && (
                <Image 
                  source={{ uri: user?.profileImage || (user as any)?.logo }} 
                  style={styles.profileImageWelcome}
                />
              )}
            </View>
          </View>
        </View>
      </View>
      
      {subscription && (
        <View style={styles.premiumActiveSection}>
          <View style={styles.premiumActiveBanner}>
            <View style={styles.premiumTitleContainer}>
              <Crown size={16} color="#FFD700" />
              <Text style={styles.premiumActiveTitle}>Premium aktiviert</Text>
            </View>
            <View style={styles.premiumBenefitsContainer}>
              <View style={styles.benefitItem}>
                <Check size={14} color={COLORS.secondary} />
                <Text style={styles.benefitTextActive}>24h vorab Zugriff</Text>
              </View>
              <View style={styles.benefitSeparator} />
              <View style={styles.benefitItem}>
                <Check size={14} color={COLORS.secondary} />
                <Text style={styles.benefitTextActive}>3x mehr Sichtbarkeit</Text>
              </View>
              <View style={styles.benefitSeparator} />
              <View style={styles.benefitItem}>
                <Check size={14} color={COLORS.secondary} />
                <Text style={styles.benefitTextActive}>Premium Badge</Text>
              </View>
              <View style={styles.benefitSeparator} />
              <View style={styles.benefitItem}>
                <Check size={14} color={COLORS.secondary} />
                <Text style={styles.benefitTextActive}>Prioritäts-Support</Text>
              </View>
            </View>
          </View>
        </View>
      )}
      
      {!subscription && (
        <View style={styles.premiumBanner}>
          <View style={styles.premiumBannerContent}>
            <View style={styles.premiumBannerItem}>
              <View style={styles.premiumTitleContainer}>
                <Crown size={16} color={COLORS.white} />
                <Text style={styles.premiumBannerTitle}>Premium nicht aktiviert</Text>
              </View>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.benefitsScrollView}
              >
                <View style={styles.premiumBenefits}>
                  <View style={styles.benefitItem}>
                    <Check size={8} color={'#FFD700'} />
                    <Text style={styles.benefitText}>24h vorab Zugriff</Text>
                  </View>
                  <View style={styles.benefitSeparator} />
                  <View style={styles.benefitItem}>
                    <Check size={8} color={'#FFD700'} />
                    <Text style={styles.benefitText}>3x mehr Sichtbarkeit</Text>
                  </View>
                  <View style={styles.benefitSeparator} />
                  <View style={styles.benefitItem}>
                    <Check size={8} color={'#FFD700'} />
                    <Text style={styles.benefitText}>Premium Badge</Text>
                  </View>
                  <View style={styles.benefitSeparator} />
                  <View style={styles.benefitItem}>
                    <Check size={8} color={'#FFD700'} />
                    <Text style={styles.benefitText}>Prioritäts-Support</Text>
                  </View>
                  <View style={styles.benefitSeparator} />
                  <View style={styles.benefitItem}>
                    <Check size={8} color={'#FFD700'} />
                    <Text style={styles.benefitText}>Kostenlose Beratung</Text>
                  </View>
                  <View style={styles.benefitSeparator} />
                  <View style={styles.benefitItem}>
                    <Check size={8} color={'#FFD700'} />
                    <Text style={styles.benefitText}>Erweiterte Statistiken</Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.premiumUpgradeButton}
            onPress={() => router.push('/premium')}
          >
            <Crown size={14} color={'#1a1a1a'} />
            <Text style={styles.premiumUpgradeText}>Jetzt Premium werden</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.businessStatsContainer}>
        <TouchableOpacity 
          style={[styles.businessStatCard, styles.creditsCard]}
          onPress={() => router.push('/credits')}
        >
          <View style={styles.creditsContent}>
            <Text style={styles.businessStatValue}>{credits}</Text>
            <Text style={styles.businessStatLabel}>Credits</Text>
            <View style={styles.creditsButton}>
              <Plus size={16} color={COLORS.white} />
              <Text style={styles.creditsButtonText}>Kaufen</Text>
            </View>
          </View>
        </TouchableOpacity>
        
        <View style={styles.businessStatsRow}>
          <TouchableOpacity 
            style={styles.businessStatCard}
            onPress={() => router.push('/projects')}
          >
            <Text style={styles.statValue}>5+</Text>
            <Text style={styles.statLabel}>Neue Projekte</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.businessStatCard}
            onPress={() => router.push('/profile/reviews')}
          >
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Meine Bewertungen</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {!subscription && (
        <Card style={styles.premiumCard}>
          <View style={styles.premiumHeader}>
            <View style={styles.premiumBadge}>
              <Crown size={24} color={COLORS.white} />
            </View>
            <Text style={styles.premiumTitle}>Werde jetzt Premium und genieße viele Vorteile</Text>
          </View>
          
          <View style={styles.premiumFeatures}>
            <View style={styles.premiumFeature}>
              <View style={styles.premiumFeatureIcon}>
                <CheckCircle size={16} color={COLORS.secondary} />
              </View>
              <Text style={styles.premiumFeatureText}>
                24h vorab Zugriff auf neue Projekte
              </Text>
            </View>
            
            <View style={styles.premiumDivider} />
            
            <View style={styles.premiumFeature}>
              <View style={styles.premiumFeatureIcon}>
                <Star size={16} color={COLORS.secondary} />
              </View>
              <Text style={styles.premiumFeatureText}>
                Bis zu 3x mehr Sichtbarkeit in Suchergebnissen
              </Text>
            </View>
            
            <View style={styles.premiumDivider} />
            
            <View style={styles.premiumFeature}>
              <View style={styles.premiumFeatureIcon}>
                <Clock size={16} color={COLORS.secondary} />
              </View>
              <Text style={styles.premiumFeatureText}>
                Prioritäts-Support und schnellere Bearbeitung
              </Text>
            </View>
            
            <View style={styles.premiumDivider} />
            
            <View style={styles.premiumFeature}>
              <View style={styles.premiumFeatureIcon}>
                <User size={16} color={COLORS.secondary} />
              </View>
              <Text style={styles.premiumFeatureText}>
                Premium-Badge für mehr Vertrauen bei Kunden
              </Text>
            </View>
          </View>
          
          <View style={styles.premiumStats}>
            <View style={styles.premiumStat}>
              <Text style={styles.premiumStatValue}>+250%</Text>
              <Text style={styles.premiumStatLabel}>Mehr Anfragen</Text>
            </View>
            <View style={styles.premiumStat}>
              <Text style={styles.premiumStatValue}>24h</Text>
              <Text style={styles.premiumStatLabel}>Vorab-Zugang</Text>
            </View>
            <View style={styles.premiumStat}>
              <Text style={styles.premiumStatValue}>⭐ 4.9</Text>
              <Text style={styles.premiumStatLabel}>Premium Rating</Text>
            </View>
          </View>
          
          <Button 
            title="Jetzt Premium werden" 
            onPress={() => router.push('/premium')}
            style={styles.premiumButton}
            textStyle={styles.premiumButtonText}
          />
          
          <Text style={styles.premiumPriceText}>ab CHF 29 /Monat</Text>
          
          <Text style={styles.premiumNote}>
            💡 Erste 7 Tage kostenlos testen
          </Text>
        </Card>
      )}
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Neue Projekte</Text>
        <TouchableOpacity onPress={() => router.push('/projects')}>
          <Text style={styles.seeAllText}>Alle anzeigen</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.projectsContainer}>
        {recentProjects.map(project => (
          <ProjectCard
            key={project.id}
            project={project}
            onPress={(project) => router.push(`/projects/${project.id}`)}
            showContactButton
            onContactPress={(project) => router.push(`/projects/${project.id}`)}
            isBusinessView
          />
        ))}
      </View>
      
      <View style={styles.quickActions}>
        <Text style={styles.quickActionsTitle}>Schnellzugriff</Text>
        
        <TouchableOpacity 
          style={styles.quickActionItem}
          onPress={() => router.push('/credits')}
        >
          <View style={styles.quickActionIcon}>
            <Plus size={20} color={COLORS.accent} />
          </View>
          <View style={styles.quickActionContent}>
            <Text style={styles.quickActionTitle}>Credits kaufen</Text>
            <Text style={styles.quickActionText}>Laden Sie Ihr Guthaben auf</Text>
          </View>
          <ArrowRight size={20} color={COLORS.gray[400]} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionItem}
          onPress={() => router.push('/profile')}
        >
          <View style={styles.quickActionIcon}>
            <User size={20} color={COLORS.primary} />
          </View>
          <View style={styles.quickActionContent}>
            <Text style={styles.quickActionTitle}>Profil bearbeiten</Text>
            <Text style={styles.quickActionText}>Aktualisieren Sie Ihre Informationen</Text>
          </View>
          <ArrowRight size={20} color={COLORS.gray[400]} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingBottom: 75,
  },
  heroSection: {
    backgroundColor: COLORS.modernGreen,
    paddingHorizontal: SPACING.l,
    paddingTop: 60,
    paddingBottom: SPACING.xl,
    marginBottom: 0,
    minHeight: 700,
    justifyContent: 'space-between',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'center',
  },

  heroTitle: {
    ...FONTS.h1,
    color: COLORS.white,
    marginBottom: SPACING.s,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700' as const,
  },
  heroSubtitle: {
    ...FONTS.body1,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.l,
    opacity: 0.9,
    fontSize: 16,
  },
  searchContainer: {
    marginBottom: SPACING.l,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.m,
    ...SHADOWS.medium,
  },
  searchPlaceholder: {
    flex: 1,
    ...FONTS.body1,
    color: COLORS.textLight,
  },
  searchButton: {
    backgroundColor: COLORS.secondary,
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroFeatures: {
    gap: SPACING.m,
  },
  heroFeature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroFeatureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.s,
  },
  heroFeatureText: {
    flex: 1,
    ...FONTS.body2,
    color: COLORS.white,
    opacity: 0.9,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: SPACING.m,
    marginTop: SPACING.l,
  },
  heroStat: {
    alignItems: 'center',
  },
  heroStatValue: {
    ...FONTS.h2,
    color: COLORS.white,
    fontWeight: '700' as const,
    fontSize: 20,
  },
  heroStatLabel: {
    ...FONTS.body2,
    color: COLORS.white,
    opacity: 0.8,
    fontSize: 12,
  },
  contentSection: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: SPACING.l,
    flex: 1,
  },
  welcomeText: {
    ...FONTS.body1,
    color: COLORS.textLight,
  },
  appName: {
    ...FONTS.h1,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...FONTS.body1,
    color: COLORS.textLight,
    marginBottom: SPACING.m,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
    marginTop: SPACING.l,
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  seeAllText: {
    ...FONTS.body2,
    color: COLORS.primary,
  },
  servicesList: {
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.m,
  },
  businessesList: {
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.m,
  },
  businessCardItem: {
    width: 280,
    marginRight: SPACING.m,
  },
  howItWorksSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: 0,
    marginTop: SPACING.l,
    marginBottom: SPACING.l,
    borderRadius: 0,
    padding: SPACING.l,
  },
  howItWorksHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  howItWorksIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.secondary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.m,
  },
  howItWorksTitle: {
    ...FONTS.h1,
    color: COLORS.text,
    marginBottom: SPACING.s,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700' as const,
  },
  howItWorksSubtitle: {
    ...FONTS.body1,
    color: COLORS.textLight,
    textAlign: 'center',
    fontSize: 16,
  },
  stepsContainer: {
    marginBottom: SPACING.l,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.l,
    marginBottom: SPACING.m,
    alignItems: 'flex-start',
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: COLORS.gray[100],
  },
  stepIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
    ...SHADOWS.medium,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  stepBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.xs,
  },
  stepBadgeText: {
    ...FONTS.body2,
    color: COLORS.white,
    fontWeight: '700' as const,
    fontSize: 10,
  },
  stepTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    fontWeight: '600' as const,
  },
  stepDescription: {
    ...FONTS.body2,
    color: COLORS.textLight,
    lineHeight: 22,
    marginBottom: SPACING.m,
  },
  stepFeatures: {
    flexDirection: 'row',
    gap: SPACING.l,
    flexWrap: 'wrap',
    marginTop: SPACING.xs,
  },
  stepFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    minWidth: 120,
  },
  stepFeatureText: {
    ...FONTS.body2,
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '500' as const,
  },
  stepConnector: {
    alignItems: 'center',
    marginVertical: SPACING.xs,
  },
  stepConnectorLine: {
    width: 2,
    height: 16,
    backgroundColor: COLORS.gray[200],
  },
  stepConnectorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
    marginTop: -3,
  },
  howItWorksFooter: {
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    borderRadius: 12,
    padding: SPACING.m,
  },
  howItWorksFooterText: {
    ...FONTS.body2,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.m,
    fontWeight: '500' as const,
  },
  howItWorksButtonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  howItWorksButton: {
    paddingHorizontal: SPACING.xl,
    minWidth: 200,
  },
  projectsContainer: {
    paddingHorizontal: SPACING.m,
  },
  aboutSection: {
    backgroundColor: COLORS.primary,
    padding: SPACING.l,
    marginHorizontal: 0,
    marginTop: SPACING.l,
    marginBottom: SPACING.xl,
    borderRadius: 0,
  },
  aboutHeader: {
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  aboutTitle: {
    ...FONTS.h1,
    color: COLORS.white,
    marginBottom: SPACING.s,
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '700' as const,
  },
  aboutSubtitle: {
    ...FONTS.body1,
    color: COLORS.white,
    textAlign: 'center',
    fontSize: 16,
    opacity: 0.9,
  },
  companyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: SPACING.m,
    marginBottom: SPACING.l,
  },
  companyStat: {
    alignItems: 'center',
  },
  companyStatValue: {
    ...FONTS.h2,
    color: COLORS.white,
    fontWeight: '700' as const,
    fontSize: 20,
  },
  companyStatLabel: {
    ...FONTS.body2,
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.8,
  },
  missionSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: SPACING.m,
    borderRadius: 12,
    marginBottom: SPACING.l,
  },
  missionTitle: {
    ...FONTS.h3,
    color: COLORS.white,
    marginBottom: SPACING.s,
    fontWeight: '600' as const,
  },
  missionText: {
    ...FONTS.body2,
    color: COLORS.white,
    lineHeight: 22,
    opacity: 0.9,
  },
  trustFeatures: {
    marginBottom: SPACING.l,
  },
  trustFeature: {
    alignItems: 'center',
    marginBottom: SPACING.l,
    paddingHorizontal: SPACING.m,
  },
  trustFeatureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.s,
  },
  trustFeatureTitle: {
    ...FONTS.h3,
    color: COLORS.white,
    marginBottom: SPACING.xs,
    textAlign: 'center',
    fontWeight: '600' as const,
  },
  trustFeatureText: {
    ...FONTS.body2,
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.9,
  },
  certificationSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: SPACING.m,
    borderRadius: 12,
    marginBottom: SPACING.l,
  },
  certificationTitle: {
    ...FONTS.h3,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.s,
    fontWeight: '600' as const,
  },
  certifications: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  certification: {
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  certificationText: {
    ...FONTS.body2,
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500' as const,
  },
  featuredButton: {
    alignSelf: 'center',
    backgroundColor: COLORS.white,
  },
  
  // Business home styles
  businessHeader: {
    padding: SPACING.l,
    paddingTop: SPACING.xl,
  },
  businessHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeSection: {
    flex: 1,
  },
  businessNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  profileImageWelcome: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  premiumActiveSection: {
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.m,
  },
  premiumActiveBanner: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.m,
    ...SHADOWS.small,
  },
  premiumActiveTitle: {
    ...FONTS.body1,
    fontWeight: '700' as const,
    color: COLORS.text,
    marginLeft: 6,
    fontSize: 16,
  },
  premiumBenefitsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.s,
    paddingRight: SPACING.m,
    gap: SPACING.s,
    flexWrap: 'wrap',
  },
  premiumBanner: {
    backgroundColor: '#1a1a1a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFD700',
    marginHorizontal: SPACING.m,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumBannerContent: {
    flex: 1,
  },
  premiumBannerItem: {
    alignItems: 'flex-start',
  },
  premiumTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  benefitsScrollView: {
    marginRight: -SPACING.m,
    maxWidth: '100%',
  },
  premiumBannerTitle: {
    ...FONTS.body1,
    fontWeight: '700' as const,
    color: COLORS.white,
    marginBottom: 4,
    fontSize: 16,
  },
  premiumBenefits: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: SPACING.m,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  benefitSeparator: {
    width: 1,
    height: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    marginHorizontal: SPACING.xs,
  },
  benefitText: {
    ...FONTS.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 8,
  },
  benefitTextActive: {
    ...FONTS.caption,
    color: COLORS.textLight,
    fontSize: 10,
    fontWeight: '500' as const,
  },
  premiumUpgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: SPACING.s,
    paddingVertical: 6,
    borderRadius: 12,
    marginLeft: SPACING.s,
    marginTop: -20,
    gap: 4,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  premiumUpgradeText: {
    ...FONTS.caption,
    color: '#1a1a1a',
    fontWeight: '600' as const,
    fontSize: 11,
  },
  businessName: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  premiumStatusBadge: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crownIcon: {
    marginRight: 6,
  },
  crownEmoji: {
    fontSize: 16,
  },
  premiumStatusContent: {
    alignItems: 'center',
  },
  premiumBenefitsText: {
    ...FONTS.caption,
    color: COLORS.white,
    fontSize: 10,
    opacity: 0.9,
    marginTop: 2,
  },
  premiumActiveBadge: {
    backgroundColor: '#FFD700',
  },
  premiumInactiveBadge: {
    backgroundColor: COLORS.gray[400],
  },
  premiumStatusText: {
    ...FONTS.caption,
    fontWeight: '600' as const,
  },
  premiumActiveText: {
    color: COLORS.white,
  },
  premiumInactiveText: {
    color: COLORS.white,
  },
  businessStatsContainer: {
    paddingHorizontal: SPACING.m,
    marginBottom: SPACING.m,
  },
  businessStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.s,
  },
  businessStatCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
    paddingVertical: SPACING.m,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    ...SHADOWS.small,
  },
  creditsCard: {
    backgroundColor: COLORS.modernGreen,
    marginBottom: SPACING.s,
    marginHorizontal: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.m,
  },
  creditsContent: {
    alignItems: 'center',
    width: '100%',
  },
  creditsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: SPACING.s,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    marginTop: SPACING.xs,
  },
  creditsButtonText: {
    ...FONTS.caption,
    color: COLORS.white,
    fontWeight: '600' as const,
    fontSize: 11,
  },
  businessStatValue: {
    ...FONTS.h1,
    color: COLORS.white,
    fontWeight: '700' as const,
  },
  businessStatLabel: {
    ...FONTS.body2,
    color: COLORS.white,
    opacity: 0.9,
  },
  statValue: {
    ...FONTS.h1,
    color: COLORS.primary,
  },
  statLabel: {
    ...FONTS.body2,
    color: COLORS.textLight,
  },
  premiumCard: {
    margin: SPACING.m,
    background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 100%)`,
    backgroundColor: COLORS.primary,
    padding: SPACING.l,
    borderRadius: 16,
    ...SHADOWS.large,
  },
  premiumHeader: {
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  premiumBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.s,
    ...SHADOWS.medium,
  },
  premiumTitle: {
    ...FONTS.h1,
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: '700' as const,
  },
  premiumSubtitle: {
    ...FONTS.h3,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.l,
    opacity: 0.9,
  },
  premiumFeatures: {
    marginBottom: SPACING.l,
  },
  premiumFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  premiumFeatureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.s,
  },
  premiumFeatureText: {
    ...FONTS.body2,
    color: COLORS.white,
    flex: 1,
    fontWeight: '500' as const,
  },
  premiumStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: SPACING.m,
    marginBottom: SPACING.l,
  },
  premiumStat: {
    alignItems: 'center',
  },
  premiumStatValue: {
    ...FONTS.h2,
    color: COLORS.white,
    fontWeight: '700' as const,
  },
  premiumStatLabel: {
    ...FONTS.body2,
    color: COLORS.white,
    opacity: 0.8,
    fontSize: 12,
  },
  premiumButton: {
    backgroundColor: COLORS.white,
    marginBottom: SPACING.xs,
  },
  premiumButtonText: {
    color: COLORS.primary,
    fontWeight: '600' as const,
  },
  premiumPriceText: {
    ...FONTS.body2,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: SPACING.s,
    fontWeight: '500' as const,
  },
  premiumDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: SPACING.xs,
    marginHorizontal: SPACING.s,
  },
  premiumNote: {
    ...FONTS.body2,
    color: COLORS.white,
    textAlign: 'center',
    opacity: 0.8,
    fontStyle: 'italic' as const,
  },
  quickActions: {
    padding: SPACING.m,
    marginTop: SPACING.m,
    marginBottom: SPACING.xl,
  },
  quickActionsTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  quickActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    borderRadius: 8,
    marginBottom: SPACING.s,
    ...SHADOWS.small,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    ...FONTS.body1,
    color: COLORS.text,
  },
  quickActionText: {
    ...FONTS.body2,
    color: COLORS.textLight,
  },
});