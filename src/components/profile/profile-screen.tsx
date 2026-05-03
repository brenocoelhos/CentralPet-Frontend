import { useAuth } from "@/context/auth-context";
import { auth } from "@/lib/firebase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText as Text } from "../themed-text";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, initializing } = useAuth();
  const profileName =
    user?.displayName?.trim() || user?.email?.split("@")[0] || "Usuario";

  const handleLogout = async () => {
    if (!user) {
      return;
    }

    try {
      if (auth) await signOut(auth);
      router.replace("/login");
    } catch {
      Alert.alert("Erro", "Nao foi possivel sair. Tente novamente.");
    }
  };

  if (initializing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#D97757" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person-outline" size={36} color="#8A7060" />
          </View>
          <Text style={styles.avatarName}>{user ? profileName : "Visitante"}</Text>
        </View>

        <TouchableOpacity
          style={styles.authButton}
          onPress={() => router.push("/login")}
          activeOpacity={0.85}
        >
          <Text style={styles.authButtonText}>Entrar ou criar conta</Text>
        </TouchableOpacity>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.85}
            onPress={() => router.push("/meus-registros")}
          >
            <View style={styles.menuIconWrap}>
              <Ionicons name="document-text-outline" size={20} color="#8A7060" />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>Meus registros</Text>
              <Text style={styles.menuDescription}>Veja seu historico e atividades</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#B7AE9F" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.85}
            onPress={() => router.push("/configuracoes")}
          >
            <View style={styles.menuIconWrap}>
              <Ionicons name="settings-outline" size={20} color="#8A7060" />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={styles.menuTitle}>Configuracoes</Text>
              <Text style={styles.menuDescription}>Ajuste preferencias da sua conta</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#B7AE9F" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={[styles.menuItem, !user && styles.menuItemDisabled]}
            activeOpacity={user ? 0.85 : 1}
            onPress={handleLogout}
            disabled={!user}
          >
            <View style={[styles.menuIconWrap, !user && styles.menuIconWrapDisabled]}>
              <Ionicons
                name="log-out-outline"
                size={20}
                color={user ? "#8A7060" : "#B8B8B8"}
              />
            </View>
            <View style={styles.menuTextWrap}>
              <Text style={[styles.menuTitle, !user && styles.menuTextDisabled]}>Sair</Text>
              <Text style={[styles.menuDescription, !user && styles.menuTextDisabled]}>
                Encerrar sessao da conta atual
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={user ? "#B7AE9F" : "#D0D0D0"}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 48,
  },
  avatarWrapper: {
    alignItems: "center",
    marginTop: 16,
    marginBottom: 22,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#F0EBE0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  authButton: {
    backgroundColor: "#D97757",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 22,
  },
  authButtonText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  menuContainer: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EAE5DA",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },
  menuItemDisabled: {
    backgroundColor: "#F8F8F8",
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0EBE0",
  },
  menuIconWrapDisabled: {
    backgroundColor: "#EEEEEE",
  },
  menuTextWrap: {
    flex: 1,
    gap: 2,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  menuDescription: {
    fontSize: 12,
    color: "#8E8476",
  },
  menuTextDisabled: {
    color: "#B8B8B8",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#EAE5DA",
  },
});
