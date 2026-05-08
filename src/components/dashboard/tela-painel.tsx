import CartaoPet from "@/components/pet/cartao-pet";
import { CARD_GAP, CARD_HEIGHT, CARD_IMAGE_HEIGHT, CARD_WIDTH, HORIZONTAL_PADDING } from "@/constants/layout-grid";
import { useAutenticacao } from "@/context/contexto-autenticacao";
import type { PetDashboardDto } from "@/services/api/modules/pets.api";
import { extrairMensagemErroApi } from "@/utils/alerta-erro-api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Types ────────────────────────────────────────────────────────────────────
type Occurrence = {
  id: string;
  status: "PERDIDO";
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
  photos?: string[];
  raw: PetDashboardDto;
};

const FILTERS = ["Todos", "Cães", "Gatos"] as const;
type Filter = (typeof FILTERS)[number];

const ORANGE = "#D97757";
const BG = "#FFFFFF";

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
export default function TelaPainel() {
  const { getApi } = useAutenticacao();
  const [activeFilter, setActiveFilter] = useState<Filter>("Todos");
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setErrorMessage(null);
        const result = await getApi().pets.buscaPets();
        setOccurrences(result.map(mapPetToOccurrence));
      } catch (error) {
        setErrorMessage(extrairMensagemErroApi(error, "Nao foi possivel carregar o dashboard."));
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, [getApi]);

  const filtered: Occurrence[] = useMemo(
    () =>
      activeFilter === "Todos"
        ? occurrences
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
          <Text style={styles.sectionTitle}>PETS PERDIDOS NA REGIÃO</Text>
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
              <CartaoPet
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
                  router.push({
                    pathname: "/detalhe-pet",
                    params: { pet: encodeURIComponent(JSON.stringify(item.raw)) },
                  })
                }
              />
            ))}
            {row.length === 1 && <View style={{ width: CARD_WIDTH }} />}
          </View>
        ))}

        {filtered.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="paw-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Nenhum pet perdido encontrado</Text>
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
    boxShadow: "0px 3px 8px rgba(0,0,0,0.08)",
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
    boxShadow: "0px 6px 12px rgba(217,119,87,0.4)",
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
  const allImages = item.imagens?.length ? item.imagens : (item.fotoUrl ? [item.fotoUrl] : []);
  
  return {
    id: item.id,
    status: "PERDIDO",
    time: item.dataDesaparecimento,
    name: item.nome,
    type: item.especie,
    breed: item.raca ?? "Sem raca",
    size: item.porte ?? "Nao informado",
    tags: item.descricao,
    neighborhood: item.localDesaparecimento,
    distance: "",
    hasNewMessage: false,
    photo: allImages[0],
    photos: allImages,
    raw: item,
  };
}
