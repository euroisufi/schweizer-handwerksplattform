import React from 'react';
import { StyleSheet, View, ViewStyle, TouchableOpacity } from 'react-native';
import { COLORS, SHADOWS } from '@/constants/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: 'small' | 'medium' | 'large' | 'none';
  padding?: 'none' | 'small' | 'medium' | 'large';
  onPress?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  elevation = 'small',
  padding = 'medium',
  onPress,
}) => {
  const getElevationStyle = () => {
    switch (elevation) {
      case 'small':
        return SHADOWS.small;
      case 'medium':
        return SHADOWS.medium;
      case 'large':
        return SHADOWS.large;
      case 'none':
        return {};
    }
  };

  const getPaddingStyle = () => {
    switch (padding) {
      case 'small':
        return { padding: 8 };
      case 'medium':
        return { padding: 16 };
      case 'large':
        return { padding: 24 };
      case 'none':
        return { padding: 0 };
    }
  };

  const cardStyle = [
    styles.card,
    getElevationStyle(),
    getPaddingStyle(),
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
  },
});

export default Card;