import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Filter } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { useAuth } from '@/hooks/auth-store';
import { useProjects } from '@/hooks/projects-store';
import { Project } from '@/types';
import ProjectCard from '@/components/ProjectCard';
import Input from '@/components/Input';
import { Search } from 'lucide-react-native';

export default function MyProjectsScreen() {
  const router = useRouter();
  const { userType } = useAuth();
  const { getUserProjects } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const userProjects = getUserProjects();
  
  // Filter projects based on search query and status
  const filteredProjects = userProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleProjectPress = (project: Project) => {
    router.push(`/projects/${project.id}`);
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>Keine Projekte gefunden</Text>
      <Text style={styles.emptyStateText}>
        {userType === 'customer' 
          ? 'Sie haben noch keine Projekte erstellt.'
          : 'Sie haben noch keine Projekte übernommen.'}
      </Text>
    </View>
  );
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Meine Projekte',
          headerBackTitle: 'Zurück',
        }} 
      />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <Input
            placeholder="Projekte suchen..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Search size={20} color={COLORS.gray[400]} />}
            containerStyle={styles.searchContainer}
          />
          
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setFilterVisible(!filterVisible)}
          >
            <Filter size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        
        {filterVisible && (
          <View style={styles.filterContainer}>
            <Text style={styles.filterTitle}>Status</Text>
            <View style={styles.filterOptions}>
              <TouchableOpacity 
                style={[
                  styles.filterOption, 
                  statusFilter === null && styles.filterOptionSelected
                ]}
                onPress={() => setStatusFilter(null)}
              >
                <Text 
                  style={[
                    styles.filterOptionText,
                    statusFilter === null && styles.filterOptionTextSelected
                  ]}
                >
                  Alle
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.filterOption, 
                  statusFilter === 'open' && styles.filterOptionSelected
                ]}
                onPress={() => setStatusFilter('open')}
              >
                <Text 
                  style={[
                    styles.filterOptionText,
                    statusFilter === 'open' && styles.filterOptionTextSelected
                  ]}
                >
                  Offen
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.filterOption, 
                  statusFilter === 'completed' && styles.filterOptionSelected
                ]}
                onPress={() => setStatusFilter('completed')}
              >
                <Text 
                  style={[
                    styles.filterOptionText,
                    statusFilter === 'completed' && styles.filterOptionTextSelected
                  ]}
                >
                  Abgeschlossen
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.filterOption, 
                  statusFilter === 'draft' && styles.filterOptionSelected
                ]}
                onPress={() => setStatusFilter('draft')}
              >
                <Text 
                  style={[
                    styles.filterOptionText,
                    statusFilter === 'draft' && styles.filterOptionTextSelected
                  ]}
                >
                  Entwürfe
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        <FlatList
          data={filteredProjects}
          renderItem={({ item }) => (
            <ProjectCard 
              project={item} 
              onPress={handleProjectPress}
              isBusinessView={userType === 'business'}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.projectsList}
          ListEmptyComponent={renderEmptyState}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  searchContainer: {
    flex: 1,
    marginBottom: 0,
    height: 25,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: COLORS.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.s,
  },
  filterContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  filterTitle: {
    ...FONTS.body1,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
    marginRight: SPACING.s,
    marginBottom: SPACING.s,
  },
  filterOptionSelected: {
    backgroundColor: COLORS.primary,
  },
  filterOptionText: {
    ...FONTS.body2,
    color: COLORS.textLight,
  },
  filterOptionTextSelected: {
    color: COLORS.white,
  },
  projectsList: {
    paddingHorizontal: SPACING.l,
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
  },
});