import { AppColors, TouchTarget } from "@/constants/tema";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TelaMapaWeb() {
  function voltarParaHome() {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/painel");
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable style={styles.homeButton} onPress={voltarParaHome}>
            <Text style={styles.homeButtonText}>Voltar para Home</Text>
          </Pressable>
        </View>

        <View style={styles.center}>
          <Text style={styles.icon}>🗺️</Text>
          <Text style={styles.title}>Mapa não disponível na web</Text>
          <Text style={styles.description}>
            O mapa interativo está disponível no aplicativo móvel.{"\n"}
            Escaneie o QR Code com o Expo Go para usar no celular.
          </Text>
          <Pressable style={styles.backButton} onPress={voltarParaHome}>
            <Text style={styles.backButtonText}>Voltar para o Painel</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.surface },
  container: { flex: 1 },
  header: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 2,
  },
  homeButton: {
    minHeight: TouchTarget.min,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  homeButtonText: { fontFamily: "Lexend_600SemiBold", color: "#fff" },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 32,
  },
  icon: { fontSize: 56 },
  title: {
    fontFamily: "Lexend_600SemiBold",
    fontSize: 20,
    color: "#1A1A1A",
    textAlign: "center",
  },
  description: {
    fontFamily: "Lexend_400Regular",
    fontSize: 14,
    color: "#8E8476",
    textAlign: "center",
    lineHeight: 22,
  },
  backButton: {
    minHeight: TouchTarget.min,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: AppColors.brand,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  backButtonText: { fontFamily: "Lexend_600SemiBold", color: "#fff" },
});
