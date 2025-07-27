import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Service } from '@/types';
import { COLORS, SHADOWS } from '@/constants/colors';
import { FONTS } from '@/constants/layout';

interface ServiceItemProps {
  service: Service;
  onPress: (service: Service) => void;
  selected?: boolean;
}

const ServiceItem: React.FC<ServiceItemProps> = ({
  service,
  onPress,
  selected = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.selectedContainer]}
      onPress={() => onPress(service)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, selected && styles.selectedIconContainer]}>
        <Text style={styles.icon}>{service.icon}</Text>
      </View>
      <Text 
        style={[styles.name, selected && styles.selectedName]}
        numberOfLines={2}
      >
        {service.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    marginRight: 12,
    marginBottom: 12,
    ...SHADOWS.small,
  },
  selectedContainer: {
    backgroundColor: COLORS.primaryLight,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  selectedIconContainer: {
    backgroundColor: COLORS.white,
  },
  icon: {
    fontSize: 24,
  },
  name: {
    ...FONTS.body2,
    color: COLORS.text,
    textAlign: 'center',
  },
  selectedName: {
    color: COLORS.white,
    fontWeight: '600' as const,
  },
});

export default ServiceItem;