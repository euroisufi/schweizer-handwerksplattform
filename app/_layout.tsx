import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Platform } from "react-native";
import { AuthContext, useAuth } from "@/hooks/auth-store";
import { ProjectsContext } from "@/hooks/projects-store";
import { CreditsContext } from "@/hooks/credits-store";
import { COLORS } from "@/constants/colors";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isLoggedIn, isLoading, userType } = useAuth();

  if (isLoading) {
    return null; // Show nothing while loading
  }

  // If user is not logged in, go to login
  // Otherwise go to tabs
  let initialRoute = "login";
  if (isLoggedIn) {
    initialRoute = "(tabs)";
  }

  // Determine header colors based on user type
  const headerBackgroundColor = userType === 'customer' ? COLORS.modernGreen : COLORS.primary;
  const headerTitleColor = COLORS.white;

  return (
    <Stack 
      screenOptions={{ 
        headerBackTitle: "Zurück",
        headerStyle: {
          backgroundColor: headerBackgroundColor,
        },
        headerTitleStyle: {
          color: headerTitleColor,
          fontWeight: '600',
          fontSize: 18,
        },
        headerTintColor: headerTitleColor,
        animation: Platform.OS === 'web' ? 'fade' : 'slide_from_right',
        animationDuration: 200,
      }}
      initialRouteName={initialRoute}
    >

      <Stack.Screen name="login" options={{ title: "Anmelden", headerShown: false }} />
      <Stack.Screen name="register" options={{ title: "Registrieren" }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="projects/[id]" options={{ title: "Projekt" }} />
      <Stack.Screen name="businesses/[id]" options={{ title: "Unternehmen" }} />
      <Stack.Screen name="projects/edit/[id]" options={{ title: "Projekt bearbeiten" }} />
      <Stack.Screen name="customers/[id]" options={{ title: "Kunde" }} />
      <Stack.Screen name="about" options={{ title: "Über uns" }} />
      <Stack.Screen name="profile/edit" options={{ title: "Profil bearbeiten" }} />
      <Stack.Screen name="profile/business-profile" options={{ title: "Unternehmensprofil" }} />
      <Stack.Screen name="profile/gallery" options={{ title: "Galerie" }} />
      <Stack.Screen name="profile/reviews" options={{ title: "Bewertungen" }} />
      <Stack.Screen name="profile/services" options={{ title: "Dienstleistungen" }} />
      <Stack.Screen name="profile/my-projects" options={{ title: "Meine Projekte" }} />
      <Stack.Screen name="profile/completed-projects" options={{ title: "Abgeschlossene Projekte" }} />
      <Stack.Screen name="profile/unlocked-contacts" options={{ title: "Freigeschaltete Kontakte" }} />
      <Stack.Screen name="settings/notifications" options={{ title: "Benachrichtigungen" }} />
      <Stack.Screen name="settings/privacy" options={{ title: "Datenschutz" }} />
      <Stack.Screen name="settings/help" options={{ title: "Hilfe" }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AuthContext>
            <ProjectsContext>
              <CreditsContext>
                <RootLayoutNav />
              </CreditsContext>
            </ProjectsContext>
          </AuthContext>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}