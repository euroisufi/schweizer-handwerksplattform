import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MapPin, Star, Phone, Mail, Globe, ArrowLeft, ArrowRight, Award } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { FONTS, SPACING } from '@/constants/layout';
import { BUSINESSES } from '@/mocks/users';
import { SERVICES } from '@/mocks/services';
import Button from '@/components/Button';
import Card from '@/components/Card';
import RatingStars from '@/components/RatingStars';

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'info' | 'gallery' | 'reviews'>('info');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const business = BUSINESSES.find(b => b.id === id);
  
  if (!business) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Unternehmen nicht gefunden</Text>
        <Button 
          title="Zurück" 
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </View>
    );
  }
  
  const serviceNames = business.services.map(serviceId => {
    const service = SERVICES.find(s => s.id === serviceId);
    return service ? service.name : '';
  }).filter(Boolean);
  
  const nextImage = () => {
    if (business.gallery && currentImageIndex < business.gallery.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };
  
  const prevImage = () => {
    if (business.gallery && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <View style={styles.tabContent}>
            <Card style={styles.infoCard}>
              <Text style={styles.infoTitle}>Über uns</Text>
              <Text style={styles.infoText}>{business.description}</Text>
            </Card>
            
            <Card style={styles.infoCard}>
              <Text style={styles.infoTitle}>Dienstleistungen</Text>
              <View style={styles.servicesList}>
                {serviceNames.map((name, index) => (
                  <View key={index} style={styles.serviceTag}>
                    <Text style={styles.serviceText}>{name}</Text>
                  </View>
                ))}
              </View>
            </Card>
            
            <Card style={styles.infoCard}>
              <Text style={styles.infoTitle}>Kontakt</Text>
              
              <View style={styles.contactItem}>
                <Phone size={18} color={COLORS.textLight} />
                <Text style={styles.contactText}>{business.phone}</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Mail size={18} color={COLORS.textLight} />
                <Text style={styles.contactText}>{business.email}</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Globe size={18} color={COLORS.textLight} />
                <Text style={styles.contactText}>www.example.com</Text>
              </View>
              
              <View style={styles.contactItem}>
                <MapPin size={18} color={COLORS.textLight} />
                <Text style={styles.contactText}>{business.canton}</Text>
              </View>
            </Card>
          </View>
        );
      
      case 'gallery':
        return (
          <View style={styles.tabContent}>
            {business.gallery && business.gallery.length > 0 ? (
              <View>
                <View style={styles.galleryImageContainer}>
                  <Image source={{ uri: business.gallery[currentImageIndex] }} style={styles.galleryImage} />
                  
                  <View style={styles.imageNavigation}>
                    <TouchableOpacity 
                      style={[styles.imageNavButton, currentImageIndex === 0 && styles.disabledButton]}
                      onPress={prevImage}
                      disabled={currentImageIndex === 0}
                    >
                      <ArrowLeft size={20} color={COLORS.white} />
                    </TouchableOpacity>
                    
                    <Text style={styles.imageCounter}>
                      {currentImageIndex + 1} / {business.gallery.length}
                    </Text>
                    
                    <TouchableOpacity 
                      style={[styles.imageNavButton, currentImageIndex === business.gallery.length - 1 && styles.disabledButton]}
                      onPress={nextImage}
                      disabled={currentImageIndex === business.gallery.length - 1}
                    >
                      <ArrowRight size={20} color={COLORS.white} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailsContainer}>
                  {business.gallery.map((image, index) => (
                    <TouchableOpacity 
                      key={index} 
                      onPress={() => setCurrentImageIndex(index)}
                      style={[
                        styles.thumbnail,
                        currentImageIndex === index && styles.selectedThumbnail,
                      ]}
                    >
                      <Image source={{ uri: image }} style={styles.thumbnailImage} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ) : (
              <Card style={styles.emptyGallery}>
                <Text style={styles.emptyGalleryText}>
                  Dieses Unternehmen hat noch keine Bilder hochgeladen.
                </Text>
              </Card>
            )}
          </View>
        );
      
      case 'reviews':
        return (
          <View style={styles.tabContent}>
            <Card style={styles.reviewSummary}>
              <View style={styles.reviewRating}>
                <Text style={styles.reviewRatingNumber}>{business.rating.toFixed(1)}</Text>
                <RatingStars rating={business.rating} size={24} />
                <Text style={styles.reviewCount}>{business.reviewCount} Bewertungen</Text>
              </View>
            </Card>
            
            {/* Mock reviews */}
            <Card style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>Max Muster</Text>
                <Text style={styles.reviewDate}>15.06.2025</Text>
              </View>
              <RatingStars rating={5} size={16} />
              <Text style={styles.reviewText}>
                Sehr professionelle Arbeit! Pünktlich, sauber und das Ergebnis ist hervorragend.
                Kann ich nur weiterempfehlen.
              </Text>
            </Card>
            
            <Card style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>Anna Schmidt</Text>
                <Text style={styles.reviewDate}>02.05.2025</Text>
              </View>
              <RatingStars rating={4} size={16} />
              <Text style={styles.reviewText}>
                Gute Arbeit, aber etwas teurer als erwartet. Trotzdem bin ich mit dem Ergebnis zufrieden.
              </Text>
            </Card>
            
            <Card style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>Peter Meier</Text>
                <Text style={styles.reviewDate}>18.04.2025</Text>
              </View>
              <RatingStars rating={5} size={16} />
              <Text style={styles.reviewText}>
                Absolut zuverlässig und kompetent. Hat mein Badezimmer in Rekordzeit renoviert und
                dabei sehr sauber gearbeitet. Jederzeit wieder!
              </Text>
            </Card>
          </View>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: business.name,
          headerBackTitle: 'Handwerker',
        }} 
      />
      
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          {business.logo ? (
            <Image source={{ uri: business.logo }} style={styles.logo} />
          ) : (
            <View style={[styles.logo, styles.noLogo]}>
              <Text style={styles.logoText}>{business.name.charAt(0)}</Text>
            </View>
          )}
          
          <View style={styles.headerContent}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{business.name}</Text>
              {business.isPremium && (
                <View style={styles.premiumBadge}>
                  <Award size={14} color={COLORS.white} />
                  <Text style={styles.premiumText}>Premium</Text>
                </View>
              )}
            </View>
            
            <View style={styles.locationContainer}>
              <MapPin size={16} color={COLORS.textLight} />
              <Text style={styles.location}>{business.canton}</Text>
            </View>
            
            <View style={styles.ratingContainer}>
              <RatingStars rating={business.rating} size={16} />
              <Text style={styles.rating}>
                {business.rating.toFixed(1)} ({business.reviewCount})
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'info' && styles.activeTab]}
            onPress={() => setActiveTab('info')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'info' && styles.activeTabText,
              ]}
            >
              Info
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'gallery' && styles.activeTab]}
            onPress={() => setActiveTab('gallery')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'gallery' && styles.activeTabText,
              ]}
            >
              Galerie
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'reviews' && styles.activeTabText,
              ]}
            >
              Bewertungen
            </Text>
          </TouchableOpacity>
        </View>
        
        {renderTabContent()}
        
        <View style={styles.actions}>
          <Button 
            title="Kontaktieren" 
            onPress={() => {}}
            style={styles.contactButton}
          />
          
          <Button 
            title="Projekt erstellen" 
            onPress={() => router.push('/create-project')}
            variant="outline"
            style={styles.projectButton}
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
  header: {
    flexDirection: 'row',
    padding: SPACING.m,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: SPACING.m,
  },
  noLogo: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    ...FONTS.h1,
    color: COLORS.white,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    ...FONTS.h2,
    color: COLORS.text,
    flex: 1,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  premiumText: {
    ...FONTS.caption,
    color: COLORS.white,
    fontWeight: '600' as const,
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginLeft: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginLeft: 8,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.m,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...FONTS.body1,
    color: COLORS.textLight,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: '600' as const,
  },
  tabContent: {
    padding: SPACING.m,
  },
  infoCard: {
    marginBottom: SPACING.m,
  },
  infoTitle: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  infoText: {
    ...FONTS.body1,
    color: COLORS.text,
    lineHeight: 24,
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceTag: {
    backgroundColor: COLORS.gray[200],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  serviceText: {
    ...FONTS.body2,
    color: COLORS.textLight,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    ...FONTS.body1,
    color: COLORS.text,
    marginLeft: 12,
  },
  galleryImageContainer: {
    position: 'relative',
    marginBottom: SPACING.m,
  },
  galleryImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
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
  thumbnailsContainer: {
    marginBottom: SPACING.m,
  },
  thumbnail: {
    width: 80,
    height: 80,
    marginRight: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: COLORS.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 2,
  },
  emptyGallery: {
    padding: SPACING.l,
    alignItems: 'center',
  },
  emptyGalleryText: {
    ...FONTS.body1,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  reviewSummary: {
    marginBottom: SPACING.m,
    alignItems: 'center',
    padding: SPACING.m,
  },
  reviewRating: {
    alignItems: 'center',
  },
  reviewRatingNumber: {
    ...FONTS.h1,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  reviewCount: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  reviewCard: {
    marginBottom: SPACING.m,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewerName: {
    ...FONTS.body1,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  reviewDate: {
    ...FONTS.body2,
    color: COLORS.textLight,
  },
  reviewText: {
    ...FONTS.body1,
    color: COLORS.text,
    marginTop: SPACING.s,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    padding: SPACING.m,
    marginBottom: SPACING.l,
  },
  contactButton: {
    flex: 1,
    marginRight: 8,
  },
  projectButton: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.text,
    marginBottom: SPACING.l,
  },
  backButton: {
    marginTop: SPACING.m,
    alignSelf: 'center',
    minWidth: 200,
  },
});