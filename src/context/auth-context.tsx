import {
    auth,
    hasFirebaseConfig,
    missingFirebaseConfigKeys,
} from "@/lib/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type PropsWithChildren,
} from "react";

type AuthContextValue = {
  user: User | null;
  initializing: boolean;
  hasFirebaseConfig: boolean;
  missingConfigKeys: string[];
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState<boolean>(hasFirebaseConfig);

  useEffect(() => {
    if (!auth) {
      setInitializing(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      hasFirebaseConfig,
      missingConfigKeys: missingFirebaseConfigKeys,
    }),
    [initializing, user],
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
