import { Tabs, useRouter } from "expo-router";
import { Home, Plus, User, Crown, Settings, Hammer, Users, CreditCard, FolderOpen } from "lucide-react-native";
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import { useAuth } from "@/hooks/auth-store";

export default function TabLayout() {
  const { userType, isLoggedIn } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleCreateProjectPress = () => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      router.push('/create-project');
    }
  };
  
  // If user is not logged in, show limited tabs
  if (!isLoggedIn) {
    return (
      <Tabs
        initialRouteName="businesses"
        screenOptions={{
          tabBarActiveTintColor: COLORS.secondary,
          tabBarInactiveTintColor: COLORS.gray[500],
          tabBarStyle: styles.tabBar,
          headerStyle: [styles.guestHeader, { paddingTop: insets.top }],
          headerTitleStyle: styles.guestHeaderTitle,
          tabBarLabelStyle: styles.tabBarLabel,

        }}
      >
        <Tabs.Screen
          name="businesses"
          options={{
            title: "Alle Handwerker",
            tabBarIcon: ({ color }) => <Home size={24} color={color} />,
            headerRight: () => <Users size={20} color={COLORS.white} style={{ marginRight: 16 }} />,
          }}
        />
        <Tabs.Screen
          name="create-project"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <View style={styles.guestPlusButtonContainer}>
                <TouchableOpacity 
                  style={[styles.createButton, { backgroundColor: COLORS.secondary }]}
                  onPress={handleCreateProjectPress}
                  activeOpacity={0.7}
                >
                  <Plus size={24} color={COLORS.white} />
                </TouchableOpacity>
                <Text style={styles.guestPlusButtonLabel} numberOfLines={1}>Projekt erstellen</Text>
              </View>
            ),
            tabBarActiveTintColor: 'transparent',
            tabBarLabelStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="aktuelle-projekte"
          options={{
            title: "Aktuelle Projekte",
            tabBarIcon: ({ color }) => <FolderOpen size={24} color={color} />,
            headerRight: () => <FolderOpen size={20} color={COLORS.white} style={{ marginRight: 16 }} />,
          }}
        />
        {/* Hide all other tabs for non-logged in users */}
        <Tabs.Screen
          name="index"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="projects"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="credits"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="premium"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: null,
          }}
        />
      </Tabs>
    );
  }
  
  // Render different tab layouts based on user type
  if (userType === 'customer') {
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.secondary,
          tabBarInactiveTintColor: COLORS.gray[500],
          tabBarStyle: styles.customerTabBar,
          headerStyle: [styles.customerHeader, { paddingTop: insets.top }],
          headerTitleStyle: styles.customerHeaderTitle,
          tabBarLabelStyle: styles.customerTabBarLabel,

        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <Home size={24} color={color} />,
            headerRight: () => <Home size={20} color={COLORS.white} style={{ marginRight: 16 }} />,
          }}
        />
        <Tabs.Screen
          name="projects"
          options={{
            title: "Meine Projekte",
            tabBarIcon: ({ color }) => <Hammer size={24} color={color} />,
            headerRight: () => <Hammer size={20} color={COLORS.white} style={{ marginRight: 16 }} />,
          }}
        />
        <Tabs.Screen
          name="create-project"
          options={{
            title: "",
            tabBarIcon: ({ color }) => (
              <View style={styles.customerPlusButtonContainer}>
                <View style={[styles.createButton, { backgroundColor: COLORS.secondary }]}>
                  <Plus size={24} color={COLORS.white} />
                </View>
                <Text style={styles.customerPlusButtonLabel} numberOfLines={1}>Projekt erstellen</Text>
              </View>
            ),
            tabBarActiveTintColor: 'transparent',
            tabBarLabelStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Kontoeinstellungen",
            tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
            headerRight: () => <Settings size={20} color={COLORS.white} style={{ marginRight: 16 }} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profil",
            tabBarIcon: ({ color }) => <User size={24} color={color} />,
            headerRight: () => <User size={20} color={COLORS.white} style={{ marginRight: 16 }} />,
          }}
        />
        <Tabs.Screen
          name="credits"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="businesses"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="premium"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="aktuelle-projekte"
          options={{
            href: null,
          }}
        />
      </Tabs>
    );
  }
  
  // Business user tabs
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray[500],
        tabBarStyle: styles.tabBar,
        headerStyle: [styles.businessHeader, { paddingTop: insets.top }],
        headerTitleStyle: styles.businessHeaderTitle,
        tabBarLabelStyle: styles.tabBarLabel,

      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
          headerRight: () => <Home size={20} color={COLORS.white} style={{ marginRight: 16 }} />,
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: "Projekte",
          tabBarIcon: ({ color }) => <Hammer size={24} color={color} />,
          headerRight: () => <Hammer size={20} color={COLORS.white} style={{ marginRight: 16 }} />,
        }}
      />
      <Tabs.Screen
        name="credits"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <View style={styles.plusButtonContainer}>
              <View style={[styles.createButton, { backgroundColor: COLORS.primary }]}>
                <Plus size={24} color={COLORS.white} />
              </View>
              <Text style={styles.plusButtonLabel}>Credits kaufen</Text>
            </View>
          ),
          tabBarActiveTintColor: 'transparent',
          tabBarLabelStyle: { display: 'none' },
          headerRight: () => <CreditCard size={20} color={COLORS.white} style={{ marginRight: 16 }} />,
        }}
      />
      <Tabs.Screen
        name="premium"
        options={{
          title: "Premium werden",
          tabBarIcon: ({ color }) => <Crown size={24} color={color} />,
          headerRight: () => <Crown size={20} color={COLORS.white} style={{ marginRight: 16 }} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
          headerRight: () => <User size={20} color={COLORS.white} style={{ marginRight: 16 }} />,
        }}
      />
      <Tabs.Screen
        name="businesses"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="create-project"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="aktuelle-projekte"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopColor: 'transparent',
    height: 80,
    paddingBottom: 8,
    paddingTop: 8,
    paddingHorizontal: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    paddingLeft: 0,
    paddingRight: 16,
  },
  headerTitle: {
    color: COLORS.text,
    fontWeight: '600' as const,
    fontSize: 18,
  },
  guestHeader: {
    backgroundColor: COLORS.secondary,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    paddingLeft: 0,
    paddingRight: 16,
  },
  guestHeaderTitle: {
    color: COLORS.white,
    fontWeight: '600' as const,
    fontSize: 18,
  },
  businessHeader: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    paddingLeft: 0,
    paddingRight: 16,
  },
  businessHeaderTitle: {
    color: COLORS.white,
    fontWeight: '600' as const,
    fontSize: 18,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  createButton: {
    backgroundColor: '#007AFF', // Default color, will be overridden inline
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  plusButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusButtonLabel: {
    fontSize: 10,
    fontWeight: '500' as const,
    color: COLORS.primary,
    marginTop: 4,
    textAlign: 'center',
  },
  customerTabBar: {
    backgroundColor: COLORS.white,
    borderTopColor: 'transparent',
    height: 80,
    paddingBottom: 8,
    paddingTop: 8,
    paddingHorizontal: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  customerHeader: {
    backgroundColor: COLORS.secondary,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    paddingLeft: 0,
    paddingRight: 16,
  },
  customerHeaderTitle: {
    color: COLORS.white,
    fontWeight: '600' as const,
    fontSize: 18,
  },
  customerTabBarLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  customerPlusButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerPlusButtonLabel: {
    fontSize: 9,
    fontWeight: '500' as const,
    color: COLORS.secondary,
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 60,
  },
  guestPlusButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestPlusButtonLabel: {
    fontSize: 9,
    fontWeight: '500' as const,
    color: COLORS.secondary,
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 60,
  },
});