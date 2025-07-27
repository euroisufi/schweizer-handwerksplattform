import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import { MapPin, Calendar, Ruler, CheckCircle, Edit, Lock } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  Easing 
} from 'react-native-reanimated';
import { Project } from '@/types';
import { COLORS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { calculateCreditsForProject } from '@/utils/credits';
import { getCategoryByName } from '@/constants/categories';
import { CUSTOMERS } from '@/mocks/users';
import { useAuth } from '@/hooks/auth-store';
import { useCredits } from '@/hooks/credits-store';
import Card from './Card';

interface ProjectCardProps {
  project: Project;
  onPress: (project: Project) => void;
  showContactButton?: boolean;
  onContactPress?: (project: Project) => void;
  isBusinessView?: boolean;
  isOwnerView?: boolean;
  onEdit?: (project: Project) => void;
  onComplete?: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onPress,
  showContactButton = false,
  onContactPress,
  isBusinessView = false,
  isOwnerView = false,
  onEdit,
  onComplete,
}) => {
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const shadowOpacity = useSharedValue(0.1);
  const shadowRadius = useSharedValue(8);
  
  // Reset animation values when component mounts or project changes
  useEffect(() => {
    scale.value = 1;
    opacity.value = 1;
    translateY.value = 0;
    shadowOpacity.value = 0.1;
    shadowRadius.value = 8;
  }, [project.id, scale, opacity, translateY, shadowOpacity, shadowRadius]);
  
  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ],
    opacity: opacity.value,
    shadowOpacity: shadowOpacity.value,
    shadowRadius: shadowRadius.value,
    elevation: shadowRadius.value / 2,
  }));
  
  const resetAnimation = () => {
    const resetEasing = Easing.bezier(0.25, 0.46, 0.45, 0.94);
    scale.value = withTiming(1, { duration: 150, easing: resetEasing });
    opacity.value = withTiming(1, { duration: 150, easing: resetEasing });
    translateY.value = withTiming(0, { duration: 150, easing: resetEasing });
    shadowOpacity.value = withTiming(0.1, { duration: 150, easing: resetEasing });
    shadowRadius.value = withTiming(8, { duration: 150, easing: resetEasing });
  };
  
  const handlePress = () => {
    if (Platform.OS === 'web') {
      // Simple animation for web
      scale.value = withSequence(
        withTiming(0.95, { duration: 100, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 100, easing: Easing.out(Easing.quad) })
      );
      setTimeout(() => onPress(project), 150);
      return;
    }
    
    // Enhanced fluid animation for mobile
    const pressEasing = Easing.bezier(0.25, 0.46, 0.45, 0.94); // easeOutQuad
    const exitEasing = Easing.bezier(0.55, 0.06, 0.68, 0.19); // easeInQuad
    
    // Press down animation - more fluid
    scale.value = withTiming(0.96, { 
      duration: 120, 
      easing: pressEasing 
    });
    
    opacity.value = withTiming(0.92, { 
      duration: 120,
      easing: pressEasing
    });
    
    translateY.value = withTiming(-4, { 
      duration: 120,
      easing: pressEasing
    });
    
    shadowOpacity.value = withTiming(0.15, {
      duration: 120,
      easing: pressEasing
    });
    
    shadowRadius.value = withTiming(10, {
      duration: 120,
      easing: pressEasing
    });
    
    // Zoom out and navigate - smoother transition
    setTimeout(() => {
      scale.value = withTiming(0.85, { 
        duration: 200,
        easing: exitEasing
      });
      
      opacity.value = withTiming(0.5, { 
        duration: 200,
        easing: exitEasing
      });
      
      translateY.value = withTiming(-20, { 
        duration: 200,
        easing: exitEasing
      });
      
      shadowOpacity.value = withTiming(0.05, {
        duration: 200,
        easing: exitEasing
      });
      
      shadowRadius.value = withTiming(4, {
        duration: 200,
        easing: exitEasing
      });
      
      // Navigate after smoother animation
      setTimeout(() => {
        onPress(project);
        // Reset animation after navigation
        setTimeout(() => {
          resetAnimation();
        }, 50);
      }, 80);
    }, 120);
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const creditsRequired = calculateCreditsForProject(project.budget);
  const category = getCategoryByName(project.service.category) || {
    name: project.service.category,
    color: '#8B5CF6',
    id: project.service.category.toLowerCase(),
    icon: project.service.icon
  };
  
  const { user, userType } = useAuth();
  const { isContactUnlocked, unlockedContacts } = useCredits();
  const customerData = CUSTOMERS.find(c => c.id === project.customerId);
  const isUnlocked = isContactUnlocked(project.id);
  
  // Get profile image from unlocked contacts if available (for business view)
  const unlockedContact = unlockedContacts.find(contact => contact.projectId === project.id);
  const profileImageFromUnlocked = unlockedContact?.profileImage;
  
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
  let genderPrefix = '';
  
  if (userType === 'customer' && user && user.id === project.customerId) {
    // Use current logged-in user's name (this takes priority over mock data)
    const customerUser = user as any; // Type assertion to access gender
    
    if (customerUser.gender) {
      genderPrefix = customerUser.gender === 'male' ? 'Herr ' : 'Frau ';
    }
    
    if (user.name) {
      customerDisplayName = genderPrefix + formatCustomerName(user.name);
      console.log('ProjectCard: Using current user name:', customerDisplayName, 'for project:', project.id);
    } else if (user.firstName && user.lastName) {
      const fullName = `${user.firstName} ${user.lastName}`;
      customerDisplayName = genderPrefix + formatCustomerName(fullName);
      console.log('ProjectCard: Using current user firstName/lastName:', customerDisplayName, 'for project:', project.id);
    } else {
      console.log('ProjectCard: Current user has no name, using default for project:', project.id);
    }
  } else if (customerData?.name) {
    // Use mock data name for other customers
    const customerUser = customerData as any; // Type assertion to access gender
    if (customerUser.gender) {
      genderPrefix = customerUser.gender === 'male' ? 'Herr ' : 'Frau ';
    }
    customerDisplayName = genderPrefix + formatCustomerName(customerData.name);
    console.log('ProjectCard: Using mock data name:', customerDisplayName, 'for project:', project.id);
  } else {
    console.log('ProjectCard: Using default name "Der Kunde" for project:', project.id);
  }

  return (
    <TouchableOpacity activeOpacity={1} onPress={handlePress}>
      <Animated.View style={[animatedStyle]}>
        <Card style={styles.card} padding="none">
        <View style={styles.imageContainer}>
          {project.images && project.images.length > 0 ? (
            <Image source={{ uri: project.images[0] }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.noImage]}>
              <Text style={styles.noImageText}>{project.service.icon}</Text>
            </View>
          )}
          <View style={styles.imageOverlay} />
          
          {/* Category tag */}
          {category && (
            <View style={[styles.categoryTag, { backgroundColor: category.color }]}>
              <Text style={styles.categoryTagText}>
                <Text style={styles.categoryPrefixText}>{customerDisplayName} sucht einen </Text>
                <Text style={styles.categoryNameText}>{category.name}</Text>
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{project.title}</Text>
            <View style={styles.badges}>
              {project.status === 'completed' && (
                <View style={[styles.badge, styles.completedBadge]}>
                  <CheckCircle size={12} color={COLORS.white} />
                  <Text style={styles.badgeText}>Abgeschlossen</Text>
                </View>
              )}
              {isBusinessView && project.status !== 'completed' && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Neu</Text>
                </View>
              )}
            </View>
          </View>
          
          <Text style={styles.description} numberOfLines={2}>
            {project.description}
          </Text>
          
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <View style={styles.detailItemHorizontal}>
                <MapPin size={14} color={COLORS.textLight} />
                <Text style={styles.detailTextSmall}>
                  {project.location.city}, {project.location.canton}
                </Text>
              </View>
              
              <Text style={styles.detailSeparator}>|</Text>
              
              <View style={styles.detailItemHorizontal}>
                <Calendar size={14} color={COLORS.textLight} />
                <Text style={styles.detailTextSmall}>
                  {formatDate(project.timeframe.start)}
                </Text>
              </View>
              
              {project.area && (
                <>
                  <Text style={styles.detailSeparator}>|</Text>
                  <View style={styles.detailItemHorizontal}>
                    <Ruler size={14} color={COLORS.textLight} />
                    <Text style={styles.detailTextSmall}>{project.area} m²</Text>
                  </View>
                </>
              )}
            </View>
            <View style={styles.detailsPadding} />
          </View>
          
          {isBusinessView && (
            <>
              {showContactButton && !isUnlocked && (
                <TouchableOpacity 
                  style={styles.unlockContactCard}
                  onPress={() => onContactPress && onContactPress(project)}
                  activeOpacity={0.8}
                >
                  <View style={styles.customerPreview}>
                    {(profileImageFromUnlocked || customerData?.profileImage || (userType === 'customer' && user && user.id === project.customerId && (user as any)?.logo)) ? (
                      <Image 
                        source={{ 
                          uri: profileImageFromUnlocked || 
                               (userType === 'customer' && user && user.id === project.customerId && (user as any)?.logo) ||
                               customerData?.profileImage
                        }} 
                        style={styles.customerImageBlurred} 
                      />
                    ) : (
                      <View style={styles.customerImageBlurred}>
                        <Text style={styles.customerInitial}>
                          {customerDisplayName?.charAt(0) || 'K'}
                        </Text>
                      </View>
                    )}
                    <Text style={styles.customerNameBlurred}>
                      {customerDisplayName}
                    </Text>
                  </View>
                  
                  <View style={styles.creditsCost}>
                    <Text style={styles.creditsText}>{creditsRequired} Credits</Text>
                  </View>
                  
                  <View style={styles.unlockAction}>
                    <Text style={styles.unlockText}>Freischalten</Text>
                    <Lock size={16} color={COLORS.white} style={styles.lockIcon} />
                  </View>
                </TouchableOpacity>
              )}
              
              {isUnlocked && (
                <View style={styles.unlockedContactCard}>
                  <View style={styles.customerPreview}>
                    {(profileImageFromUnlocked || customerData?.profileImage || (userType === 'customer' && user && user.id === project.customerId && (user as any)?.logo)) ? (
                      <Image 
                        source={{ 
                          uri: profileImageFromUnlocked || 
                               (userType === 'customer' && user && user.id === project.customerId && (user as any)?.logo) ||
                               customerData?.profileImage
                        }} 
                        style={styles.customerImage} 
                      />
                    ) : (
                      <View style={styles.customerImage}>
                        <Text style={styles.customerInitial}>
                          {customerDisplayName?.charAt(0) || 'K'}
                        </Text>
                      </View>
                    )}
                    <Text style={styles.customerName}>
                      {customerDisplayName}
                    </Text>
                  </View>
                  
                  <View style={styles.contactInfo}>
                    {project.contactPhone || customerData?.phone ? (
                      <Text style={styles.phoneNumber}>
                        {project.contactPhone || customerData?.phone}
                      </Text>
                    ) : project.contactEmail || customerData?.email ? (
                      <Text style={styles.emailAddress}>
                        {project.contactEmail || customerData?.email}
                      </Text>
                    ) : (
                      <Text style={styles.noContactInfo}>Keine Kontaktdaten</Text>
                    )}
                  </View>
                </View>
              )}
            </>
          )}
          
          {isOwnerView && (
            <View style={styles.ownerActions}>
              <Text style={styles.ownerActionsTitle}>Meine Aktionen</Text>
              <View style={styles.actionButtons}>
                {project.status !== 'completed' && onEdit && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      onEdit(project);
                    }}
                  >
                    <Edit size={16} color={COLORS.primary} />
                    <Text style={styles.actionButtonText}>Bearbeiten</Text>
                  </TouchableOpacity>
                )}
                
                {project.status !== 'completed' && onComplete && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.completeActionButton]}
                    onPress={(e) => {
                      e.stopPropagation();
                      onComplete(project);
                    }}
                  >
                    <CheckCircle size={16} color={COLORS.white} />
                    <Text style={[styles.actionButtonText, styles.completeActionButtonText]}>
                      Abschließen
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
        </Card>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  imageContainer: {
    position: 'relative',
    height: 280,
    width: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  categoryTag: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  categoryTagText: {
    ...FONTS.caption,
    color: COLORS.white,
    fontSize: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textAlign: 'center',
  },
  categoryPrefixText: {
    fontWeight: '400' as const,
  },
  categoryNameText: {
    fontWeight: '700' as const,
  },
  noImage: {
    backgroundColor: COLORS.gray[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageText: {
    fontSize: 48,
  },
  content: {
    padding: 12,
    paddingTop: 0,
    paddingBottom: 22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    ...FONTS.h3,
    color: COLORS.text,
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedBadge: {
    backgroundColor: COLORS.success,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600' as const,
    marginLeft: 2,
  },
  description: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  details: {
    marginTop: 6,
  },
  detailsPadding: {
    height: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailItemHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginLeft: 8,
  },
  detailTextSmall: {
    ...FONTS.caption,
    color: COLORS.textLight,
    marginLeft: 6,
    fontSize: 12,
  },
  detailSeparator: {
    ...FONTS.caption,
    color: COLORS.textLight,
    marginHorizontal: 8,
    fontSize: 12,
  },

  unlockContactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 6,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  customerPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  customerImageBlurred: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.gray[300],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    opacity: 0.7,
  },
  customerInitial: {
    ...FONTS.body2,
    color: COLORS.white,
    fontWeight: '600' as const,
  },
  customerNameBlurred: {
    ...FONTS.body2,
    color: COLORS.text,
    fontWeight: '500' as const,
  },
  creditsCost: {
    backgroundColor: COLORS.modernGreen,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginHorizontal: 6,
  },
  creditsText: {
    ...FONTS.caption,
    color: COLORS.white,
    fontWeight: '600' as const,
  },
  unlockAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  unlockText: {
    ...FONTS.caption,
    color: COLORS.white,
    fontWeight: '600' as const,
    marginRight: 4,
  },
  lockIcon: {
    marginLeft: 2,
  },
  unlockedContactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '10',
    borderRadius: 10,
    padding: 6,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.success + '40',
  },
  customerImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  customerName: {
    ...FONTS.body2,
    color: COLORS.text,
    fontWeight: '500' as const,
  },
  contactInfo: {
    marginLeft: 'auto',
  },
  phoneNumber: {
    ...FONTS.body2,
    color: COLORS.success,
    fontWeight: '600' as const,
    textAlign: 'right',
  },
  emailAddress: {
    ...FONTS.body2,
    color: COLORS.primary,
    fontWeight: '600' as const,
    textAlign: 'right',
  },
  noContactInfo: {
    ...FONTS.body2,
    color: COLORS.textLight,
    fontWeight: '500' as const,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  ownerActions: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  ownerActionsTitle: {
    ...FONTS.body2,
    fontWeight: '600' as const,
    color: COLORS.primary,
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  completeActionButton: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  actionButtonText: {
    ...FONTS.caption,
    color: COLORS.primary,
    fontWeight: '600' as const,
    marginLeft: 4,
  },
  completeActionButtonText: {
    color: COLORS.white,
  },
});

export default ProjectCard;