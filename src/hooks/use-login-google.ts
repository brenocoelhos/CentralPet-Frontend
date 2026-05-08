import { useAutenticacao } from "@/context/contexto-autenticacao";
import { api } from "@/services/api";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useMemo, useState } from "react";
import { Alert, Platform } from "react-native";


WebBrowser.maybeCompleteAuthSession();

const googleClientConfig = {
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
};

export function useLoginGoogle(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const { signInWithToken } = useAutenticacao();

  const missingGoogleConfigKeys = useMemo(() => {
    if (Platform.OS === "ios") {
      return googleClientConfig.iosClientId ? [] : ["iosClientId"];
    }
    if (Platform.OS === "android") {
      return googleClientConfig.androidClientId ? [] : ["androidClientId"];
    }
    // web
    return googleClientConfig.webClientId ? [] : ["webClientId"];
  }, []);

  // Fluxo nativo: o SDK calcula automaticamente a redirectUri como
  // com.googleusercontent.apps.{id}:/oauth2callback para iOS/Android.
  // Não é necessário cadastrar nada extra no Google Cloud Console.
  const [request, , promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    scopes: ["openid", "profile", "email"],
  });

  const handleGoogleLogin = async () => {
    if (missingGoogleConfigKeys.length > 0) {
      Alert.alert(
        "Google Login nao configurado",
        `Defina as variaveis ${missingGoogleConfigKeys.join(", ")} para habilitar o Google Sign-In.`,
      );
      return;
    }

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

  return {
    handleGoogleLogin,
    loading,
    missingGoogleConfigKeys,
  };
}
