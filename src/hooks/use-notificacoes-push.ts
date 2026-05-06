import type { UsuarioAutenticado } from "@/context/contexto-autenticacao";
import type { criarApi } from "@/services/api";
import Constants, { ExecutionEnvironment } from "expo-constants";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// Configuração de como exibir notificações quando o app está em foreground
if (!isExpoGo) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

type NotificacaoPetData = {
  petId?: string;
  tipo?: "pet_perdido" | "avistamento";
};

async function obterTokenPush(): Promise<string | null> {
  if (Platform.OS === "web" || isExpoGo) return null;

  // NotificationPermissionsStatus extends PermissionResponse, mas expo-modules-core
  // não está hoistado no node_modules raiz — usamos cast seguro para ler `status`.
  type StatusResult = { status: string; canAskAgain: boolean };

  let perm = (await Notifications.getPermissionsAsync()) as unknown as StatusResult;

  if (perm.status !== "granted") {
    perm = (await Notifications.requestPermissionsAsync()) as unknown as StatusResult;
  }

  if (perm.status !== "granted") return null;

  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
}

async function obterLocalizacao(): Promise<{ latitude: number; longitude: number } | null> {
  if (Platform.OS === "web") return null;

  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") return null;

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  };
}

export function useNotificacoesPush(
  user: UsuarioAutenticado | null,
  getApi: () => ReturnType<typeof criarApi>,
) {
  const tokenRegistradoRef = useRef<string | null>(null);

  // Registrar token quando usuário loga
  useEffect(() => {
    if (!user) return;

    let cancelado = false;

    const registrar = async () => {
      const token = await obterTokenPush();
      if (!token || cancelado) return;
      if (tokenRegistradoRef.current === token) return;

      const coords = await obterLocalizacao();

      try {
        await getApi().notificacoes.registrarToken({
          token,
          userId: user.id,
          lat: coords?.latitude,
          lng: coords?.longitude,
          plataforma: Platform.OS === "ios" ? "ios" : "android",
        });
        tokenRegistradoRef.current = token;
      } catch {
        // Silencioso — notificação é funcionalidade não-crítica
      }
    };

    void registrar();

    return () => {
      cancelado = true;
    };
  }, [user, getApi]);

  // Listener: app em foreground recebe notificação
  useEffect(() => {
    if (isExpoGo) return;

    const subscription = Notifications.addNotificationReceivedListener(
      (_notification) => {
        // Notificação já aparece automaticamente pelo setNotificationHandler acima
      },
    );
    return () => subscription.remove();
  }, []);

  // Listener: usuário toca na notificação
  useEffect(() => {
    if (isExpoGo) return;

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as NotificacaoPetData;
        if (data?.petId) {
          router.push(`/detalhe-pet?id=${data.petId}`);
        }
      },
    );
    return () => subscription.remove();
  }, []);

  // Lidar com notificação que abriu o app do estado fechado
  useEffect(() => {
    if (isExpoGo) return;

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!response) return;
      const data = response.notification.request.content.data as NotificacaoPetData;
      if (data?.petId) {
        router.push(`/detalhe-pet?id=${data.petId}`);
      }
    }).catch(() => undefined);
  }, []);
}
