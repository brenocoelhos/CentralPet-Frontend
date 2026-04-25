import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import {
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
    neighborhood: "Vila Mada",
    distance: "1,4 km de você",
    hasNewMessage: true,
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
  },
];

const FILTERS = ["Todos", "Perdidos", "Encontrados", "Cães"] as const;
type Filter = (typeof FILTERS)[number];

const ORANGE = "#D97757";
const BG = "#FAF7F5";

// ─── Icons ────────────────────────────────────────────────────────────────────
const PawIcon = ({ size = 28 }: { size?: number }) => (
  <MaterialIcons name="pets" size={size} color="#555" />
);

const ChatIcon = ({ active }: { active: boolean }) => (
  <View
    style={[
      styles.chatIcon,
      { backgroundColor: active ? "#4CAF50" : "#E8E0DC" },
    ]}
  >
    <MaterialIcons
      name="chat-bubble"
      size={18}
      color={active ? "#fff" : "#555"}
    />
  </View>
);

// ─── Sub-components ───────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: "PERDIDO" | "ENCONTRADO" }) => {
  const isFound = status === "ENCONTRADO";

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: isFound ? "#E8F5E9" : "#FFF3E0" },
      ]}
    >
      <Text
        style={[styles.badgeText, { color: isFound ? "#2E7D32" : "#E65100" }]}
      >
        {status}
      </Text>
    </View>
  );
};

const TagChip = ({ label }: { label: string }) => (
  <View style={styles.chip}>
    <Text style={styles.chipText}>{label}</Text>
  </View>
);

const OccurrenceCard = ({
  item,
  onPress,
}: {
  item: Occurrence;
  onPress: (item: Occurrence) => void;
}) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => onPress(item)}
    activeOpacity={0.85}
  >
    <View style={styles.cardRow}>
      <View style={styles.avatar}>
        <PawIcon size={30} />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <StatusBadge status={item.status} />
          <Text style={styles.timeText}>{item.time}</Text>
        </View>

        <Text style={styles.petName}>{item.name}</Text>

        <Text style={styles.petInfo}>
          {item.type} · {item.breed} · {item.size}
        </Text>

        <View style={styles.tagsRow}>
          {item.tags.map((tag) => (
            <TagChip key={tag} label={tag} />
          ))}
        </View>

        <Text style={styles.locationText}>
          {item.neighborhood} ·{" "}
          <Text style={styles.distanceBold}>{item.distance}</Text>
        </Text>
      </View>

      <ChatIcon active={item.hasNewMessage} />
    </View>
  </TouchableOpacity>
);

const FilterBar = ({
  active,
  onSelect,
}: {
  active: Filter;
  onSelect: (filter: Filter) => void;
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

const UrgentBanner = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.banner} onPress={onPress} activeOpacity={0.9}>
    <View style={styles.bannerIcon}>
      <MaterialIcons name="priority-high" size={18} color="#fff" />
    </View>

    <View style={styles.bannerContent}>
      <Text style={styles.bannerLabel}>URGENTE · HÁ 2 HORAS</Text>
      <Text style={styles.bannerTitle}>
        Bolt desapareceu no Parque Ibirapuera
      </Text>
    </View>

    <Text style={styles.bannerCta}>Ver →</Text>
  </TouchableOpacity>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
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
            : OCCURRENCES;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <View style={styles.header}>
        <Text>
          <Text style={styles.logoBold}>Central</Text>
          <Text style={styles.logoAccent}>Pet</Text>
        </Text>

        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <MaterialIcons name="notifications" size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <UrgentBanner onPress={() => {}} />
        <FilterBar active={activeFilter} onSelect={setActiveFilter} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>OCORRÊNCIAS NA REGIÃO</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>Ver mapa</Text>
          </TouchableOpacity>
        </View>

        {filtered.map((item) => (
          <OccurrenceCard key={item.id} item={item} onPress={() => {}} />
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} activeOpacity={0.88}>
          <Text style={styles.fabText}>Registrar ocorrência</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 12 : 4,
    paddingBottom: 12,
    backgroundColor: BG,
  },

  logoBold: {
    fontFamily: "Lexend_700Bold",
    color: "#1a1a1a",
    fontSize: 24,
  },

  logoAccent: {
    fontFamily: "Lexend_700Bold",
    color: ORANGE,
    fontSize: 24,
  },

  scroll: { flex: 1 },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },

  banner: {
    backgroundColor: ORANGE,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 20,
    shadowColor: ORANGE,
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },

  bannerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  bannerContent: { flex: 1 },

  bannerLabel: {
    fontFamily: "Lexend_700Bold",
    fontSize: 10,
    color: "rgba(255,255,255,0.85)",
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  bannerTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 13,
    color: "#fff",
    lineHeight: 20,
  },

  bannerCta: {
    fontFamily: "Lexend_700Bold",
    fontSize: 13,
    color: "#fff",
    marginLeft: 8,
  },

  filterContainer: {
    flexDirection: "row",
    paddingBottom: 16,
    gap: 8,
  },

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

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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

  card: {
    backgroundColor: "#F5F2EC",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },

  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E8E4DF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },

  cardContent: { flex: 1 },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 2,
  },

  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },

  badgeText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 10,
    letterSpacing: 0.4,
  },

  timeText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 11,
    color: "#999",
  },

  petName: {
    fontFamily: "Lexend_700Bold",
    fontSize: 17,
    color: "#1a1a1a",
    marginBottom: 2,
  },

  petInfo: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },

  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },

  chip: {
    backgroundColor: "#E8E4DF",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },

  chipText: {
    fontFamily: "Lexend_500Medium",
    fontSize: 11,
    color: "#555",
  },

  locationText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 12,
    color: "#888",
  },

  distanceBold: {
    fontFamily: "Lexend_700Bold",
    color: "#444",
  },

  chatIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    marginTop: 2,
  },

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
