import Ionicons from "@expo/vector-icons/Ionicons";
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
  // Detail extras
  description?: string;
  ownerName?: string;
  ownerPhone?: string;
  reward?: boolean;
  lastSeenDate?: string;
  lastSeenAddress?: string;
  color?: string;
  age?: string;
  weight?: string;
  castrated?: boolean;
  vaccinated?: boolean;
};

// ─── Constants ────────────────────────────────────────────────────────────────
const ORANGE = "#D97757";
const BG = "#FAF7F5";

// ─── Props ────────────────────────────────────────────────────────────────────
type PetDetailScreenProps = {
  item: Occurrence;
  onBack: () => void;
};

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

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIconWrap}>
      <Ionicons name={icon as any} size={16} color={ORANGE} />
    </View>
    <View style={styles.infoTexts}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const SectionTitle = ({ title }: { title: string }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function PetDetailScreen({
  item,
  onBack,
}: PetDetailScreenProps) {
  const [contactPressed, setContactPressed] = useState(false);
  const isFound = item.status === "ENCONTRADO";

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Detalhes</Text>

        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="share-social-outline" size={24} color="#1a1a1a" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Avatar Card ── */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="paw" size={56} color="#bbb" />
          </View>

          <View style={styles.avatarInfo}>
            <View style={styles.avatarBadgeRow}>
              <StatusBadge status={item.status} />
              {item.reward && (
                <View style={styles.rewardBadge}>
                  <Ionicons name="star" size={10} color="#B8860B" />
                  <Text style={styles.rewardText}>Recompensa</Text>
                </View>
              )}
            </View>

            <Text style={styles.petName}>{item.name}</Text>
            <Text style={styles.petBreed}>
              {item.type} · {item.breed}
            </Text>

            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={13} color={ORANGE} />
              <Text style={styles.locationText}>
                {item.neighborhood} ·{" "}
                <Text style={styles.distanceBold}>{item.distance}</Text>
              </Text>
            </View>

            <Text style={styles.timeAgo}>Publicado {item.time}</Text>
          </View>
        </View>

        {/* ── Características ── */}
        <View style={styles.section}>
          <SectionTitle title="CARACTERÍSTICAS" />
          <View style={styles.card}>
            <View style={styles.charsGrid}>
              <View style={styles.charItem}>
                <Text style={styles.charLabel}>Porte</Text>
                <Text style={styles.charValue}>{item.size}</Text>
              </View>
              <View style={styles.charDivider} />
              <View style={styles.charItem}>
                <Text style={styles.charLabel}>Cor</Text>
                <Text style={styles.charValue}>{item.color ?? "—"}</Text>
              </View>
              <View style={styles.charDivider} />
              <View style={styles.charItem}>
                <Text style={styles.charLabel}>Idade</Text>
                <Text style={styles.charValue}>{item.age ?? "—"}</Text>
              </View>
              <View style={styles.charDivider} />
              <View style={styles.charItem}>
                <Text style={styles.charLabel}>Peso</Text>
                <Text style={styles.charValue}>{item.weight ?? "—"}</Text>
              </View>
            </View>

            <View style={styles.charsDividerH} />

            <View style={styles.charsCheckRow}>
              <View style={styles.checkItem}>
                <Ionicons
                  name={item.castrated ? "checkmark-circle" : "close-circle"}
                  size={18}
                  color={item.castrated ? "#4CAF50" : "#ccc"}
                />
                <Text style={styles.checkLabel}>Castrado</Text>
              </View>
              <View style={styles.checkItem}>
                <Ionicons
                  name={item.vaccinated ? "checkmark-circle" : "close-circle"}
                  size={18}
                  color={item.vaccinated ? "#4CAF50" : "#ccc"}
                />
                <Text style={styles.checkLabel}>Vacinado</Text>
              </View>
            </View>

            <View style={styles.tagsRow}>
              {item.tags.map((tag) => (
                <TagChip key={tag} label={tag} />
              ))}
            </View>
          </View>
        </View>

        {/* ── Descrição ── */}
        {item.description && (
          <View style={styles.section}>
            <SectionTitle title="DESCRIÇÃO" />
            <View style={styles.card}>
              <Text style={styles.descriptionText}>{item.description}</Text>
            </View>
          </View>
        )}

        {/* ── Último avistamento ── */}
        <View style={styles.section}>
          <SectionTitle
            title={isFound ? "ONDE FOI ENCONTRADO" : "ÚLTIMO AVISTAMENTO"}
          />
          <View style={styles.card}>
            <InfoRow
              icon="calendar-outline"
              label="Data"
              value={item.lastSeenDate ?? "Não informado"}
            />
            <View style={styles.infoSeparator} />
            <InfoRow
              icon="location-outline"
              label="Endereço"
              value={item.lastSeenAddress ?? item.neighborhood}
            />
            <View style={styles.infoSeparator} />
            <InfoRow
              icon="navigate-outline"
              label="Distância de você"
              value={item.distance}
            />
          </View>
        </View>

        {/* ── Tutor / Quem encontrou ── */}
        <View style={styles.section}>
          <SectionTitle title={isFound ? "QUEM ENCONTROU" : "TUTOR"} />
          <View style={styles.card}>
            <View style={styles.ownerRow}>
              <View style={styles.ownerAvatar}>
                <Ionicons name="person" size={22} color="#888" />
              </View>
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerName}>
                  {item.ownerName ?? "Anônimo"}
                </Text>
                <Text style={styles.ownerSub}>
                  {isFound ? "Encontrou o pet" : "Dono do pet"}
                </Text>
              </View>
              {item.ownerPhone && (
                <TouchableOpacity style={styles.callBtn}>
                  <Ionicons name="call-outline" size={18} color={ORANGE} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── CTA ── */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.fab, contactPressed && styles.fabPressed]}
          activeOpacity={0.88}
          onPress={() => setContactPressed(true)}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.fabText}>
            {isFound ? "Entrar em contato" : "Já vi esse pet"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 12 : 4,
    paddingBottom: 12,
    backgroundColor: BG,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F0EDEA",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 17,
    color: "#1a1a1a",
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },

  // Avatar Card
  avatarCard: {
    backgroundColor: "#F5F2EC",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E8E4DF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarInfo: { flex: 1 },
  avatarBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },

  rewardBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rewardText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 10,
    color: "#B8860B",
  },

  petName: {
    fontFamily: "Lexend_700Bold",
    fontSize: 22,
    color: "#1a1a1a",
    marginBottom: 2,
  },
  petBreed: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 4,
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
  timeAgo: {
    fontFamily: "Lexend_400Regular",
    fontSize: 11,
    color: "#aaa",
  },

  // Sections
  section: { marginBottom: 20 },
  sectionTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 11,
    color: "#888",
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  // Card
  card: {
    backgroundColor: "#F5F2EC",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },

  // Badge
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

  // Chips
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 12,
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

  // Chars grid
  charsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  charItem: {
    flex: 1,
    alignItems: "center",
  },
  charLabel: {
    fontFamily: "Lexend_400Regular",
    fontSize: 11,
    color: "#999",
    marginBottom: 4,
  },
  charValue: {
    fontFamily: "Lexend_700Bold",
    fontSize: 13,
    color: "#1a1a1a",
  },
  charDivider: {
    width: 1,
    backgroundColor: "#E0DBD6",
    marginVertical: 2,
  },
  charsDividerH: {
    height: 1,
    backgroundColor: "#E0DBD6",
    marginVertical: 12,
  },

  // Checks
  charsCheckRow: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 4,
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  checkLabel: {
    fontFamily: "Lexend_500Medium",
    fontSize: 13,
    color: "#555",
  },

  // Description
  descriptionText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
  },

  // InfoRow
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 2,
  },
  infoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EDE8E3",
    alignItems: "center",
    justifyContent: "center",
  },
  infoTexts: { flex: 1 },
  infoLabel: {
    fontFamily: "Lexend_400Regular",
    fontSize: 11,
    color: "#999",
  },
  infoValue: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 13,
    color: "#1a1a1a",
  },
  infoSeparator: {
    height: 1,
    backgroundColor: "#E0DBD6",
    marginVertical: 10,
  },

  // Owner
  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ownerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8E4DF",
    alignItems: "center",
    justifyContent: "center",
  },
  ownerInfo: { flex: 1 },
  ownerName: {
    fontFamily: "Lexend_700Bold",
    fontSize: 15,
    color: "#1a1a1a",
  },
  ownerSub: {
    fontFamily: "Lexend_400Regular",
    fontSize: 12,
    color: "#888",
  },
  callBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EDE8E3",
    alignItems: "center",
    justifyContent: "center",
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
  fabPressed: {
    backgroundColor: "#c4663e",
  },
  fabText: {
    fontFamily: "Lexend_700Bold",
    color: "#fff",
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
