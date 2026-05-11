import CampoSenha from "@/components/auth/campo-senha";
import { TextoTema as Text } from "@/components/texto-tema";
import { api } from "@/services/api";
import { exibirAlertaErroApi } from "@/utils/alerta-erro-api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function TelaRedefinirSenha() {
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string }>();

  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRedefinir = async () => {
    if (!token) {
      Alert.alert("Link inválido", "Token de recuperação não encontrado.");
      return;
    }

    if (!novaSenha || !confirmarSenha) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha a nova senha e a confirmação.",
      );
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert(
        "Senha inválida",
        "A senha deve ter pelo menos 6 caracteres.",
      );
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert(
        "Senhas diferentes",
        "A confirmação precisa ser igual à nova senha.",
      );
      return;
    }

    try {
      setLoading(true);

      await api.auth.redefinirSenha({
        token,
        novaSenha,
      });

      router.replace("/login");
    } catch (error) {
      exibirAlertaErroApi(
        "Erro",
        error,
        "Não foi possível redefinir sua senha. O link pode estar expirado.",
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
          <Ionicons name="lock-closed-outline" size={34} color="#D97757" />
        </View>

        <View style={styles.headerWrapper}>
          <Text style={styles.title}>Nova senha</Text>
          <Text style={styles.subtitle}>
            Crie uma nova senha para acessar sua conta.
          </Text>
        </View>

        <CampoSenha
          label="Nova senha"
          leftIconName="lock-closed-outline"
          value={novaSenha}
          onChangeText={setNovaSenha}
          returnKeyType="next"
          disabled={loading}
        />

        <CampoSenha
          label="Confirmar nova senha"
          leftIconName="lock-closed-outline"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          returnKeyType="done"
          disabled={loading}
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleRedefinir}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <View style={styles.primaryButtonContent}>
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#FFFFFF"
              />
              <Text style={styles.primaryButtonText}>Redefinir senha</Text>
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
