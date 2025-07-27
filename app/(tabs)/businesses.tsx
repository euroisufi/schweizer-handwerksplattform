import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Filter } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { Business } from '@/types';
import { BUSINESSES } from '@/mocks/users';
import { CATEGORIES } from '@/constants/categories';
import BusinessCard from '@/components/BusinessCard';
import Input from '@/components/Input';
import { Search } from 'lucide-react-native';
import Button from '@/components/Button';
import { useAuth } from '@/hooks/auth-store';

export default function BusinessesScreen() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [cantonFilter, setCantonFilter] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  

  
  // Filter businesses based on search query and filters
  const filteredBusinesses = BUSINESSES.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (business.description && business.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !categoryFilter || business.categories.includes(categoryFilter);
    
    const matchesCanton = !cantonFilter || business.canton === cantonFilter;
    
    const matchesRating = !ratingFilter || business.rating >= ratingFilter;
    
    return matchesSearch && matchesCategory && matchesCanton && matchesRating;
  });
  
  const handleBusinessPress = (business: Business) => {
    router.push(`/businesses/${business.id}`);
  };
  
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>Keine Unternehmen gefunden</Text>
      <Text style={styles.emptyStateText}>
        Es wurden keine passenden Unternehmen gefunden. Versuchen Sie es mit anderen Filtereinstellungen.
      </Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Input
          placeholder="Unternehmen suchen..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={COLORS.gray[400]} />}
          containerStyle={styles.searchContainer}
        />
        
        <Button
          title="Filter"
          onPress={() => setFilterVisible(!filterVisible)}
          variant="outline"
          size="small"
          icon={<Filter size={16} color={COLORS.primary} />}
          style={styles.filterButton}
        />
      </View>
      
      {filterVisible && (
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Kategorien</Text>
          <View style={styles.filterOptions}>
            <Button
              title="Alle"
              onPress={() => setCategoryFilter(null)}
              variant={categoryFilter === null ? 'primary' : 'outline'}
              size="small"
              style={styles.filterOption}
            />
            
            {CATEGORIES.slice(0, 6).map(category => (
              <Button
                key={category.id}
                title={category.name}
                onPress={() => setCategoryFilter(category.name)}
                variant={categoryFilter === category.name ? 'primary' : 'outline'}
                size="small"
                style={styles.filterOption}
              />
            ))}
          </View>
          
          <Text style={styles.filterTitle}>Bewertung</Text>
          <View style={styles.filterOptions}>
            <Button
              title="Alle"
              onPress={() => setRatingFilter(null)}
              variant={ratingFilter === null ? 'primary' : 'outline'}
              size="small"
              style={styles.filterOption}
            />
            
            <Button
              title="4+ Sterne"
              onPress={() => setRatingFilter(4)}
              variant={ratingFilter === 4 ? 'primary' : 'outline'}
              size="small"
              style={styles.filterOption}
            />
            
            <Button
              title="4.5+ Sterne"
              onPress={() => setRatingFilter(4.5)}
              variant={ratingFilter === 4.5 ? 'primary' : 'outline'}
              size="small"
              style={styles.filterOption}
            />
          </View>
        </View>
      )}
      
      <FlatList
        data={filteredBusinesses}
        renderItem={({ item }) => (
          <BusinessCard 
            business={item} 
            onPress={handleBusinessPress}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.businessesList}
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
  },
  filterButton: {
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
    marginTop: SPACING.s,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOption: {
    marginRight: SPACING.s,
    marginBottom: SPACING.s,
  },
  businessesList: {
    padding: SPACING.m,
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