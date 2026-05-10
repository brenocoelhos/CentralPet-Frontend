import CampoEntrada from "@/components/auth/campo-entrada";
import { TextoTema as Text } from "@/components/texto-tema";
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

export default function TelaEsqueciSenha() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnviar = async () => {
    if (!email.trim()) {
      Alert.alert("Campo obrigatório", "Informe seu email.");
      return;
    }

    try {
      setLoading(true);

      await api.auth.esqueciSenha({
        email: email.trim(),
      });

      Alert.alert(
        "Verifique seu email",
        "Se o email estiver cadastrado, enviaremos um link para redefinir sua senha.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ],
      );
    } catch (error) {
      exibirAlertaErroApi(
        "Erro",
        error,
        "Não foi possível solicitar a recuperação de senha.",
      );
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
        <View style={styles.iconCircle}>
          <Ionicons name="mail-outline" size={34} color="#D97757" />
        </View>

        <View style={styles.headerWrapper}>
          <Text style={styles.title}>Recuperar senha</Text>
          <Text style={styles.subtitle}>
            Digite seu email para receber o link de recuperação.
          </Text>
        </View>

        <CampoEntrada
          label="E-mail"
          leftIconName="mail-outline"
          placeholder="exemplo@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          returnKeyType="done"
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleEnviar}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <View style={styles.primaryButtonContent}>
              <Ionicons name="send-outline" size={18} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>Enviar link</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/login")}
          activeOpacity={0.8}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>Voltar para o login</Text>
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
    paddingBottom: 48,
    justifyContent: "center",
  },
  iconCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#FFF1EB",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 18,
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
    textAlign: "center",
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
  backButton: {
    alignItems: "center",
    marginTop: 16,
  },
  backButtonText: {
    fontSize: 13,
    color: "#D97757",
    fontWeight: "700",
  },
});
