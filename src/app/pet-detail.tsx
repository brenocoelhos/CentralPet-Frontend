import AppShell from "@/components/layout/app-shell";
import PetDetailScreen from "@/components/pet/pet-detail-screen";
import { useLocalSearchParams } from "expo-router";

// 🔹 MOCK (use o mesmo do dashboard)
const MOCK_DATA = [
  {
    id: "1",
    status: "PERDIDO",
    time: "há 2h",
    name: "Bolt",
    type: "Cão",
    breed: "Golden Retriever",
    size: "Porte grande",
    tags: ["Pelagem dourada", "Coleira azul", "Sem chip"],
    neighborhood: "Parque Ibirapuera",
    distance: "0,8 km de você",
    hasNewMessage: false,
    description: "Muito dócil, atende pelo nome.",
    ownerName: "João",
    ownerPhone: "11999999999",
    reward: true,
    lastSeenDate: "20/04/2026",
    lastSeenAddress: "Parque Ibirapuera",
    color: "Dourado",
    age: "3 anos",
    weight: "28kg",
    castrated: true,
    vaccinated: true,
  },
  {
    id: "2",
    status: "ENCONTRADO",
    time: "há 5h",
    name: "Gata laranja",
    type: "Gato",
    breed: "SRD",
    size: "Porte pequeno",
    tags: ["Pelagem laranja", "Sem coleira", "Dócil"],
    neighborhood: "Vila Mada",
    distance: "1,4 km de você",
    hasNewMessage: true,
    description: "Aparenta estar perdida.",
    ownerName: "Maria",
    ownerPhone: "11988888888",
    lastSeenDate: "21/04/2026",
    lastSeenAddress: "Vila Madalena",
    color: "Laranja",
    age: "2 anos",
    weight: "4kg",
    castrated: false,
    vaccinated: false,
  },
];

export default function PetDetailRoute() {
  const { id } = useLocalSearchParams();

  const item = MOCK_DATA.find((o) => o.id === id);

  // 🔹 fallback simples (evita crash)
  if (!item) {
    return null;
  }

  return (
    <AppShell>
      <PetDetailScreen item={item} />
    </AppShell>
  );
}
