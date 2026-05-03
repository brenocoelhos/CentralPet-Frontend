import AppShell from "@/components/layout/app-shell";
import { ThemedText as Text } from "@/components/themed-text";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

export default function ConfiguracoesRoute() {
  return (
    <AppShell>
      <View style={styles.root}>
        <View style={styles.iconWrap}>
          <Ionicons name="settings-outline" size={30} color="#8A7060" />
        </View>
        <Text style={styles.title}>Configuracoes</Text>
        <Text style={styles.description}>
          Ajuste preferencias da conta e personalize sua experiencia no app.
        </Text>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
    gap: 10,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F0EBE0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  description: {
    fontSize: 14,
    color: "#746C5F",
    textAlign: "center",
    lineHeight: 20,
  },
});
