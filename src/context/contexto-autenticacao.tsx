import {
  auth,
  hasFirebaseConfig,
  missingFirebaseConfigKeys,
} from "@/lib/firebase";
import { criarApi } from "@/services/api";
import type { LoginResponse } from "@/services/api/modules/autenticacao.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  onAuthStateChanged,
  signOut,
  type User as FirebaseUser,
} from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { AppState, Platform } from "react-native";

const TOKEN_STORAGE_KEY = "@centralpet:token";
const USER_ID_STORAGE_KEY = "@centralpet:userId";
const LAST_ACTIVITY_KEY = "@centralpet:lastActivity";
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutos

export type UsuarioAutenticado = {
  id: string;
  uid: string;
  email?: string;
  displayName?: string;
  endereco?: string;
  fotoPerfil?: string; // NOVO CAMPO
  emailVerified?: boolean;
  provider: "jwt" | "firebase";
};

type ValorContextoAutenticacao = {
  user: UsuarioAutenticado | null;
  token: string | null;
  initializing: boolean;
  hasFirebaseConfig: boolean;
  missingConfigKeys: string[];
  signInWithToken: (
    token: string,
    loginPayload?: LoginResponse,
  ) => Promise<void>;
  getApi: () => ReturnType<typeof criarApi>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<UsuarioAutenticado>) => void; // NOVA FUNÇÃO
};

const AuthContext = createContext<ValorContextoAutenticacao | null>(null);

export function ProvedorAutenticacao({ children }: PropsWithChildren) {
  const [user, setUser] = useState<UsuarioAutenticado | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);
  const tokenRef = useRef<string | null>(null);
  tokenRef.current = token;

  const forceLogout = useCallback(async () => {
    await clearStoredSession();
    setToken(null);
    setUser(null);
  }, []);

  const updateActivity = useCallback(() => {
    void AsyncStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()));
  }, []);

  // Permite atualizar dados locais sem recarregar tudo
  const updateUser = useCallback((data: Partial<UsuarioAutenticado>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  useEffect(() => {
    let isMounted = true;
    let unsubscribeFirebase: (() => void) | undefined;

    async function bootstrap() {
      // Checar inatividade antes de restaurar a sessão
      const lastActivityStr = await AsyncStorage.getItem(LAST_ACTIVITY_KEY);
      if (lastActivityStr) {
        const elapsed = Date.now() - parseInt(lastActivityStr, 10);
        if (elapsed > INACTIVITY_TIMEOUT_MS) {
          await clearStoredSession();
          if (isMounted) setInitializing(false);
          return;
        }
      }

      const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);

      if (storedToken) {
        try {
          const currentUser = await fetchJwtUser(storedToken);

          if (!isMounted) {
            return;
          }

          setToken(storedToken);
          setUser(currentUser);
        } catch {
          await clearStoredSession();

          if (isMounted) {
            setToken(null);
            setUser(null);
          }
        } finally {
          if (isMounted) {
            setInitializing(false);
          }
        }

        return;
      }

      if (!auth) {
        if (isMounted) {
          setInitializing(false);
        }
        return;
      }

      unsubscribeFirebase = onAuthStateChanged(auth, (currentUser) => {
        if (!isMounted) {
          return;
        }

        setUser(currentUser ? mapFirebaseUser(currentUser) : null);
        setToken(null);
        setInitializing(false);
      });
    }

    void bootstrap();

    return () => {
      isMounted = false;
      unsubscribeFirebase?.();
    };
  }, []);

  const signInWithToken = useCallback(
    async (nextToken: string, loginPayload?: any) => {
      let currentUser: UsuarioAutenticado;

      if (
        loginPayload &&
        typeof loginPayload === "object" &&
        "token" in loginPayload
      ) {
        const fromPayload = normalizeLoginPayload(loginPayload, nextToken);
        currentUser = fromPayload ?? (await fetchJwtUser(nextToken));
      } else {
        currentUser = await fetchJwtUser(nextToken);
      }

      await AsyncStorage.multiSet([
        [TOKEN_STORAGE_KEY, nextToken],
        [USER_ID_STORAGE_KEY, currentUser.id],
        [LAST_ACTIVITY_KEY, String(Date.now())],
      ]);
      setToken(nextToken);
      setUser(currentUser);
    },
    [],
  );

  const getApi = useCallback(
    () => criarApi({ token: token ?? undefined }),
    [token],
  );

  const logout = useCallback(async () => {
    if (token) {
      try {
        await criarApi({ token }).auth.logout();
      } finally {
        await clearStoredSession();
        setToken(null);
        setUser(null);
      }

      return;
    }

    if (auth) {
      await signOut(auth);
    }

    await clearStoredSession();
    setToken(null);
    setUser(null);
  }, [token]);

  // ── Mobile: checar inatividade ao voltar ao foreground ──────────────────
  useEffect(() => {
    if (Platform.OS === "web") return;

    const sub = AppState.addEventListener("change", async (nextState) => {
      if (nextState === "active" && tokenRef.current) {
        const lastStr = await AsyncStorage.getItem(LAST_ACTIVITY_KEY);
        if (
          lastStr &&
          Date.now() - parseInt(lastStr, 10) > INACTIVITY_TIMEOUT_MS
        ) {
          await forceLogout();
        } else {
          updateActivity();
        }
      } else if (nextState === "background") {
        updateActivity();
      }
    });

    return () => sub.remove();
  }, [forceLogout, updateActivity]);

  // ── Web: ouvir eventos de interação e atualizar timestamp ───────────────
  useEffect(() => {
    if (Platform.OS !== "web" || !token) return;
    if (typeof document === "undefined") return;

    let throttleTimer: ReturnType<typeof setTimeout> | null = null;

    const handleActivity = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        updateActivity();
        throttleTimer = null;
      }, 60_000); // atualiza no máximo 1x por minuto
    };

    document.addEventListener("mousemove", handleActivity);
    document.addEventListener("keydown", handleActivity);
    document.addEventListener("click", handleActivity);
    document.addEventListener("touchstart", handleActivity);

    return () => {
      document.removeEventListener("mousemove", handleActivity);
      document.removeEventListener("keydown", handleActivity);
      document.removeEventListener("click", handleActivity);
      document.removeEventListener("touchstart", handleActivity);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [token, updateActivity]);

  // ── Heartbeat: manter timestamp atualizado enquanto app está aberto ─────
  useEffect(() => {
    if (!token) return;
    updateActivity();
    const interval = setInterval(updateActivity, 5 * 60 * 1000); // a cada 5 min
    return () => clearInterval(interval);
  }, [token, updateActivity]);

  const value = useMemo(
    () => ({
      user,
      token,
      initializing,
      hasFirebaseConfig,
      missingConfigKeys: missingFirebaseConfigKeys,
      signInWithToken,
      getApi,
      logout,
      updateUser,
    }),
    [initializing, logout, getApi, signInWithToken, token, user, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAutenticacao() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAutenticacao must be used within ProvedorAutenticacao");
  }

  return context;
}

