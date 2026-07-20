import { AppColors, Radius, TouchTarget } from "@/constants/tema";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ORANGE = AppColors.brand;
const GREEN = "#3F9142";
const BG = AppColors.surface;

const IMG_PETS_PERDIDOS =
  "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80";
const IMG_ADOCAO =
  "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80";
const IMG_HISTORIA =
  "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=800&q=80";

export default function TelaHome() {
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.headerRow}>
          <View style={styles.logoRow}>
            <View style={styles.logoBadge}>
              <Ionicons name="paw" size={16} color="#fff" />
            </View>
            <Text>
              <Text style={styles.logoBold}>Central</Text>
              <Text style={styles.logoAccent}>Pet</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={styles.notifBtn}
            accessibilityRole="button"
            accessibilityLabel="Ver notificações"
          >
            <Ionicons name="notifications-outline" size={20} color="#1a1a1a" />
          </TouchableOpacity>
        </View>

        {/* ── Saudação ── */}
        <View style={styles.greetingBlock}>
          <Text style={styles.greetingTitle}>Olá, Amigo dos Pets! 👋</Text>
          <Text style={styles.greetingSubtitle}>
            Como podemos ajudar você e a comunidade hoje?
          </Text>
        </View>

        {/* ── Card Pets Perdidos ── */}
        <TouchableOpacity
          style={styles.featureCard}
          activeOpacity={0.9}
          onPress={() => router.push("/painel")}
          accessibilityRole="button"
          accessibilityLabel="Ver alertas de pets perdidos próximos"
        >
          <Image
            source={{ uri: IMG_PETS_PERDIDOS }}
            style={styles.featureImage}
            resizeMode="cover"
          />
          <View style={[styles.featureIconBadge, { backgroundColor: ORANGE }]}>
            <Ionicons name="paw" size={20} color="#fff" />
          </View>
          <View style={styles.featureBody}>
            <Text style={styles.featureTitle}>Pets Perdidos</Text>
            <Text style={styles.featureDesc}>
              Ajude a reencontrar pets desaparecidos na sua região.
            </Text>
            <View style={[styles.featureCta, { backgroundColor: ORANGE }]}>
              <Text style={styles.featureCtaText}>Ver alertas próximos</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ── Card Adoção ── */}
        <TouchableOpacity
          style={styles.featureCard}
          activeOpacity={0.9}
          onPress={() => router.push("/adocao")}
          accessibilityRole="button"
          accessibilityLabel="Encontrar um pet para adoção"
        >
          <Image
            source={{ uri: IMG_ADOCAO }}
            style={styles.featureImage}
            resizeMode="cover"
          />
          <View style={[styles.featureIconBadge, { backgroundColor: GREEN }]}>
            <Ionicons name="heart" size={18} color="#fff" />
          </View>
          <View style={styles.featureBody}>
            <Text style={styles.featureTitle}>Adoção</Text>
            <Text style={styles.featureDesc}>
              Encontre seu novo melhor amigo em ONGs parceiras.
            </Text>
            <View style={[styles.featureCta, { backgroundColor: GREEN }]}>
              <Text style={styles.featureCtaText}>Encontrar um amigo</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* ── Apoie a Causa ── */}
        <TouchableOpacity
          style={styles.donateCard}
          activeOpacity={0.85}
          onPress={() =>
            Alert.alert(
              "Em breve",
              "Estamos preparando esta função para você conhecer e apoiar ONGs parceiras.",
            )
          }
          accessibilityRole="button"
          accessibilityLabel="Apoie a causa conhecendo ONGs parceiras"
        >
          <View style={styles.donateIcon}>
            <Ionicons name="heart-circle-outline" size={22} color={ORANGE} />
          </View>
          <View style={styles.donateTexts}>
            <Text style={styles.donateTitle}>Apoie a Causa</Text>
            <Text style={styles.donateDesc}>
              Conheça ONGs parceiras e faça uma doação.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#B7AFA4" />
        </TouchableOpacity>

        {/* ── História Real ── */}
        <View style={styles.storyCard}>
          <Image
            source={{ uri: IMG_HISTORIA }}
            style={styles.storyImage}
            resizeMode="cover"
          />
          <View style={styles.storyOverlay} />
          <View style={styles.storyTag}>
            <Text style={styles.storyTagText}>História Real</Text>
          </View>
          <Text style={styles.storyCaption}>
            Max voltou para casa após 15 dias graças à comunidade!
          </Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 120 },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  logoBold: { fontFamily: "Lexend_700Bold", fontSize: 20, color: "#1A1A1A" },
  logoAccent: { fontFamily: "Lexend_700Bold", fontSize: 20, color: ORANGE },
  notifBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0EDEA",
    alignItems: "center",
    justifyContent: "center",
  },

  greetingBlock: { marginBottom: 20, gap: 4 },
  greetingTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 24,
    color: "#1A1A1A",
  },
  greetingSubtitle: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#8E8476",
  },

  featureCard: {
    borderRadius: Radius.lg,
    backgroundColor: "#F5F2EC",
    overflow: "hidden",
    marginBottom: 16,
    boxShadow: "0px 3px 8px rgba(0,0,0,0.08)",
    elevation: 3,
  },
  featureImage: { width: "100%", height: 150, backgroundColor: "#E8E4DF" },
  featureIconBadge: {
    position: "absolute",
    top: 128,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: BG,
  },
  featureBody: { padding: 16, paddingTop: 28 },
  featureTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 18,
    color: "#1A1A1A",
    marginBottom: 4,
  },
  featureDesc: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    color: "#7A7268",
    marginBottom: 14,
  },
  featureCta: {
    minHeight: TouchTarget.min,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  featureCtaText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 14,
    color: "#fff",
  },

  donateCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: AppColors.border,
    backgroundColor: BG,
    padding: 14,
    marginBottom: 16,
  },
  donateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FBEFE9",
    alignItems: "center",
    justifyContent: "center",
  },
  donateTexts: { flex: 1 },
  donateTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 14,
    color: "#1A1A1A",
    marginBottom: 2,
  },
  donateDesc: {
    fontFamily: "Lexend_400Regular",
    fontSize: 12,
    color: "#8E8476",
  },

  storyCard: {
    borderRadius: Radius.lg,
    overflow: "hidden",
    height: 190,
  },
  storyImage: { width: "100%", height: "100%" },
  storyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.32)",
  },
  storyTag: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  storyTagText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 11,
    color: "#fff",
  },
  storyCaption: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    fontFamily: "Lexend_700Bold",
    fontSize: 16,
    lineHeight: 21,
    color: "#fff",
  },
});
