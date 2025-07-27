import { Stack } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useAuth } from '@/hooks/auth-store';

export default function SettingsLayout() {
  const { userType } = useAuth();
  
  // Determine header colors based on user type
  const headerBackgroundColor = userType === 'customer' ? COLORS.modernGreen : COLORS.primary;
  const headerTitleColor = COLORS.white;

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: headerBackgroundColor,
        },
        headerTintColor: headerTitleColor,
        headerTitleStyle: {
          fontWeight: '600',
          color: headerTitleColor,
        },
        headerShadowVisible: true,
      }}
    >
      <Stack.Screen name="notifications" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="help" />
    </Stack>
  );
}