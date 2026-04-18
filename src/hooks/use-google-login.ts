import { auth } from "@/lib/firebase";
import { makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
    GoogleAuthProvider,
    signInWithCredential,
    signInWithPopup,
} from "firebase/auth";
import { useMemo, useState } from "react";
import { Alert, Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

const googleClientConfig = {
  expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
  androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
};

function getRedirectUri() {
  return makeRedirectUri({
    scheme: "centralpetfrontend",
    path: "auth",
  });
}

export function useGoogleLogin() {
  const [loading, setLoading] = useState(false);
  const redirectUri = getRedirectUri();

  const missingGoogleConfigKeys = useMemo(() => {
    if (Platform.OS === "web") {
      return [];
    }

    const requiredKeys = ["webClientId"] as const;

    if (Platform.OS === "android") {
      const hasAndroidConfig =
        Boolean(googleClientConfig.androidClientId) ||
        Boolean(googleClientConfig.expoClientId);

      if (!hasAndroidConfig) {
        return ["androidClientId (ou expoClientId)", ...requiredKeys];
      }
    }

    if (Platform.OS === "ios") {
      const hasIosConfig =
        Boolean(googleClientConfig.iosClientId) ||
        Boolean(googleClientConfig.expoClientId);

      if (!hasIosConfig) {
        return ["iosClientId (ou expoClientId)", ...requiredKeys];
      }
    }

    return requiredKeys.filter((key) => !googleClientConfig[key]);
  }, []);

  const [request, , promptAsync] = Google.useAuthRequest({
    ...googleClientConfig,
    redirectUri,
  });

  const handleGoogleLogin = async () => {
    if (!auth) {
      Alert.alert(
        "Firebase nao configurado",
        "Preencha as variaveis EXPO_PUBLIC_FIREBASE_* antes de usar login Google.",
      );
      return;
    }

    if (missingGoogleConfigKeys.length > 0) {
      Alert.alert(
        "Google Login nao configurado",
        `Defina as variaveis ${missingGoogleConfigKeys.join(", ")} para habilitar o Google Sign-In.`,
      );
      return;
    }

    if (
      Platform.OS === "web" &&
      googleClientConfig.webClientId &&
      googleClientConfig.iosClientId &&
      googleClientConfig.webClientId === googleClientConfig.iosClientId
    ) {
      Alert.alert(
        "Google Login invalido na web",
        "O webClientId esta igual ao iOS Client ID. Crie um OAuth Client do tipo Web e use no EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.",
      );
      return;
    }

    if (Platform.OS === "web") {
      try {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } catch {
        Alert.alert(
          "Falha no login",
          "Nao foi possivel entrar com Google no navegador.",
        );
      } finally {
        setLoading(false);
      }

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

      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
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
