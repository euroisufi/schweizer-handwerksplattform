import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Edit, LogOut, Star, ChevronRight, Award, CreditCard, Crown, Settings, Camera, User as UserIcon, Plus, Users, Zap } from 'lucide-react-native';
import { COLORS, SHADOWS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { useAuth } from '@/hooks/auth-store';
import { useCredits } from '@/hooks/credits-store';
import { Business } from '@/types';
import Button from '@/components/Button';
import Card from '@/components/Card';
import RatingStars from '@/components/RatingStars';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, userType, logout, switchUserType } = useAuth();
  const { credits, subscription } = useCredits();
  
  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);
  
  if (!user) {
    return null;
  }
  
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
  
  const handleSwitchUserType = () => {
    const newType = userType === 'customer' ? 'business' : 'customer';
    switchUserType(newType);
  };
  
  if (userType === 'customer') {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            {(user as any)?.logo ? (
              <Image source={{ uri: (user as any).logo }} style={styles.profileImage} />
            ) : (
              <Text style={styles.profileImageText}>{user.name.charAt(0)}</Text>
            )}
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          
          <View style={styles.headerButtons}>
            <Button 
              title="Profil bearbeiten" 
              onPress={() => router.push('/profile/edit')}
              variant="outline"
              size="small"
              icon={<Edit size={16} color={COLORS.primary} />}
              style={styles.editButton}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meine Projekte</Text>
          
          <Card style={styles.menuItem} onPress={() => router.push('/projects')}>
            <View style={styles.menuItemIcon}>
              <UserIcon size={20} color={COLORS.primary} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>Offene Projekte</Text>
              <Text style={styles.menuItemSubtext}>Verwalten Sie Ihre laufenden Aufträge</Text>
            </View>
            <ChevronRight size={20} color={COLORS.gray[400]} />
          </Card>
          
          <Card style={styles.menuItem} onPress={() => router.push('/profile/completed-projects')}>
            <View style={styles.menuItemIcon}>
              <UserIcon size={20} color={COLORS.success} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>Abgeschlossene Projekte</Text>
              <Text style={styles.menuItemSubtext}>Übersicht Ihrer erledigten Aufträge</Text>
            </View>
            <ChevronRight size={20} color={COLORS.gray[400]} />
          </Card>
          
          <Card style={styles.menuItem} onPress={() => router.push('/create-project')}>
            <View style={[styles.menuItemIcon, { backgroundColor: COLORS.modernGreen + '20' }]}>
              <Edit size={20} color={COLORS.modernGreen} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>Neues Projekt erstellen</Text>
              <Text style={styles.menuItemSubtext}>Erstellen Sie einen neuen Auftrag</Text>
            </View>
            <ChevronRight size={20} color={COLORS.gray[400]} />
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Einstellungen</Text>
          
          <Card style={styles.menuItem} onPress={() => router.push('/profile/account')}>
            <View style={styles.menuItemIcon}>
              <Settings size={20} color={COLORS.primary} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>Konto</Text>
              <Text style={styles.menuItemSubtext}>Verwalten Sie Ihre Kontodaten</Text>
            </View>
            <ChevronRight size={20} color={COLORS.gray[400]} />
          </Card>
          
          <Card style={styles.menuItem} onPress={() => router.push('/profile/notifications')}>
            <View style={styles.menuItemIcon}>
              <Settings size={20} color={COLORS.primary} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>Benachrichtigungen</Text>
              <Text style={styles.menuItemSubtext}>Einstellungen für Mitteilungen</Text>
            </View>
            <ChevronRight size={20} color={COLORS.gray[400]} />
          </Card>
        </View>
        
        <View style={styles.logoutSection}>
          <Button 
            title="Abmelden" 
            onPress={handleLogout}
            variant="outline"
            icon={<LogOut size={16} color={COLORS.error} />}
            textStyle={{ color: COLORS.error }}
            style={[styles.logoutButton, { borderColor: COLORS.error }]}
          />
        </View>
        
        <Button 
          title="Zu Handwerker-Ansicht wechseln" 
          onPress={handleSwitchUserType}
          variant="text"
          style={styles.demoButton}
        />
      </ScrollView>
    );
  }
  
  // Business profile
  const businessUser = user as Business;
  
  return (
    <ScrollView style={styles.container}>
      <View style={[styles.header, styles.businessHeader]}>
        <View style={styles.businessProfileTop}>
          {businessUser.logo ? (
            <Image source={{ uri: businessUser.logo }} style={styles.businessLogo} />
          ) : (
            <View style={styles.businessLogoPlaceholder}>
              <Text style={styles.businessLogoText}>{businessUser.name.charAt(0)}</Text>
            </View>
          )}
          
          <View style={styles.businessInfo}>
            <View style={styles.businessNameContainer}>
              <Text style={[styles.name, styles.businessName]}>{businessUser.name}</Text>
              {subscription && (
                <View style={styles.premiumBadge}>
                  <Award size={12} color={COLORS.white} />
                  <Text style={styles.premiumText}>Premium</Text>
                </View>
              )}
            </View>
            
            <View style={styles.ratingContainer}>
              <RatingStars rating={4.8} size={14} />
              <Text style={[styles.ratingText, styles.businessRatingText]}>4.8 (24 Bewertungen)</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.headerButtons}>
          <Button 
            title="Profil bearbeiten" 
            onPress={() => router.push('/profile/edit')}
            variant="outline"
            size="small"
            icon={<Edit size={14} color={COLORS.white} />}
            style={styles.businessEditButton}
            textStyle={{ color: COLORS.white }}
          />
        </View>
      </View>
      
      <View style={styles.businessStatsContainer}>
        <View style={styles.businessStatsGrid}>
          <TouchableOpacity 
            style={[styles.businessStatCard, styles.creditsCard]}
            onPress={() => router.push('/credits')}
          >
            <View style={styles.statIconContainer}>
              <Zap size={24} color={COLORS.white} />
            </View>
            <Text style={styles.businessStatValue}>{credits}</Text>
            <Text style={styles.businessStatLabel}>Verfügbare Credits</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.businessStatCard}
            onPress={() => router.push('/projects')}
          >
            <View style={styles.statIconContainer}>
              <UserIcon size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Neue Projekte</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.businessStatCard}
            onPress={() => router.push('/profile/reviews')}
          >
            <View style={styles.statIconContainer}>
              <Star size={20} color={COLORS.warning} />
            </View>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Bewertung</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mein Konto</Text>
        
        <Card style={styles.menuItem} onPress={() => router.push('/credits')}>
          <View style={[styles.menuItemIcon, { backgroundColor: COLORS.modernGreen + '20' }]}>
            <Plus size={20} color={COLORS.modernGreen} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>Credits kaufen</Text>
            <Text style={styles.menuItemSubtext}>Laden Sie Ihr Guthaben auf</Text>
          </View>
          <ChevronRight size={20} color={COLORS.gray[400]} />
        </Card>
        
        {!subscription ? (
          <Card style={[styles.menuItem, styles.premiumMenuItem]} onPress={() => router.push('/premium')}>
            <View style={styles.premiumMenuContent}>
              <View style={styles.premiumMenuHeader}>
                <View style={[styles.menuItemIcon, { backgroundColor: '#FFD700' + '20' }]}>
                  <Crown size={20} color={'#FFD700'} />
                </View>
                <View style={styles.menuItemContent}>
                  <Text style={[styles.menuItemText, styles.premiumMenuTitle]}>Jetzt Premium werden</Text>
                  <Text style={styles.menuItemSubtext}>Werden Sie Premium-Mitglied</Text>
                </View>
              </View>
              <View style={styles.premiumBenefitsList}>
                <View style={styles.premiumBenefitItem}>
                  <Text style={styles.checkmark}>✓</Text>
                  <Text style={styles.premiumBenefitText}>24h vorab Zugriff auf neue Projekte</Text>
                </View>
                <View style={styles.premiumBenefitItem}>
                  <Text style={styles.checkmark}>✓</Text>
                  <Text style={styles.premiumBenefitText}>3x mehr Sichtbarkeit in Suchergebnissen</Text>
                </View>
                <View style={styles.premiumBenefitItem}>
                  <Text style={styles.checkmark}>✓</Text>
                  <Text style={styles.premiumBenefitText}>Premium Badge für mehr Vertrauen</Text>
                </View>
                <View style={styles.premiumBenefitItem}>
                  <Text style={styles.checkmark}>✓</Text>
                  <Text style={styles.premiumBenefitText}>Prioritäts-Support</Text>
                </View>
              </View>
            </View>
            <ChevronRight size={20} color={COLORS.gray[400]} />
          </Card>
        ) : (
          <Card style={styles.menuItem} onPress={() => router.push('/premium')}>
            <View style={[styles.menuItemIcon, { backgroundColor: '#FFD700' + '20' }]}>
              <Crown size={20} color={'#FFD700'} />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>Premium-Abo verwalten</Text>
              <Text style={styles.menuItemSubtext}>Abo ändern oder kündigen</Text>
            </View>
            <ChevronRight size={20} color={COLORS.gray[400]} />
          </Card>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Projekte</Text>
        
        <Card style={styles.menuItem} onPress={() => router.push('/projects')}>
          <View style={styles.menuItemIcon}>
            <UserIcon size={20} color={COLORS.primary} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>Alle Projekte anzeigen</Text>
            <Text style={styles.menuItemSubtext}>Übersicht aller verfügbaren Projekte</Text>
          </View>
          <ChevronRight size={20} color={COLORS.gray[400]} />
        </Card>
        
        <Card style={styles.menuItem} onPress={() => router.push('/profile/unlocked-contacts')}>
          <View style={styles.menuItemIcon}>
            <Users size={20} color={COLORS.primary} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>Meine freigeschalteten Kontakte</Text>
            <Text style={styles.menuItemSubtext}>Verwalten Sie Ihre Kundenkontakte</Text>
          </View>
          <ChevronRight size={20} color={COLORS.gray[400]} />
        </Card>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Einstellungen</Text>
        
        <Card style={styles.menuItem} onPress={() => router.push('/profile/business-profile')}>
          <View style={styles.menuItemIcon}>
            <UserIcon size={20} color={COLORS.primary} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>Unternehmensprofil</Text>
            <Text style={styles.menuItemSubtext}>Bearbeiten Sie Ihr Firmenprofil</Text>
          </View>
          <ChevronRight size={20} color={COLORS.gray[400]} />
        </Card>
        
        <Card style={styles.menuItem} onPress={() => router.push('/profile/services')}>
          <View style={styles.menuItemIcon}>
            <Settings size={20} color={COLORS.primary} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>Fachbereiche/Dienstleistungen</Text>
            <Text style={styles.menuItemSubtext}>Verwalten Sie Ihre Leistungen</Text>
          </View>
          <ChevronRight size={20} color={COLORS.gray[400]} />
        </Card>
        
        <Card style={styles.menuItem} onPress={() => router.push('/profile/gallery')}>
          <View style={styles.menuItemIcon}>
            <Camera size={20} color={COLORS.primary} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>Fotogalerie</Text>
            <Text style={styles.menuItemSubtext}>Verwalten Sie Ihre Projektbilder</Text>
          </View>
          <ChevronRight size={20} color={COLORS.gray[400]} />
        </Card>
        
        <Card style={styles.menuItem} onPress={() => router.push('/profile/reviews')}>
          <View style={styles.menuItemIcon}>
            <Star size={20} color={COLORS.primary} />
          </View>
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>Bewertungen</Text>
            <Text style={styles.menuItemSubtext}>Übersicht Ihrer Kundenbewertungen</Text>
          </View>
          <ChevronRight size={20} color={COLORS.gray[400]} />
        </Card>
      </View>
      
      <View style={styles.logoutSection}>
        <Button 
          title="Abmelden" 
          onPress={handleLogout}
          variant="outline"
          icon={<LogOut size={16} color={COLORS.error} />}
          textStyle={{ color: COLORS.error }}
          style={[styles.logoutButton, { borderColor: COLORS.error }]}
        />
      </View>
      
      <Button 
        title="Zu Kunden-Ansicht wechseln" 
        onPress={handleSwitchUserType}
        variant="text"
        style={styles.demoButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingBottom: 90,
  },
  header: {
    alignItems: 'center',
    padding: SPACING.l,
    paddingTop: SPACING.xl,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  businessHeader: {
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    paddingBottom: SPACING.xl,
  },
  businessName: {
    color: COLORS.white,
  },
  businessRatingText: {
    color: COLORS.white,
    opacity: 0.9,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.m,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileImageText: {
    ...FONTS.h1,
    color: COLORS.white,
  },
  name: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  email: {
    ...FONTS.body1,
    color: COLORS.textLight,
    marginBottom: SPACING.m,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  editButton: {
    marginRight: SPACING.m,
  },
  businessEditButton: {
    borderColor: COLORS.white + '50',
    backgroundColor: 'transparent',
  },
  section: {
    padding: SPACING.m,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
    padding: SPACING.m,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  menuItemText: {
    ...FONTS.body1,
    color: COLORS.text,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemSubtext: {
    ...FONTS.caption,
    color: COLORS.textLight,
    fontSize: 12,
    marginTop: 2,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.text,
    marginBottom: SPACING.l,
  },
  loginButton: {
    minWidth: 200,
  },
  logoutSection: {
    padding: SPACING.m,
    marginTop: SPACING.m,
  },
  logoutButton: {
    alignSelf: 'center',
    minWidth: 200,
  },
  demoButton: {
    margin: SPACING.l,
    marginTop: SPACING.m,
  },
  
  // Business profile styles
  businessProfileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  businessInfo: {
    flex: 1,
    marginLeft: SPACING.m,
  },
  businessLogo: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: COLORS.white + '30',
  },
  businessLogoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: COLORS.white + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white + '30',
  },
  businessLogoText: {
    ...FONTS.h1,
    color: COLORS.white,
  },
  businessNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
    flexWrap: 'wrap',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: SPACING.s,
  },
  premiumText: {
    fontSize: 10,
    color: COLORS.white,
    fontWeight: '600' as const,
    marginLeft: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  ratingText: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginLeft: SPACING.xs,
  },
  businessStatsContainer: {
    paddingHorizontal: SPACING.m,
    marginTop: -SPACING.l,
    marginBottom: SPACING.m,
  },
  businessStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.s,
  },
  businessStatCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACING.l,
    paddingHorizontal: SPACING.s,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    ...SHADOWS.medium,
    minHeight: 100,
    justifyContent: 'center',
  },
  creditsCard: {
    backgroundColor: COLORS.modernGreen,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.s,
  },
  businessStatValue: {
    ...FONTS.h2,
    color: COLORS.white,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  businessStatLabel: {
    ...FONTS.caption,
    color: COLORS.white,
    opacity: 0.9,
    textAlign: 'center',
    fontSize: 11,
  },
  statValue: {
    ...FONTS.h3,
    color: COLORS.primary,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  statLabel: {
    ...FONTS.caption,
    color: COLORS.textLight,
    textAlign: 'center',
    fontSize: 11,
  },
  premiumMenuItem: {
    paddingVertical: SPACING.l,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#FFD700' + '30',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  premiumMenuContent: {
    flex: 1,
  },
  premiumMenuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  premiumMenuTitle: {
    fontWeight: '600' as const,
    fontSize: 16,
    color: COLORS.text,
  },
  premiumBenefitsList: {
    marginLeft: 52,
    marginTop: SPACING.xs,
  },
  premiumBenefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkmark: {
    color: COLORS.success,
    fontSize: 12,
    fontWeight: '600' as const,
    marginRight: 6,
    width: 12,
  },
  premiumBenefitText: {
    ...FONTS.caption,
    color: COLORS.textLight,
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
  },

  
  // Login container styles
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  subtitle: {
    ...FONTS.body1,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: SPACING.m,
  },
  registerButton: {
    marginTop: SPACING.s,
  },
});