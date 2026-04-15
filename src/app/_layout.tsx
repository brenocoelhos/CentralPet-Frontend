import { AuthProvider, useAuth } from "@/context/auth-context";
import {
  Stack,
  useRootNavigationState,
  useRouter,
  useSegments,
} from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const publicRoutes = new Set(["login", "cadastro-usuario"]);

function AppStack() {
  const { user, initializing } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (!navigationState?.key || initializing) {
      return;
    }

    const currentRoute = segments[0];
    const isPublicRoute = !currentRoute || publicRoutes.has(currentRoute);

    if (user && (!currentRoute || isPublicRoute)) {
      router.replace("/dashboard");
      return;
    }

    if (!user && !isPublicRoute) {
      router.replace("/login");
    }
  }, [initializing, navigationState?.key, router, segments, user]);

  if (!navigationState?.key || initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0f6fd7" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: "#f4f7fb" },
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppStack />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f7fb",
  },
});
