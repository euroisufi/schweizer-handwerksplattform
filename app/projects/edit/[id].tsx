import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity, Image, Platform, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Save, X, Camera, Plus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { useAuth } from '@/hooks/auth-store';
import { useProjects } from '@/hooks/projects-store';
import { Project } from '@/types';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';

export default function EditProjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { userType } = useAuth();
  const { getProjectById, updateProject, isProjectOwner } = useProjects();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [area, setArea] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const project = getProjectById(id);
  const isOwner = project ? isProjectOwner(project.id) : false;
  
  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
      setArea(project.area || '');
      setBudgetMin(project.budget?.min.toString() || '');
      setBudgetMax(project.budget?.max.toString() || '');
      setProjectImages(project.images || []);
    }
  }, [project]);
  
  if (!project) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Projekt nicht gefunden</Text>
        <Button 
          title="Zurück" 
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </View>
    );
  }
  
  if (!isOwner || userType !== 'customer') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Sie haben keine Berechtigung, dieses Projekt zu bearbeiten</Text>
        <Button 
          title="Zurück" 
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </View>
    );
  }
  
  if (project.status === 'completed') {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Abgeschlossene Projekte können nicht bearbeitet werden</Text>
        <Button 
          title="Zurück" 
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </View>
    );
  }
  
  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie einen Projekttitel ein.');
      return;
    }
    
    if (!description.trim()) {
      Alert.alert('Fehler', 'Bitte geben Sie eine Projektbeschreibung ein.');
      return;
    }
    
    if (!budgetMin || !budgetMax) {
      Alert.alert('Fehler', 'Budget ist erforderlich.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const updates: Partial<Project> = {
        title: title.trim(),
        description: description.trim(),
        area: area.trim() || undefined,
        images: projectImages,
      };
      
      const min = parseInt(budgetMin);
      const max = parseInt(budgetMax);
      
      if (isNaN(min) || isNaN(max)) {
        Alert.alert('Fehler', 'Budget muss eine gültige Zahl sein.');
        setIsLoading(false);
        return;
      }
      
      if (min > max) {
        Alert.alert('Fehler', 'Das Mindestbudget darf nicht höher als das Maximalbudget sein.');
        setIsLoading(false);
        return;
      }
      
      updates.budget = { min, max };
      
      await updateProject(project.id, updates);
      
      Alert.alert(
        'Erfolg',
        'Projekt wurde erfolgreich aktualisiert.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Fehler', 'Projekt konnte nicht aktualisiert werden.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImagePicker = async () => {
    try {
      // On web, use mock images for demo purposes
      if (Platform.OS === 'web') {
        const mockImages = [
          'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
          'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80'
        ];
        const randomImages = mockImages.slice(0, Math.floor(Math.random() * 3) + 1);
        setProjectImages(prev => [...prev, ...randomImages]);
        return;
      }

      // Request permission for mobile
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Berechtigung erforderlich', 'Bitte erlauben Sie den Zugriff auf Ihre Fotogalerie.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        aspect: [4, 3],
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        setProjectImages(prev => [...prev, ...newImages]);
      }
    } catch (error) {
      Alert.alert('Fehler', 'Beim Auswählen der Bilder ist ein Fehler aufgetreten.');
    }
  };

  const removeImage = (index: number) => {
    setProjectImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleCancel = () => {
    Alert.alert(
      'Änderungen verwerfen',
      'Möchten Sie die Bearbeitung abbrechen? Alle Änderungen gehen verloren.',
      [
        {
          text: 'Weiter bearbeiten',
          style: 'cancel',
        },
        {
          text: 'Verwerfen',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]
    );
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Projekt bearbeiten',
          headerBackTitle: 'Zurück',
          headerStyle: {
            backgroundColor: COLORS.modernGreen,
          },
          headerTintColor: COLORS.white,
          headerTitleStyle: {
            color: COLORS.white,
          },
          headerRight: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleCancel}
            >
              <X size={20} color={COLORS.white} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container}>
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Projektdetails</Text>
          
          <Input
            label="Projekttitel *"
            placeholder="z.B. Badezimmer renovieren"
            value={title}
            onChangeText={setTitle}
            containerStyle={styles.inputContainer}
          />
          
          <Input
            label="Projektbeschreibung *"
            placeholder="Beschreiben Sie Ihr Projekt im Detail..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            containerStyle={styles.inputContainer}
          />
          
          <Input
            label="Fläche (optional)"
            placeholder="z.B. 25"
            value={area}
            onChangeText={setArea}
            keyboardType="numeric"
            rightText="m²"
            containerStyle={styles.inputContainer}
          />
        </Card>
        
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Budget *</Text>
          <Text style={styles.sectionSubtitle}>
            Geben Sie Ihr Budget in CHF an. Diese Information wird benötigt, damit Handwerker die passenden Credits-Kosten für Ihr Projekt berechnen können. Für Sie entstehen keine zusätzlichen Kosten.
          </Text>
          
          <View style={styles.budgetRow}>
            <Input
              label="Von *"
              placeholder="1000"
              value={budgetMin}
              onChangeText={setBudgetMin}
              keyboardType="numeric"
              leftText="CHF"
              containerStyle={[styles.inputContainer, styles.budgetInput]}
            />
            
            <Input
              label="Bis *"
              placeholder="5000"
              value={budgetMax}
              onChangeText={setBudgetMax}
              keyboardType="numeric"
              leftText="CHF"
              containerStyle={[styles.inputContainer, styles.budgetInput]}
            />
          </View>
        </Card>
        
        <Card style={styles.formCard}>
          <Text style={styles.sectionTitle}>Projektbilder (optional)</Text>
          <Text style={styles.sectionSubtitle}>
            Fügen Sie Bilder hinzu, um Ihr Projekt besser zu beschreiben.
          </Text>
          
          <Pressable 
            style={styles.imageUploadPlaceholder}
            onPress={handleImagePicker}
          >
            <Camera size={32} color={COLORS.textLight} />
            <Text style={styles.imageUploadText}>Bilder hinzufügen</Text>
            <Text style={styles.imageUploadSubtext}>
              Tippen Sie hier, um Bilder aus Ihrer Galerie auszuwählen
            </Text>
          </Pressable>
          
          {projectImages.length > 0 && (
            <View style={styles.imagePreviewContainer}>
              <Text style={styles.imagePreviewTitle}>Ausgewählte Bilder ({projectImages.length})</Text>
              <View style={styles.imagePreviewGrid}>
                {projectImages.map((imageUri, index) => (
                  <View key={index} style={styles.imagePreviewItem}>
                    <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                    <TouchableOpacity 
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <X size={12} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}
        </Card>
        
        <View style={styles.actions}>
          <Button
            title="Änderungen speichern"
            onPress={handleSave}
            loading={isLoading}
            style={styles.saveButton}
            leftIcon={<Save size={20} color={COLORS.white} />}
          />
          
          <Button
            title="Abbrechen"
            onPress={handleCancel}
            variant="outline"
            style={styles.cancelButton}
          />
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
  formCard: {
    margin: SPACING.m,
    marginBottom: SPACING.s,
  },
  sectionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  sectionSubtitle: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginBottom: SPACING.m,
  },
  inputContainer: {
    marginBottom: SPACING.m,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetInput: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  actions: {
    padding: SPACING.m,
    paddingTop: SPACING.s,
  },
  saveButton: {
    marginBottom: SPACING.m,
  },
  cancelButton: {
    marginBottom: SPACING.xl,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...FONTS.h3,
    color: COLORS.error,
    textAlign: 'center',
    margin: SPACING.l,
  },
  backButton: {
    alignSelf: 'center',
    minWidth: 200,
  },
  imageUploadPlaceholder: {
    backgroundColor: COLORS.gray[50],
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.gray[200],
    borderStyle: 'dashed',
    padding: SPACING.l,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    marginBottom: SPACING.m,
  },
  imageUploadText: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '600' as const,
    marginTop: SPACING.s,
    marginBottom: SPACING.xs,
  },
  imageUploadSubtext: {
    ...FONTS.body2,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  imagePreviewContainer: {
    marginTop: SPACING.m,
  },
  imagePreviewTitle: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '600' as const,
    marginBottom: SPACING.s,
  },
  imagePreviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.s,
  },
  imagePreviewItem: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});