import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function PetSignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");

  const handleCreatePet = () => {
    if (!name || !species || !breed || !age) {
      Alert.alert("Campos obrigatorios", "Preencha todos os campos do pet.");
      return;
    }

    Alert.alert("Pet cadastrado", "Cadastro realizado com sucesso.");
    router.replace("/dashboard");
  };

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.card}>
        <Text style={styles.title}>Cadastro de pet</Text>

        <TextInput
          placeholder="Nome do pet"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Especie"
          value={species}
          onChangeText={setSpecies}
          style={styles.input}
        />
        <TextInput
          placeholder="Raca"
          value={breed}
          onChangeText={setBreed}
          style={styles.input}
        />
        <TextInput
          placeholder="Idade"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
          style={styles.input}
        />

        <Pressable style={styles.primaryButton} onPress={handleCreatePet}>
          <Text style={styles.primaryButtonText}>Salvar pet</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Voltar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f7fb",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: "#d9e1ec",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a2533",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cad6e5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fbfdff",
  },
  primaryButton: {
    backgroundColor: "#0f6fd7",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#0f6fd7",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#0f6fd7",
    fontWeight: "700",
  },
});
