import { AppColors, Radius, TouchTarget } from "@/constants/tema";
import type { PetAdocao } from "@/data/pets-adocao-mock";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ORANGE = AppColors.brand;
const GREEN = "#3F9142";
const BG = AppColors.surface;

type TelaDetalhePetAdocaoProps = {
  pet: PetAdocao;
};

function HealthBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <View
      style={[
        styles.healthBadge,
        active ? styles.healthBadgeActive : styles.healthBadgeInactive,
      ]}
    >
      <Ionicons
        name="checkmark-circle"
        size={14}
        color={active ? GREEN : "#C0BBB5"}
      />
      <Text
        style={[styles.healthBadgeText, !active && styles.healthBadgeTextInactive]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TelaDetalhePetAdocao({ pet }: TelaDetalhePetAdocaoProps) {
  const insets = useSafeAreaInsets();
  const [isFavorito, setIsFavorito] = useState(false);
  const photo = pet.fotos[0];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Conheça ${pet.nome}, ${pet.raca}, disponível para adoção no CentralPet!`,
      });
    } catch {
      // usuário cancelou o compartilhamento
    }
  };

  const handleContato = async () => {
    const cleanedPhone = pet.responsavel.telefone?.replace(/\D/g, "") ?? "";

    if (!cleanedPhone) {
      Alert.alert(
        "Contato indisponível",
        "Este responsável não possui telefone cadastrado.",
      );
      return;
    }

    const message = `Ola! Tenho interesse em adotar o(a) ${pet.nome}.`;
    const url = `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`;

    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Erro", "Não foi possível abrir o WhatsApp.");
    }
  };

  const handleAbrirMapa = () => {
    router.push({
      pathname: "/mapa",
      params: { nome: pet.nome, endereco: pet.localizacao },
    });
  };

  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.photoWrap}>
          <Image source={{ uri: photo }} style={styles.photo} resizeMode="cover" />
          <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
            </TouchableOpacity>
            <View style={styles.topBarRight}>
              <TouchableOpacity
                style={styles.circleBtn}
                onPress={() => void handleShare()}
                accessibilityRole="button"
                accessibilityLabel="Compartilhar perfil"
              >
                <Ionicons name="share-social-outline" size={18} color="#1A1A1A" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.circleBtn}
                onPress={() => setIsFavorito((v) => !v)}
                accessibilityRole="button"
                accessibilityLabel={
                  isFavorito ? "Remover dos favoritos" : "Adicionar aos favoritos"
                }
              >
                <Ionicons
                  name={isFavorito ? "heart" : "heart-outline"}
                  size={18}
                  color={isFavorito ? "#D94F4F" : "#1A1A1A"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{pet.nome}</Text>
            <View style={styles.ageBadge}>
              <Text style={styles.ageBadgeText}>{pet.idade}</Text>
            </View>
          </View>
          <Text style={styles.breed}>
            {pet.raca} · {pet.sexo}
          </Text>

          <View style={styles.traitsRow}>
            <View style={styles.traitBox}>
              <View style={[styles.traitIcon, { backgroundColor: "#FBEFE9" }]}>
                <Ionicons name="paw" size={16} color={ORANGE} />
              </View>
              <Text style={styles.traitLabel}>Personalidade</Text>
              <Text style={styles.traitValue}>{pet.personalidade}</Text>
            </View>
            <View style={styles.traitBox}>
              <View style={[styles.traitIcon, { backgroundColor: "#EAF6EC" }]}>
                <Ionicons name="people" size={16} color={GREEN} />
              </View>
              <Text style={styles.traitLabel}>Crianças</Text>
              <Text style={styles.traitValue}>
                {pet.amigavelComCriancas ? "Amigável" : "Com cuidado"}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre o {pet.nome}</Text>
            <Text style={styles.sobreText}>{pet.sobre}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Saúde</Text>
            <View style={styles.healthRow}>
              <HealthBadge label="Vacinado" active={pet.vacinado} />
              <HealthBadge label="Castrado" active={pet.castrado} />
              <HealthBadge label="Vermifugado" active={pet.vermifugado} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Localização</Text>
            <TouchableOpacity
              style={styles.locationCard}
              activeOpacity={0.85}
              onPress={handleAbrirMapa}
              accessibilityRole="button"
              accessibilityLabel={`Ver ${pet.localizacao} no mapa`}
            >
              <View style={styles.locationIcon}>
                <Ionicons name="location" size={18} color={ORANGE} />
              </View>
              <View style={styles.locationTexts}>
                <Text style={styles.locationText}>{pet.localizacao}</Text>
                {pet.distancia ? (
                  <Text style={styles.locationDistance}>{pet.distancia}</Text>
                ) : null}
              </View>
              <Ionicons name="chevron-forward" size={18} color="#B7AFA4" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View
        style={[styles.contactBar, { paddingBottom: Math.max(insets.bottom, 16) }]}
      >
        <View style={styles.contactAvatar}>
          {pet.responsavel.avatarUrl ? (
            <Image
              source={{ uri: pet.responsavel.avatarUrl }}
              style={styles.contactAvatarImg}
            />
          ) : (
            <Ionicons name="person" size={20} color="#888" />
          )}
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName} numberOfLines={1}>
            {pet.responsavel.nome}
          </Text>
          <Text style={styles.contactRole} numberOfLines={1}>
            {pet.responsavel.cargo}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.contactBtn}
          activeOpacity={0.9}
          onPress={() => void handleContato()}
          accessibilityRole="button"
          accessibilityLabel={`Falar com ${pet.responsavel.nome} sobre ${pet.nome}`}
        >
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={16}
            color="#fff"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.contactBtnText}>Contato Responsável</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  scrollContent: { paddingBottom: 110 },

  photoWrap: { height: 340, backgroundColor: "#E8E4DF" },
  photo: { width: "100%", height: "100%" },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topBarRight: { flexDirection: "row", gap: 10 },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 2px 6px rgba(0,0,0,0.15)",
    elevation: 3,
  },

  card: {
    marginTop: -22,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: BG,
    paddingTop: 22,
    paddingHorizontal: 16,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  name: { fontFamily: "Lexend_700Bold", fontSize: 26, color: "#1A1A1A" },
  ageBadge: {
    backgroundColor: "#FBEFE9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  ageBadgeText: {
    fontFamily: "Lexend_700Bold",
    fontSize: 12,
    color: ORANGE,
  },
  breed: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#8E8476",
    marginTop: 2,
    marginBottom: 18,
  },

  traitsRow: { flexDirection: "row", gap: 10, marginBottom: 22 },
  traitBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: Radius.md,
    padding: 12,
    gap: 4,
  },
  traitIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  traitLabel: {
    fontFamily: "Lexend_400Regular",
    fontSize: 11,
    color: "#8E8476",
  },
  traitValue: {
    fontFamily: "Lexend_700Bold",
    fontSize: 14,
    color: "#1A1A1A",
  },

  section: { marginBottom: 22 },
  sectionTitle: {
    fontFamily: "Lexend_700Bold",
    fontSize: 15,
    color: "#1A1A1A",
    marginBottom: 10,
  },
  sobreText: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    lineHeight: 21,
    color: "#5A5348",
  },

  healthRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  healthBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  healthBadgeActive: {
    backgroundColor: "#EAF6EC",
    borderColor: "#CDE8D1",
  },
  healthBadgeInactive: {
    backgroundColor: "#F5F2EC",
    borderColor: AppColors.border,
  },
  healthBadgeText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 12,
    color: GREEN,
  },
  healthBadgeTextInactive: { color: "#B0A99F" },

  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F5F2EC",
    borderRadius: Radius.md,
    padding: 12,
  },
  locationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FBEFE9",
    alignItems: "center",
    justifyContent: "center",
  },
  locationTexts: { flex: 1 },
  locationText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 13,
    color: "#1A1A1A",
  },
  locationDistance: {
    fontFamily: "Lexend_400Regular",
    fontSize: 12,
    color: "#8E8476",
    marginTop: 1,
  },

  contactBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: BG,
    paddingHorizontal: 16,
    paddingTop: 14,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: AppColors.border,
    boxShadow: "0px -4px 12px rgba(0,0,0,0.08)",
    elevation: 8,
  },
  contactAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E8E4DF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  contactAvatarImg: { width: "100%", height: "100%" },
  contactInfo: { flex: 1, minWidth: 0 },
  contactName: { fontFamily: "Lexend_700Bold", fontSize: 13, color: "#1A1A1A" },
  contactRole: { fontFamily: "Lexend_400Regular", fontSize: 11, color: "#8E8476" },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: TouchTarget.min,
    paddingHorizontal: 14,
    borderRadius: Radius.pill,
    backgroundColor: ORANGE,
  },
  contactBtnText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 13,
    color: "#fff",
  },
});
