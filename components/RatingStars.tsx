import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Star } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';

interface RatingStarsProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 20,
  interactive = false,
  onRatingChange,
}) => {
  const renderStar = (position: number) => {
    const isFilled = position <= rating;
    
    if (interactive) {
      return (
        <TouchableOpacity
          key={position}
          onPress={() => onRatingChange && onRatingChange(position)}
          style={styles.starContainer}
        >
          <Star
            size={size}
            color={COLORS.warning}
            fill={isFilled ? COLORS.warning : 'transparent'}
          />
        </TouchableOpacity>
      );
    }
    
    return (
      <View key={position} style={styles.starContainer}>
        <Star
          size={size}
          color={COLORS.warning}
          fill={isFilled ? COLORS.warning : 'transparent'}
        />
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map(position => renderStar(position))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  starContainer: {
    marginRight: 4,
  },
});

export default RatingStars;