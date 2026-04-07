import { useAuth } from "@/context/auth-context";
import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0f6fd7" />
      </View>
    );
  }

  return <Redirect href={user ? "/dashboard" : "/login"} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f7fb",
  },
});
