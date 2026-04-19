import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        contentStyle: { backgroundColor: "#f4f7fb" },
      }}
    >
      <Stack.Screen name="cadastro-pet" options={{ title: "Cadastrar Animal" }} />
    </Stack>
  );
}
