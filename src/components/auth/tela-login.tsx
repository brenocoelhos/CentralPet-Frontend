import { useAutenticacao } from "@/context/contexto-autenticacao";
import { useLoginGoogle } from "@/hooks/use-login-google";
import { api } from "@/services/api";
import { exibirAlertaErroApi } from "@/utils/alerta-erro-api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextoTema as Text } from "../texto-tema";
import CampoEntrada from "./campo-entrada";
import CampoSenha from "./campo-senha";

export default function TelaLogin() {
  const router = useRouter();
  const { signInWithToken } = useAutenticacao();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleGoogleLogin, loading: googleLoading } = useLoginGoogle(() => router.replace("/painel"));

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Campos obrigatorios", "Preencha email e senha.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.auth.login({
        email: email.trim(),
        senha: password,
      });

      const token = typeof response === "string" ? response : response.token;

      if (!token) {
        throw new Error("Token nao retornado pelo backend");
      }

      await signInWithToken(token, response);
      router.replace("/painel");
    } catch (error) {
      exibirAlertaErroApi("Falha no login", error, "Nao foi possivel realizar o login.");
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

        <CampoEntrada
          label="E-mail"
          leftIconName="mail-outline"
          placeholder="exemplo@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          returnKeyType="next"
        />

        <CampoSenha
          label="Senha"
          leftIconName="lock-closed-outline"
          value={password}
          onChangeText={setPassword}
          returnKeyType="done"
          disabled={loading || googleLoading}
        />

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
    justifyContent: "center",
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
