import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Save } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { useAuth } from '@/hooks/auth-store';
import { CATEGORIES } from '@/constants/categories';
import Button from '@/components/Button';
import Card from '@/components/Card';

export default function ServicesScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>((user as any)?.categories || []);
  
  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };
  
  const handleSave = () => {
    if (selectedCategories.length === 0) {
      Alert.alert('Fehler', 'Bitte wählen Sie mindestens einen Fachbereich aus.');
      return;
    }
    
    const updatedData = {
      categories: selectedCategories,
    } as any;
    
    updateUser(updatedData);
    
    Alert.alert(
      'Fachbereiche gespeichert',
      'Ihre Fachbereiche wurden erfolgreich aktualisiert.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };
  

  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Fachbereiche/Dienstleistungen',
          headerBackTitle: 'Zurück',
        }} 
      />
      
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.title}>Ihre Fachbereiche</Text>
          <Text style={styles.subtitle}>
            Wählen Sie alle Fachbereiche aus, in denen Sie tätig sind. Kunden können Sie basierend auf diesen Fachbereichen finden und Sie erhalten passende Projektanfragen.
          </Text>
          
          <View style={styles.categoriesContainer}>
            {CATEGORIES.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  selectedCategories.includes(category.id) && styles.categoryItemSelected
                ]}
                onPress={() => handleCategoryToggle(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryText,
                  selectedCategories.includes(category.id) && styles.categoryTextSelected
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.selectedSummary}>
            <Text style={styles.selectedTitle}>
              Ausgewählte Fachbereiche: {selectedCategories.length}
            </Text>
            {selectedCategories.length > 0 && (
              <Text style={styles.selectedText}>
                {selectedCategories.map(id => {
                  const category = CATEGORIES.find(c => c.id === id);
                  return category?.name;
                }).filter(Boolean).join(', ')}
              </Text>
            )}
          </View>
          
          <Button 
            title="Änderungen speichern" 
            onPress={handleSave}
            icon={<Save size={16} color={COLORS.white} />}
            style={styles.saveButton}
          />
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.m,
  },
  card: {
    padding: SPACING.m,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  subtitle: {
    ...FONTS.body1,
    color: COLORS.textLight,
    marginBottom: SPACING.l,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.m,
    gap: SPACING.s,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.gray[300],
    backgroundColor: COLORS.white,
    marginBottom: SPACING.s,
  },
  categoryItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  categoryText: {
    ...FONTS.body2,
    color: COLORS.text,
  },
  categoryTextSelected: {
    color: COLORS.white,
  },
  selectedSummary: {
    backgroundColor: COLORS.gray[100],
    padding: SPACING.m,
    borderRadius: 8,
    marginBottom: SPACING.m,
  },
  selectedTitle: {
    ...FONTS.body1,
    fontWeight: '600' as const,
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  selectedText: {
    ...FONTS.body2,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  saveButton: {
    marginTop: SPACING.m,
  },
});