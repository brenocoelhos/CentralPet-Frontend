import type { UsuarioAutenticado } from "@/context/contexto-autenticacao";
import type { criarApi } from "@/services/api";
import { adicionarNotificacao } from "@/services/notificacoes/armazenamento-notificacoes";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type NotificacaoPetData = {
  petId?: string;
  tipo?: "pet_perdido" | "avistamento";
};

function abrirDetalhePetPorId(petId?: string) {
  if (!petId) {
    return;
  }

  router.push(`/detalhe-pet?id=${encodeURIComponent(petId)}`);
}

async function obterTokenPushNativo(): Promise<string | null> {
  if (!Device.isDevice) {
    // Emuladores/simuladores não recebem push de verdade.
    return null;
  }

  const permissoesAtuais = await Notifications.getPermissionsAsync();
  let status = permissoesAtuais.status;

  if (status !== "granted") {
    const solicitadas = await Notifications.requestPermissionsAsync();
    status = solicitadas.status;
  }

  if (status !== "granted") {
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  try {
    // Token nativo (FCM no Android / APNs no iOS) — é o que o backend
    // precisa para enviar push via Firebase Admin, diferente do token
    // intermediário do serviço de push da Expo.
    const tokenResponse = await Notifications.getDevicePushTokenAsync();
    return typeof tokenResponse.data === "string" ? tokenResponse.data : null;
  } catch {
    return null;
  }
}

export function useNotificacoesPush(
  user: UsuarioAutenticado | null,
  getApi: () => ReturnType<typeof criarApi>,
) {
  const tokenRegistradoRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      tokenRegistradoRef.current = null;
      return;
    }

    let cancelado = false;

    const registrar = async () => {
      const token = await obterTokenPushNativo();
      if (!token || cancelado) {
        return;
      }

      const cacheKey = `${user.id}:${token}`;
      if (tokenRegistradoRef.current === cacheKey) {
        return;
      }

      try {
        await getApi().notificacoes.registrarToken({
          token,
          userId: user.id,
          plataforma: Platform.OS === "ios" ? "ios" : "android",
        });
        tokenRegistradoRef.current = cacheKey;
      } catch {
        // Silencioso — a inscrição em push não é crítica para o fluxo principal.
      }
    };

    void registrar();

    return () => {
      cancelado = true;
    };
  }, [getApi, user]);

  useEffect(() => {
    const subscricaoRecebida = Notifications.addNotificationReceivedListener(
      (notificacao) => {
        const data = (notificacao.request.content.data ?? {}) as NotificacaoPetData;

        void adicionarNotificacao({
          titulo: notificacao.request.content.title ?? "CentralPet",
          corpo: notificacao.request.content.body ?? undefined,
          petId: data.petId,
          tipo: data.tipo ?? (data.petId ? "pet_perdido" : "outro"),
        });
      },
    );

    const subscricaoResposta =
      Notifications.addNotificationResponseReceivedListener((resposta) => {
        const data = (resposta.notification.request.content.data ??
          {}) as NotificacaoPetData;
        abrirDetalhePetPorId(data.petId);
      });

    return () => {
      subscricaoRecebida.remove();
      subscricaoResposta.remove();
    };
  }, []);
}
