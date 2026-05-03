import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
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

// ─── Mock Data ────────────────────────────────────────────────────────────────
const OCCURRENCES: Occurrence[] = [
  {
    id: "1",
    status: "PERDIDO",
    time: "há 2h",
    name: "Bolt",
    type: "Cão",
    breed: "Golden Retriever",
    size: "Porte grande",
    tags: ["Pelagem dourada", "Coleira azul", "Sem chip"],
    neighborhood: "Parque Ibirapuera",
    distance: "0,8 km de você",
    hasNewMessage: false,
    photo:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&q=80",
  },
  {
    id: "2",
    status: "ENCONTRADO",
    time: "há 5h",
    name: "Gata laranja",
    type: "Gato",
    breed: "SRD",
    size: "Porte pequeno",
    tags: ["Pelagem laranja", "Sem coleira", "Dócil"],
    neighborhood: "Vila Madalena",
    distance: "1,4 km de você",
    hasNewMessage: true,
    photo:
      "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&q=80",
  },
  {
    id: "3",
    status: "PERDIDO",
    time: "há 1 dia",
    name: "Max",
    type: "Cão",
    breed: "Labrador preto",
    size: "Porte grande",
    tags: ["Pelagem preta", "Coleira vermelha"],
    neighborhood: "Pinheiros",
    distance: "2,1 km de você",
    hasNewMessage: false,
    photo:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80",
  },
  {
    id: "4",
    status: "PERDIDO",
    time: "há 3h",
    name: "Luna",
    type: "Cão",
    breed: "Shih Tzu",
    size: "Porte pequeno",
    tags: ["Pelagem branca", "Sem coleira"],
    neighborhood: "Moema",
    distance: "3,2 km de você",
    hasNewMessage: false,
    photo:
      "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=400&q=80",
  },
];

const FILTERS = ["Todos", "Perdidos", "Encontrados", "Cães", "Gatos"] as const;
type Filter = (typeof FILTERS)[number];

const ORANGE = "#D97757";
const BG = "#FAF7F5";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 16 * 2 - 12) / 2;

// ─── Pet Card ─────────────────────────────────────────────────────────────────
const PetCard = ({ item }: { item: Occurrence }) => {
  const isFound = item.status === "ENCONTRADO";

  return (
    <TouchableOpacity
      style={styles.petCard}
      activeOpacity={0.88}
      onPress={() =>
        router.push({ pathname: "/pet-detail", params: { id: item.id } })
      }
    >
      <View style={styles.photoWrapper}>
        {item.photo ? (
          <Image
            source={{ uri: item.photo }}
            style={styles.photo}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Ionicons name="paw" size={36} color="#ccc" />
          </View>
        )}

        <View style={styles.photoOverlay} />

        <View
          style={[
            styles.photoBadge,
            { backgroundColor: isFound ? "#2E7D32" : ORANGE },
          ]}
        >
          <Text style={styles.photoBadgeText}>{item.status}</Text>
        </View>

        {item.hasNewMessage && (
          <View style={styles.chatDot}>
            <Ionicons name="chatbubble" size={11} color="#fff" />
          </View>
        )}
      </View>

      <View style={styles.petInfoBox}>
        <Text style={styles.petName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.petBreed} numberOfLines={1}>
          {item.breed}
        </Text>
        <View style={styles.petLocationRow}>
          <Ionicons name="location-outline" size={11} color={ORANGE} />
          <Text style={styles.petLocation} numberOfLines={1}>
            {item.neighborhood}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

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

  const filtered: Occurrence[] =
    activeFilter === "Todos"
      ? OCCURRENCES
      : activeFilter === "Perdidos"
        ? OCCURRENCES.filter((o) => o.status === "PERDIDO")
        : activeFilter === "Encontrados"
          ? OCCURRENCES.filter((o) => o.status === "ENCONTRADO")
          : activeFilter === "Cães"
            ? OCCURRENCES.filter((o) => o.type === "Cão")
            : activeFilter === "Gatos"
              ? OCCURRENCES.filter((o) => o.type === "Gato")
              : OCCURRENCES;

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

        {/* ── Grid ── */}
        {rows.map((row, i) => (
          <View key={i} style={styles.gridRow}>
            {row.map((item) => (
              <PetCard key={item.id} item={item} />
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
        <TouchableOpacity style={styles.fab} activeOpacity={0.88}>
          <Ionicons
            name="add-circle-outline"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.fabText}>Registrar ocorrência</Text>
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
    paddingHorizontal: 16,
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
    gap: 12,
    marginBottom: 12,
  },

  // Pet Card
  petCard: {
    width: CARD_WIDTH,
    backgroundColor: "#F5F2EC",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
  },
  photoWrapper: {
    width: "100%",
    height: CARD_WIDTH * 1.15,
    backgroundColor: "#E8E4DF",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoPlaceholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  photoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  photoBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  photoBadgeText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 9,
    color: "#fff",
    letterSpacing: 0.3,
  },
  chatDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
  },

  // Info below photo
  petInfoBox: {
    padding: 10,
    gap: 2,
  },
  petName: {
    fontFamily: "Lexend_700Bold",
    fontSize: 15,
    color: "#1a1a1a",
  },
  petBreed: {
    fontFamily: "Lexend_400Regular",
    fontSize: 12,
    color: "#777",
  },
  petLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  petLocation: {
    fontFamily: "Lexend_400Regular",
    fontSize: 11,
    color: "#999",
    flex: 1,
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
