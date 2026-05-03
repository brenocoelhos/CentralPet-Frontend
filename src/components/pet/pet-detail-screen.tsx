import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
    Dimensions,
    Image,
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
  photos?: string[];
  ownerName?: string;
  ownerPhone?: string;
  reward?: boolean;
  lastSeenDate?: string;
  lastSeenAddress?: string;
  color?: string;
  castrated?: boolean;
  vaccinated?: boolean;
};

// ─── Constants ────────────────────────────────────────────────────────────────
const ORANGE = "#D97757";
const BG = "#FAF7F5";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CAROUSEL_SIDE_PADDING = 16;
const PHOTO_GAP = 10;
const PHOTO_WIDTH =
  (SCREEN_WIDTH - CAROUSEL_SIDE_PADDING * 2 - PHOTO_GAP * 2) / 2.5;
const PHOTO_HEIGHT = PHOTO_WIDTH * 1.15;

// ─── Props ────────────────────────────────────────────────────────────────────
type PetDetailScreenProps = {
  item: Occurrence;
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

// ─── Photo Carousel ───────────────────────────────────────────────────────────
const PhotoCarousel = ({
  photos,
  activeIndex,
  onScroll,
}: {
  photos: string[];
  activeIndex: number;
  onScroll: (index: number) => void;
}) => (
  <View style={styles.carouselWrapper}>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={PHOTO_WIDTH + PHOTO_GAP}
      decelerationRate="fast"
      contentContainerStyle={styles.carouselContent}
      onScroll={(e) => {
        const index = Math.max(
          0,
          Math.min(
            photos.length - 1,
            Math.round(e.nativeEvent.contentOffset.x / (PHOTO_WIDTH + PHOTO_GAP)),
          ),
        );
        onScroll(index);
      }}
      scrollEventThrottle={16}
    >
      {photos.map((uri, i) => (
        <View key={i} style={styles.photoCard}>
          <Image source={{ uri }} style={styles.photo} resizeMode="cover" />
        </View>
      ))}
    </ScrollView>

    {/* Dots */}
    <View style={styles.dotsRow}>
      {photos.map((_, i) => (
        <View
          key={i}
          style={[styles.dot, i === activeIndex && styles.dotActive]}
        />
      ))}
    </View>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function PetDetailScreen({ item }: PetDetailScreenProps) {
  const [contactPressed, setContactPressed] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const isFound = item.status === "ENCONTRADO";

  // Fallback photos if none provided
  const photos = item.photos?.length
    ? item.photos
    : [
        "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&q=80",
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80",
        "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&q=80",
      ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Photo Carousel ── */}
        <PhotoCarousel
          photos={photos}
          activeIndex={activePhoto}
          onScroll={setActivePhoto}
        />

        {/* ── Pet identity ── */}
        <View style={styles.identityCard}>
          <View style={styles.identityTop}>
            <View style={styles.identityBadgeRow}>
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
          </View>

          <View style={styles.identityMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={13} color={ORANGE} />
              <Text style={styles.metaText}>{item.neighborhood}</Text>
            </View>
            <View style={styles.metaDot} />
            <Text style={styles.metaTime}>Publicado {item.time}</Text>
          </View>
        </View>

        {/* ── Características ── */}
        <View style={styles.section}>
          <SectionTitle title="CARACTERÍSTICAS" />
          <View style={styles.card}>
            {/* Grid: Porte + Cor apenas */}
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
            </View>

            <View style={styles.charsDividerH} />

            {/* Castrado / Vacinado */}
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

            {/* Tags */}
            <View style={styles.tagsRow}>
              {item.tags.map((tag) => (
                <TagChip key={tag} label={tag} />
              ))}
            </View>
          </View>
        </View>

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

  scroll: { flex: 1 },
  scrollContent: { paddingTop: 14, paddingBottom: 16 },

  // ── Carousel ──
  carouselWrapper: {
    marginBottom: 16,
  },
  carouselContent: {
    paddingHorizontal: CAROUSEL_SIDE_PADDING,
    gap: PHOTO_GAP,
  },
  photoCard: {
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#E8E4DF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  photo: {
    width: "100%",
    height: "100%",
  },

  // Dots
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D9D3CF",
  },
  dotActive: {
    width: 18,
    backgroundColor: ORANGE,
  },

  // ── Identity Card ──
  identityCard: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  identityTop: {
    marginBottom: 10,
  },
  identityBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
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
    fontSize: 26,
    color: "#1a1a1a",
    marginBottom: 2,
  },
  petBreed: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#666",
  },
  identityMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 12,
    color: "#888",
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#ccc",
  },
  metaTime: {
    fontFamily: "Lexend_400Regular",
    fontSize: 12,
    color: "#aaa",
  },

  // ── Sections ──
  section: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
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

  // Chars grid (só Porte e Cor)
  charsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
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
