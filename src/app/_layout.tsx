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
import { Text, TextInput } from "react-native";

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
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="cadastro-usuario" options={{ headerShown: false }} />
      <Stack.Screen
        name="index"
        options={{ headerBackVisible: false, headerLeft: () => null }}
      />
      <Stack.Screen
        name="dashboard"
        options={{ headerBackVisible: false, headerLeft: () => null }}
      />
      <Stack.Screen name="cadastro-pet" options={{ title: "Cadastrar Animal" }} />
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
