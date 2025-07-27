import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CreditPackage } from '@/types';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/layout';
import Card from './Card';

interface CreditPackageCardProps {
  package: CreditPackage;
  onPress: (pkg: CreditPackage) => void;
  selected?: boolean;
  premiumDiscount?: number;
}

const CreditPackageCard: React.FC<CreditPackageCardProps> = ({
  package: pkg,
  onPress,
  selected = false,
  premiumDiscount = 0,
}) => {
  const originalPrice = pkg.price;
  const discountedPrice = premiumDiscount > 0 ? originalPrice * (1 - premiumDiscount / 100) : originalPrice;
  const finalPrice = premiumDiscount > 0 ? discountedPrice : originalPrice;
  const pricePerCredit = finalPrice / pkg.credits;
  
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => onPress(pkg)}>
      <Card 
        style={[
          styles.card, 
          selected && styles.selectedCard,
          pkg.isPremiumOnly && styles.premiumCard
        ]}
      >
        {pkg.discountPercent && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{pkg.discountPercent}% Rabatt</Text>
          </View>
        )}
        
        {pkg.isPremiumOnly && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Premium</Text>
          </View>
        )}
        
        <Text style={styles.name}>{pkg.name}</Text>
        
        <View style={styles.priceContainer}>
          {premiumDiscount > 0 ? (
            <>
              <Text style={styles.originalPrice}>CHF {originalPrice}</Text>
              <Text style={styles.price}>CHF {finalPrice.toFixed(2)}</Text>
              <View style={styles.premiumDiscountBadge}>
                <Text style={styles.premiumDiscountText}>-{premiumDiscount}% Premium</Text>
              </View>
            </>
          ) : (
            <Text style={styles.price}>CHF {pkg.price}</Text>
          )}
          <Text style={styles.pricePerCredit}>
            (CHF {pricePerCredit.toFixed(2)} pro Credit)
          </Text>
        </View>
        
        <View style={styles.creditsContainer}>
          <Text style={styles.credits}>{pkg.credits}</Text>
          <Text style={styles.creditsLabel}>Credits</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: COLORS.primary,
  },
  premiumCard: {
    backgroundColor: COLORS.gray[100],
  },
  discountBadge: {
    position: 'absolute',
    top: -10,
    right: 10,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  premiumBadge: {
    position: 'absolute',
    top: -10,
    left: 10,
    backgroundColor: COLORS.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  premiumText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  name: {
    ...FONTS.h3,
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    ...FONTS.h2,
    color: COLORS.text,
  },
  pricePerCredit: {
    ...FONTS.caption,
    color: COLORS.textLight,
  },
  creditsContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
    paddingVertical: 8,
    borderRadius: 4,
  },
  credits: {
    ...FONTS.h1,
    color: COLORS.primary,
  },
  creditsLabel: {
    ...FONTS.body2,
    color: COLORS.textLight,
  },
  originalPrice: {
    ...FONTS.body1,
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  premiumDiscountBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  premiumDiscountText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '600' as const,
  },
});

export default CreditPackageCard;