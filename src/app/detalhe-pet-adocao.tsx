import EstruturaApp from "@/components/layout/estrutura-app";
import TelaDetalhePetAdocao from "@/components/pet/tela-detalhe-pet-adocao";
import { buscarPetAdocaoPorId } from "@/data/pets-adocao-mock";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function PetDetailAdocaoRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const pet = id ? buscarPetAdocaoPorId(id) : undefined;

  useEffect(() => {
    if (!id || pet) {
      return;
    }
    router.replace("/adocao");
  }, [id, pet]);

  if (!pet) {
    return (
      <EstruturaApp>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Pet não encontrado.</Text>
        </View>
      </EstruturaApp>
    );
  }

  return (
    <EstruturaApp>
      <TelaDetalhePetAdocao pet={pet} />
    </EstruturaApp>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    color: "#D94F4F",
    textAlign: "center",
    fontSize: 14,
  },
});
