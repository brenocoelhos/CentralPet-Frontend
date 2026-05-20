import CartaoPet from "@/components/pet/cartao-pet";
import {
  CARD_GAP,
  CARD_HEIGHT,
  CARD_IMAGE_HEIGHT,
  CARD_WIDTH,
  HORIZONTAL_PADDING,
} from "@/constants/layout-grid";
import { AppColors, Radius, TouchTarget } from "@/constants/tema";
import { useAutenticacao } from "@/context/contexto-autenticacao";
import type { PetDashboardDto } from "@/services/api/modules/pets.api";
import { extrairMensagemErroApi } from "@/utils/alerta-erro-api";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";

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

const ORANGE = AppColors.brand;
const BG = AppColors.surface;

// ─── Filter Bar ───────────────────────────────────────────────────────────────
const FilterBar = ({
  active,
  onSelect,
}: {
  active: Filter;
  onSelect: (f: Filter) => void;
}) => (
  <View style={styles.filterContainer}>
    {FILTERS.map((f) => (
      <Pressable
        key={f}
        style={[styles.filterBtn, active === f && styles.filterBtnActive]}
        onPress={() => onSelect(f)}
        accessibilityRole="button"
        accessibilityLabel={`Filtrar por ${f}`}
      >
        <Text
          style={[styles.filterText, active === f && styles.filterTextActive]}
        >
          {f}
        </Text>
      </Pressable>
    ))}
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function TelaPainel() {
  const { getApi } = useAutenticacao();
  const [activeFilter, setActiveFilter] = useState<Filter>("Todos");
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadDashboard = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        }
        setErrorMessage(null);
        const result = await getApi().pets.buscaPets();
        setOccurrences(result.content.map(mapPetToOccurrence));
      } catch (error) {
        setErrorMessage(
          extrairMensagemErroApi(
            error,
            "Nao foi possivel carregar o dashboard.",
          ),
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [getApi],
  );

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    void loadDashboard(false);
  }, [loadDashboard]);

  const filtered: Occurrence[] = useMemo(
    () =>
      activeFilter === "Todos"
        ? occurrences
        : activeFilter === "Cães"
          ? occurrences.filter(
              (o) =>
                o.type.toLowerCase().includes("cão") ||
                o.type.toLowerCase().includes("cach"),
            )
          : activeFilter === "Gatos"
            ? occurrences.filter((o) => o.type.toLowerCase().includes("gato"))
            : occurrences,
    [activeFilter, occurrences],
  );

  const skeletonItems = useMemo(
    () => Array.from({ length: 4 }, (_, i) => `sk-${i}`),
    [],
  );

  const renderOccurrenceCard = ({ item }: { item: Occurrence }) => (
    <View style={styles.itemWrapper}>
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
    </View>
  );

  const renderSkeletonCard = ({ item }: { item: string }) => (
    <View key={item} style={styles.itemWrapper}>
      <View style={[styles.petCard, styles.skeletonCard]} />
    </View>
  );

  const listHeader = (
    <>
      <FilterBar active={activeFilter} onSelect={setActiveFilter} />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>PETS PERDIDOS NA REGIAO</Text>
      </View>
    </>
  );

  const listEmpty = loading ? (
    <FlatList
      data={skeletonItems}
      keyExtractor={(item) => item}
      numColumns={2}
      renderItem={renderSkeletonCard}
      columnWrapperStyle={styles.gridRow}
      scrollEnabled={false}
    />
  ) : errorMessage ? (
    <View style={styles.feedbackContainer}>
      <Text style={styles.errorText}>{errorMessage}</Text>
      <Pressable
        style={styles.retryButton}
        onPress={() => void loadDashboard(true)}
        accessibilityRole="button"
        accessibilityLabel="Tentar carregar o painel novamente"
      >
        <Text style={styles.retryButtonText}>Tentar novamente</Text>
      </Pressable>
    </View>
  ) : (
    <View style={styles.emptyState}>
      <Ionicons name="paw-outline" size={48} color="#ccc" />
      <Text style={styles.emptyText}>Nenhum pet perdido encontrado</Text>
    </View>
  );

  return (
    <View style={styles.safe}>
      <FlatList
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        data={loading ? [] : filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        renderItem={renderOccurrenceCard}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        ListFooterComponent={<View style={{ height: 110 }} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[ORANGE]}
            tintColor={ORANGE}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* ── FAB ── */}
      <View style={styles.fabContainer}>
        <Pressable
          style={styles.fab}
          onPress={() => router.push("/cadastro-pet")}
          accessibilityRole="button"
          accessibilityLabel="Abrir cadastro de pet"
          accessibilityHint="Vai para o formulario de cadastro"
        >
          <Ionicons
            name="add-circle-outline"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.fabText}>Realizar cadastro</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 8,
  },

  // Filters
  filterContainer: { flexDirection: "row", paddingBottom: 16, gap: 8 },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
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
    justifyContent: "space-between",
    marginBottom: CARD_GAP,
  },
  itemWrapper: {
    width: CARD_WIDTH,
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
  feedbackContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 24,
  },
  emptyText: {
    fontFamily: "Lexend_500Medium",
    fontSize: 14,
    color: "#bbb",
  },
  errorText: {
    color: "#D94F4F",
    textAlign: "center",
    fontSize: 13,
  },
  retryButton: {
    minHeight: TouchTarget.min,
    borderRadius: Radius.pill,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontFamily: "Lexend_600SemiBold",
    fontSize: 14,
  },
  skeletonCard: {
    opacity: 0.45,
    backgroundColor: "#E8E2D8",
  },

  // FAB
  fabContainer: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
  },
  fab: {
    minHeight: TouchTarget.min,
    backgroundColor: ORANGE,
    borderRadius: Radius.pill,
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
  const allImages = item.imagens?.length
    ? item.imagens
    : item.fotoUrl
      ? [item.fotoUrl]
      : [];

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
