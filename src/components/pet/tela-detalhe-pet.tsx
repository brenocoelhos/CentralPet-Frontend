import Ionicons from "@expo/vector-icons/Ionicons";
import * as Linking from "expo-linking";
import { useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
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
const BG = "#FFFFFF";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CAROUSEL_SIDE_PADDING = 16;
const PHOTO_GAP = 10;
const PHOTO_WIDTH =
  (SCREEN_WIDTH - CAROUSEL_SIDE_PADDING * 2 - PHOTO_GAP) / 1.5;
const PHOTO_HEIGHT = PHOTO_WIDTH * 1.3;

// ─── Props ────────────────────────────────────────────────────────────────────
type PetDetailScreenProps = {
  item: Occurrence;
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: "PERDIDO" | "ENCONTRADO" }) => {
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: "#FFF3E0" },
      ]}
    >
      <Text style={[styles.badgeText, { color: "#E65100" }]}>
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

function formatDisplayDate(value?: string): string {
  if (!value) {
    return "";
  }

  if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return value;
  }

  const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${day}/${month}/${year}`;
  }

  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    return `${day}/${month}/${year}`;
  }

  return value;
}

function formatDisplayDateTime(value?: string): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  }

  return formatDisplayDate(value);
}

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
export default function TelaDetalhePet({ item }: PetDetailScreenProps) {
  const [activePhoto, setActivePhoto] = useState(0);

  const handleOpenWhatsApp = async () => {
    const cleanedPhone = item.ownerPhone?.replace(/\D/g, "") ?? "";

    if (!cleanedPhone) {
      Alert.alert("Telefone indisponível", "Este registro não possui telefone para contato.");
      return;
    }

    const message = "Ola! Vi seu pet perdido e quero ajudar com informacoes.";
    const url = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Erro", "Não foi possível abrir o WhatsApp.");
    }
  };

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
            <Text style={styles.metaTime}>Publicado {formatDisplayDateTime(item.time)}</Text>
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

            {/* Castrado / Vacinado / Recompensa */}
            <View style={styles.charsCheckRow}>
              <View style={styles.checkItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={item.castrated ? "#4CAF50" : "#D0CECA"}
                />
                <Text style={[styles.checkLabel, !item.castrated && styles.checkLabelOff]}>Castrado</Text>
              </View>
              <View style={styles.checkItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={item.vaccinated ? "#4CAF50" : "#D0CECA"}
                />
                <Text style={[styles.checkLabel, !item.vaccinated && styles.checkLabelOff]}>Vacinado</Text>
              </View>
              <View style={styles.checkItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={item.reward ? "#4CAF50" : "#D0CECA"}
                />
                <Text style={[styles.checkLabel, !item.reward && styles.checkLabelOff]}>Recompensa</Text>
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
          <SectionTitle title="ÚLTIMO AVISTAMENTO" />
          <View style={styles.card}>
            <InfoRow
              icon="calendar-outline"
              label="Data"
              value={item.lastSeenDate ? formatDisplayDate(item.lastSeenDate) : "Não informado"}
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
          <SectionTitle title="CONTATO DO TUTOR" />
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
                  Tutor(a) do pet
                </Text>
              </View>
              {item.ownerPhone && (
                <TouchableOpacity
                  style={styles.callBtn}
                  activeOpacity={0.85}
                  onPress={handleOpenWhatsApp}
                >
                  <Ionicons name="logo-whatsapp" size={18} color={ORANGE} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
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
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
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
    boxShadow: "0px 2px 6px rgba(0,0,0,0.05)",
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
  checkLabelOff: {
    color: "#C0BBB5",
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

});
