import { AuthProvider } from "@/context/auth-context";
import { Stack } from "expo-router";

function AppStack() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: "#f4f7fb" },
      }}
    />
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppStack />
    </AuthProvider>
  );
}
