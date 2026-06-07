import { useAutenticacao } from "@/context/contexto-autenticacao";
import { api } from "@/services/api";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useMemo, useState } from "react";
import { Alert, Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

const HAS_CONFIG = !!(IOS_CLIENT_ID || ANDROID_CLIENT_ID || WEB_CLIENT_ID);

// Hook interno usado apenas quando há config disponível
function useGoogleAuthWithConfig(onSuccess?: () => void) {
  const { signInWithToken } = useAutenticacao();
  const [loading, setLoading] = useState(false);

  const [request, , promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
    androidClientId: ANDROID_CLIENT_ID,
    webClientId: WEB_CLIENT_ID,
    scopes: ["openid", "profile", "email"],
  });

  const handleGoogleLogin = async () => {
    if (!request) {
      Alert.alert(
        "Google Login indisponivel",
        "Nao foi possivel iniciar a requisicao de autenticacao do Google.",
      );
      return;
    }

    try {
      setLoading(true);
      const result = await promptAsync();

      if (result.type !== "success") {
        const oauthError = "params" in result ? result.params?.error : null;
        const requestRedirectUri = request.url
          ? new URL(request.url).searchParams.get("redirect_uri")
          : null;

        if (oauthError) {
          Alert.alert(
            "Google OAuth",
            `Erro: ${oauthError}${requestRedirectUri ? `\nredirect_uri usado: ${requestRedirectUri}` : ""}`,
          );
        }
        return;
      }

      const idToken = result.params.id_token;

      if (!idToken) {
        Alert.alert("Falha no login", "Token do Google nao recebido.");
        return;
      }

      const response = await api.auth.google({ idToken });
      const token = typeof response === "string" ? response : response.token;

      if (!token) {
        Alert.alert("Falha no login", "Token JWT nao recebido do backend.");
        return;
      }

      await signInWithToken(token);
      onSuccess?.();
    } catch {
      Alert.alert("Falha no login", "Nao foi possivel entrar com Google.");
    } finally {
      setLoading(false);
    }
  };

  return { handleGoogleLogin, loading };
}

// Hook stub usado quando não há config — nunca chama useAuthRequest
function useGoogleAuthStub() {
  const missingKey =
    Platform.OS === "ios"
      ? "EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID"
      : Platform.OS === "android"
        ? "EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID"
        : "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID";

  const handleGoogleLogin = () => {
    Alert.alert(
      "Google Login nao configurado",
      `Defina a variavel ${missingKey} no arquivo .env para habilitar o Google Sign-In.`,
    );
  };

  return { handleGoogleLogin, loading: false };
}

// Hook público — escolhe qual implementação usar em tempo de módulo (não em render)
const useGoogleAuthImpl = HAS_CONFIG
  ? useGoogleAuthWithConfig
  : useGoogleAuthStub;

export function useLoginGoogle(onSuccess?: () => void) {
  const { handleGoogleLogin, loading } = useGoogleAuthImpl(onSuccess);

  const missingGoogleConfigKeys = useMemo(() => {
    if (Platform.OS === "ios") return IOS_CLIENT_ID ? [] : ["iosClientId"];
    if (Platform.OS === "android")
      return ANDROID_CLIENT_ID ? [] : ["androidClientId"];
    return WEB_CLIENT_ID ? [] : ["webClientId"];
  }, []);

  return {
    handleGoogleLogin,
    loading,
    missingGoogleConfigKeys,
  };
}
