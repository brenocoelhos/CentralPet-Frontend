import { ProvedorAutenticacao } from "@/context/contexto-autenticacao";
import {
    Lexend_400Regular,
    Lexend_500Medium,
    Lexend_600SemiBold,
    Lexend_700Bold,
} from "@expo-google-fonts/lexend";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";

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
  notifBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0EDEA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
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
          headerRight: () => (
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#1a1a1a"
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="busca"
        options={{
          headerTitle: () => (
            <Text>
              <Text style={styles.logoBold}>Busca</Text>
              <Text style={styles.logoAccent}>Pet</Text>
            </Text>
          ),
        }}
      />

      <Stack.Screen
        name="cadastro-pet"
        options={{
          headerTitle: () => (
            <Text>
              <Text style={styles.logoBold}>Cadastro</Text>
              <Text style={styles.logoAccent}>Pet</Text>
            </Text>
          ),
          headerBackVisible: true,
          headerRight: () => null,
        }}
      />

      <Stack.Screen
        name="pet-detail"
        options={{
          title: "Detalhes",
        }}
      />

      <Stack.Screen
        name="perfil"
        options={({ navigation }) => ({
          title: "Perfil",
          headerTitleStyle: {
            fontFamily: "Lexend_700Bold",
            fontSize: 22,
            color: "#1A1A1A",
          },
          headerRight: () => (
            <TouchableOpacity
              style={styles.notifBtn}
              onPress={() => navigation.navigate("configuracoes")}
            >
              <Ionicons name="settings-outline" size={22} color="#1a1a1a" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="meus-registros"
        options={{ title: "Meus registros" }}
      />
      <Stack.Screen
        name="configuracoes"
        options={{ title: "Configuracoes" }}
      />
      <Stack.Screen
        name="contatos-emergencia"
        options={{ title: "Contatos de emergencia" }}
      />
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
    <ProvedorAutenticacao>
      <AppStack />
    </ProvedorAutenticacao>
  );
}
