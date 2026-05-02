import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { ThemedText as Text } from "../themed-text";
import { ThemedTextInput } from "../themed-text-input";

type PetItem = {
  id: string;
  name: string;
  species: "Cachorro" | "Gato";
  breed: string;
  location: string;
  imageUrl: string;
  daysAgo: number;
  status: "Perdido" | "Encontrado";
};

const MOCK_PETS: PetItem[] = [
  {
    id: "1",
    name: "Rex",
    species: "Cachorro",
    breed: "Labrador",
    location: "Vila Madalena, SP",
    imageUrl:
      "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=900&q=80",
    daysAgo: 2,
    status: "Perdido",
  },
  {
    id: "2",
    name: "Mimi",
    species: "Gato",
    breed: "Siames",
    location: "Pinheiros, SP",
    imageUrl:
      "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=900&q=80",
    daysAgo: 1,
    status: "Encontrado",
  },
  {
    id: "3",
    name: "Thor",
    species: "Cachorro",
    breed: "Bulldog",
    location: "Moema, SP",
    imageUrl:
      "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=900&q=80",
    daysAgo: 5,
    status: "Perdido",
  },
  {
    id: "4",
    name: "Luna",
    species: "Gato",
    breed: "Persa",
    location: "Perdizes, SP",
    imageUrl:
      "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=80",
    daysAgo: 3,
    status: "Encontrado",
  },
  {
    id: "5",
    name: "Thor",
    species: "Cachorro",
    breed: "Bulldog",
    location: "Moema, SP",
    imageUrl:
      "https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=900&q=80",
    daysAgo: 5,
    status: "Perdido",
  },
  {
    id: "6",
    name: "Luna",
    species: "Gato",
    breed: "Persa",
    location: "Perdizes, SP",
    imageUrl:
      "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=80",
    daysAgo: 3,
    status: "Encontrado",
  },
];

const FILTER_OPTIONS = ["Todos", "Perdidos", "Encontrados", "Cachorro", "Gato"] as const;

type FilterOption = (typeof FILTER_OPTIONS)[number];

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterOption>("Todos");
  const [sortByRecent, setSortByRecent] = useState(true);

  const filteredPets = useMemo(() => {
    const term = query.trim().toLowerCase();

    const byFilter = MOCK_PETS.filter((pet) => {
      if (activeFilter === "Todos") return true;
      if (activeFilter === "Perdidos") return pet.status === "Perdido";
      if (activeFilter === "Encontrados") return pet.status === "Encontrado";
      return pet.species === activeFilter;
    });

    const byQuery = byFilter.filter((pet) => {
      if (!term) return true;

      return [pet.name, pet.species, pet.breed, pet.location]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });

    return [...byQuery].sort((left, right) => {
      if (sortByRecent) {
        return left.daysAgo - right.daysAgo;
      }

      return right.daysAgo - left.daysAgo;
    });
  }, [activeFilter, query, sortByRecent]);

  const renderPetCard = ({ item }: { item: PetItem }) => {
    return (
      <View style={styles.itemCard}>
        <Image source={{ uri: item.imageUrl }} style={styles.petImage} resizeMode="cover" />

        <View style={styles.itemContent}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>

          <Text style={styles.itemBreed} numberOfLines={1}>
            {item.breed}
          </Text>

          <Text style={styles.itemLocation} numberOfLines={2}>{item.location}</Text>
        </View>
      </View>
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
          onChangeText={setQuery}
          style={styles.input}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {FILTER_OPTIONS.map((option) => {
          const active = option === activeFilter;
          return (
            <Pressable
              key={option}
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setActiveFilter(option)}
            >
              <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.resultsRow}>
        <Text style={styles.resultsLabel}>{filteredPets.length} animais encontrados</Text>
        <Pressable
          style={styles.sortButton}
          onPress={() => setSortByRecent((current) => !current)}
        >
          <Text style={styles.sortButtonText}>
            {sortByRecent ? "Mais recentes" : "Mais antigos"}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        style={styles.container}
        data={filteredPets}
        numColumns={2}
        columnWrapperStyle={styles.cardRow}
        keyExtractor={(item) => item.id}
        renderItem={renderPetCard}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum animal encontrado.</Text>}
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
  filtersRow: {
    gap: 8,
    paddingVertical: 2,
    paddingRight: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DDD5C9",
    backgroundColor: "#FFFFFF",
  },
  filterChipActive: {
    backgroundColor: "#E57639",
    borderColor: "#E57639",
  },
  filterChipText: {
    color: "#6F6659",
    fontSize: 12,
    fontFamily: "Lexend_500Medium",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
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
  itemCard: {
    flex: 1,
    height: 272,
    borderWidth: 1,
    borderColor: "#E6DED2",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#FAF8F4",
  },
  petImage: {
    width: "100%",
    height: 180,
    alignSelf: "center",
    backgroundColor: "#EFE7DE",
  },
  itemContent: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  itemName: {
    fontSize: 22,
    color: "#2A2621",
    fontFamily: "Lexend_600SemiBold",
    lineHeight: 26,
  },
  itemBreed: {
    fontSize: 13,
    color: "#6F665A",
    fontFamily: "Lexend_500Medium",
  },
  itemLocation: {
    fontSize: 11,
    color: "#7A7268",
    fontFamily: "Lexend_400Regular",
    minHeight: 30,
  },
  emptyText: {
    textAlign: "center",
    color: "#8A8174",
    paddingVertical: 24,
    fontFamily: "Lexend_500Medium",
  },
});
