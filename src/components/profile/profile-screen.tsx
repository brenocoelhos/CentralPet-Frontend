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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedText as Text } from "../themed-text";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, initializing } = useAuth();

  const handleLogout = async () => {
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
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person-outline" size={36} color="#8A7060" />
          </View>
          <Text style={styles.avatarName}>
            {user ? (user.displayName ?? "Usuario") : "Visitante"}
          </Text>
          {!user && (
            <Text style={styles.avatarSubtitle}>
              Entre ou cadastre-se para acessar seu perfil
            </Text>
          )}
        </View>

        {user ? (
          <>
            <View style={styles.fieldGroup}>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>E-MAIL</Text>
                <Text style={styles.fieldValue}>{user.email ?? "—"}</Text>
              </View>

              {user.phoneNumber && (
                <View style={[styles.field, styles.fieldBorderTop]}>
                  <Text style={styles.fieldLabel}>TELEFONE</Text>
                  <Text style={styles.fieldValue}>{user.phoneNumber}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.dangerButton}
              onPress={handleLogout}
              activeOpacity={0.85}
            >
              <Text style={styles.dangerButtonText}>Sair da conta</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/login")}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryButtonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push("/cadastro-usuario")}
              activeOpacity={0.85}
            >
              <Text style={styles.secondaryButtonText}>Criar conta</Text>
            </TouchableOpacity>
          </>
        )}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0EDE8",
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    color: "#1A1A1A",
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 48,
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 32,
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
    marginBottom: 4,
  },
  avatarSubtitle: {
    fontSize: 13,
    color: "#B0A898",
    textAlign: "center",
  },
  fieldGroup: {
    borderWidth: 1,
    borderColor: "#E0DBD0",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 20,
  },
  field: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    gap: 3,
  },
  fieldBorderTop: {
    borderTopWidth: 1,
    borderTopColor: "#E0DBD0",
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#B0A898",
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: 15,
    color: "#1A1A1A",
  },
  primaryButton: {
    backgroundColor: "#D97757",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#D97757",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    color: "#D97757",
    fontWeight: "bold",
  },
  dangerButton: {
    borderWidth: 1,
    borderColor: "#D97757",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
  },
  dangerButtonText: {
    fontSize: 15,
    color: "#D97757",
    fontWeight: "bold",
  },
});
