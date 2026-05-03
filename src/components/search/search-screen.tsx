import PetCard from "@/components/pet/pet-card";
import { ApiError, api } from "@/services/api";
import type { PetDashboardDto } from "@/services/api/modules/pets.api";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { ThemedText as Text } from "../themed-text";
import { ThemedTextInput } from "../themed-text-input";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [sortByRecent, setSortByRecent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState<PetDashboardDto[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const shouldSearch = query.trim().length > 0;

  const sortedPets = useMemo(() => {
    return [...pets].sort((left, right) => {
      const leftTime = new Date(left.dataDesaparecimento).getTime();
      const rightTime = new Date(right.dataDesaparecimento).getTime();

      if (sortByRecent) {
        return rightTime - leftTime;
      }

      return leftTime - rightTime;
    });
  }, [pets, sortByRecent]);

  const handleSearch = async (value: string) => {
    setQuery(value);

    const term = value.trim();
    if (!term) {
      setPets([]);
      setErrorMessage(null);
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const result = await api.pets.buscaPets({ nome: term });
      setPets(result);
    } catch (error) {
      setPets([]);
      if (error instanceof ApiError && typeof error.data === "object" && error.data) {
        const data = error.data as { erro?: string; erros?: string[] };
        setErrorMessage(data.erro ?? data.erros?.[0] ?? "Erro ao buscar pets.");
      } else {
        setErrorMessage("Erro ao buscar pets.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderPetCard = ({ item }: { item: PetDashboardDto }) => {
    return (
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
  };

  const listHeader = (
    <View style={styles.headerBlock}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={16} color="#9D988D" />
        <ThemedTextInput
          placeholder="Nome, raça, bairro..."
          placeholderTextColor="#9D988D"
          value={query}
          onChangeText={handleSearch}
          style={styles.input}
        />
      </View>

      <View style={styles.resultsRow}>
        <Text style={styles.resultsLabel}>
          {shouldSearch ? `${sortedPets.length} animais encontrados` : "Digite para buscar"}
        </Text>
        <Pressable
          style={styles.sortButton}
          onPress={() => setSortByRecent((current) => !current)}
          disabled={!shouldSearch}
        >
          <Text style={styles.sortButtonText}>
            {sortByRecent ? "Mais recentes" : "Mais antigos"}
          </Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color="#D97757" />
        </View>
      ) : null}

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        style={styles.container}
        data={shouldSearch ? sortedPets : []}
        numColumns={2}
        columnWrapperStyle={styles.cardRow}
        keyExtractor={(item) => item.id}
        renderItem={renderPetCard}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          shouldSearch ? <Text style={styles.emptyText}>Nenhum animal encontrado.</Text> : null
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 14,
  },
  listContent: {
    paddingBottom: 20,
    gap: 10,
  },
  cardRow: {
    gap: 10,
  },
  headerBlock: {
    gap: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E7DED2",
    backgroundColor: "#FBF8F4",
    paddingHorizontal: 12,
    height: 46,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: "#37332D",
    fontSize: 15,
    paddingVertical: Platform.select({ ios: 10, android: 7 }),
  },
  resultsRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resultsLabel: {
    color: "#7A7266",
    fontSize: 14,
    fontFamily: "Lexend_600SemiBold",
  },
  sortButton: {
    borderWidth: 1,
    borderColor: "#DDD5C9",
    borderRadius: 11,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: "#FFFFFF",
  },
  sortButtonText: {
    color: "#4B443A",
    fontSize: 12,
    fontFamily: "Lexend_600SemiBold",
  },
  loadingRow: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 2,
  },
  errorText: {
    color: "#D94F4F",
    fontSize: 12,
    marginTop: 2,
  },
  itemCard: {
    flex: 1,
    height: 272,
    borderWidth: 1,
    borderColor: "#E6DED2",
    borderRadius: 14,
    backgroundColor: "#FAF8F4",
  },
  emptyText: {
    textAlign: "center",
    color: "#8A8174",
    paddingVertical: 24,
    fontFamily: "Lexend_500Medium",
  },
});
