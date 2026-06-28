import {
  buscarPetAdocaoPorId,
  type PetAdocao,
} from "@/constants/pets-adocao";
import { Radius, TouchTarget } from "@/constants/tema";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ADOPTION_GREEN = "#3F8F7B";
const ADOPTION_DARK = "#2D4F46";
const ADOPTION_SOFT = "#EFF7F3";
const CORAL = "#C7674D";
const BG = "#FBFAF7";

type TraitCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
};

function TraitCard({ icon, label, value }: TraitCardProps) {
  return (
    <View style={styles.traitCard}>
      <View style={styles.traitIcon}>
        <Ionicons name={icon} size={18} color={ADOPTION_GREEN} />
      </View>
      <View style={styles.traitTextWrap}>
        <Text style={styles.traitLabel}>{label}</Text>
        <Text style={styles.traitValue}>{value}</Text>
      </View>
    </View>
  );
}

function HealthChip({ label }: { label: string }) {
  return (
    <View style={styles.healthChip}>
      <Ionicons name="checkmark-circle" size={14} color={ADOPTION_GREEN} />
      <Text style={styles.healthText}>{label}</Text>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrap}>
        <Ionicons name={icon} size={16} color={ADOPTION_GREEN} />
      </View>
      <View style={styles.infoTexts}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function handleContact(pet: PetAdocao) {
  const message = `Ola! Vi o ${pet.name} na tela de adocao da CentralPet e quero saber mais sobre o processo.`;
  const url = `https://wa.me/${pet.phone}?text=${encodeURIComponent(message)}`;

  Linking.openURL(url).catch(() => {
    Alert.alert("Erro", "Nao foi possivel abrir o WhatsApp.");
  });
}

export default function TelaDetalheAdocao() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const pet = buscarPetAdocaoPorId(id);

  return (
    <SafeAreaView style={styles.safe} edges={["right", "left"]}>
      <StatusBar barStyle="light-content" backgroundColor={ADOPTION_DARK} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={{ uri: pet.photo }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay} />

          <View style={styles.heroTopBar}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.roundButton}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <Ionicons name="chevron-back" size={22} color={ADOPTION_DARK} />
            </TouchableOpacity>

            <View style={styles.heroActions}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.roundButton}
                accessibilityRole="button"
                accessibilityLabel="Compartilhar animal para adocao"
              >
                <Ionicons
                  name="share-social-outline"
                  size={20}
                  color={ADOPTION_DARK}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.roundButton}
                accessibilityRole="button"
                accessibilityLabel="Favoritar animal para adocao"
              >
                <Ionicons name="heart" size={21} color={CORAL} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.adoptionBadge}>
            <Ionicons name="home" size={14} color={ADOPTION_DARK} />
            <Text style={styles.adoptionBadgeText}>Disponivel para adocao</Text>
          </View>
        </ImageBackground>

        <View style={styles.sheet}>
          <View style={styles.identityRow}>
            <View style={styles.identityText}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petMeta}>
                {pet.breed} - {pet.sex}
              </Text>
            </View>

            <View style={styles.ageBadge}>
              <Text style={styles.ageText}>{pet.age}</Text>
            </View>
          </View>

          <View style={styles.traitsGrid}>
            <TraitCard
              icon="happy-outline"
              label="Personalidade"
              value={pet.personality}
            />
            <TraitCard
              icon="people-outline"
              label="Criancas"
              value={pet.children}
            />
            <TraitCard icon="resize-outline" label="Porte" value={pet.size} />
            <TraitCard icon="walk-outline" label="Rotina" value={pet.energy} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre o {pet.name}</Text>
            <Text style={styles.aboutText}>{pet.about}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Saude</Text>
            <View style={styles.healthRow}>
              {pet.health.map((item) => (
                <HealthChip key={item} label={item} />
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Localizacao</Text>
            <View style={styles.infoCard}>
              <InfoRow
                icon="home-outline"
                label="Ponto de encontro"
                value={pet.location}
              />
              <View style={styles.infoSeparator} />
              <View style={styles.actionInfoRow}>
                <View style={styles.actionInfoText}>
                  <InfoRow
                    icon="location-outline"
                    label="Distancia"
                    value={pet.distance}
                  />
                </View>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.actionIconButton}
                  accessibilityRole="button"
                  accessibilityLabel="Abrir localizacao"
                >
                  <Ionicons name="navigate" size={18} color={ADOPTION_GREEN} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contato do responsavel</Text>
            <View style={styles.infoCard}>
              <View style={styles.ownerRow}>
                <Image source={{ uri: pet.responsibleAvatar }} style={styles.ownerAvatar} />
                <View style={styles.ownerInfo}>
                  <Text style={styles.ownerName}>{pet.responsible}</Text>
                  <Text style={styles.ownerSub}>{pet.responsibleRole}</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.callBtn}
                  onPress={() => handleContact(pet)}
                  accessibilityRole="button"
                  accessibilityLabel="Contato com responsavel"
                >
                  <Ionicons name="logo-whatsapp" size={18} color={ADOPTION_GREEN} />
                </TouchableOpacity>
              </View>
              <View style={styles.infoSeparator} />
              <InfoRow
                icon="chatbubble-outline"
                label="Mensagem"
                value="Fale sobre o processo de adocao"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 118,
  },
  hero: {
    height: 330,
    justifyContent: "space-between",
    backgroundColor: ADOPTION_DARK,
  },
  heroImage: {
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    backgroundColor: "rgba(31,54,48,0.18)",
  },
  heroTopBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  heroActions: {
    flexDirection: "row",
    gap: 10,
  },
  roundButton: {
    width: TouchTarget.min,
    height: TouchTarget.min,
    borderRadius: Radius.round,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  adoptionBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginLeft: 20,
    marginBottom: 28,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(239,247,243,0.94)",
  },
  adoptionBadgeText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 12,
    color: ADOPTION_DARK,
  },
  sheet: {
    marginTop: -20,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 24,
    backgroundColor: BG,
  },
  identityRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 20,
  },
  identityText: {
    flex: 1,
    minWidth: 0,
  },
  petName: {
    fontFamily: "Lexend_700Bold",
    fontSize: 27,
    color: "#282724",
    marginBottom: 5,
  },
  petMeta: {
    fontFamily: "Lexend_400Regular",
    fontSize: 13,
    lineHeight: 18,
    color: "#8A8178",
  },
  ageBadge: {
    minWidth: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: "#F7E8E2",
  },
  ageText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 12,
    color: CORAL,
    textAlign: "center",
  },
  traitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  traitCard: {
    width: "48.5%",
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: ADOPTION_SOFT,
  },
  traitIcon: {
    width: 31,
    height: 31,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  traitTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  traitLabel: {
    fontFamily: "Lexend_400Regular",
    fontSize: 10,
    color: "#8B9690",
  },
  traitValue: {
    fontFamily: "Lexend_700Bold",
    fontSize: 12,
    color: ADOPTION_DARK,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 17,
    color: "#37342F",
    marginBottom: 10,
  },
  aboutText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    lineHeight: 23,
    color: "#7B746D",
  },
  healthRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },
  healthChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: "#BFDCD1",
    backgroundColor: "#FFFFFF",
  },
  healthText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 12,
    color: ADOPTION_DARK,
  },
  infoCard: {
    backgroundColor: "#F5F2EC",
    borderRadius: 16,
    padding: 14,
    elevation: 1,
  },
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
  infoTexts: {
    flex: 1,
    minWidth: 0,
  },
  infoLabel: {
    fontFamily: "Lexend_400Regular",
    fontSize: 11,
    color: "#999",
  },
  infoValue: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 13,
    color: "#1A1A1A",
  },
  infoSeparator: {
    height: 1,
    backgroundColor: "#E0DBD6",
    marginVertical: 10,
  },
  actionInfoRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 10,
  },
  actionInfoText: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },
  actionIconButton: {
    width: TouchTarget.min,
    height: TouchTarget.min,
    borderRadius: Radius.round,
    borderWidth: 1,
    borderColor: "#BFDCD1",
    backgroundColor: "#F4FBF8",
    alignItems: "center",
    justifyContent: "center",
  },
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
  },
  ownerInfo: {
    flex: 1,
    minWidth: 0,
  },
  ownerName: {
    fontFamily: "Lexend_700Bold",
    fontSize: 15,
    color: "#1A1A1A",
  },
  ownerSub: {
    fontFamily: "Lexend_400Regular",
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  callBtn: {
    width: TouchTarget.min,
    height: TouchTarget.min,
    borderRadius: Radius.sm,
    backgroundColor: "#EDE8E3",
    alignItems: "center",
    justifyContent: "center",
  },
});
