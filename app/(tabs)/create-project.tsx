import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, Pressable, Image, Platform, Linking, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect, Stack } from 'expo-router';
import { ArrowRight, ArrowLeft, Check, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { useAuth } from '@/hooks/auth-store';
import { useProjects } from '@/hooks/projects-store';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import StepProgress from '@/components/StepProgress';
import { SERVICES } from '@/mocks/services';
import { CANTONS } from '@/mocks/cantons';
import { calculateCreditsForProject } from '@/utils/credits';
import { CATEGORIES } from '@/constants/categories';

const URGENCY_OPTIONS = [
  { id: 'urgent', name: 'Dringend (innerhalb 1 Woche)', icon: '🚨' },
  { id: '2weeks', name: 'Innerhalb von 2 Wochen', icon: '📅' },
  { id: '1month', name: 'Innerhalb von 1 Monat', icon: '📆' },
  { id: 'flexible', name: 'Flexibel (wenige Monate)', icon: '⏰' },
];

const STEP_NAMES = [
  'Kategorie',
  'Details',
  'Standort',
  'Bilder',
  'Kontakt',
  'Veröffentlichen'
];

export default function CreateProjectScreen() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const { createProject } = useProjects();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [area, setArea] = useState('');
  const [urgency, setUrgency] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [canton, setCanton] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');

  const totalSteps = 6;

  // Check if user is logged in on component mount and redirect immediately
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  // Update email and phone when user changes
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedCategory) {
      Alert.alert('Fehler', 'Bitte wählen Sie eine Kategorie aus.');
      return;
    }
    
    if (currentStep === 2 && (!title || !description)) {
      Alert.alert('Fehler', 'Bitte füllen Sie alle Felder aus.');
      return;
    }
    
    if (currentStep === 3 && !urgency) {
      Alert.alert('Fehler', 'Bitte wählen Sie einen Zeitrahmen aus.');
      return;
    }
    
    if (currentStep === 4 && (!address || !city || !postalCode || !canton)) {
      Alert.alert('Fehler', 'Bitte füllen Sie alle Adressfelder aus.');
      return;
    }
    
    // Step 5 (images) is optional, no validation needed
    
    if (currentStep === 6 && (!email || !phone || !budgetMin || !budgetMax)) {
      Alert.alert('Fehler', 'Bitte füllen Sie alle Kontaktfelder und das Budget aus.');
      return;
    }
    
    if (currentStep === 6 && budgetMin && budgetMax) {
      const min = parseFloat(budgetMin);
      const max = parseFloat(budgetMax);
      
      if (isNaN(min) || isNaN(max) || min <= 0 || max <= 0) {
        Alert.alert('Fehler', 'Budget muss eine gültige Zahl sein.');
        return;
      }
      
      if (min > max) {
        Alert.alert('Fehler', 'Das Mindestbudget darf nicht höher als das Maximalbudget sein.');
        return;
      }
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCreateProject();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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

  const handleCreateProject = async () => {
    // Check if user is logged in before creating project
    if (!user) {
      Alert.alert(
        'Anmeldung erforderlich',
        'Sie müssen sich anmelden, um ein Projekt zu erstellen.',
        [
          {
            text: 'Abbrechen',
            style: 'cancel',
          },
          {
            text: 'Anmelden',
            onPress: () => router.push('/login'),
          },
        ]
      );
      return;
    }
    
    if (!selectedCategory) return;
    
    try {
      const selectedCategoryData = CATEGORIES.find(c => c.id === selectedCategory);
      const selectedService = SERVICES.find(s => s.category === selectedCategoryData?.name) || SERVICES[0];
      
      if (!budgetMin || !budgetMax) {
        Alert.alert('Fehler', 'Budget ist erforderlich.');
        return;
      }
      
      const min = parseFloat(budgetMin);
      const max = parseFloat(budgetMax);
      
      if (isNaN(min) || isNaN(max) || min <= 0 || max <= 0) {
        Alert.alert('Fehler', 'Ungültiges Budget angegeben.');
        return;
      }
      
      if (min > max) {
        Alert.alert('Fehler', 'Das Mindestbudget darf nicht höher als das Maximalbudget sein.');
        return;
      }
      
      const budgetData = { min, max };
      
      const projectData = {
        title,
        description,
        service: selectedService,
        location: {
          address,
          city,
          canton,
          postalCode,
        },
        timeframe: {
          start: urgency === 'urgent' ? new Date().toISOString().split('T')[0] : 
                 urgency === '2weeks' ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
                 urgency === '1month' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
                 new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end: urgency === 'urgent' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : 
               urgency === '2weeks' ? new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
               urgency === '1month' ? new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
               new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        budget: budgetData,
        area,
        images: projectImages,
        status: 'open' as const,
        customerId: user.id,
        contactName: user.name,
        contactEmail: email,
        contactPhone: phone
      };
      
      await createProject(projectData);
      
      Alert.alert(
        'Erfolg',
        'Ihr Projekt wurde erfolgreich erstellt.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/projects'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Fehler', 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.');
    }
  };



  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Welchen Handwerker brauchen Sie?</Text>
            <Text style={styles.stepDescription}>
              Wählen Sie die passende Kategorie für Ihr Projekt aus.
            </Text>
            
            <View style={styles.categoriesGrid}>
              {CATEGORIES.map((category) => (
                <Pressable
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    selectedCategory === category.id && styles.selectedCategoryCard
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={[
                    styles.categoryName,
                    selectedCategory === category.id && styles.selectedCategoryName
                  ]}>
                    {category.name}
                  </Text>
                  {selectedCategory === category.id && (
                    <View style={styles.checkIcon}>
                      <Check size={16} color={COLORS.white} />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Beschreiben Sie Ihr Projekt</Text>
            <Text style={styles.stepDescription}>
              Geben Sie Details zu Ihrem {CATEGORIES.find(c => c.id === selectedCategory)?.name}-Projekt an.
            </Text>
            
            <Input
              label="Projekttitel"
              placeholder="z.B. Wohnzimmer streichen"
              value={title}
              onChangeText={setTitle}
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
            />
            
            <Input
              label="Beschreibung"
              placeholder="Beschreiben Sie Ihr Projekt genauer..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              containerStyle={styles.textAreaContainer}
              inputStyle={styles.textAreaInput}
            />
            
            <Input
              label="Fläche (optional)"
              placeholder="z.B. 25"
              value={area}
              onChangeText={setArea}
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
              rightIcon={<Text style={styles.suffixText}>m²</Text>}
              keyboardType="numeric"
            />
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Wann soll die Arbeit erledigt werden?</Text>
            <Text style={styles.stepDescription}>
              Wählen Sie Ihren gewünschten Zeitrahmen aus.
            </Text>
            
            <View style={styles.urgencyContainer}>
              {URGENCY_OPTIONS.map((option) => (
                <Pressable
                  key={option.id}
                  style={[
                    styles.urgencyCard,
                    urgency === option.id && styles.selectedUrgencyCard
                  ]}
                  onPress={() => setUrgency(option.id)}
                >
                  <Text style={styles.urgencyIcon}>{option.icon}</Text>
                  <Text style={[
                    styles.urgencyText,
                    urgency === option.id && styles.selectedUrgencyText
                  ]}>
                    {option.name}
                  </Text>
                  {urgency === option.id && (
                    <View style={styles.checkIcon}>
                      <Check size={16} color={COLORS.white} />
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Wo soll die Arbeit durchgeführt werden?</Text>
            <Text style={styles.stepDescription}>
              Geben Sie die Adresse des Projekts an.
            </Text>
            
            <Input
              label="Straße und Hausnummer"
              placeholder="z.B. Musterstraße 123"
              value={address}
              onChangeText={setAddress}
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
            />
            
            <View style={styles.locationRow}>
              <Input
                label="PLZ"
                placeholder="8000"
                value={postalCode}
                onChangeText={setPostalCode}
                keyboardType="numeric"
                containerStyle={[styles.inputContainer, styles.locationInputSmall]}
                inputStyle={styles.inputText}
              />
              
              <Input
                label="Ort"
                placeholder="Zürich"
                value={city}
                onChangeText={setCity}
                containerStyle={[styles.inputContainer, styles.locationInputLarge]}
                inputStyle={styles.inputText}
              />
            </View>
            
            <View style={styles.cantonContainer}>
              <Text style={styles.cantonLabel}>Kanton</Text>
              <View style={styles.cantonGrid}>
                {CANTONS.map((cantonOption) => (
                  <Pressable
                    key={cantonOption.id}
                    style={[
                      styles.cantonCard,
                      canton === cantonOption.id && styles.selectedCantonCard
                    ]}
                    onPress={() => setCanton(cantonOption.id)}
                  >
                    <Text style={[
                      styles.cantonText,
                      canton === cantonOption.id && styles.selectedCantonText
                    ]}>
                      {cantonOption.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        );



      case 5:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Bilder hinzufügen (optional)</Text>
            <Text style={styles.stepDescription}>
              Fügen Sie Bilder hinzu, um Ihr Projekt besser zu beschreiben.
            </Text>
            
            <View style={styles.imageUploadContainer}>
              <Pressable 
                style={styles.imageUploadPlaceholder}
                onPress={handleImagePicker}
              >
                <Text style={styles.imageUploadIcon}>📷</Text>
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
              
              <View style={styles.skipContainer}>
                <Text style={styles.skipText}>
                  Dieser Schritt ist optional. Sie können auch ohne Bilder fortfahren.
                </Text>
              </View>
            </View>
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Kontaktdaten bestätigen</Text>
            <Text style={styles.stepDescription}>
              Überprüfen Sie Ihre Kontaktdaten für Angebote.
            </Text>
            
            <Input
              label="E-Mail Adresse"
              placeholder="ihre.email@beispiel.ch"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
            />
            
            <Input
              label="Telefonnummer"
              placeholder="+41 79 123 45 67"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              containerStyle={styles.inputContainer}
              inputStyle={styles.inputText}
            />
            
            <Text style={styles.budgetSectionTitle}>Budget *</Text>
            <Text style={styles.budgetSectionSubtitle}>
              Geben Sie Ihr Budget in CHF an. Diese Information wird benötigt, um die Credits-Kosten für Handwerker zu berechnen. Sie als Kunde zahlen nichts zusätzlich.
            </Text>
            
            <View style={styles.budgetRow}>
              <Input
                label="Von"
                placeholder="1000"
                value={budgetMin}
                onChangeText={setBudgetMin}
                keyboardType="numeric"
                containerStyle={[styles.inputContainer, styles.budgetInput]}
                inputStyle={styles.inputText}
                rightIcon={<Text style={styles.suffixText}>CHF</Text>}
              />
              
              <Input
                label="Bis"
                placeholder="5000"
                value={budgetMax}
                onChangeText={setBudgetMax}
                keyboardType="numeric"
                containerStyle={[styles.inputContainer, styles.budgetInput]}
                inputStyle={styles.inputText}
                rightIcon={<Text style={styles.suffixText}>CHF</Text>}
              />
            </View>

            
            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Projekt-Zusammenfassung</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Kategorie:</Text>
                  <Text style={styles.summaryValue}>
                    {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                  </Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Titel:</Text>
                  <Text style={styles.summaryValue}>{title}</Text>
                </View>
                
                {area && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Fläche:</Text>
                    <Text style={styles.summaryValue}>{area} m²</Text>
                  </View>
                )}
                
                {(budgetMin || budgetMax) && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Budget:</Text>
                    <Text style={styles.summaryValue}>
                      {budgetMin && budgetMax ? `${budgetMin} - ${budgetMax} CHF` : 
                       budgetMin ? `ab ${budgetMin} CHF` : 
                       budgetMax ? `bis ${budgetMax} CHF` : ''}
                    </Text>
                  </View>
                )}
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Ort:</Text>
                  <Text style={styles.summaryValue}>{city}, {canton}</Text>
                </View>
                
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Zeitrahmen:</Text>
                  <Text style={styles.summaryValue}>
                    {URGENCY_OPTIONS.find(u => u.id === urgency)?.name}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  // Don't render anything if user is not logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Projekt erstellen',
          headerBackTitle: 'Zurück',
          headerStyle: {
            backgroundColor: COLORS.white,
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
          },
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.backHeaderButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={COLORS.modernGreen} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.container}>
        <StepProgress 
          currentStep={currentStep}
          totalSteps={totalSteps}
          steps={STEP_NAMES}
        />
        <ScrollView 
          style={styles.scrollContainer} 
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Card style={styles.card}>
            {renderStepContent()}
          </Card>
        </ScrollView>
        
        {/* Fixed button container at bottom */}
        <View style={styles.fixedButtonContainer}>
          <View style={styles.buttonsContainer}>
            {currentStep > 1 && (
              <Button 
                title="Zurück" 
                onPress={handlePreviousStep}
                variant="outline"
                style={styles.backButton}
                icon={<ArrowLeft size={20} color={COLORS.modernGreen} />}
              />
            )}
            
            <Button 
              title={currentStep === totalSteps ? "Projekt erstellen" : "Weiter"} 
              onPress={handleNextStep}
              style={styles.nextButton}
              icon={currentStep === totalSteps ? <Check size={20} color={COLORS.white} /> : <ArrowRight size={20} color={COLORS.white} />}
            />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray[50],
  },
  scrollContainer: {
    flex: 1,
  },
  stepIndicatorContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    alignItems: 'center',
  },
  stepCounterText: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '600' as const,
    marginBottom: SPACING.s,
    fontSize: 16,
  },
  contentContainer: {
    padding: SPACING.m,
    paddingBottom: 180,
  },
  card: {
    padding: SPACING.xl,
    marginHorizontal: SPACING.m,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.gray[100],
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.gray[300],
    marginHorizontal: 8,
    opacity: 0.6,
  },
  currentStepDot: {
    backgroundColor: COLORS.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  completedStepDot: {
    backgroundColor: COLORS.success,
    opacity: 1,
  },
  stepContent: {
    marginBottom: SPACING.xl,
  },
  stepTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    marginBottom: SPACING.m,
    fontSize: 26,
    fontWeight: '700' as const,
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: -0.8,
  },
  stepDescription: {
    ...FONTS.body1,
    color: COLORS.gray[600],
    marginBottom: SPACING.xl,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: SPACING.l,
    opacity: 0.9,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.s,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.l,
    marginBottom: SPACING.m,
    borderWidth: 2,
    borderColor: COLORS.gray[200],
    alignItems: 'center',
    position: 'relative',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 110,
    justifyContent: 'center',
  },
  selectedCategoryCard: {
    backgroundColor: COLORS.modernGreen,
    borderColor: COLORS.modernGreen,
    shadowColor: COLORS.modernGreen,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    transform: [{ scale: 1.02 }],
  },
  categoryIcon: {
    fontSize: 36,
    marginBottom: SPACING.s,
  },
  categoryName: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  selectedCategoryName: {
    color: COLORS.white,
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.modernGreen,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.modernGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    marginBottom: SPACING.l,
  },
  inputText: {
    fontSize: 16,
    lineHeight: 20,
  },
  textAreaContainer: {
    marginBottom: SPACING.l,
  },
  textAreaInput: {
    fontSize: 16,
    lineHeight: 22,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  urgencyContainer: {
    gap: SPACING.m,
  },
  urgencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.l,
    borderWidth: 2,
    borderColor: COLORS.gray[200],
    position: 'relative',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    minHeight: 68,
  },
  selectedUrgencyCard: {
    backgroundColor: COLORS.modernGreen,
    borderColor: COLORS.modernGreen,
    shadowColor: COLORS.modernGreen,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
    transform: [{ scale: 1.01 }],
  },
  urgencyIcon: {
    fontSize: 28,
    marginRight: SPACING.l,
  },
  urgencyText: {
    ...FONTS.body1,
    color: COLORS.text,
    flex: 1,
  },
  selectedUrgencyText: {
    color: COLORS.white,
  },
  locationRow: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  locationInputSmall: {
    flex: 1,
  },
  locationInputLarge: {
    flex: 2,
  },
  cantonContainer: {
    marginTop: SPACING.m,
  },
  cantonLabel: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '600' as const,
    marginBottom: SPACING.s,
  },
  cantonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.s,
  },
  cantonCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.m,
    borderWidth: 2,
    borderColor: COLORS.gray[200],
    minWidth: 90,
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  selectedCantonCard: {
    backgroundColor: COLORS.modernGreen,
    borderColor: COLORS.modernGreen,
    shadowColor: COLORS.modernGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  cantonText: {
    ...FONTS.body2,
    color: COLORS.text,
    fontSize: 12,
  },
  selectedCantonText: {
    color: COLORS.white,
  },
  summarySection: {
    marginTop: SPACING.l,
  },
  summaryTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  summaryCard: {
    backgroundColor: COLORS.gray[50],
    borderRadius: 16,
    padding: SPACING.l,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.s,
  },
  summaryLabel: {
    ...FONTS.body2,
    color: COLORS.textLight,
  },
  summaryValue: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '600' as const,
    flex: 1,
    textAlign: 'right',
  },
  backHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 75,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.l,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[100],
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.m,
  },
  backButton: {
    flex: 1,
    borderRadius: 14,
    height: 56,
    borderWidth: 2,
    borderColor: COLORS.modernGreen,
  },
  nextButton: {
    flex: 2,
    borderRadius: 14,
    height: 56,
    backgroundColor: COLORS.modernGreen,
    shadowColor: COLORS.modernGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  suffixText: {
    ...FONTS.body1,
    color: COLORS.textLight,
    fontWeight: '500' as const,
    fontSize: 16,
  },
  imageUploadContainer: {
    marginBottom: SPACING.l,
  },
  imageUploadPlaceholder: {
    backgroundColor: COLORS.gray[50],
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.gray[200],
    borderStyle: 'dashed',
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  imageUploadIcon: {
    fontSize: 48,
    marginBottom: SPACING.s,
  },
  imageUploadText: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '600' as const,
    marginBottom: SPACING.xs,
  },
  imageUploadSubtext: {
    ...FONTS.body2,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  imagePreviewContainer: {
    marginTop: SPACING.l,
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
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipContainer: {
    marginTop: SPACING.l,
    alignItems: 'center',
  },
  skipText: {
    ...FONTS.body2,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  budgetInfoCard: {
    backgroundColor: COLORS.gray[50],
    borderRadius: 16,
    padding: SPACING.l,
    marginTop: SPACING.l,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  budgetInfoTitle: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '600' as const,
    marginBottom: SPACING.s,
  },
  budgetInfoText: {
    ...FONTS.body2,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  creditPreview: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: SPACING.m,
    marginTop: SPACING.m,
    alignItems: 'center',
  },
  creditPreviewText: {
    ...FONTS.body2,
    color: COLORS.white,
    fontWeight: '600' as const,
    textAlign: 'center',
  },

  budgetSectionTitle: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '600' as const,
    marginBottom: SPACING.xs,
    marginTop: SPACING.m,
  },
  budgetSectionSubtitle: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginBottom: SPACING.m,
  },
  budgetRow: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  budgetInput: {
    flex: 1,
  },
});