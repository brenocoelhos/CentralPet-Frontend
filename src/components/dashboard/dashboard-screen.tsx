import PetCard from "@/components/pet/pet-card";
import { ApiError, api } from "@/services/api";
import type { PetDashboardDto } from "@/services/api/modules/pets.api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────
type Occurrence = {
  id: string;
  status: "PERDIDO" | "ENCONTRADO";
  time: string;
  name: string;
  type: string;
  breed: string;
  size: string;
  tags: string[];
  neighborhood: string;
  distance: string;
  hasNewMessage: boolean;
  photo?: string;
};

const FILTERS = ["Todos", "Perdidos", "Encontrados", "Cães", "Gatos"] as const;
type Filter = (typeof FILTERS)[number];

const ORANGE = "#D97757";
const BG = "#FAF7F5";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HORIZONTAL_PADDING = 14;
const CARD_GAP = 10;
const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;
const CARD_HEIGHT = 272;
const CARD_IMAGE_HEIGHT = 180;

// ─── Filter Bar ───────────────────────────────────────────────────────────────
const FilterBar = ({
  active,
  onSelect,
}: {
  active: Filter;
  onSelect: (f: Filter) => void;
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.filterContainer}
  >
    {FILTERS.map((f) => (
      <TouchableOpacity
        key={f}
        style={[styles.filterBtn, active === f && styles.filterBtnActive]}
        onPress={() => onSelect(f)}
        activeOpacity={0.75}
      >
        <Text
          style={[styles.filterText, active === f && styles.filterTextActive]}
        >
          {f}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function DashboardScreen() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Todos");
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const result = await api.pets.buscaPets();
        setOccurrences(result.map(mapPetToOccurrence));
      } catch (error) {
        if (error instanceof ApiError && typeof error.data === "object" && error.data) {
          const data = error.data as { erro?: string; erros?: string[] };
          setErrorMessage(data.erro ?? data.erros?.[0] ?? "Nao foi possivel carregar o dashboard.");
        } else {
          setErrorMessage("Nao foi possivel carregar o dashboard.");
        }
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const filtered: Occurrence[] = useMemo(
    () =>
      activeFilter === "Todos"
        ? occurrences
        : activeFilter === "Perdidos"
          ? occurrences.filter((o) => o.status === "PERDIDO")
          : activeFilter === "Encontrados"
            ? occurrences.filter((o) => o.status === "ENCONTRADO")
            : activeFilter === "Cães"
              ? occurrences.filter((o) => o.type.toLowerCase().includes("cão") || o.type.toLowerCase().includes("cach"))
              : activeFilter === "Gatos"
                ? occurrences.filter((o) => o.type.toLowerCase().includes("gato"))
                : occurrences,
    [activeFilter, occurrences],
  );

  const rows: Occurrence[][] = [];
  for (let i = 0; i < filtered.length; i += 2) {
    rows.push(filtered.slice(i, i + 2));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Filters ── */}
        <FilterBar active={activeFilter} onSelect={setActiveFilter} />

        {/* ── Section header ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>OCORRÊNCIAS NA REGIÃO</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>Ver mapa</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={ORANGE} />
          </View>
        ) : null}

        {!loading && errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        {/* ── Grid ── */}
        {!loading && !errorMessage && rows.map((row, i) => (
          <View key={i} style={styles.gridRow}>
            {row.map((item) => (
              <PetCard
                key={item.id}
                variant="dashboard"
                name={item.name}
                breed={item.breed}
                location={item.neighborhood}
                imageUrl={item.photo}
                status={item.status}
                hasNewMessage={item.hasNewMessage}
                imageHeight={CARD_IMAGE_HEIGHT}
                cardStyle={styles.petCard}
                onPress={() =>
                  router.push({ pathname: "/pet-detail", params: { id: item.id } })
                }
              />
            ))}
            {row.length === 1 && <View style={{ width: CARD_WIDTH }} />}
          </View>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="paw-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Nenhuma ocorrência encontrada</Text>
          </View>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── FAB ── */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} activeOpacity={0.88} onPress={() => router.push("/cadastro-pet")}>
          <Ionicons
            name="add-circle-outline"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.fabText}>Realizar cadastro</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: Platform.OS === "android" ? 12 : 8,
  },

  // Filters
  filterContainer: { flexDirection: "row", paddingBottom: 16, gap: 8 },
  filterBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#D9D3CF",
    backgroundColor: BG,
  },
  filterBtnActive: {
    backgroundColor: "#1a1a1a",
    borderColor: "#1a1a1a",
  },
  filterText: {
    fontFamily: "Lexend_500Medium",
    fontSize: 14,
    color: "#555",
  },
  filterTextActive: {
    fontFamily: "Lexend_600SemiBold",
    color: "#fff",
  },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 11,
    color: "#888",
    letterSpacing: 0.8,
  },
  sectionLink: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 13,
    color: ORANGE,
  },

  // Grid
  gridRow: {
    flexDirection: "row",
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },

  // Pet Card
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
  // Empty state
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontFamily: "Lexend_500Medium",
    fontSize: 14,
    color: "#bbb",
  },
  loadingWrap: {
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "#D94F4F",
    textAlign: "center",
    fontSize: 13,
    marginBottom: 12,
  },

  // FAB
  fabContainer: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
  },
  fab: {
    backgroundColor: ORANGE,
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: ORANGE,
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  fabText: {
    fontFamily: "Lexend_700Bold",
    color: "#fff",
    fontSize: 16,
    letterSpacing: 0.2,
  },
});

function mapPetToOccurrence(item: PetDashboardDto): Occurrence {
  const hasFoundKeyword = item.descricao.some((chip) =>
    chip.toLowerCase().includes("encontr"),
  );

  return {
    id: item.id,
    status: hasFoundKeyword ? "ENCONTRADO" : "PERDIDO",
    time: item.dataDesaparecimento,
    name: item.nome,
    type: item.especie,
    breed: item.raca ?? "Sem raca",
    size: item.porte ?? "Nao informado",
    tags: item.descricao,
    neighborhood: item.localDesaparecimento,
    distance: "",
    hasNewMessage: false,
    photo: item.fotoUrl,
  };
}
