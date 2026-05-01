import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
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
  coat: string;
  size: string;
  location: string;
  daysAgo: number;
  status: "Perdido" | "Encontrado";
  tags: string[];
};

const MOCK_PETS: PetItem[] = [
  {
    id: "1",
    name: "Rex",
    species: "Cachorro",
    breed: "Labrador",
    coat: "Caramelo",
    size: "Porte Grande",
    location: "Vila Madalena, SP",
    daysAgo: 2,
    status: "Perdido",
    tags: ["Pelagem dourada", "Coleira azul"],
  },
  {
    id: "2",
    name: "Mimi",
    species: "Gato",
    breed: "Siames",
    coat: "Branco",
    size: "Porte Medio",
    location: "Pinheiros, SP",
    daysAgo: 1,
    status: "Encontrado",
    tags: ["Olhos azuis", "Sem coleira"],
  },
  {
    id: "3",
    name: "Thor",
    species: "Cachorro",
    breed: "Bulldog",
    coat: "Cinza",
    size: "Porte Medio",
    location: "Moema, SP",
    daysAgo: 5,
    status: "Perdido",
    tags: ["Focinho branco", "Porte medio"],
  },
  {
    id: "4",
    name: "Luna",
    species: "Gato",
    breed: "Persa",
    coat: "Preto",
    size: "Porte Pequeno",
    location: "Perdizes, SP",
    daysAgo: 3,
    status: "Encontrado",
    tags: ["Mansa", "Pelagem longa"],
  },
];

const FILTER_OPTIONS = ["Todos", "Perdidos", "Encontrados", "Cachorro", "Gato"] as const;

type FilterOption = (typeof FILTER_OPTIONS)[number];

export default function SearchScreen() {
  const router = useRouter();
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

      return [pet.name, pet.species, pet.breed, pet.coat, pet.location, ...pet.tags]
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
    const statusFound = item.status === "Encontrado";

    return (
      <View style={styles.itemCard}>
        <View style={styles.avatarBlock}>
          <Ionicons
            name={item.species === "Cachorro" ? "paw" : "logo-octocat"}
            size={35}
            color="#5E4A3F"
          />
        </View>

        <View style={styles.itemContent}>
          <View style={styles.itemHeadLine}>
            <Text style={styles.itemName}>{item.name}</Text>
            <View
              style={[
                styles.statusBadge,
                statusFound ? styles.statusBadgeFound : styles.statusBadgeLost,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  statusFound ? styles.statusTextFound : styles.statusTextLost,
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>

          <Text style={styles.itemMeta}>
            {item.breed} · {item.coat} · {item.size}
          </Text>

          <View style={styles.tagsRow}>
            {item.tags.map((tag) => (
              <View key={tag} style={styles.tagPill}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.itemLocation}>
            <Ionicons name="location-outline" size={12} color="#B5B0A3" /> {item.location}, {item.daysAgo} dias atras
          </Text>
        </View>
      </View>
    );
  };

  const listHeader = (
    <View style={styles.headerBlock}>
      <View style={styles.topBar}>

      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={16} color="#9D988D" />
        <ThemedTextInput
          placeholder="Nome, raca, bairro..."
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
        keyExtractor={(item) => item.id}
        renderItem={renderPetCard}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhum animal encontrado.</Text>}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <Pressable style={styles.backButton} onPress={() => router.push("/dashboard")}>
        <Text style={styles.backButtonText}>Voltar ao dashboard</Text>
      </Pressable>
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
    paddingBottom: 110,
    gap: 10,
  },
  headerBlock: {
    gap: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 25,
    fontFamily: "Lexend_700Bold",
    color: "#292722",
  },
  notificationButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#E5DDD1",
    backgroundColor: "#FAF8F4",
    alignItems: "center",
    justifyContent: "center",
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
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderColor: "#E6DED2",
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  avatarBlock: {
    width: 66,
    height: 66,
    borderRadius: 10,
    backgroundColor: "#F7E8E0",
    alignItems: "center",
    justifyContent: "center",
  },
  itemContent: {
    flex: 1,
    gap: 4,
  },
  itemHeadLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    fontSize: 21,
    color: "#2A2621",
    fontFamily: "Lexend_700Bold",
    lineHeight: 25,
  },
  statusBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusBadgeLost: {
    backgroundColor: "#F8E9E0",
  },
  statusBadgeFound: {
    backgroundColor: "#EEF7D9",
  },
  statusText: {
    fontSize: 11,
    fontFamily: "Lexend_600SemiBold",
  },
  statusTextLost: {
    color: "#9A562F",
  },
  statusTextFound: {
    color: "#4E7A22",
  },
  itemMeta: {
    fontSize: 14,
    color: "#6B6154",
    fontFamily: "Lexend_600SemiBold",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  tagPill: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E2DBD0",
    backgroundColor: "#F7F4EF",
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    color: "#6C6256",
    fontSize: 11,
    fontFamily: "Lexend_500Medium",
  },
  itemLocation: {
    fontSize: 12,
    color: "#94897A",
    fontFamily: "Lexend_400Regular",
  },
  emptyText: {
    textAlign: "center",
    color: "#8A8174",
    paddingVertical: 24,
    fontFamily: "Lexend_500Medium",
  },
  backButton: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 20,
    borderRadius: 10,
    backgroundColor: "#E57639",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EC8E58",
  },
  backButtonText: {
    color: "#FFFFFF",
    fontFamily: "Lexend_700Bold",
    fontSize: 14,
  },
});
