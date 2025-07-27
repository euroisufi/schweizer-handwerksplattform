import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { useProjects } from '@/hooks/projects-store';
import ProjectCard from '@/components/ProjectCard';

export default function CompletedProjectsScreen() {
  const router = useRouter();
  const { projects } = useProjects();
  
  // Filter completed projects
  const completedProjects = projects.filter(project => project.status === 'completed');
  
  const handleProjectPress = (project: any) => {
    router.push(`/projects/${project.id}`);
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>Keine abgeschlossenen Projekte</Text>
      <Text style={styles.emptyStateText}>
        Sie haben noch keine Projekte abgeschlossen. Abgeschlossene Projekte werden hier angezeigt.
      </Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Abgeschlossene Projekte',
          headerStyle: { backgroundColor: COLORS.white },
          headerTitleStyle: { color: COLORS.text }
        }} 
      />
      
      <FlatList
        data={completedProjects}
        renderItem={({ item }) => (
          <ProjectCard
            project={item}
            onPress={handleProjectPress}
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
  },
  projectsList: {
    padding: SPACING.m,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    marginTop: SPACING.xl,
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
  },
});