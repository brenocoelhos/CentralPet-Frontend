import TelaCadastroPet from "@/components/pet/tela-cadastro-pet";
import TelaCadastroPetAdocao from "@/components/pet/tela-cadastro-pet-adocao";
import { AppColors } from "@/constants/tema";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ORANGE = AppColors.brand;
const BG = AppColors.surface;

type Aba = "perdido" | "adocao";

export default function TelaNovo() {
  const [aba, setAba] = useState<Aba>("perdido");

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Cadastrar Pet</Text>
        <View style={styles.tabRow}>
          <Pressable
            style={[styles.tab, aba === "perdido" && styles.tabActive]}
            onPress={() => setAba("perdido")}
            accessibilityRole="button"
            accessibilityLabel="Cadastrar pet perdido"
            accessibilityState={{ selected: aba === "perdido" }}
          >
            <Text style={[styles.tabText, aba === "perdido" && styles.tabTextActive]}>
              Pet Perdido
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, aba === "adocao" && styles.tabActive]}
            onPress={() => setAba("adocao")}
            accessibilityRole="button"
            accessibilityLabel="Cadastrar pet para adoção"
            accessibilityState={{ selected: aba === "adocao" }}
          >
            <Text style={[styles.tabText, aba === "adocao" && styles.tabTextActive]}>
              Pet para Adoção
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.formArea}>
        {aba === "perdido" ? <TelaCadastroPet /> : <TelaCadastroPetAdocao />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  title: {
    fontFamily: "Lexend_700Bold",
    fontSize: 22,
    color: "#1A1A1A",
    marginBottom: 14,
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#F0EDEA",
    borderRadius: 999,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    minHeight: 40,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: ORANGE,
  },
  tabText: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 13,
    color: "#6F665A",
  },
  tabTextActive: {
    color: "#fff",
  },
  formArea: { flex: 1 },
});
