import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import { MapPin, Calendar, Clock, CheckCircle, Edit, Lock, User } from 'lucide-react-native';
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

  const getDaysLeft = () => {
    const today = new Date();
    const startDate = new Date(project.timeframe.start);
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Überfällig';
    if (diffDays === 0) return 'Heute';
    if (diffDays === 1) return '1 Tag';
    return `${diffDays} Tage`;
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={handlePress}>
      <Animated.View style={[animatedStyle]}>
        <View style={styles.card}>
          {/* Hero Image */}
          <View style={styles.imageContainer}>
            {project.images && project.images.length > 0 ? (
              <Image source={{ uri: project.images[0] }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.noImage]}>
                <Text style={styles.noImageText}>{project.service.icon}</Text>
              </View>
            )}
          </View>
          
          {/* Content */}
          <View style={styles.content}>
            {/* Title */}
            <Text style={styles.title}>{project.title}</Text>
            
            {/* Location */}
            <View style={styles.locationRow}>
              <MapPin size={16} color={COLORS.textLight} />
              <Text style={styles.locationText}>
                {project.location.city}, {project.location.canton}
              </Text>
            </View>
            
            {/* Description */}
            <Text style={styles.description} numberOfLines={3}>
              {project.description}
            </Text>
            
            {/* Info Grid */}
            <View style={styles.infoGrid}>
              {/* Category */}
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Kategorie</Text>
                <View style={styles.categoryRow}>
                  <User size={14} color={COLORS.text} />
                  <Text style={styles.infoValue}>{category.name}</Text>
                </View>
              </View>
              
              {/* Days Left */}
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Verbleibend</Text>
                <View style={styles.categoryRow}>
                  <Clock size={14} color={COLORS.text} />
                  <Text style={styles.infoValue}>{getDaysLeft()}</Text>
                </View>
              </View>
            </View>
            
            {/* Organization */}
            <View style={styles.organizationSection}>
              <Text style={styles.organizationLabel}>Organisation von</Text>
              <View style={styles.organizationRow}>
                <View style={styles.organizationInfo}>
                  {(profileImageFromUnlocked || customerData?.profileImage || (userType === 'customer' && user && user.id === project.customerId && (user as any)?.logo)) ? (
                    <Image 
                      source={{ 
                        uri: profileImageFromUnlocked || 
                             (userType === 'customer' && user && user.id === project.customerId && (user as any)?.logo) ||
                             customerData?.profileImage
                      }} 
                      style={styles.organizationAvatar} 
                    />
                  ) : (
                    <View style={styles.organizationAvatar}>
                      <Text style={styles.organizationInitial}>
                        {customerDisplayName?.charAt(0) || 'K'}
                      </Text>
                    </View>
                  )}
                  <View style={styles.organizationDetails}>
                    <Text style={styles.organizationName}>{customerDisplayName}</Text>
                    <Text style={styles.organizationStatus}>Verifizierter Account</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.visitButton}>
                  <Text style={styles.visitButtonText}>Besuchen</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Contact Unlock Section for Business View */}
            {isBusinessView && showContactButton && !isUnlocked && (
              <TouchableOpacity 
                style={styles.unlockContactSection}
                onPress={() => onContactPress && onContactPress(project)}
                activeOpacity={0.8}
              >
                <View style={styles.unlockContactContent}>
                  <View style={styles.unlockContactLeft}>
                    <Text style={styles.unlockContactTitle}>Kontakt freischalten</Text>
                    <Text style={styles.unlockContactSubtitle}>{creditsRequired} Credits erforderlich</Text>
                  </View>
                  <View style={styles.unlockContactButton}>
                    <Text style={styles.unlockContactButtonText}>Freischalten</Text>
                    <Lock size={16} color={COLORS.white} />
                  </View>
                </View>
              </TouchableOpacity>
            )}
            
            {/* Unlocked Contact Info */}
            {isBusinessView && isUnlocked && (
              <View style={styles.unlockedContactSection}>
                <Text style={styles.unlockedContactTitle}>Kontakt freigeschaltet</Text>
                <View style={styles.unlockedContactInfo}>
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
            
            {/* Owner Actions */}
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
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  imageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
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
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 28,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 6,
    fontWeight: '500' as const,
  },
  description: {
    fontSize: 15,
    color: COLORS.textLight,
    lineHeight: 22,
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500' as const,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600' as const,
    marginLeft: 6,
  },
  organizationSection: {
    marginBottom: 20,
  },
  organizationLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500' as const,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  organizationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  organizationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  organizationAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  organizationInitial: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600' as const,
  },
  organizationDetails: {
    flex: 1,
  },
  organizationName: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600' as const,
    marginBottom: 2,
  },
  organizationStatus: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500' as const,
  },
  visitButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  visitButtonText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600' as const,
  },
  unlockContactSection: {
    backgroundColor: COLORS.gray[50],
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  unlockContactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unlockContactLeft: {
    flex: 1,
  },
  unlockContactTitle: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  unlockContactSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500' as const,
  },
  unlockContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  unlockContactButtonText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600' as const,
    marginRight: 8,
  },
  unlockedContactSection: {
    backgroundColor: COLORS.success + '10',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.success + '40',
  },
  unlockedContactTitle: {
    fontSize: 16,
    color: COLORS.success,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  unlockedContactInfo: {
    alignItems: 'flex-start',
  },
  phoneNumber: {
    fontSize: 16,
    color: COLORS.success,
    fontWeight: '600' as const,
  },
  emailAddress: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600' as const,
  },
  noContactInfo: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500' as const,
    fontStyle: 'italic',
  },
  ownerActions: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  ownerActionsTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: COLORS.primary,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
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
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600' as const,
    marginLeft: 6,
  },
  completeActionButtonText: {
    color: COLORS.white,
  },
});

export default ProjectCard;