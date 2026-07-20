import CartaoPet from "@/components/pet/cartao-pet";
import {
  CARD_GAP,
  CARD_HEIGHT,
  CARD_IMAGE_HEIGHT,
  CARD_WIDTH,
  HORIZONTAL_PADDING,
} from "@/constants/layout-grid";
import { AppColors } from "@/constants/tema";
import { PETS_ADOCAO_MOCK, type PetAdocao } from "@/data/pets-adocao-mock";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

const FILTERS = ["Todos", "Cães", "Gatos"] as const;
type Filter = (typeof FILTERS)[number];

const BG = AppColors.surface;

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

export default function TelaAdocao() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Todos");

  const filtered: PetAdocao[] = useMemo(() => {
    if (activeFilter === "Cães") {
      return PETS_ADOCAO_MOCK.filter((pet) => pet.especie === "Cão");
    }
    if (activeFilter === "Gatos") {
      return PETS_ADOCAO_MOCK.filter((pet) => pet.especie === "Gato");
    }
    return PETS_ADOCAO_MOCK;
  }, [activeFilter]);

  const renderCard = ({ item }: { item: PetAdocao }) => (
    <View style={styles.itemWrapper}>
      <CartaoPet
        variant="dashboard"
        name={item.nome}
        breed={item.raca}
        location={`${item.localizacao} · ${item.distancia}`}
        imageUrl={item.fotos[0]}
        status={item.idade}
        imageHeight={CARD_IMAGE_HEIGHT}
        cardStyle={styles.petCard}
        onPress={() =>
          router.push({
            pathname: "/detalhe-pet-adocao",
            params: { id: item.id },
          })
        }
      />
    </View>
  );

  const listHeader = (
    <>
      <FilterBar active={activeFilter} onSelect={setActiveFilter} />
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>PETS DISPONÍVEIS PARA ADOÇÃO</Text>
      </View>
    </>
  );

  const listEmpty = (
    <View style={styles.emptyState}>
      <Ionicons name="paw-outline" size={48} color="#ccc" />
      <Text style={styles.emptyText}>Nenhum pet disponível com esse filtro</Text>
    </View>
  );

  return (
    <View style={styles.safe}>
      <FlatList
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        renderItem={renderCard}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
        ListFooterComponent={<View style={{ height: 110 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 8,
  },

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

  gridRow: {
    justifyContent: "space-between",
    marginBottom: CARD_GAP,
  },
  itemWrapper: {
    width: CARD_WIDTH,
  },

  petCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#F5F2EC",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0px 3px 8px rgba(0,0,0,0.08)",
    elevation: 3,
  },

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
});
