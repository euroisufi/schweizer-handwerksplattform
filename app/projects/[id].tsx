import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Alert, TouchableOpacity, Linking, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack, useFocusEffect } from 'expo-router';
import { MapPin, Calendar, Ruler, User, Phone, Mail, ArrowLeft, ArrowRight, Copy, Edit, CheckCircle, Lock, Unlock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence, 
  withDelay,
  runOnJS,
  Easing,
  withSpring
} from 'react-native-reanimated';
import { COLORS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { useAuth } from '@/hooks/auth-store';
import { useProjects } from '@/hooks/projects-store';
import { useCredits } from '@/hooks/credits-store';
import { getCategoryByName } from '@/constants/categories';
import { CUSTOMERS } from '@/mocks/users';
import Button from '@/components/Button';
import Card from '@/components/Card';


export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user, userType } = useAuth();
  const { getProjectById, completeProject, isProjectOwner } = useProjects();
  const { credits, useCreditsForContact, hasEnoughCredits, calculateCreditsForProject, isContactUnlocked } = useCredits();
  const insets = useSafeAreaInsets();
  
  const [contactRevealed, setContactRevealed] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isUnlocking, setIsUnlocking] = useState(false);
  
  // Animation values for unlock
  const lockScale = useSharedValue(1);
  const lockRotation = useSharedValue(0);
  const lockOpacity = useSharedValue(1);
  const cardOpacity = useSharedValue(1);
  const cardScale = useSharedValue(1);
  const overlayOpacity = useSharedValue(1);
  
  // Animation values for screen entrance
  const screenScale = useSharedValue(Platform.OS === 'web' ? 1 : 0.8);
  const screenOpacity = useSharedValue(Platform.OS === 'web' ? 1 : 0);
  const contentTranslateY = useSharedValue(Platform.OS === 'web' ? 0 : 50);
  const imageScale = useSharedValue(Platform.OS === 'web' ? 1 : 1.2);
  const headerOpacity = useSharedValue(Platform.OS === 'web' ? 1 : 0);
  
  const project = getProjectById(id);
  
  // Check if contact is already unlocked
  const isAlreadyUnlocked = project ? isContactUnlocked(project.id) : false;
  
  // Set initial state based on whether contact is already unlocked
  React.useEffect(() => {
    if (isAlreadyUnlocked) {
      setContactRevealed(true);
    }
  }, [isAlreadyUnlocked]);
  const isOwner = project ? isProjectOwner(project.id) : false;
  const category = project ? getCategoryByName(project.service.category) : null;
  
  // Get customer data including profile image
  const customerData = project ? CUSTOMERS.find(c => c.id === project.customerId) : null;
  
  // Format customer name as "E.Isufi" style
  const formatCustomerName = (customerName: string) => {
    const nameParts = customerName.split(' ');
    if (nameParts.length >= 2) {
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      return `${firstName.charAt(0)}.${lastName}`;
    }
    return customerName;
  };
  
  // Use current user's name if they are the customer and logged in
  let customerDisplayName = 'Der Kunde';
  let customerFullName = 'Der Kunde';
  
  if (userType === 'customer' && user && user.id === project?.customerId) {
    // Use current logged-in user's name (this takes priority over mock data)
    if (user.name) {
      customerDisplayName = formatCustomerName(user.name);
      customerFullName = user.name;
      console.log('ProjectDetail: Using current user name:', customerDisplayName, 'for project:', project?.id);
    } else if (user.firstName && user.lastName) {
      const fullName = `${user.firstName} ${user.lastName}`;
      customerDisplayName = formatCustomerName(fullName);
      customerFullName = fullName;
      console.log('ProjectDetail: Using current user firstName/lastName:', customerDisplayName, 'for project:', project?.id);
    } else {
      console.log('ProjectDetail: Current user has no name, using default for project:', project?.id);
    }
  } else if (customerData?.name) {
    // Use mock data name for other customers
    customerDisplayName = formatCustomerName(customerData.name);
    customerFullName = customerData.name;
    console.log('ProjectDetail: Using mock data name:', customerDisplayName, 'for project:', project?.id);
  } else {
    console.log('ProjectDetail: Using default name "Der Kunde" for project:', project?.id);
  }
  
  const customer = project ? {
    id: project.customerId,
    name: customerFullName,
    email: project.contactEmail,
    phone: project.contactPhone,
    profileImage: customerData?.profileImage
  } : null;
  
  // Animated styles
  const animatedLockStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: lockScale.value },
      { rotate: `${lockRotation.value}deg` }
    ],
    opacity: lockOpacity.value,
  }));
  
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));
  
  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));
  
  // Screen entrance animations
  const animatedScreenStyle = useAnimatedStyle(() => ({
    transform: [{ scale: screenScale.value }],
    opacity: screenOpacity.value,
  }));
  
  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
  }));
  
  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));
  
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));
  
  // Trigger entrance animation when screen focuses
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === 'web') return;
      
      // Reset values
      screenScale.value = 0.8;
      screenOpacity.value = 0;
      contentTranslateY.value = 50;
      imageScale.value = 1.2;
      headerOpacity.value = 0;
      
      // Animate entrance
      screenScale.value = withSpring(1, {
        damping: 20,
        stiffness: 300,
      });
      
      screenOpacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.quad),
      });
      
      headerOpacity.value = withDelay(200, withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      }));
      
      contentTranslateY.value = withDelay(100, withSpring(0, {
        damping: 20,
        stiffness: 200,
      }));
      
      imageScale.value = withDelay(50, withTiming(1, {
        duration: 600,
        easing: Easing.out(Easing.quad),
      }));
    }, [])
  );
  
  if (!project) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Projekt nicht gefunden</Text>
        <Button 
          title="Zurück" 
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </View>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  const handlePhoneCall = (phoneNumber: string) => {
    if (Platform.OS === 'web') {
      // On web, copy phone number to clipboard
      if (navigator.clipboard) {
        navigator.clipboard.writeText(phoneNumber);
        Alert.alert('Kopiert', 'Telefonnummer wurde in die Zwischenablage kopiert.');
      } else {
        Alert.alert('Telefonnummer', phoneNumber);
      }
      return;
    }

    const phoneUrl = `tel:${phoneNumber}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Fehler', 'Telefon-App konnte nicht geöffnet werden.');
        }
      })
      .catch(() => Alert.alert('Fehler', 'Beim Öffnen der Telefon-App ist ein Fehler aufgetreten.'));
  };

  const handleEmailCopy = async (email: string) => {
    try {
      if (Platform.OS === 'web') {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(email);
          Alert.alert('Kopiert', 'E-Mail-Adresse wurde in die Zwischenablage kopiert.');
        } else {
          Alert.alert('E-Mail-Adresse', email);
        }
      } else {
        await Clipboard.setStringAsync(email);
        Alert.alert('Kopiert', 'E-Mail-Adresse wurde in die Zwischenablage kopiert.');
      }
    } catch (error) {
      Alert.alert('Fehler', 'E-Mail-Adresse konnte nicht kopiert werden.');
    }
  };

  const animateUnlock = () => {
    setIsUnlocking(true);
    
    if (Platform.OS === 'web') {
      // Simplified animation for web
      setTimeout(() => {
        setContactRevealed(true);
        setIsUnlocking(false);
      }, 800);
      return;
    }
    
    // Lock shake animation
    lockScale.value = withSequence(
      withTiming(1.2, { duration: 150, easing: Easing.out(Easing.quad) }),
      withTiming(0.9, { duration: 100 }),
      withTiming(1.1, { duration: 100 }),
      withTiming(0, { duration: 300, easing: Easing.in(Easing.quad) })
    );
    
    lockRotation.value = withSequence(
      withTiming(-10, { duration: 100 }),
      withTiming(10, { duration: 100 }),
      withTiming(-5, { duration: 100 }),
      withTiming(0, { duration: 100 })
    );
    
    // Fade out lock and overlay
    lockOpacity.value = withDelay(400, withTiming(0, { duration: 300 }));
    overlayOpacity.value = withDelay(400, withTiming(0, { duration: 300 }));
    
    // Card transformation
    cardScale.value = withDelay(700, withSequence(
      withTiming(0.95, { duration: 200 }),
      withTiming(1.02, { duration: 200 }),
      withTiming(1, { duration: 200 })
    ));
    
    cardOpacity.value = withDelay(700, withSequence(
      withTiming(0.8, { duration: 200 }),
      withTiming(1, { duration: 400 })
    ));
    
    // Complete the unlock after animation
    setTimeout(() => {
      runOnJS(setContactRevealed)(true);
      runOnJS(setIsUnlocking)(false);
    }, 1200);
  };

  const handleLockPress = () => {
    const requiredCredits = calculateCreditsForProject(project?.budget);
    
    if (!hasEnoughCredits(project?.budget)) {
      Alert.alert(
        'Nicht genügend Credits',
        `Sie haben nicht genügend Credits, um diesen Kontakt freizuschalten. Sie benötigen ${requiredCredits} Credit${requiredCredits > 1 ? 's' : ''}, haben aber nur ${credits}. Möchten Sie Credits kaufen?`,
        [
          {
            text: 'Abbrechen',
            style: 'cancel',
          },
          {
            text: 'Credits kaufen',
            onPress: () => router.push('/credits'),
          },
        ]
      );
      return;
    }
    
    Alert.alert(
      'Kontakt freischalten',
      `Möchten Sie ${requiredCredits} Credit${requiredCredits > 1 ? 's' : ''} verwenden, um die Kontaktdaten dieses Kunden freizuschalten?`,
      [
        {
          text: 'Abbrechen',
          style: 'cancel',
        },
        {
          text: 'Freischalten',
          onPress: async () => {
            if (project) {
              try {
                await useCreditsForContact({ projectId: project.id, projectBudget: project.budget });
                animateUnlock();
              } catch (error) {
                console.error('Failed to unlock contact:', error);
              }
            }
          },
        },
      ]
    );
  };

  const handleRevealContact = handleLockPress;
  
  const handleCompleteProject = () => {
    if (!project) return;
    
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
  
  const handleEditProject = () => {
    if (!project) return;
    router.push(`/projects/edit/${project.id}`);
  };
  
  const nextImage = () => {
    if (project.images && currentImageIndex < project.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  
  const prevImage = () => {
    if (project.images && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  
  return (
    <Animated.View style={[{ flex: 1 }, animatedScreenStyle]}>
      <Stack.Screen 
        options={{ 
          title: project.title,
          headerBackTitle: 'Zurück',
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '600',
            color: COLORS.white,
          },
          headerLeft: () => (
            <Animated.View style={animatedHeaderStyle}>
              <TouchableOpacity 
                style={styles.backHeaderButton}
                onPress={() => router.back()}
              >
                <ArrowLeft size={24} color={COLORS.white} />
              </TouchableOpacity>
            </Animated.View>
          ),
          headerRight: isOwner && userType === 'customer' ? () => (
            <Animated.View style={[styles.headerActions, animatedHeaderStyle]}>
              {project.status !== 'completed' && (
                <>
                  <TouchableOpacity 
                    style={styles.headerButton}
                    onPress={handleEditProject}
                  >
                    <Edit size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.headerButton, styles.completeButton]}
                    onPress={handleCompleteProject}
                  >
                    <CheckCircle size={20} color={COLORS.white} />
                  </TouchableOpacity>
                </>
              )}
            </Animated.View>
          ) : undefined,
        }} 
      />
      
      <ScrollView style={styles.container}>
        <Animated.View style={animatedImageStyle}>
        {project.images && project.images.length > 0 ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: project.images[currentImageIndex] }} style={styles.image} />
            
            {project.images.length > 1 && (
              <View style={styles.imageNavigation}>
                <TouchableOpacity 
                  style={[styles.imageNavButton, currentImageIndex === 0 && styles.disabledButton]}
                  onPress={prevImage}
                  disabled={currentImageIndex === 0}
                >
                  <ArrowLeft size={20} color={COLORS.white} />
                </TouchableOpacity>
                
                <Text style={styles.imageCounter}>
                  {currentImageIndex + 1} / {project.images.length}
                </Text>
                
                <TouchableOpacity 
                  style={[styles.imageNavButton, currentImageIndex === project.images.length - 1 && styles.disabledButton]}
                  onPress={nextImage}
                  disabled={currentImageIndex === project.images.length - 1}
                >
                  <ArrowRight size={20} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View style={[styles.image, styles.noImage]}>
            <Text style={styles.noImageText}>{project.service.icon}</Text>
          </View>
        )}
        </Animated.View>
        
        <Animated.View style={[styles.content, animatedContentStyle]}>
          <View style={styles.contentPadding}>
            <View style={styles.serviceTagContainer}>
              <View style={[styles.serviceTag, { backgroundColor: category?.color || COLORS.primary }]}>
                <Text style={styles.serviceText}>
                  <Text style={styles.servicePrefixText}>{customerDisplayName} sucht einen </Text>
                  <Text style={styles.serviceCategoryText}>{category?.name || project.service.category}</Text>
                </Text>
              </View>
            </View>
            
            <View style={styles.titleRow}>
              <Text style={styles.title}>{project.title}</Text>
              {project.status === 'completed' && (
                <View style={styles.completedBadge}>
                  <CheckCircle size={16} color={COLORS.white} />
                  <Text style={styles.completedText}>Abgeschlossen</Text>
                </View>
              )}
            </View>
            
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <MapPin size={18} color={COLORS.textLight} />
                <Text style={styles.detailText}>
                  {project.location.city}, {project.location.canton}
                </Text>
              </View>
              
              <View style={styles.detailItem}>
                <Calendar size={18} color={COLORS.textLight} />
                <Text style={styles.detailText}>
                  {formatDate(project.timeframe.start)}
                  {project.timeframe.end && ` - ${formatDate(project.timeframe.end)}`}
                </Text>
              </View>
              
              {project.area && (
                <View style={styles.detailItem}>
                  <Ruler size={18} color={COLORS.textLight} />
                  <Text style={styles.detailText}>
                    {project.area} m²
                  </Text>
                </View>
              )}
            </View>
            
            {/* Modern divider line */}
            <View style={styles.dividerLine} />
          </View>
          
          <View style={styles.projectInfoSection}>
            <Text style={styles.descriptionTitle}>Projektbeschreibung</Text>
            <Text style={styles.description}>{project.description}</Text>
          </View>
        </Animated.View>
        
        {userType === 'business' && (
          <Animated.View style={[styles.contactSection, animatedContentStyle]}>
            <View style={styles.contactOuterContainer}>
              <Card style={styles.contactCard}>
              {contactRevealed ? (
                <View style={styles.contactSuccessContainer}>
                  <View style={styles.successHeader}>
                    <View style={styles.successIconContainer}>
                      <CheckCircle size={32} color={COLORS.white} />
                    </View>
                    <Text style={styles.successTitle}>Direkter Kundenkontakt</Text>
                    <Text style={styles.successSubtitle}>
                      Glückwunsch! Sie haben die Kontaktdaten von {customer?.name} freigeschaltet.
                    </Text>
                  </View>

                  <View style={styles.contactDetailsContainer}>
                    <View style={styles.contactDetailItem}>
                      <View style={styles.contactIconContainer}>
                        {customerData?.profileImage ? (
                          <Image source={{ uri: customerData.profileImage }} style={styles.customerProfileImage} />
                        ) : (
                          <User size={20} color={COLORS.primary} />
                        )}
                      </View>
                      <View style={styles.contactDetailContent}>
                        <Text style={styles.contactDetailLabel}>Name</Text>
                        <Text style={styles.contactDetailValue}>{customer?.name}</Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.contactDetailItem}
                      onPress={() => customer?.phone && handlePhoneCall(customer.phone)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.contactIconContainer}>
                        <Phone size={20} color={COLORS.primary} />
                      </View>
                      <View style={styles.contactDetailContent}>
                        <Text style={styles.contactDetailLabel}>Telefon</Text>
                        <Text style={[styles.contactDetailValue, styles.clickableContactText]}>{customer?.phone}</Text>
                        <Text style={styles.contactActionHint}>
                          {Platform.OS === 'web' ? 'Klicken zum Kopieren' : 'Antippen zum Anrufen'}
                        </Text>
                      </View>
                      <Copy size={16} color={COLORS.textLight} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.contactDetailItem}
                      onPress={() => customer?.email && handleEmailCopy(customer.email)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.contactIconContainer}>
                        <Mail size={20} color={COLORS.primary} />
                      </View>
                      <View style={styles.contactDetailContent}>
                        <Text style={styles.contactDetailLabel}>E-Mail</Text>
                        <Text style={[styles.contactDetailValue, styles.clickableContactText]}>{customer?.email}</Text>
                        <Text style={styles.contactActionHint}>Antippen zum Kopieren</Text>
                      </View>
                      <Copy size={16} color={COLORS.textLight} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.successTip}>
                    <Text style={styles.successTipText}>
                      💡 Tipp: Kontaktieren Sie den Kunden innerhalb von 24h für die beste Erfolgsquote!
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.unlockModalContainer}>
                  <View style={styles.unlockModalHeader}>
                    <Text style={styles.unlockModalTitle}>Direkter Kundenkontakt</Text>
                    <Text style={styles.unlockModalSubtitle}>Erhalten Sie sofortigen Zugang zu den Kontaktdaten</Text>
                  </View>

                  <TouchableOpacity 
                    style={styles.unlockModalIllustration}
                    onPress={handleLockPress}
                    disabled={isUnlocking}
                    activeOpacity={0.9}
                  >
                    <View style={styles.illustrationContainer}>
                      {Platform.OS !== 'web' ? (
                        <Animated.View style={[styles.customerCard, animatedCardStyle]}>
                          {customerData?.profileImage ? (
                            <Image source={{ uri: customerData.profileImage }} style={styles.customerImageCentered} />
                          ) : (
                            <View style={styles.customerImageCentered}>
                              <Text style={styles.customerInitialCentered}>{customer?.name?.charAt(0) || 'K'}</Text>
                            </View>
                          )}
                          <View style={styles.customerInfoCentered}>
                            <Text style={styles.customerNameCentered}>
                              {customer?.name ? `${customer.name.split(' ')[0].charAt(0)}. ${customer.name.split(' ').slice(1).join(' ')}` : 'K. Kunde'}
                            </Text>
                            <Text style={styles.customerLocationCentered}>{project.location.city}</Text>
                          </View>
                        </Animated.View>
                      ) : (
                        <View style={[styles.customerCard, isUnlocking && styles.customerCardUnlocking]}>
                          {customerData?.profileImage ? (
                            <Image source={{ uri: customerData.profileImage }} style={styles.customerImageCentered} />
                          ) : (
                            <View style={styles.customerImageCentered}>
                              <Text style={styles.customerInitialCentered}>{customer?.name?.charAt(0) || 'K'}</Text>
                            </View>
                          )}
                          <View style={styles.customerInfoCentered}>
                            <Text style={styles.customerNameCentered}>
                              {customer?.name ? `${customer.name.split(' ')[0].charAt(0)}. ${customer.name.split(' ').slice(1).join(' ')}` : 'K. Kunde'}
                            </Text>
                            <Text style={styles.customerLocationCentered}>{project.location.city}</Text>
                          </View>
                        </View>
                      )}
                      
                      {Platform.OS !== 'web' ? (
                        <Animated.View style={[styles.lockOverlay, animatedOverlayStyle]}>
                          <View style={styles.lockButton}>
                            <Animated.View style={animatedLockStyle}>
                              <Lock size={28} color={COLORS.white} />
                            </Animated.View>
                          </View>
                        </Animated.View>
                      ) : (
                        <View style={[styles.lockOverlay, isUnlocking && styles.lockOverlayUnlocking]}>
                          <View style={styles.lockButton}>
                            <View style={[styles.lockIconContainer, isUnlocking && styles.lockIconUnlocking]}>
                              <Lock size={28} color={COLORS.white} />
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                    
                    <Text style={styles.unlockHintText}>
                      {isUnlocking ? 'Wird freigeschaltet...' : `Antippen zum Freischalten - ${calculateCreditsForProject(project?.budget)} Credits`}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.benefitsList}>
                    <View style={styles.benefitItem}>
                      <Text style={styles.benefitIcon}>✓</Text>
                      <Text style={styles.benefitText}>Vollständige Kontaktdaten (Name, Telefon, E-Mail)</Text>
                    </View>
                    <View style={styles.benefitItem}>
                      <Text style={styles.benefitIcon}>✓</Text>
                      <Text style={styles.benefitText}>Direkter Kontakt ohne Zwischenhändler</Text>
                    </View>
                    <View style={styles.benefitItem}>
                      <Text style={styles.benefitIcon}>✓</Text>
                      <Text style={styles.benefitText}>Höhere Erfolgsquote durch schnelle Reaktion</Text>
                    </View>
                    <View style={styles.benefitItem}>
                      <Text style={styles.benefitIcon}>✓</Text>
                      <Text style={styles.benefitText}>Lebenslanger Zugang zu diesen Kontaktdaten</Text>
                    </View>
                    <View style={styles.benefitItem}>
                      <Text style={styles.benefitIcon}>✓</Text>
                      <Text style={styles.benefitText}>Sichere und vertrauensvolle Abwicklung</Text>
                    </View>
                  </View>

                  <View style={styles.priceSection}>
                    <Text style={styles.priceValue}>{calculateCreditsForProject(project?.budget)}</Text>
                    <Text style={styles.priceLabel}>Credits</Text>
                    <Text style={styles.guaranteeText}>
                      🔒 100% sicher • Geld-zurück-Garantie bei Problemen
                    </Text>
                  </View>

                  <View style={styles.creditsInfo}>
                    <Text style={styles.creditsAvailable}>
                      Verfügbare Credits: <Text style={styles.creditsNumber}>{credits}</Text>
                    </Text>
                    {!hasEnoughCredits(project?.budget) && (
                      <Text style={styles.lowCreditsWarning}>
                        Nicht genügend Credits verfügbar
                      </Text>
                    )}
                  </View>

                </View>
              )}
              </Card>
            </View>
            
            {/* Customer Contact Mini Box - Outside the main card */}
            <View style={styles.customerContactSection}>
              <View style={styles.customerContactRow}>
                {customerData?.profileImage ? (
                  <Image source={{ uri: customerData.profileImage }} style={styles.customerContactImage} />
                ) : (
                  <View style={styles.customerContactImage}>
                    <Text style={styles.customerContactInitial}>{customer?.name?.charAt(0) || 'K'}</Text>
                  </View>
                )}
                <View style={styles.customerContactInfo}>
                  <Text style={styles.customerContactName}>{customer?.name}</Text>
                  <Text style={styles.customerContactCredits}>{calculateCreditsForProject(project?.budget)} Credits</Text>
                </View>
                <TouchableOpacity 
                  style={contactRevealed ? styles.unlockButton : styles.lockButton}
                  onPress={contactRevealed ? () => {} : handleLockPress}
                  disabled={contactRevealed}
                >
                  <Text style={styles.unlockButtonText}>
                    {contactRevealed ? 'Freigeschaltet' : 'Freischalten'}
                  </Text>
                  {!contactRevealed && <Lock size={16} color={COLORS.white} style={styles.lockIconSmall} />}
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 250,
  },
  noImage: {
    backgroundColor: COLORS.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    fontSize: 64,
  },
  imageNavigation: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  imageCounter: {
    color: COLORS.white,
    ...FONTS.body2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  content: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginTop: -24,
    position: 'relative',
    zIndex: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  contentPadding: {
    padding: SPACING.m,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  serviceTagContainer: {
    alignItems: 'center',
    marginBottom: SPACING.m,
    marginTop: -24,
  },
  serviceTag: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  serviceText: {
    ...FONTS.body2,
    color: COLORS.white,
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  servicePrefixText: {
    fontWeight: '400' as const,
  },
  serviceCategoryText: {
    fontWeight: '700' as const,
  },
  detailsContainer: {
    marginBottom: SPACING.m,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    ...FONTS.body1,
    color: COLORS.textLight,
    marginLeft: 12,
  },
  dividerLine: {
    height: 1,
    backgroundColor: COLORS.gray[200],
    marginHorizontal: SPACING.m,
    marginVertical: SPACING.s,
  },
  projectInfoSection: {
    padding: SPACING.m,
    paddingBottom: 50,
    marginBottom: 0,
  },
  descriptionTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  description: {
    ...FONTS.body1,
    color: COLORS.text,
    lineHeight: 24,
  },
  budgetBadge: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    minWidth: 120,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  budgetLabel: {
    ...FONTS.caption,
    color: COLORS.textLight,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  budgetAmount: {
    ...FONTS.body1,
    color: COLORS.primary,
    fontWeight: '700' as const,
    textAlign: 'center',
    fontSize: 14,
  },
  contactSection: {
    backgroundColor: COLORS.primary,
    paddingTop: 39,
    paddingHorizontal: 0,
    paddingBottom: SPACING.l,
    marginTop: -25,
    position: 'relative',
    zIndex: 1,
  },
  contactCard: {
    marginBottom: 0,
    marginHorizontal: 0,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderRadius: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  unlockModalContainer: {
    alignItems: 'center',
    padding: SPACING.l,
  },
  unlockModalHeader: {
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  unlockModalTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    fontWeight: '700' as const,
    textAlign: 'center',
    marginBottom: 8,
  },
  unlockModalSubtitle: {
    ...FONTS.body1,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  unlockModalIllustration: {
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  illustrationContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerCard: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    minWidth: 240,
    minHeight: 180,
    justifyContent: 'center',
  },
  customerImageCentered: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    opacity: 0.7,
  },
  customerInitialCentered: {
    ...FONTS.h2,
    color: COLORS.white,
    fontWeight: '700' as const,
  },
  customerInfoCentered: {
    alignItems: 'center',
  },
  customerNameCentered: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '600' as const,
    marginBottom: 4,
    textAlign: 'center',
  },
  customerLocationCentered: {
    ...FONTS.caption,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  lockIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIconUnlocking: {
    transform: [{ scale: 0 }],
    opacity: 0,
  },
  lockOverlayUnlocking: {
    opacity: 0,
  },
  customerCardUnlocking: {
    transform: [{ scale: 1.02 }],
    opacity: 0.9,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  contactTitle: {
    ...FONTS.h2,
    color: COLORS.primary,
    fontWeight: '700' as const,
  },
  urgencyBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    ...FONTS.caption,
    color: COLORS.white,
    fontWeight: '700' as const,
  },
  contactInfo: {
    marginTop: SPACING.s,
  },
  successBanner: {
    backgroundColor: '#E8F5E8',
    padding: SPACING.s,
    borderRadius: 8,
    marginBottom: SPACING.m,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  successText: {
    ...FONTS.body1,
    color: '#2E7D32',
    fontWeight: '600' as const,
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#F8F9FA',
    padding: SPACING.m,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  contactText: {
    ...FONTS.body1,
    color: COLORS.text,
    marginLeft: 12,
    fontWeight: '600' as const,
    flex: 1,
  },
  clickableText: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  copyIcon: {
    marginLeft: 8,
  },
  actionHint: {
    position: 'absolute',
    bottom: -20,
    left: 32,
    right: 0,
  },
  actionHintText: {
    ...FONTS.caption,
    color: COLORS.textLight,
    fontSize: 11,
    fontStyle: 'italic',
  },
  contactTip: {
    backgroundColor: '#FFF3E0',
    padding: SPACING.s,
    borderRadius: 8,
    marginTop: SPACING.s,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  contactTipText: {
    ...FONTS.body2,
    color: '#E65100',
    fontStyle: 'italic',
  },
  contactLocked: {
    alignItems: 'center',
    padding: SPACING.m,
  },
  benefitsList: {
    width: '100%',
    marginBottom: SPACING.l,
  },
  benefitsTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.s,
    textAlign: 'center',
    fontWeight: '600' as const,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  benefitIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 20,
    color: '#4CAF50',
    fontWeight: '700' as const,
    marginTop: 2,
  },
  benefitText: {
    ...FONTS.body1,
    color: COLORS.text,
    flex: 1,
    lineHeight: 22,
    fontSize: 15,
  },
  priceSection: {
    alignItems: 'center',
    backgroundColor: '#F8F4FF',
    padding: SPACING.l,
    borderRadius: 16,
    marginBottom: SPACING.l,
    width: '100%',
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  priceValue: {
    ...FONTS.h1,
    color: COLORS.primary,
    fontWeight: '800' as const,
    fontSize: 56,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  priceLabel: {
    ...FONTS.h3,
    color: COLORS.primary,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  priceSubtext: {
    ...FONTS.body2,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  creditsInfo: {
    alignItems: 'center',
    marginBottom: SPACING.l,
    width: '100%',
  },
  creditsAvailable: {
    ...FONTS.body1,
    color: COLORS.text,
    marginBottom: 4,
  },
  creditsNumber: {
    fontWeight: '700' as const,
    color: COLORS.primary,
  },
  lowCreditsWarning: {
    ...FONTS.body2,
    color: '#FF5722',
    fontWeight: '600' as const,
  },
  revealButton: {
    minWidth: '100%',
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    marginBottom: SPACING.s,
    borderRadius: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  revealButtonUnlocking: {
    backgroundColor: COLORS.textLight,
    opacity: 0.8,
  },
  guaranteeText: {
    ...FONTS.caption,
    color: COLORS.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 12,
    fontSize: 12,
  },
  backButton: {
    marginTop: SPACING.m,
    alignSelf: 'center',
    minWidth: 200,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backHeaderButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  completeButton: {
    backgroundColor: COLORS.success,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.s,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    ...FONTS.caption,
    color: COLORS.white,
    fontWeight: '600' as const,
    marginLeft: 4,
  },
  creditCost: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: '600' as const,
    fontStyle: 'italic',
  },
  contactSuccessContainer: {
    alignItems: 'center',
    padding: SPACING.l,
  },
  successHeader: {
    alignItems: 'center',
    marginBottom: SPACING.l,
    width: '100%',
  },
  successIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.m,
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  successTitle: {
    ...FONTS.h2,
    color: COLORS.text,
    fontWeight: '700' as const,
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    ...FONTS.body1,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  contactDetailsContainer: {
    width: '100%',
    marginBottom: SPACING.l,
  },
  contactDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: SPACING.m,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  contactDetailContent: {
    flex: 1,
  },
  contactDetailLabel: {
    ...FONTS.caption,
    color: COLORS.textLight,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  contactDetailValue: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  clickableContactText: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  contactActionHint: {
    ...FONTS.caption,
    color: COLORS.textLight,
    fontSize: 11,
    fontStyle: 'italic',
  },
  successTip: {
    backgroundColor: '#FFF3E0',
    padding: SPACING.m,
    borderRadius: 12,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  successTipText: {
    ...FONTS.body2,
    color: '#E65100',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  customerProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  unlockHintText: {
    ...FONTS.body2,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600' as const,
  },
  
  // Customer Contact Section (outside white box)
  contactOuterContainer: {
    paddingHorizontal: 0,
  },
  customerContactSection: {
    backgroundColor: COLORS.white,
    marginTop: 7,
    marginHorizontal: SPACING.m,
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    borderRadius: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  lockIconSmall: {
    marginLeft: 4,
  },
  customerContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerContactImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  customerContactInitial: {
    ...FONTS.body1,
    color: COLORS.white,
    fontWeight: '700' as const,
  },
  customerContactInfo: {
    flex: 1,
  },
  customerContactName: {
    ...FONTS.body1,
    color: COLORS.text,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  customerContactCredits: {
    ...FONTS.caption,
    color: COLORS.success,
    fontWeight: '600' as const,
  },
  unlockButton: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  unlockButtonText: {
    ...FONTS.caption,
    color: COLORS.white,
    fontWeight: '600' as const,
  },
});