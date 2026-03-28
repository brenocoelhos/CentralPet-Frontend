import { useRouter } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.card}>
        <Text style={styles.title}>Perfil</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.value}>Usuario Demo</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>usuario@centralpet.com</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Telefone</Text>
          <Text style={styles.value}>(11) 99999-9999</Text>
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.secondaryText}>Voltar</Text>
          </Pressable>

          <Pressable
            style={styles.primaryButton}
            onPress={() => router.push("/dashboard")}
          >
            <Text style={styles.primaryText}>Dashboard</Text>
          </Pressable>
        </View>
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
    maxWidth: 500,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d9e1ec",
    padding: 20,
    gap: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1a2533",
    marginBottom: 6,
  },
  row: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6b7d90",
    textTransform: "uppercase",
  },
  value: {
    fontSize: 16,
    color: "#1a2533",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#0f6fd7",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#0f6fd7",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  secondaryText: {
    color: "#0f6fd7",
    fontWeight: "700",
  },
  primaryText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
