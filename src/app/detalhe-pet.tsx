import EstruturaApp from "@/components/layout/estrutura-app";
import TelaDetalhePet from "@/components/pet/tela-detalhe-pet";
import { TextoTema as Text } from "@/components/texto-tema";
import { useAutenticacao } from "@/context/contexto-autenticacao";
import type { PetDashboardDto } from "@/services/api/modules/pets.api";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

type DetailItem = {
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
  latitude?: number;
  longitude?: number;
  color?: string;
  castrated?: boolean;
  vaccinated?: boolean;
};

export default function PetDetailRoute() {
  const { getApi } = useAutenticacao();
  const { pet, id } = useLocalSearchParams<{ pet?: string; id?: string }>();
  const [petFromId, setPetFromId] = useState<PetDashboardDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const parsedPet = useMemo(() => {
    if (!pet) {
      return null;
    }

    try {
      return JSON.parse(decodeURIComponent(pet)) as PetDashboardDto;
    } catch {
      return null;
    }
  }, [pet]);

  const petId = typeof id === "string" && id.trim().length > 0 ? id.trim() : null;

  const loadPetById = useCallback(async () => {
    if (!petId || parsedPet) {
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const result = await getApi().pets.buscarPetPorId(petId);
      setPetFromId(result);
    } catch {
      setErrorMessage("Nao foi possivel carregar os detalhes do pet.");
    } finally {
      setLoading(false);
    }
  }, [getApi, parsedPet, petId]);

  useEffect(() => {
    void loadPetById();
  }, [loadPetById]);

  const sourcePet = parsedPet ?? petFromId;

  if (loading && !sourcePet) {
    return (
      <EstruturaApp>
        <View style={styles.centered}>
          <ActivityIndicator color="#D97757" />
        </View>
      </EstruturaApp>
    );
  }

  if (errorMessage && !sourcePet) {
    return (
      <EstruturaApp>
        <View style={styles.centered}>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Pressable style={styles.retryButton} onPress={() => void loadPetById()}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      </EstruturaApp>
    );
  }

  if (!sourcePet) {
    return null;
  }

  const item = mapPetToDetailItem(sourcePet);

  return (
    <EstruturaApp>
      <TelaDetalhePet item={item} />
    </EstruturaApp>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 12,
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    color: "#D94F4F",
    textAlign: "center",
    fontSize: 14,
  },
  retryButton: {
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: "#D97757",
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontFamily: "Lexend_600SemiBold",
    fontSize: 14,
  },
});

function mapPetToDetailItem(item: PetDashboardDto): DetailItem {
  const hasFoundKeyword = item.descricao.some((chip) =>
    chip.toLowerCase().includes("encontr"),
  );
  const photos = item.imagens?.length ? item.imagens : item.fotoUrl ? [item.fotoUrl] : undefined;

  return {
    id: String(item.id),
    status: hasFoundKeyword ? "ENCONTRADO" : "PERDIDO",
    time: item.dataCadastro ?? item.dataDesaparecimento,
    name: item.nome,
    type: item.especie,
    breed: item.raca ?? "Sem raça",
    size: item.porte ?? "Não informado",
    tags: item.descricao,
    neighborhood: item.localDesaparecimento,
    distance: "",
    hasNewMessage: false,
    photos,
    ownerName: item.nomeTutor,
    ownerPhone: item.telefoneTutor,
    reward: item.recompensa ?? false,
    lastSeenDate: item.dataDesaparecimento,
    lastSeenAddress: item.localDesaparecimento,
    latitude: item.latitude,
    longitude: item.longitude,
    color: item.cor,
    castrated: item.castrado ?? false,
    vaccinated: item.vacinado ?? false,
  };
}
