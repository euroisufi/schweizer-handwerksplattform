import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Check, Crown, Star, Zap } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { useAuth } from '@/hooks/auth-store';
import { useProjects } from '@/hooks/projects-store';
import { useCredits } from '@/hooks/credits-store';
import { Project } from '@/types';
import { CATEGORIES } from '@/constants/categories';
import { BUSINESSES } from '@/mocks/users';
import ProjectCard from '@/components/ProjectCard';
import Button from '@/components/Button';


export default function ProjectsScreen() {
  const router = useRouter();
  const { userType, user } = useAuth();
  const { projects, getUserProjects, completeProject } = useProjects();
  const { hasPremium } = useCredits();

  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortFilter, setSortFilter] = useState<string>('newest');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Get current business user's categories if they are a business
  const businessCategories = userType === 'business' && user ? 
    ((user as any)?.categories || []) : [];
  
  console.log('Business categories:', businessCategories);
  console.log('User type:', userType);
  console.log('User:', user);
  
  // Get projects based on user type
  const userProjects = userType === 'customer' 
    ? getUserProjects().filter(project => project.status !== 'completed') 
    : projects.filter(project => project.status !== 'completed');
  
  // Filter and sort projects
  const filteredProjects = userProjects
    .filter(project => {
      const matchesStatus = !statusFilter || project.status === statusFilter;
      const matchesCategory = !categoryFilter || project.service.category === categoryFilter;
      
      // For business users: only show projects that match their offered categories
      // Convert category IDs to names for comparison
      const matchesBusinessCategories = userType === 'customer' || 
        businessCategories.length === 0 || 
        businessCategories.some((categoryId: string) => {
          const category = CATEGORIES.find(c => c.id === categoryId);
          return category?.name === project.service.category;
        });
      
      console.log('Project:', project.title, 'Category:', project.service.category, 'Matches:', matchesBusinessCategories);
      
      return matchesStatus && matchesCategory && matchesBusinessCategories;
    })
    .sort((a, b) => {
      switch (sortFilter) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'budget_high':
          return (b.budget?.max || 0) - (a.budget?.max || 0);
        case 'budget_low':
          return (a.budget?.min || 0) - (b.budget?.min || 0);
        default:
          return 0;
      }
    });
  

  
  const handleProjectPress = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };
  
  const handleEditProject = (project: Project) => {
    router.push(`/projects/edit/${project.id}`);
  };
  
  const handleCompleteProject = (project: Project) => {
    Alert.alert(
      'Projekt abschließen',
      'Möchten Sie dieses Projekt als abgeschlossen markieren?',
      [
        {
          text: 'Abbrechen',
          style: 'cancel',
        },
        {
          text: 'Abschließen',
          onPress: async () => {
            try {
              await completeProject(project.id);
              Alert.alert('Erfolg', 'Projekt wurde als abgeschlossen markiert.');
            } catch (error) {
              Alert.alert('Fehler', 'Projekt konnte nicht abgeschlossen werden.');
            }
          },
        },
      ]
    );
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>Keine offenen Projekte gefunden</Text>
      {userType === 'customer' ? (
        <>
          <Text style={styles.emptyStateText}>
            Sie haben keine offenen Projekte. Erstellen Sie jetzt ein neues Projekt oder sehen Sie sich Ihre abgeschlossenen Projekte an.
          </Text>
          <Button 
            title="Projekt erstellen" 
            onPress={() => router.push('/create-project')}
            style={styles.emptyStateButton}
          />
        </>
      ) : (
        <Text style={styles.emptyStateText}>
          Es wurden keine passenden Projekte gefunden. Versuchen Sie es mit anderen Filtereinstellungen.
        </Text>
      )}
    </View>
  );
  
  return (
    <View style={styles.container}>
      {/* Premium Banner - show for all business users */}
      {userType === 'business' && (
        <View style={[styles.premiumBanner, hasPremium && styles.premiumBannerActive]}>
          <View style={styles.premiumBannerLeft}>
            <View style={styles.premiumIconContainer}>
              <Crown size={20} color={hasPremium ? '#FFD700' : COLORS.white} />
            </View>
            <View style={styles.premiumTextContainer}>
              <Text style={styles.premiumBannerTitle}>
                {hasPremium ? 'Premium Mitglied' : 'Premium werden'}
              </Text>
              <Text style={styles.premiumBannerSubtitle}>
                {hasPremium ? 'Alle Vorteile aktiv' : 'Mehr Aufträge erhalten'}
              </Text>
            </View>
          </View>
          
          <View style={styles.premiumBenefitsContainer}>
            <View style={styles.premiumBenefitItem}>
              <Zap size={12} color={hasPremium ? '#FFD700' : COLORS.white} />
              <Text style={styles.premiumBenefitText}>24h Vorab-Zugriff</Text>
            </View>
            <View style={styles.premiumBenefitItem}>
              <Star size={12} color={hasPremium ? '#FFD700' : COLORS.white} />
              <Text style={styles.premiumBenefitText}>3x Sichtbarkeit</Text>
            </View>
          </View>
          
          {!hasPremium && (
            <TouchableOpacity 
              style={styles.premiumUpgradeButton}
              onPress={() => router.push('/premium')}
            >
              <Text style={styles.premiumUpgradeText}>Upgrade</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      {userType === 'business' && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.nearbyButton}>
            <MapPin size={16} color={COLORS.primary} />
            <Text style={styles.nearbyButtonText}>In der Nähe</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Categories horizontal scroll */}
      <View style={styles.categoriesSection}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          <TouchableOpacity 
            style={[styles.categoryChip, categoryFilter === null && styles.categoryChipSelected]}
            onPress={() => setCategoryFilter(null)}
          >
            <Text style={[styles.categoryChipText, categoryFilter === null && styles.categoryChipTextSelected]}>
              Alle
            </Text>
          </TouchableOpacity>
          
          {CATEGORIES
            .filter(category => {
              // For business users: only show categories they offer
              // For customer users: show all categories
              return userType === 'customer' || 
                businessCategories.length === 0 || 
                businessCategories.includes(category.id);
            })
            .map(category => (
            <TouchableOpacity 
              key={category.id}
              style={[
                styles.categoryChip, 
                categoryFilter === category.name && styles.categoryChipSelected,
                categoryFilter === category.name && { backgroundColor: category.color }
              ]}
              onPress={() => setCategoryFilter(category.name)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryChipText, 
                categoryFilter === category.name && styles.categoryChipTextSelected
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Show settings button if business has no categories or no projects in category */}
        {userType === 'business' && (businessCategories.length === 0 || filteredProjects.length === 0) && (
          <View style={styles.noProjectsContainer}>
            <Text style={styles.noProjectsText}>
              {businessCategories.length === 0 
                ? 'Keine Fachbereiche definiert' 
                : 'Keine Projekte in dieser Kategorie'}
            </Text>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => router.push('/profile/services')}
            >
              <Text style={styles.settingsButtonText}>Fachbereiche/Dienstleistungen verwalten</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      

      
      {/* Status filters - only for customer users */}
      {userType === 'customer' && (
        <View style={styles.statusFiltersSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statusFiltersContainer}
          >
            <TouchableOpacity 
              style={[styles.statusFilterChip, statusFilter === null && styles.statusFilterChipSelected]}
              onPress={() => setStatusFilter(null)}
            >
              <Text style={[styles.statusFilterText, statusFilter === null && styles.statusFilterTextSelected]}>
                Alle Projekte
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.statusFilterChip, statusFilter === 'open' && styles.statusFilterChipSelected]}
              onPress={() => setStatusFilter('open')}
            >
              <Text style={[styles.statusFilterText, statusFilter === 'open' && styles.statusFilterTextSelected]}>
                Offene Projekte
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.statusFilterChip, statusFilter === 'in_progress' && styles.statusFilterChipSelected]}
              onPress={() => setStatusFilter('in_progress')}
            >
              <Text style={[styles.statusFilterText, statusFilter === 'in_progress' && styles.statusFilterTextSelected]}>
                In Bearbeitung
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.statusFilterChip, statusFilter === 'completed' && styles.statusFilterChipSelected]}
              onPress={() => setStatusFilter('completed')}
            >
              <Text style={[styles.statusFilterText, statusFilter === 'completed' && styles.statusFilterTextSelected]}>
                Abgeschlossen
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
      

      
      <FlatList
        data={filteredProjects}
        renderItem={({ item }) => (
          <ProjectCard 
            project={item} 
            onPress={handleProjectPress}
            showContactButton={userType === 'business'}
            onContactPress={handleProjectPress}
            isBusinessView={userType === 'business'}
            isOwnerView={userType === 'customer'}
            onEdit={userType === 'customer' ? handleEditProject : undefined}
            onComplete={userType === 'customer' ? handleCompleteProject : undefined}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.projectsList}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingBottom: 75,
  },
  premiumBanner: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.m,
    marginHorizontal: SPACING.m,
    marginTop: SPACING.s,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumBannerActive: {
    backgroundColor: '#1a1a2e',
  },
  premiumBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  premiumIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.s,
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumBannerTitle: {
    ...FONTS.body1,
    fontWeight: '700' as const,
    color: COLORS.white,
    marginBottom: 2,
  },
  premiumBannerSubtitle: {
    ...FONTS.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  premiumBenefitsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginRight: SPACING.s,
  },
  premiumBenefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  premiumBenefitText: {
    ...FONTS.caption,
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 10,
    marginLeft: 4,
  },
  premiumUpgradeButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  premiumUpgradeText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: '700' as const,
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: SPACING.m,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  nearbyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '10',
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    marginLeft: SPACING.s,
  },
  nearbyButtonText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: '600' as const,
    marginLeft: 4,
  },
  categoriesSection: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    paddingVertical: SPACING.s,
  },
  categoriesContainer: {
    paddingHorizontal: SPACING.m,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    marginRight: SPACING.xs,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primary,
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  categoryChipText: {
    ...FONTS.caption,
    color: COLORS.textLight,
    fontWeight: '500' as const,
  },
  categoryChipTextSelected: {
    color: COLORS.white,
  },

  statusFiltersSection: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    paddingVertical: SPACING.xs,
  },
  statusFiltersContainer: {
    paddingHorizontal: SPACING.m,
  },
  statusFilterChip: {
    backgroundColor: COLORS.gray[100],
    paddingHorizontal: SPACING.s,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: SPACING.xs,
  },
  statusFilterChipSelected: {
    backgroundColor: COLORS.primary,
  },
  statusFilterText: {
    ...FONTS.caption,
    color: COLORS.textLight,
    fontWeight: '500' as const,
    fontSize: 12,
  },
  statusFilterTextSelected: {
    color: COLORS.white,
  },

  projectsList: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
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
    marginBottom: SPACING.l,
  },
  emptyStateButton: {
    minWidth: 200,
  },
  noProjectsContainer: {
    alignItems: 'center',
    padding: SPACING.m,
    backgroundColor: COLORS.gray[50],
    marginHorizontal: SPACING.m,
    marginTop: SPACING.s,
    borderRadius: 8,
  },
  noProjectsText: {
    ...FONTS.body2,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.s,
  },
  settingsButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  settingsButtonText: {
    ...FONTS.caption,
    color: COLORS.white,
    fontWeight: '600' as const,
  },
});