async function fetchJwtUser(token: string): Promise<UsuarioAutenticado> {
  const payload = await criarApi({ token }).auth.me();
  const user = normalizeApiUser(payload);

  if (!user) {
    throw new Error("Invalid auth/me response");
  }

  return user;
}

function mapFirebaseUser(user: FirebaseUser): UsuarioAutenticado {
  return {
    id: user.uid,
    uid: user.uid,
    email: user.email ?? undefined,
    displayName: user.displayName ?? undefined,
    provider: "firebase",
  };
}

function normalizeApiUser(
  payload: Record<string, unknown>,
): UsuarioAutenticado | null {
  const id =
    readString(payload.id) ??
    readString(payload.usuarioId) ??
    readString(payload.uid);

  if (!id) {
    return null;
  }

  const displayName =
    readString(payload.nome) ??
    readString(payload.name) ??
    readString(payload.displayName);

  return {
    id,
    uid: id,
    email: readString(payload.email),
    displayName,
    endereco: readString(payload.endereco),
    fotoPerfil: readString(payload.fotoPerfil),
    emailVerified:
      typeof payload.emailVerified === "boolean"
        ? payload.emailVerified
        : undefined,
    provider: "jwt",
  };
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function normalizeLoginPayload(
  payload: {
    token: string;
    nome?: string;
    email?: string;
    id?: string;
    usuarioId?: string;
    fotoPerfil?: string;
  },
  _token: string,
): UsuarioAutenticado | null {
  const id = payload.id ?? payload.usuarioId;

  if (!id) {
    return null;
  }

  return {
    id,
    uid: id,
    email: payload.email,
    displayName: payload.nome,
    fotoPerfil: payload.fotoPerfil,
    provider: "jwt",
  };
}

async function clearStoredSession() {
  await AsyncStorage.multiRemove([
    TOKEN_STORAGE_KEY,
    USER_ID_STORAGE_KEY,
    LAST_ACTIVITY_KEY,
  ]);
}
