import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import { Subscription } from '@/types';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/layout';
import Card from './Card';

interface SubscriptionCardProps {
  subscription: Subscription;
  onPress: (subscription: Subscription) => void;
  selected?: boolean;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onPress,
  selected = false,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(subscription)}>
      <Card 
        style={[
          styles.card, 
          selected && styles.selectedCard
        ]}
      >
        <Text style={styles.name}>{subscription.name}</Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>CHF {subscription.price}</Text>
          <Text style={styles.billingCycle}>
            {subscription.billingCycle === 'monthly' ? 'pro Monat' : 'pro Jahr'}
          </Text>
        </View>
        
        <View style={styles.featuresContainer}>
          {subscription.features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Check size={16} color={COLORS.success} />
              <Text style={styles.featureText}>{feature}</Text>
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
    borderWidth: 2,
    borderColor: COLORS.gray[200],
    shadowColor: COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '05',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  name: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  billingCycle: {
    ...FONTS.caption,
    color: COLORS.textLight,
  },
  featuresContainer: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  featureText: {
    ...FONTS.body2,
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
  },
});

export default SubscriptionCard;