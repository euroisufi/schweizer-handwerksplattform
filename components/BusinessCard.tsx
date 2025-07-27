import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ViewStyle } from 'react-native';
import { MapPin, Star } from 'lucide-react-native';
import { Business } from '@/types';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/layout';
import Card from './Card';

interface BusinessCardProps {
  business: Business;
  onPress: (business: Business) => void;
  style?: ViewStyle;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, onPress, style }) => {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={() => onPress(business)}>
      <Card style={[styles.card, style]}>
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
              <Text style={styles.name} numberOfLines={1}>{business.name}</Text>
              {business.isPremium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumText}>Premium</Text>
                </View>
              )}
            </View>
            
            <View style={styles.locationContainer}>
              <MapPin size={14} color={COLORS.textLight} />
              <Text style={styles.location}>{business.canton}</Text>
            </View>
            
            <View style={styles.ratingContainer}>
              <Star size={14} color={COLORS.warning} fill={COLORS.warning} />
              <Text style={styles.rating}>
                {business.rating.toFixed(1)} ({business.reviewCount})
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {business.description}
        </Text>
        
        <View style={styles.services}>
          {business.services.map((serviceId, index) => (
            <View key={serviceId} style={styles.serviceTag}>
              <Text style={styles.serviceText}>
                {/* This would normally fetch the service name from a service list */}
                {serviceId === '1' ? 'Malerei' : 
                 serviceId === '2' ? 'Fliesenlegen' : 
                 serviceId === '3' ? 'Elektroinstallation' : 
                 serviceId === '4' ? 'Sanitärinstallation' : 
                 serviceId === '5' ? 'Gartenarbeit' : 
                 serviceId === '6' ? 'Dachdeckerarbeiten' : 
                 serviceId === '7' ? 'Bodenbeläge' : 'Service'}
              </Text>
            </View>
          ))}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  noLogo: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '700' as const,
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
    ...FONTS.h3,
    color: COLORS.text,
    flex: 1,
  },
  premiumBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  premiumText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600' as const,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  location: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  description: {
    ...FONTS.body2,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  services: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceTag: {
    backgroundColor: COLORS.gray[200],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  serviceText: {
    ...FONTS.caption,
    color: COLORS.textLight,
  },
});

export default BusinessCard;