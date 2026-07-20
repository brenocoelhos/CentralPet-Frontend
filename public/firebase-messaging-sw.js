/* global importScripts, firebase, indexedDB, self */

importScripts("https://www.gstatic.com/firebasejs/12.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.12.0/firebase-messaging-compat.js");

const DB_NAME = "centralpet-fcm";
const STORE_NAME = "settings";
const CONFIG_KEY = "firebaseConfig";
const CONFIG_MESSAGE_TYPE = "centralpet:fcm-config";
const CONFIG_ACK_TYPE = "centralpet:fcm-config-ack";
const OPEN_PET_MESSAGE_TYPE = "centralpet:open-pet";
const RECEIVED_MESSAGE_TYPE = "centralpet:notification-received";

let messagingInitialized = false;

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

async function saveConfig(config) {
  const database = await openDatabase();

  await new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(config, CONFIG_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

async function loadConfig() {
  const database = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(CONFIG_KEY);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

function initializeMessaging(config) {
  if (messagingInitialized || !config || !config.apiKey) {
    return;
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }

  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const data = payload.data || {};
    const petId = data.petId;
    const title = payload.notification?.title || "CentralPet";
    const body = payload.notification?.body || "Nova notificação disponível.";

    self.registration.showNotification(title, {
      body,
      icon: payload.notification?.icon || "/assets/images/logo.png",
      badge: payload.notification?.badge || "/assets/images/logo.png",
      data: { petId },
    });

    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          client.postMessage({
            type: RECEIVED_MESSAGE_TYPE,
            title,
            body,
            petId,
          });
        }
      });
  });

  messagingInitialized = true;
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(Promise.resolve());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  const data = event.data || {};

  if (data.type === CONFIG_MESSAGE_TYPE && data.config) {
    event.waitUntil(
      (async () => {
        await saveConfig(data.config);
        initializeMessaging(data.config);
      })(),
    );

    if (event.source) {
      event.source.postMessage({
        type: CONFIG_ACK_TYPE,
        requestId: data.requestId,
      });
    }
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const petId = event.notification.data?.petId;
  const targetUrl = petId
    ? `${self.location.origin}/detalhe-pet?id=${encodeURIComponent(petId)}`
    : self.location.origin;

  event.waitUntil(
    (async () => {
      const windowClients = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of windowClients) {
        if ("focus" in client) {
          await client.focus();
          client.postMessage({
            type: OPEN_PET_MESSAGE_TYPE,
            petId,
          });
          return;
        }
      }

      await self.clients.openWindow(targetUrl);
    })(),
  );
});

void (async () => {
  try {
    const config = await loadConfig();
    if (config) {
      initializeMessaging(config);
    }
  } catch {
    // O service worker continua funcional mesmo sem a configuracao persistida.
  }
})();