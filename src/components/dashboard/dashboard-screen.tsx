import { useRouter } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function DashboardScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>
          Acesso rapido aos modulos do sistema
        </Text>

        <View style={styles.grid}>
          <Pressable style={styles.card} onPress={() => router.push("/perfil")}>
            <Text style={styles.cardTitle}>Perfil</Text>
            <Text style={styles.cardText}>Visualizar dados do usuario</Text>
          </Pressable>

          <Pressable style={styles.card} onPress={() => router.push("/busca")}>
            <Text style={styles.cardTitle}>Busca</Text>
            <Text style={styles.cardText}>Procurar pets cadastrados</Text>
          </Pressable>

          <Pressable
            style={styles.card}
            onPress={() => router.push("/cadastro-pet")}
          >
            <Text style={styles.cardTitle}>Cadastro de pet</Text>
            <Text style={styles.cardText}>Adicionar novo pet</Text>
          </Pressable>

          <Pressable
            style={styles.card}
            onPress={() => router.push("/cadastro-usuario")}
          >
            <Text style={styles.cardTitle}>Cadastro de usuario</Text>
            <Text style={styles.cardText}>Cadastrar novo usuario</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.logoutButton}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.logoutButtonText}>Sair</Text>
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
    fontSize: 28,
    fontWeight: "800",
    color: "#1a2533",
  },
  subtitle: {
    fontSize: 16,
    color: "#4d6075",
    marginBottom: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "48%",
    minHeight: 120,
    borderRadius: 14,
    padding: 14,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d9e1ec",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a2533",
  },
  cardText: {
    fontSize: 13,
    color: "#4d6075",
  },
  logoutButton: {
    marginTop: "auto",
    backgroundColor: "#0f6fd7",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
