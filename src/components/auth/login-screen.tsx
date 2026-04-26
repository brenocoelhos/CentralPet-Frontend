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
  const [showPassword, setShowPassword] = useState(false);
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
        <View style={styles.headerWrapper}>
          <Text style={styles.title}>Bem-vindo de volta</Text>
          <Text style={styles.subtitle}>Entre com seu email e senha</Text>
        </View>

        <Text style={styles.label}>E-mail</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={18} color="#8A816F" />
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
        </View>

        <Text style={styles.label}>Senha</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={18} color="#8A816F" />
          <ThemedTextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#B0A898"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            returnKeyType="done"
          />
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            activeOpacity={0.8}
            style={styles.inputIconButton}
            disabled={loading || googleLoading}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={18}
              color="#8A816F"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleLogin}
          activeOpacity={0.85}
          disabled={loading || googleLoading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <View style={styles.primaryButtonContent}>
              <Ionicons name="log-in-outline" size={18} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Entrar na conta</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.separatorText}>- ou continue com -</Text>

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

        <View style={styles.signupTextRow}>
          <Text style={styles.signupText}>Nao tem uma conta? </Text>
          <TouchableOpacity
            onPress={() => router.push("/cadastro-usuario")}
            activeOpacity={0.8}
            disabled={loading || googleLoading}
          >
            <Text style={styles.signupLink}>Criar conta gratuita</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 36,
    paddingBottom: 48,
  },
  headerWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  subtitle: {
    fontSize: 13,
    color: "#6F6758",
    marginTop: 6,
  },
  label: {
    fontSize: 13,
    color: "#1A1A1A",
    marginBottom: 6,
    marginTop: 2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0DBD0",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: "#1A1A1A",
    borderWidth: 0,
    paddingHorizontal: 10,
    paddingVertical: 13,
    backgroundColor: "#FFFFFF",
  },
  inputIconButton: {
    paddingLeft: 4,
    paddingVertical: 4,
  },
  primaryButton: {
    backgroundColor: "#D97757",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },
  primaryButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginLeft: 8,
  },
  separatorText: {
    marginTop: 14,
    textAlign: "center",
    fontSize: 12,
    color: "#7D7568",
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
  signupTextRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  signupText: {
    fontSize: 12,
    color: "#7D7568",
  },
  signupLink: {
    fontSize: 12,
    color: "#D97757",
    fontWeight: "700",
  },
});
