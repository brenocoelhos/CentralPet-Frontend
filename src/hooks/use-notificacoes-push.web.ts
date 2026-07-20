import type { UsuarioAutenticado } from "@/context/contexto-autenticacao";
import {
    firebaseConfig,
    firebaseMessagingVapidKey,
    hasFirebaseMessagingConfig,
} from "@/lib/configuracao-firebase";
import type { criarApi } from "@/services/api";
import { adicionarNotificacao } from "@/services/notificacoes/armazenamento-notificacoes";
import { router } from "expo-router";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
    getMessaging,
    getToken,
    isSupported,
    onMessage,
    type Messaging,
} from "firebase/messaging";
import { useEffect, useRef } from "react";

const SERVICE_WORKER_PATH = "/firebase-messaging-sw.js";
const CONFIG_MESSAGE_TYPE = "centralpet:fcm-config";
const CONFIG_ACK_TYPE = "centralpet:fcm-config-ack";
const OPEN_PET_MESSAGE_TYPE = "centralpet:open-pet";
const RECEIVED_MESSAGE_TYPE = "centralpet:notification-received";

type NotificacaoPetData = {
  petId?: string;
  tipo?: "pet_perdido" | "avistamento";
};

let messagingInstancePromise: Promise<Messaging | null> | null = null;

function getFirebaseApp() {
  if (getApps().length) {
    return getApp();
  }

  return initializeApp(firebaseConfig);
}

async function getMessagingInstance(): Promise<Messaging | null> {
  if (!hasFirebaseMessagingConfig || typeof window === "undefined") {
    return null;
  }

  if (!messagingInstancePromise) {
    messagingInstancePromise = (async () => {
      const supported = await isSupported().catch(() => false);
      if (!supported) {
        return null;
      }

      return getMessaging(getFirebaseApp());
    })();
  }

  return messagingInstancePromise;
}

async function ensureServiceWorkerRegistration() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  const registration =
    (await navigator.serviceWorker.getRegistration("/")) ??
    (await navigator.serviceWorker.register(SERVICE_WORKER_PATH, {
      scope: "/",
    }));

  await navigator.serviceWorker.ready;
  return registration;
}

async function sincronizarConfiguracaoFirebase(
  registration: ServiceWorkerRegistration,
) {
  if (!registration.active) {
    return;
  }

  await new Promise<void>((resolve) => {
    const requestId =
      globalThis.crypto?.randomUUID?.() ??
      `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const cleanup = () => {
      clearTimeout(timeout);
      navigator.serviceWorker.removeEventListener("message", onMessageEvent);
    };

    const timeout = setTimeout(() => {
      cleanup();
      resolve();
    }, 2000);

    const onMessageEvent = (event: MessageEvent) => {
      const data = event.data as
        | { type?: string; requestId?: string }
        | undefined;

      if (data?.type !== CONFIG_ACK_TYPE || data.requestId !== requestId) {
        return;
      }

      cleanup();
      resolve();
    };

    navigator.serviceWorker.addEventListener("message", onMessageEvent);
    registration.active?.postMessage({
      type: CONFIG_MESSAGE_TYPE,
      requestId,
      config: firebaseConfig,
    });
  });
}

async function obterTokenPush(): Promise<string | null> {
  if (!hasFirebaseMessagingConfig || typeof window === "undefined") {
    return null;
  }

  if (typeof Notification === "undefined") {
    return null;
  }

  if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return null;
    }
  } else if (Notification.permission !== "granted") {
    return null;
  }

  const [messaging, registration] = await Promise.all([
    getMessagingInstance(),
    ensureServiceWorkerRegistration(),
  ]);

  if (!messaging || !registration || !firebaseMessagingVapidKey) {
    return null;
  }

  await sincronizarConfiguracaoFirebase(registration);

  return getToken(messaging, {
    vapidKey: firebaseMessagingVapidKey,
    serviceWorkerRegistration: registration,
  });
}

async function obterLocalizacao(): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  return null;
}

function abrirDetalhePetPorId(petId?: string) {
  if (!petId) {
    return;
  }

  router.push(`/detalhe-pet?id=${encodeURIComponent(petId)}`);
}

export function useNotificacoesPush(
  user: UsuarioAutenticado | null,
  getApi: () => ReturnType<typeof criarApi>,
) {
  const tokenRegistradoRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const onServiceWorkerMessage = (event: MessageEvent) => {
      const data = event.data as
        | {
            type?: string;
            petId?: string;
            title?: string;
            body?: string;
          }
        | undefined;

      if (data?.type === OPEN_PET_MESSAGE_TYPE) {
        abrirDetalhePetPorId(data.petId);
        return;
      }

      if (data?.type === RECEIVED_MESSAGE_TYPE) {
        void adicionarNotificacao({
          titulo: data.title ?? "CentralPet",
          corpo: data.body,
          petId: data.petId,
          tipo: data.petId ? "pet_perdido" : "outro",
        });
      }
    };

    navigator.serviceWorker.addEventListener("message", onServiceWorkerMessage);

    return () => {
      navigator.serviceWorker.removeEventListener(
        "message",
        onServiceWorkerMessage,
      );
    };
  }, []);

  useEffect(() => {
    if (!user) {
      tokenRegistradoRef.current = null;
      return;
    }

    let cancelado = false;

    const registrar = async () => {
      const token = await obterTokenPush();
      if (!token || cancelado) {
        return;
      }

      const cacheKey = `${user.id}:${token}`;
      if (tokenRegistradoRef.current === cacheKey) {
        return;
      }

      const coords = await obterLocalizacao();

      try {
        await getApi().notificacoes.registrarToken({
          token,
          userId: user.id,
          lat: coords?.latitude,
          lng: coords?.longitude,
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
    if (!user) {
      return;
    }

    let unsubscribe: () => void = () => undefined;
    let cancelado = false;

    const registrarListener = async () => {
      const messaging = await getMessagingInstance();
      if (!messaging || cancelado) {
        return;
      }

      unsubscribe = onMessage(messaging, (payload) => {
        if (
          typeof Notification === "undefined" ||
          Notification.permission !== "granted"
        ) {
          return;
        }

        const data = payload.data as NotificacaoPetData | undefined;
        const title = payload.notification?.title ?? "CentralPet";

        void adicionarNotificacao({
          titulo: title,
          corpo: payload.notification?.body,
          petId: data?.petId,
          tipo: data?.tipo ?? (data?.petId ? "pet_perdido" : "outro"),
        });

        const notification = new Notification(title, {
          body: payload.notification?.body,
          icon: payload.notification?.icon,
          data: { petId: data?.petId },
        });

        notification.onclick = () => {
          notification.close();
          abrirDetalhePetPorId(data?.petId);
        };
      });
    };

    void registrarListener();

    return () => {
      cancelado = true;
      unsubscribe();
    };
  }, [user]);
}
