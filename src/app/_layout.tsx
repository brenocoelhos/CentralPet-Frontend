import { AuthProvider } from "@/context/auth-context";
import {
  Lexend_400Regular,
  Lexend_500Medium,
  Lexend_600SemiBold,
  Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TextInput } from "react-native";

const styles = StyleSheet.create({
  logoBold: {
    fontFamily: "Lexend_700Bold",
    fontSize: 22,
    color: "#1A1A1A",
  },
  logoAccent: {
    fontFamily: "Lexend_700Bold",
    fontSize: 22,
    color: "#D97757",
  },
});

function AppStack() {
  return (
    <Stack
      screenOptions={{
        animation: "none",
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: "Lexend_700Bold",
        },
        contentStyle: { backgroundColor: "#f4f7fb" },
      }}
    >
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen
        name="cadastro-usuario"
        options={{ title: "Cadastro de Usuario" }}
      />
      <Stack.Screen name="index" options={{ title: "Inicio" }} />
      <Stack.Screen
        name="dashboard"
        options={{
          headerTitle: () => (
            <Text>
              <Text style={styles.logoBold}>Central</Text>
              <Text style={styles.logoAccent}>Pet</Text>
            </Text>
          ),
          headerLeft: () => null,
          headerRight: () => null,
        }}
      />
      <Stack.Screen name="busca" options={{ title: "Busca" }} />
      <Stack.Screen name="cadastro-pet" options={{ title: "Cadastro de Pet" }} />
      <Stack.Screen name="perfil" options={{ title: "Perfil" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
  });

  useEffect(() => {
    if (!fontsLoaded) {
      return;
    }

    const TextComponent = Text as unknown as {
      defaultProps?: { style?: unknown };
    };
    const TextInputComponent = TextInput as unknown as {
      defaultProps?: { style?: unknown };
    };

    TextComponent.defaultProps = TextComponent.defaultProps ?? {};
    TextInputComponent.defaultProps = TextInputComponent.defaultProps ?? {};

    TextComponent.defaultProps.style = [
      { fontFamily: "Lexend_400Regular" },
      TextComponent.defaultProps.style,
    ];
    TextInputComponent.defaultProps.style = [
      { fontFamily: "Lexend_400Regular" },
      TextInputComponent.defaultProps.style,
    ];
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AppStack />
    </AuthProvider>
  );
}
