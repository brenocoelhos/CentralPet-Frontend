import AppShell from "@/components/layout/app-shell";
import PetCard from "@/components/pet/pet-card";
import { ThemedText as Text } from "@/components/themed-text";
import { ApiError, api } from "@/services/api";
import type { PetDashboardDto } from "@/services/api/modules/pets.api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    View,
} from "react-native";

export default function MeusRegistrosRoute() {
  const [pets, setPets] = useState<PetDashboardDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadPets() {
      try {
        setLoading(true);
        setErrorMessage(null);
        const userId = await AsyncStorage.getItem("@centralpet:userId");
        if (!userId) {
          setErrorMessage("Você precisa estar logado para ver seus registros.");
          return;
        }
        const result = await api.pets.buscaPets({ usuarioId: userId });
        setPets(result);
      } catch (error) {
        if (error instanceof ApiError && typeof error.data === "object" && error.data) {
          const data = error.data as { erro?: string; erros?: string[] };
          setErrorMessage(data.erro ?? data.erros?.[0] ?? "Erro ao carregar registros.");
        } else {
          setErrorMessage("Erro ao carregar registros.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadPets();
  }, []);

  const renderPetCard = ({ item }: { item: PetDashboardDto }) => (
    <PetCard
      variant="search"
      name={item.nome}
      breed={item.raca ?? item.especie}
      location={item.localDesaparecimento}
      imageUrl={item.fotoUrl}
      imageHeight={180}
      cardStyle={styles.itemCard}
    />
  );

  if (loading) {
    return (
      <AppShell>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#D97757" />
        </View>
      </AppShell>
    );
  }

  if (errorMessage) {
    return (
      <AppShell>
        <View style={styles.centered}>
          <View style={styles.iconWrap}>
            <Ionicons name="alert-circle-outline" size={30} color="#8A7060" />
          </View>
          <Text style={styles.title}>Ops!</Text>
          <Text style={styles.description}>{errorMessage}</Text>
        </View>
      </AppShell>
    );
  }

  if (pets.length === 0) {
    return (
      <AppShell>
        <View style={styles.centered}>
          <View style={styles.iconWrap}>
            <Ionicons name="document-text-outline" size={30} color="#8A7060" />
          </View>
          <Text style={styles.title}>Nenhum registro</Text>
          <Text style={styles.description}>
            Você ainda não cadastrou nenhum pet desaparecido.
          </Text>
        </View>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        renderItem={renderPetCard}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.countLabel}>
            {pets.length} {pets.length === 1 ? "registro" : "registros"}
          </Text>
        }
      />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
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
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 12,
    backgroundColor: "#FFFFFF",
  },
  countLabel: {
    fontSize: 13,
    color: "#9D988D",
    marginBottom: 4,
  },
  itemCard: {
    width: "100%",
  },
});

