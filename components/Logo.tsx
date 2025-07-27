import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export default function Logo({ size = 'medium', showText = false }: LogoProps) {
  const logoSize = size === 'small' ? 120 : size === 'medium' ? 150 : 180;
  const logoWidth = size === 'small' ? 360 : size === 'medium' ? 450 : 540;
  
  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://r2-pub.rork.com/attachments/md2x4nkrkasynd4343pfl' }}
        style={[styles.logoImage, { width: logoWidth, height: logoSize }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    // Clean logo without shadows
  },
});