import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Campos obrigatorios", "Preencha email e senha.");
      return;
    }

    router.replace("/dashboard");
  };

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.card}>
        <Text style={styles.title}>CentralPet</Text>
        <Text style={styles.subtitle}>Login</Text>

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        <Pressable style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Entrar</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/cadastro-usuario")}>
          <Text style={styles.linkText}>Criar conta de usuario</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f7fb",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: "#d9e1ec",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    color: "#1a2533",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#4d6075",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cad6e5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fbfdff",
  },
  primaryButton: {
    backgroundColor: "#0f6fd7",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  linkText: {
    textAlign: "center",
    marginTop: 8,
    color: "#0f6fd7",
    fontWeight: "600",
  },
});
