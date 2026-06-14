import CartaoPet from "@/components/pet/cartao-pet";
import {
  CARD_HEIGHT,
  CARD_IMAGE_HEIGHT,
  CARD_WIDTH,
} from "@/constants/layout-grid";
import { AppColors, Radius, TouchTarget } from "@/constants/tema";
import { useAutenticacao } from "@/context/contexto-autenticacao";
import type { PetDashboardDto } from "@/services/api/modules/pets.api";
import { extrairMensagemErroApi } from "@/utils/alerta-erro-api";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EntradaTextoTema } from "../entrada-texto-tema";
import { TextoTema as Text } from "../texto-tema";

const SPECIES_FILTERS = [
  { label: "Cachorro", group: "CACHORRO" },
  { label: "Gato", group: "GATO" },
  { label: "Ave", group: "AVE" },
  { label: "Outros", group: "OUTROS" },
] as const;

type SpeciesFilterGroup = (typeof SPECIES_FILTERS)[number]["group"];

export default function TelaBusca() {
  const { getApi } = useAutenticacao();
  const [query, setQuery] = useState("");
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesFilterGroup | null>(null);
  const [sortByRecent, setSortByRecent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState<PetDashboardDto[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const hasActiveFilters = query.trim().length > 0 || !!selectedSpecies;
  const shouldSearch = hasSearched && hasActiveFilters;

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

  const handleSearch = async (species = selectedSpecies) => {
    const term = query.trim();
    if (!term && !species) return;

    setHasSearched(true);

    try {
      setLoading(true);
      setErrorMessage(null);
      const result = await getApi().pets.buscaPets({
        termo: term || undefined,
        grupoEspecie: species ?? undefined,
      });
      setPets(result.content);
    } catch (error) {
      setPets([]);
      setErrorMessage(extrairMensagemErroApi(error, "Erro ao buscar pets."));
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (!value.trim() && !selectedSpecies) {
      setPets([]);
      setHasSearched(false);
      setErrorMessage(null);
    }
  };

  const handleSpeciesChange = (species: SpeciesFilterGroup | null) => {
    setSelectedSpecies(species);

    if (query.trim() || species) {
      void handleSearch(species);
      return;
    }

    setPets([]);
    setHasSearched(false);
    setErrorMessage(null);
  };

  const renderPetCard = ({ item }: { item: PetDashboardDto }) => {
    const cardImage = item.imagens?.[0] ?? item.fotoUrl;

    return (
      <View style={styles.itemWrapper}>
        <CartaoPet
          variant="dashboard"
          name={item.nome}
          breed={item.raca ?? item.especie}
          location={item.localDesaparecimento}
          imageUrl={cardImage}
          imageHeight={CARD_IMAGE_HEIGHT}
          cardStyle={styles.itemCard}
          onPress={() =>
            router.push({
              pathname: "/detalhe-pet",
              params: { pet: encodeURIComponent(JSON.stringify(item)) },
            })
          }
        />
      </View>
    );
  };

  const listHeader = (
    <View style={styles.headerBlock}>
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={16} color="#9D988D" />
          <EntradaTextoTema
            placeholder="Nome, raça, bairro..."
            placeholderTextColor="#9D988D"
            value={query}
            onChangeText={handleQueryChange}
            onSubmitEditing={() => void handleSearch()}
            returnKeyType="search"
            style={styles.input}
          />
        </View>
        <Pressable
          style={[
            styles.searchButton,
            !hasActiveFilters && styles.searchButtonDisabled,
          ]}
          onPress={() => void handleSearch()}
          disabled={!hasActiveFilters || loading}
          accessibilityRole="button"
          accessibilityLabel="Buscar pets"
        >
          <Text style={styles.searchButtonText}>Buscar</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.speciesList}
      >
        <Pressable
          style={[
            styles.speciesChip,
            !selectedSpecies && styles.speciesChipActive,
          ]}
          onPress={() => handleSpeciesChange(null)}
          accessibilityRole="button"
          accessibilityLabel="Buscar todas as especies"
        >
          <Text
            style={[
              styles.speciesChipText,
              !selectedSpecies && styles.speciesChipTextActive,
            ]}
          >
            Todos
          </Text>
        </Pressable>
        {SPECIES_FILTERS.map(({ label, group }) => {
          const isActive = selectedSpecies === group;
          return (
            <Pressable
              key={group}
              style={[styles.speciesChip, isActive && styles.speciesChipActive]}
              onPress={() => handleSpeciesChange(isActive ? null : group)}
              accessibilityRole="button"
              accessibilityLabel={`Buscar especie ${label}`}
            >
              <Text
                style={[
                  styles.speciesChipText,
                  isActive && styles.speciesChipTextActive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.resultsRow}>
        <Text style={styles.resultsLabel}>
          {shouldSearch
            ? `${sortedPets.length} pets perdidos encontrados`
            : "Digite ou escolha uma especie"}
        </Text>
        <Pressable
          style={styles.sortButton}
          onPress={() => setSortByRecent((current) => !current)}
          disabled={!shouldSearch}
          accessibilityRole="button"
          accessibilityLabel="Alterar ordenacao dos resultados"
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

      {errorMessage ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <Pressable
            style={styles.retryButton}
            onPress={() => void handleSearch()}
            accessibilityRole="button"
            accessibilityLabel="Tentar buscar novamente"
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.page} edges={["right", "bottom", "left"]}>
      <FlatList
        style={styles.container}
        data={shouldSearch ? sortedPets : []}
        numColumns={2}
        columnWrapperStyle={styles.cardRow}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderPetCard}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          shouldSearch ? (
            <Text style={styles.emptyText}>Nenhum pet perdido encontrado.</Text>
          ) : null
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
    backgroundColor: AppColors.surface,
  },
  container: {
    flex: 1,
    paddingHorizontal: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
  cardRow: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  itemWrapper: {
    width: CARD_WIDTH,
  },
  headerBlock: {
    gap: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E7DED2",
    backgroundColor: "#FBF8F4",
    paddingHorizontal: 12,
    height: 46,
  },
  searchButton: {
    height: 46,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: AppColors.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonDisabled: {
    backgroundColor: "#E7DED2",
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Lexend_600SemiBold",
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: "#37332D",
    fontSize: 15,
    paddingVertical: Platform.select({ ios: 10, android: 7 }),
  },
  speciesList: {
    gap: 8,
    paddingRight: 4,
  },
  speciesChip: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: "#DDD5C9",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  speciesChipActive: {
    borderColor: AppColors.brand,
    backgroundColor: "#FFF0E9",
  },
  speciesChipText: {
    color: "#5C544A",
    fontSize: 12,
    fontFamily: "Lexend_600SemiBold",
  },
  speciesChipTextActive: {
    color: AppColors.brand,
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
    color: AppColors.danger,
    fontSize: 12,
  },
  errorBox: {
    gap: 8,
    marginTop: 2,
  },
  retryButton: {
    minHeight: TouchTarget.min,
    borderRadius: Radius.pill,
    backgroundColor: AppColors.brand,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "Lexend_600SemiBold",
  },
  itemCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#F5F2EC",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0px 3px 8px rgba(0,0,0,0.08)",
    elevation: 3,
  },
  emptyText: {
    textAlign: "center",
    color: "#8A8174",
    paddingVertical: 24,
    fontFamily: "Lexend_500Medium",
  },
});
