import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { SPACING, FONTS } from '@/constants/layout';
import ProjectCard from '@/components/ProjectCard';
import { PROJECTS } from '@/mocks/projects';
import { CATEGORIES } from '@/constants/categories';
import { Project } from '@/types';

export default function AktuelleProjektePage() {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const router = useRouter();

  const filteredProjects = PROJECTS.filter((project: Project) => {
    const matchesCategory = !categoryFilter || project.service.category === categoryFilter;
    
    return matchesCategory;
  });

  const handleProjectPress = () => {
    // Redirect to login when user taps on a project card
    router.push('/login');
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Aktuelle Projekte',
          headerStyle: {
            backgroundColor: COLORS.secondary,
          },
          headerTitleStyle: {
            color: COLORS.white,
            fontWeight: '600',
            fontSize: 18,
          },
          headerTintColor: COLORS.white,
        }} 
      />
      <View style={styles.container}>
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
            
            {CATEGORIES.map(category => (
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
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredProjects.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Keine aktuellen Projekte verfügbar
              </Text>
            </View>
          ) : (
            filteredProjects.map((project: Project) => (
              <TouchableOpacity key={project.id} onPress={handleProjectPress}>
                <ProjectCard
                  project={project}
                  onPress={handleProjectPress}
                />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.gray[600],
    textAlign: 'center',
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
});