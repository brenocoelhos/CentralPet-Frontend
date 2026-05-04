import { auth, hasFirebaseConfig, missingFirebaseConfigKeys } from "@/lib/firebase";
import { createApi } from "@/services/api";
import type { LoginResponse } from "@/services/api/modules/auth.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type PropsWithChildren,
} from "react";

const TOKEN_STORAGE_KEY = "@centralpet:token";
const USER_ID_STORAGE_KEY = "@centralpet:userId";

export type AuthUser = {
  id: string;
  uid: string;
  email?: string;
  displayName?: string;
  endereco?: string;
  emailVerified?: boolean;
  provider: "jwt" | "firebase";
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  initializing: boolean;
  hasFirebaseConfig: boolean;
  missingConfigKeys: string[];
  signInWithToken: (token: string, loginPayload?: LoginResponse) => Promise<void>;
  getApi: () => ReturnType<typeof createApi>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    let unsubscribeFirebase: (() => void) | undefined;

    async function bootstrap() {
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

  const signInWithToken = useCallback(async (nextToken: string, loginPayload?: LoginResponse) => {
    let currentUser: AuthUser;

    if (loginPayload && typeof loginPayload === "object" && "token" in loginPayload) {
      const fromPayload = normalizeLoginPayload(loginPayload, nextToken);
      currentUser = fromPayload ?? (await fetchJwtUser(nextToken));
    } else {
      currentUser = await fetchJwtUser(nextToken);
    }

    await AsyncStorage.multiSet([
      [TOKEN_STORAGE_KEY, nextToken],
      [USER_ID_STORAGE_KEY, currentUser.id],
    ]);
    setToken(nextToken);
    setUser(currentUser);
  }, []);

  const getApi = useCallback(() => createApi({ token: token ?? undefined }), [token]);

  const logout = useCallback(async () => {
    if (token) {
      try {
        await createApi({ token }).auth.logout();
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
    }),
    [initializing, logout, getApi, signInWithToken, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

async function fetchJwtUser(token: string): Promise<AuthUser> {
  const payload = await createApi({ token }).auth.me();
  const user = normalizeApiUser(payload);

  if (!user) {
    throw new Error("Invalid auth/me response");
  }

  return user;
}

function mapFirebaseUser(user: FirebaseUser): AuthUser {
  return {
    id: user.uid,
    uid: user.uid,
    email: user.email ?? undefined,
    displayName: user.displayName ?? undefined,
    provider: "firebase",
  };
}

function normalizeApiUser(payload: Record<string, unknown>): AuthUser | null {
  const id =
    readString(payload.id) ??
    readString(payload.usuarioId) ??
    readString(payload.uid) ??
    readString(payload.email);

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
    emailVerified: typeof payload.emailVerified === "boolean" ? payload.emailVerified : undefined,
    provider: "jwt",
  };
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function normalizeLoginPayload(
  payload: { token: string; nome?: string; email?: string },
  _token: string,
): AuthUser | null {
  const id = payload.email ?? payload.nome;

  if (!id) {
    return null;
  }

  return {
    id,
    uid: id,
    email: payload.email,
    displayName: payload.nome,
    provider: "jwt",
  };
}

async function clearStoredSession() {
  await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, USER_ID_STORAGE_KEY]);
}
