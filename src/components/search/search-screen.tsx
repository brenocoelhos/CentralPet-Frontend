import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    FlatList,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

type PetItem = {
  id: string;
  name: string;
  species: string;
  breed: string;
};

const MOCK_PETS: PetItem[] = [
  { id: "1", name: "Bidu", species: "Cao", breed: "Vira-lata" },
  { id: "2", name: "Luna", species: "Gato", breed: "Siamese" },
  { id: "3", name: "Thor", species: "Cao", breed: "Labrador" },
  { id: "4", name: "Mel", species: "Gato", breed: "Persa" },
];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filteredPets = useMemo(() => {
    if (!query.trim()) {
      return MOCK_PETS;
    }

    const term = query.toLowerCase();
    return MOCK_PETS.filter((pet) => {
      return (
        pet.name.toLowerCase().includes(term) ||
        pet.species.toLowerCase().includes(term) ||
        pet.breed.toLowerCase().includes(term)
      );
    });
  }, [query]);

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.title}>Busca de pets</Text>

        <TextInput
          placeholder="Buscar por nome, especie ou raca"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />

        <FlatList
          data={filteredPets}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.itemCard}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeta}>
                {item.species} - {item.breed}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhum pet encontrado.</Text>
          }
        />

        <Pressable
          style={styles.button}
          onPress={() => router.push("/dashboard")}
        >
          <Text style={styles.buttonText}>Voltar ao dashboard</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f4f7fb",
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a2533",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cad6e5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
  },
  listContent: {
    gap: 10,
    paddingBottom: 10,
  },
  itemCard: {
    borderWidth: 1,
    borderColor: "#d9e1ec",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#ffffff",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a2533",
  },
  itemMeta: {
    fontSize: 14,
    color: "#4d6075",
  },
  emptyText: {
    textAlign: "center",
    color: "#6b7d90",
    paddingVertical: 20,
  },
  button: {
    backgroundColor: "#0f6fd7",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
