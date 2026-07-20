import { useAutenticacao } from "@/context/contexto-autenticacao";
import { api } from "@/services/api";
import { exibirAlertaErroApi } from "@/utils/alerta-erro-api";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { TextoTema as Text } from "../texto-tema";
import CampoEntrada from "./campo-entrada";
import CampoSenha from "./campo-senha";

export default function TelaLogin() {
  const router = useRouter();
  const { signInWithToken } = useAutenticacao();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
      router.replace("/home");
    } catch (error) {
      exibirAlertaErroApi(
        "Falha no login",
        error,
        "Nao foi possivel realizar o login.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require("../../../assets/images/logo.png")}
            style={{
              width: 150,
              height: 150,
              alignSelf: "center",
              marginBottom: 16,
            }}
          />
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
            disabled={loading}
          />

          <TouchableOpacity
            onPress={() => router.push("/esqueci-senha")}
            activeOpacity={0.8}
            disabled={loading}
            style={styles.forgotPasswordButton}
          >
            <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
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

          <View style={styles.signupTextRow}>
            <Text style={styles.signupText}>Nao tem uma conta? </Text>
            <TouchableOpacity
              onPress={() => router.push("/cadastro-usuario")}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={styles.signupLink}>Criar conta gratuita</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 48,
    justifyContent: "center",
  },
  headerWrapper: {
    alignItems: "center",
    marginBottom: 18,
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
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginTop: 4,
    marginBottom: 8,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: "#D97757",
    fontWeight: "700",
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
