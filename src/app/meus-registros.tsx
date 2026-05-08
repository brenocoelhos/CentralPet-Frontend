import EstruturaApp from "@/components/layout/estrutura-app";
import CartaoPet from "@/components/pet/cartao-pet";
import { TextoTema as Text } from "@/components/texto-tema";
import { CARD_GAP, CARD_HEIGHT, CARD_IMAGE_HEIGHT, CARD_WIDTH, HORIZONTAL_PADDING } from "@/constants/layout-grid";
import { AppColors, Radius, TouchTarget } from "@/constants/tema";
import { useAutenticacao } from "@/context/contexto-autenticacao";
import { criarApi } from "@/services/api";
import type { PetDashboardDto } from "@/services/api/modules/pets.api";
import { extrairMensagemErroApi } from "@/utils/alerta-erro-api";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  View
} from "react-native";

const ORANGE = AppColors.brand;
const BG = AppColors.surface;

export default function MeusRegistrosRoute() {
  const router = useRouter();
  const { user, token } = useAutenticacao();
  const [pets, setPets] = useState<PetDashboardDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadPets = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        }
        setErrorMessage(null);

        if (!user?.uid || !token) {
          setErrorMessage("Voce precisa estar logado para ver seus registros.");
          setPets([]);
          return;
        }

        const result = await criarApi({ token }).pets.buscaPets({ usuarioId: user.uid });
        setPets(result);
      } catch (error) {
        setErrorMessage(extrairMensagemErroApi(error, "Erro ao carregar registros."));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token, user?.uid],
  );

  useFocusEffect(
    useCallback(() => {
      void loadPets(true);
    }, [loadPets]),
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    void loadPets(false);
  }, [loadPets]);

  const handleDelete = async (id: string, nome: string) => {
    if (!token) {
      Alert.alert("Sessao expirada", "Entre novamente para excluir este registro.");
      return;
    }

    Alert.alert(
      "Excluir registro",
      `Deseja excluir o registro de "${nome}"? Esta acao nao pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              Vibration.vibrate(35);
              await criarApi({ token }).pets.deletePet(id);
              setPets((prev) => prev.filter((p) => p.id !== id));
              Vibration.vibrate(20);
            } catch {
              Vibration.vibrate([0, 40, 30, 40]);
              Alert.alert("Erro", "Nao foi possivel excluir o registro.");
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const skeletonItems = useMemo(() => Array.from({ length: 4 }, (_, i) => String(i)), []);

  const renderCard = ({ item }: { item: PetDashboardDto }) => {
    const cardImage = item.imagens?.[0] ?? item.fotoUrl;

    return (
      <View style={styles.cardWrapper}>
        <CartaoPet
          variant="dashboard"
          name={item.nome}
          breed={item.raca ?? item.especie}
          location={item.localDesaparecimento}
          imageUrl={cardImage}
          status={item.descricao?.some((d) => d.toLowerCase().includes("encontr")) ? "ENCONTRADO" : "PERDIDO"}
          imageHeight={CARD_IMAGE_HEIGHT}
          cardStyle={styles.petCard}
        />
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => void handleDelete(item.id, item.nome)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`Excluir registro de ${item.nome}`}
          accessibilityHint="Remove este pet dos seus registros"
        >
          <Ionicons name="trash-outline" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderSkeleton = ({ item }: { item: string }) => (
    <View key={item} style={styles.cardWrapper}>
      <View style={[styles.petCard, styles.skeletonCard]} />
    </View>
  );

  if (loading && pets.length === 0) {
    return (
      <EstruturaApp>
        <FlatList
          data={skeletonItems}
          keyExtractor={(item) => item}
          numColumns={2}
          renderItem={renderSkeleton}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        />
      </EstruturaApp>
    );
  }

  if (errorMessage && pets.length === 0) {
    return (
      <EstruturaApp>
        <View style={styles.centered}>
          <View style={styles.iconWrap}>
            <Ionicons name="alert-circle-outline" size={30} color="#8A7060" />
          </View>
          <Text style={styles.title}>Ops!</Text>
          <Text style={styles.description}>{errorMessage}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => void loadPets(true)}
            accessibilityRole="button"
            accessibilityLabel="Tentar carregar registros novamente"
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      </EstruturaApp>
    );
  }

  if (pets.length === 0) {
    return (
      <EstruturaApp>
        <View style={styles.centered}>
          <View style={styles.iconWrap}>
            <Ionicons name="document-text-outline" size={30} color="#8A7060" />
          </View>
          <Text style={styles.title}>Nenhum registro</Text>
          <Text style={styles.description}>
            Voce ainda nao cadastrou nenhum pet desaparecido.
          </Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => router.push("/cadastro-pet")}
            accessibilityRole="button"
            accessibilityLabel="Cadastrar novo pet"
          >
            <Text style={styles.retryButtonText}>Cadastrar pet</Text>
          </Pressable>
        </View>
      </EstruturaApp>
    );
  }

  return (
    <EstruturaApp>
      <FlatList
        style={styles.scroll}
        contentContainerStyle={styles.listContent}
        data={pets}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        columnWrapperStyle={styles.gridRow}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[ORANGE]}
            tintColor={ORANGE}
          />
        }
        ListHeaderComponent={
          <Text style={styles.countLabel}>
            {pets.length} {pets.length === 1 ? "registro" : "registros"}
          </Text>
        }
        ListFooterComponent={<View style={{ height: 24 }} />}
        showsVerticalScrollIndicator={false}
      />
    </EstruturaApp>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: BG,
    gap: 10,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F0EBE0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  description: {
    fontSize: 14,
    color: "#746C5F",
    textAlign: "center",
    lineHeight: 20,
  },
  scroll: { flex: 1, backgroundColor: BG },
  scrollContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: Platform.OS === "android" ? 12 : 8,
    paddingBottom: 24,
  },
  listContent: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: Platform.OS === "android" ? 12 : 8,
  },
  countLabel: {
    fontSize: 13,
    color: "#9D988D",
    marginBottom: 12,
  },
  gridRow: {
    flexDirection: "row",
    gap: CARD_GAP,
    marginBottom: CARD_GAP,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    position: "relative",
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
  deleteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: TouchTarget.min,
    height: TouchTarget.min,
    borderRadius: Radius.round,
    backgroundColor: "rgba(200, 50, 50, 0.85)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  retryButton: {
    marginTop: 8,
    minHeight: TouchTarget.min,
    paddingHorizontal: 16,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ORANGE,
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
});

