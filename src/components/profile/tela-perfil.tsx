import { useAutenticacao } from "@/context/contexto-autenticacao";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from "react-native";
import { TextoTema as Text } from "../texto-tema";

function parseCidadeEstado(endereco?: string): string | null {
  if (!endereco) return null;
  const parts = endereco.split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[parts.length - 2]}, ${parts[parts.length - 1]}`;
  }
  return parts[0] ?? null;
}

export default function TelaPerfil() {
  const router = useRouter();
  const { user, initializing, logout, getApi } = useAutenticacao();
  const profileName =
    user?.displayName?.trim() || user?.email?.split("@")[0] || "Usuario";

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [stats, setStats] = useState({ registros: 0, encontrados: 0, avistamentos: 0 });

  useEffect(() => {
    if (!user) return;
    getApi()
      .pets.buscaPets({ usuarioId: user.id })
      .then((pets) => setStats((prev) => ({ ...prev, registros: pets.length })))
      .catch(() => {});
  }, [user, getApi]);

  const cidadeEstado = parseCidadeEstado(user?.endereco);

  const handleLogout = async () => {
    if (!user) return;
    try {
      await logout();
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
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.topSection}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person-outline" size={36} color="#8A7060" />
          </View>
          <Text style={styles.avatarName}>{user ? profileName : "Visitante"}</Text>
          {user?.email && <Text style={styles.avatarEmail}>{user.email}</Text>}
          {cidadeEstado && (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={13} color="#8E8476" />
              <Text style={styles.locationText}>{cidadeEstado}</Text>
            </View>
          )}
          {user?.emailVerified && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={12} color="#FFFFFF" />
              <Text style={styles.verifiedText}>Verificado</Text>
            </View>
          )}
        </View>

        {!user && (
          <TouchableOpacity
            style={styles.authButton}
            onPress={() => router.push("/login")}
            activeOpacity={0.88}
          >
            <Ionicons
              name="log-in-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.authButtonText}>Entrar ou criar conta</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Stats row */}
      {user && (
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.registros}</Text>
            <Text style={styles.statLabel}>Registros</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.statValueGreen]}>{stats.encontrados}</Text>
            <Text style={styles.statLabel}>Encontrados</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.avistamentos}</Text>
            <Text style={styles.statLabel}>Avistamentos</Text>
          </View>
        </View>
      )}

      {/* Menu */}
      <View style={styles.menuContainer}>
        {/* Saude do pet — em breve */}
        <View style={[styles.menuItem, styles.menuItemDisabled]}>
          <View style={[styles.menuIconWrap, styles.menuIconWrapDisabled]}>
            <Ionicons name="medkit-outline" size={20} color="#B8B8B8" />
          </View>
          <View style={styles.menuTextWrap}>
            <Text style={[styles.menuTitle, styles.menuTextDisabled]}>Saude do pet</Text>
            <Text style={[styles.menuDescription, styles.menuTextDisabled]}>Vacinas, consultas, vermifugo e lembretes (em breve)</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#D0D0D0" />
        </View>

        <View style={styles.menuDivider} />

        {/* Meus registros */}
        <TouchableOpacity
          style={[styles.menuItem, !user && styles.menuItemDisabled]}
          activeOpacity={user ? 0.85 : 1}
          onPress={() => user && router.push("/meus-registros")}
          disabled={!user}
        >
          <View style={[styles.menuIconWrap, !user && styles.menuIconWrapDisabled]}>
            <Ionicons name="document-text-outline" size={20} color={user ? "#8A7060" : "#B8B8B8"} />
          </View>
          <View style={styles.menuTextWrap}>
            <Text style={[styles.menuTitle, !user && styles.menuTextDisabled]}>Meus registros</Text>
            <Text style={[styles.menuDescription, !user && styles.menuTextDisabled]}>Veja seu historico e atividades</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={user ? "#B7AE9F" : "#D0D0D0"} />
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        {/* Contatos de emergência */}
        <TouchableOpacity
          style={[styles.menuItem, !user && styles.menuItemDisabled]}
          activeOpacity={user ? 0.85 : 1}
          onPress={() => user && router.push("/contatos-emergencia")}
          disabled={!user}
        >
          <View style={[styles.menuIconWrap, !user && styles.menuIconWrapDisabled]}>
            <Ionicons name="call-outline" size={20} color={user ? "#8A7060" : "#B8B8B8"} />
          </View>
          <View style={styles.menuTextWrap}>
            <Text style={[styles.menuTitle, !user && styles.menuTextDisabled]}>Contatos de emergência</Text>
            <Text style={[styles.menuDescription, !user && styles.menuTextDisabled]}>Vet, abrigos e pessoas de confiança</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={user ? "#B7AE9F" : "#D0D0D0"} />
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        {/* Histórico de avistamentos */}
        <TouchableOpacity
          style={[styles.menuItem, !user && styles.menuItemDisabled]}
          activeOpacity={user ? 0.85 : 1}
          disabled={!user}
        >
          <View style={[styles.menuIconWrap, !user && styles.menuIconWrapDisabled]}>
            <Ionicons name="eye-outline" size={20} color={user ? "#8A7060" : "#B8B8B8"} />
          </View>
          <View style={styles.menuTextWrap}>
            <Text style={[styles.menuTitle, !user && styles.menuTextDisabled]}>Histórico de avistamentos</Text>
            <Text style={[styles.menuDescription, !user && styles.menuTextDisabled]}>Reportes que você enviou</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={user ? "#B7AE9F" : "#D0D0D0"} />
        </TouchableOpacity>

        <View style={styles.menuDivider} />

        {/* Notificações com toggle */}
        <View style={[styles.menuItem, !user && styles.menuItemDisabled]}>
          <View style={[styles.menuIconWrap, !user && styles.menuIconWrapDisabled]}>
            <Ionicons name="notifications-outline" size={20} color={user ? "#8A7060" : "#B8B8B8"} />
          </View>
          <View style={styles.menuTextWrap}>
            <Text style={[styles.menuTitle, !user && styles.menuTextDisabled]}>Notificações</Text>
            <Text style={[styles.menuDescription, !user && styles.menuTextDisabled]}>Alertas de pets na região</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={user ? setNotificationsEnabled : undefined}
            disabled={!user}
            trackColor={{ false: "#E0D9CF", true: "#D97757" }}
            thumbColor="#FFFFFF"
            ios_backgroundColor="#E0D9CF"
          />
        </View>

        <View style={styles.menuDivider} />

        {/* Sair */}
        <TouchableOpacity
          style={[styles.menuItem, !user && styles.menuItemDisabled]}
          activeOpacity={user ? 0.85 : 1}
          onPress={handleLogout}
          disabled={!user}
        >
          <View style={[styles.menuIconWrap, !user && styles.menuIconWrapDisabled]}>
            <Ionicons name="log-out-outline" size={20} color={user ? "#8A7060" : "#B8B8B8"} />
          </View>
          <View style={styles.menuTextWrap}>
            <Text style={[styles.menuTitle, !user && styles.menuTextDisabled]}>Sair</Text>
            <Text style={[styles.menuDescription, !user && styles.menuTextDisabled]}>Encerrar sessao da conta atual</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={user ? "#B7AE9F" : "#D0D0D0"} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 0,
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
  avatarEmail: {
    fontSize: 13,
    color: "#8E8476",
    marginTop: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: "#8E8476",
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginTop: 8,
  },
  verifiedText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  authButton: {
    backgroundColor: "#D97757",
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 22,
    boxShadow: "0px 6px 12px rgba(217,119,87,0.4)",
    elevation: 6,
  },
  authButtonText: {
    fontFamily: "Lexend_700Bold",
    color: "#FFFFFF",
    fontSize: 16,
    letterSpacing: 0.2,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    backgroundColor: "#FAF7F3",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EAE5DA",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: "#EAE5DA",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  statValueGreen: {
    color: "#4CAF50",
  },
  statLabel: {
    fontSize: 11,
    color: "#8E8476",
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
    fontWeight: "400",
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
