import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Device size categories
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 414;
const isLargeDevice = width >= 414;

// Responsive font scaling
const getResponsiveSize = (small: number, medium: number, large: number) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

export const SIZES = {
  // Global sizes - responsive
  base: 8,
  small: getResponsiveSize(12, 14, 16),
  font: getResponsiveSize(14, 16, 18),
  medium: getResponsiveSize(16, 18, 20),
  large: getResponsiveSize(18, 20, 22),
  xlarge: getResponsiveSize(22, 26, 28),
  xxlarge: getResponsiveSize(28, 34, 36),
  
  // Screen dimensions
  width,
  height,
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const FONTS = {
  h1: {
    fontSize: SIZES.xxlarge,
    fontWeight: '700' as const,
    lineHeight: getResponsiveSize(34, 42, 44),
  },
  h2: {
    fontSize: SIZES.xlarge,
    fontWeight: '700' as const,
    lineHeight: getResponsiveSize(28, 32, 34),
  },
  h3: {
    fontSize: SIZES.large,
    fontWeight: '700' as const,
    lineHeight: getResponsiveSize(24, 26, 28),
  },
  h4: {
    fontSize: SIZES.medium,
    fontWeight: '600' as const,
    lineHeight: getResponsiveSize(22, 24, 26),
  },
  body1: {
    fontSize: SIZES.medium,
    fontWeight: '400' as const,
    lineHeight: getResponsiveSize(22, 24, 26),
  },
  body2: {
    fontSize: SIZES.font,
    fontWeight: '400' as const,
    lineHeight: getResponsiveSize(20, 22, 24),
  },
  caption: {
    fontSize: SIZES.small,
    fontWeight: '400' as const,
    lineHeight: getResponsiveSize(16, 18, 20),
  },
  button: {
    fontSize: SIZES.medium,
    fontWeight: '600' as const,
    lineHeight: getResponsiveSize(22, 24, 26),
  },
};

// Export responsive helper for components that need custom sizing
export const getResponsiveFontSize = getResponsiveSize;