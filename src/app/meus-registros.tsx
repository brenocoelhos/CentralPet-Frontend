import AppShell from "@/components/layout/app-shell";
import PetCard from "@/components/pet/pet-card";
import { ThemedText as Text } from "@/components/themed-text";
import { useAuth } from "@/context/auth-context";
import { ApiError, createApi } from "@/services/api";
import type { PetDashboardDto } from "@/services/api/modules/pets.api";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const ORANGE = "#D97757";
const BG = "#FFFFFF";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HORIZONTAL_PADDING = 14;
const CARD_GAP = 10;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;
const CARD_HEIGHT = 272;
const CARD_IMAGE_HEIGHT = 180;

export default function MeusRegistrosRoute() {
  const { user, token } = useAuth();
  const [pets, setPets] = useState<PetDashboardDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadPets() {
      try {
        setLoading(true);
        setErrorMessage(null);

        if (!user?.uid || !token) {
          setErrorMessage("Você precisa estar logado para ver seus registros.");
          return;
        }

        const result = await createApi({ token }).pets.buscaPets({ usuarioId: user.uid });
        setPets(result);
      } catch (error) {
        if (error instanceof ApiError && typeof error.data === "object" && error.data) {
          const data = error.data as { erro?: string; erros?: string[] };
          setErrorMessage(data.erro ?? data.erros?.[0] ?? "Erro ao carregar registros.");
        } else {
          setErrorMessage("Erro ao carregar registros.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadPets();
  }, [token, user?.uid]);

  const handleDelete = (id: string, nome: string) => {
    if (!token) {
      Alert.alert("Sessão expirada", "Entre novamente para excluir este registro.");
      return;
    }

    Alert.alert(
      "Excluir registro",
      `Deseja excluir o registro de "${nome}"? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await createApi({ token }).pets.deletePet(id);
              setPets((prev) => prev.filter((p) => p.id !== id));
              Alert.alert("Registro removido", "O pet foi excluído com sucesso.");
            } catch {
              Alert.alert("Erro", "Não foi possível excluir o registro.");
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const rows: PetDashboardDto[][] = [];
  for (let i = 0; i < pets.length; i += 2) {
    rows.push(pets.slice(i, i + 2));
  }

  if (loading) {
    return (
      <AppShell>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={ORANGE} />
        </View>
      </AppShell>
    );
  }

  if (errorMessage) {
    return (
      <AppShell>
        <View style={styles.centered}>
          <View style={styles.iconWrap}>
            <Ionicons name="alert-circle-outline" size={30} color="#8A7060" />
          </View>
          <Text style={styles.title}>Ops!</Text>
          <Text style={styles.description}>{errorMessage}</Text>
        </View>
      </AppShell>
    );
  }

  if (pets.length === 0) {
    return (
      <AppShell>
        <View style={styles.centered}>
          <View style={styles.iconWrap}>
            <Ionicons name="document-text-outline" size={30} color="#8A7060" />
          </View>
          <Text style={styles.title}>Nenhum registro</Text>
          <Text style={styles.description}>
            Você ainda não cadastrou nenhum pet desaparecido.
          </Text>
        </View>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.countLabel}>
          {pets.length} {pets.length === 1 ? "registro" : "registros"}
        </Text>

        {rows.map((row, i) => (
          <View key={i} style={styles.gridRow}>
            {row.map((item) => (
              <View key={item.id} style={styles.cardWrapper}>
                <PetCard
                  variant="dashboard"
                  name={item.nome}
                  breed={item.raca ?? item.especie}
                  location={item.localDesaparecimento}
                  imageUrl={item.fotoUrl}
                  status={
                    item.descricao?.some((d) => d.toLowerCase().includes("encontr"))
                      ? "ENCONTRADO"
                      : "PERDIDO"
                  }
                  imageHeight={CARD_IMAGE_HEIGHT}
                  cardStyle={styles.petCard}
                />
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item.id, item.nome)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="trash-outline" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            {row.length === 1 && <View style={{ width: CARD_WIDTH }} />}
          </View>
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: BG,
    gap: 10,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F0EBE0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  description: {
    fontSize: 14,
    color: "#746C5F",
    textAlign: "center",
    lineHeight: 20,
  },
  scroll: { flex: 1, backgroundColor: BG },
  scrollContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: Platform.OS === "android" ? 12 : 8,
  },
  countLabel: {
    fontSize: 13,
    color: "#9D988D",
    marginBottom: 12,
  },
  gridRow: {
    flexDirection: "row",
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    position: "relative",
  },
  petCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#F5F2EC",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
  },
  deleteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(200, 50, 50, 0.85)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
});

