import { Ionicons } from "@expo/vector-icons";
import PetCard from "@/components/pet/pet-card";
import { useMemo, useState } from "react";
import {
    FlatList,
    Platform,
    Pressable,
    SafeAreaView,
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

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [sortByRecent, setSortByRecent] = useState(true);

  const filteredPets = useMemo(() => {
    const term = query.trim().toLowerCase();

    const byQuery = MOCK_PETS.filter((pet) => {
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
  }, [query, sortByRecent]);

  const renderPetCard = ({ item }: { item: PetItem }) => {
    return (
      <PetCard
        variant="search"
        name={item.name}
        breed={item.breed}
        location={item.location}
        imageUrl={item.imageUrl}
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
          onChangeText={setQuery}
          style={styles.input}
        />
      </View>

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
    backgroundColor: "#FAF8F4",
  },
  emptyText: {
    textAlign: "center",
    color: "#8A8174",
    paddingVertical: 24,
    fontFamily: "Lexend_500Medium",
  },
});
