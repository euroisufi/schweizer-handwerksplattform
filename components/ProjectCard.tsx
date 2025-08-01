import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { MapPin, Clock, CheckCircle, Edit, Lock, User } from 'lucide-react-native';
import { Project } from '@/types';
import { COLORS } from '@/constants/colors';
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
  const handlePress = () => {
    onPress(project);
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

  const getProjectBudget = () => {
    if (project.budget && project.budget.min && project.budget.max) {
      if (project.budget.min === project.budget.max) {
        return `${project.budget.min} €`;
      }
      return `${project.budget.min} - ${project.budget.max} €`;
    }
    return getDaysLeft();
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
      <View style={styles.card}>
          {/* Banner */}
          <View style={styles.banner}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerText}>
                <Text style={styles.customerName}>{customerDisplayName}</Text> sucht einen{' '}
              </Text>
              <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
                <Text style={styles.categoryBadgeText}>{category.name}</Text>
              </View>
            </View>
          </View>
          
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
            
            {/* Divider after location */}
            <View style={styles.divider} />
            
            {/* Description Section */}
            <Text style={styles.sectionTitle}>Projektbeschreibung</Text>
            <Text style={styles.description} numberOfLines={3}>
              {project.description}
            </Text>
            
            {/* Divider after description */}
            <View style={styles.divider} />
            
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
              
              {/* Project Budget */}
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Projektbudget</Text>
                <View style={styles.categoryRow}>
                  <Clock size={14} color={COLORS.text} />
                  <Text style={styles.infoValue}>{getProjectBudget()}</Text>
                </View>
              </View>
            </View>
            
            {/* Contact Data */}
            <View style={styles.organizationSection}>
              {/* Divider before contact data */}
              <View style={styles.divider} />
              <Text style={styles.organizationLabel}>Kontaktdaten</Text>
              <View style={styles.organizationRow}>
                <View style={styles.organizationInfo}>
                  <View style={styles.organizationDetails}>
                    <Text style={styles.organizationName}>{customerDisplayName}</Text>
                    <Text style={styles.organizationStatus}>Verifizierter Account</Text>
                  </View>
                </View>
              </View>
            </View>
            
          </View>
          
          {/* Contact Unlock Section for Business View - Outside main content */}
          {isBusinessView && showContactButton && !isUnlocked && (
            <View style={styles.unlockContactSectionOuter}>
              <TouchableOpacity 
                style={styles.unlockContactSection}
                onPress={() => onContactPress && onContactPress(project)}
                activeOpacity={0.8}
              >
                <View style={styles.unlockContactContent}>
                  {/* Profile Image */}
                  {(profileImageFromUnlocked || customerData?.profileImage || (userType === 'customer' && user && user.id === project.customerId && (user as any)?.logo)) ? (
                    <Image 
                      source={{ 
                        uri: profileImageFromUnlocked || 
                             (userType === 'customer' && user && user.id === project.customerId && (user as any)?.logo) ||
                             customerData?.profileImage
                      }} 
                      style={styles.unlockContactAvatar} 
                    />
                  ) : (
                    <View style={styles.unlockContactAvatar}>
                      <Text style={styles.unlockContactInitial}>
                        {customerDisplayName?.charAt(0) || 'K'}
                      </Text>
                    </View>
                  )}
                  
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
            </View>
          )}
            
          
          {/* Unlocked Contact Info - Outside main content */}
          {isBusinessView && isUnlocked && (
            <View style={styles.unlockedContactSectionOuter}>
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
            </View>
          )}
          
          {/* Owner Actions - Outside main content */}
          {isOwnerView && (
            <View style={styles.ownerActionsSectionOuter}>
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
            </View>
          )}
      </View>
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
  banner: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  bannerText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600' as const,
  },
  customerName: {
    fontWeight: '700' as const,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 4,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600' as const,
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
  sectionTitle: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600' as const,
    marginBottom: 8,
    marginTop: 16,
  },
  description: {
    fontSize: 15,
    color: COLORS.textLight,
    lineHeight: 22,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.gray[200],
    marginVertical: 8,
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
    marginBottom: 8,
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

  unlockContactSectionOuter: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: -8,
  },
  unlockContactSection: {
    backgroundColor: COLORS.gray[50],
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
  },
  unlockContactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unlockContactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  unlockContactInitial: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600' as const,
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
  unlockedContactSectionOuter: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 2,
  },
  unlockedContactSection: {
    backgroundColor: COLORS.success + '10',
    borderRadius: 16,
    padding: 16,
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
  ownerActionsSectionOuter: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 2,
  },
  ownerActions: {
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