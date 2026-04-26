import { useAuth } from "@/context/auth-context";
import { useGoogleLogin } from "@/hooks/use-google-login";
import { auth } from "@/lib/firebase";
import { getFirebaseAuthErrorMessage } from "@/utils/firebase-auth-errors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { ThemedText as Text } from "../themed-text";
import { ThemedTextInput } from "../themed-text-input";

export default function LoginScreen() {
  const router = useRouter();
  const { hasFirebaseConfig, missingConfigKeys } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleGoogleLogin, loading: googleLoading } = useGoogleLogin();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Campos obrigatorios", "Preencha email e senha.");
      return;
    }

    if (!hasFirebaseConfig || !auth) {
      Alert.alert(
        "Firebase nao configurado",
        `Defina as variaveis ${missingConfigKeys.join(", ")} para habilitar o login.`,
      );
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/dashboard");
    } catch (error) {
      Alert.alert("Falha no login", getFirebaseAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={95}
      >
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Ionicons name="paw-outline" size={30} color="rgba(0,0,0,0.5)" />
          </View>
          <Text style={styles.avatarLabel}>Bem-vindo de volta</Text>
        </View>

        <Text style={styles.label}>E-mail</Text>
        <ThemedTextInput
          style={styles.input}
          placeholder="exemplo@gmail.com"
          placeholderTextColor="#B0A898"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          returnKeyType="next"
        />

        <Text style={styles.label}>Senha</Text>
        <ThemedTextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#B0A898"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          returnKeyType="done"
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.primaryButton, styles.splitButton]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading || googleLoading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>Entrar na conta</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, styles.splitButton, styles.splitButtonRight]}
            onPress={() => router.push("/cadastro-usuario")}
            activeOpacity={0.85}
            disabled={loading || googleLoading}
          >
            <Text style={styles.secondaryButtonText}>Criar conta</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          activeOpacity={0.85}
          disabled={loading || googleLoading}
        >
          {googleLoading ? (
            <ActivityIndicator color="#D97757" />
          ) : (
            <View style={styles.googleButtonContent}>
              <Ionicons name="logo-google" size={18} color="#D97757" />
              <Text style={styles.googleButtonText}>Google</Text>
            </View>
          )}
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 48,
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0EBE0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  avatarLabel: {
    fontSize: 13,
    color: "#1A1A1A",
  },
  label: {
    fontSize: 13,
    color: "#1A1A1A",
    marginBottom: 6,
    marginTop: 2,
  },
  input: {
    fontSize: 13,
    color: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#E0DBD0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#D97757",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  splitButton: {
    flex: 1,
    marginTop: 0,
  },
  splitButtonRight: {
    marginLeft: 10,
  },
  primaryButtonText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D97757",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  googleButtonText: {
    fontSize: 15,
    color: "#D97757",
    fontWeight: "bold",
    marginLeft: 8,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#D97757",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  secondaryButtonText: {
    fontSize: 15,
    color: "#D97757",
    fontWeight: "bold",
  },
});
