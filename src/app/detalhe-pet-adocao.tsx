import EstruturaApp from "@/components/layout/estrutura-app";
import TelaDetalhePetAdocao from "@/components/pet/tela-detalhe-pet-adocao";
import { buscarPetAdocaoPorId, type PetAdocao } from "@/data/pets-adocao-mock";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function PetDetailAdocaoRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [pet, setPet] = useState<PetAdocao | null | undefined>(undefined);

  useEffect(() => {
    let ativo = true;

    if (!id) {
      setPet(null);
      return;
    }

    void buscarPetAdocaoPorId(id).then((encontrado) => {
      if (ativo) {
        setPet(encontrado ?? null);
      }
    });

    return () => {
      ativo = false;
    };
  }, [id]);

  useEffect(() => {
    if (pet === null) {
      router.replace("/adocao");
    }
  }, [pet]);

  if (pet === undefined) {
    return (
      <EstruturaApp>
        <View style={styles.centered}>
          <ActivityIndicator color="#D97757" />
        </View>
      </EstruturaApp>
    );
  }

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
