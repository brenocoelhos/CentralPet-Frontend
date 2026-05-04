import AppShell from "@/components/layout/app-shell";
import PetDetailScreen from "@/components/pet/pet-detail-screen";
import type { PetDashboardDto } from "@/services/api/modules/pets.api";
import { useLocalSearchParams } from "expo-router";

type DetailItem = {
  id: string;
  status: "PERDIDO" | "ENCONTRADO";
  time: string;
  name: string;
  type: string;
  breed: string;
  size: string;
  tags: string[];
  neighborhood: string;
  distance: string;
  hasNewMessage: boolean;
  photos?: string[];
  ownerName?: string;
  ownerPhone?: string;
  reward?: boolean;
  lastSeenDate?: string;
  lastSeenAddress?: string;
  color?: string;
  castrated?: boolean;
  vaccinated?: boolean;
};

export default function PetDetailRoute() {
  const { pet } = useLocalSearchParams<{ pet?: string }>();

  if (!pet) {
    return null;
  }

  let parsedPet: PetDashboardDto | null = null;

  try {
    parsedPet = JSON.parse(decodeURIComponent(pet));
  } catch {
    parsedPet = null;
  }

  if (!parsedPet) {
    return null;
  }

  const item = mapPetToDetailItem(parsedPet);

  return (
    <AppShell>
      <PetDetailScreen item={item} />
    </AppShell>
  );
}

function mapPetToDetailItem(item: PetDashboardDto): DetailItem {
  const hasFoundKeyword = item.descricao.some((chip) =>
    chip.toLowerCase().includes("encontr"),
  );

  return {
    id: item.id,
    status: hasFoundKeyword ? "ENCONTRADO" : "PERDIDO",
    time: item.dataCadastro ?? item.dataDesaparecimento,
    name: item.nome,
    type: item.especie,
    breed: item.raca ?? "Sem raca",
    size: item.porte ?? "Nao informado",
    tags: item.descricao,
    neighborhood: item.localDesaparecimento,
    distance: "",
    hasNewMessage: false,
    photos: item.fotoUrl ? [item.fotoUrl] : undefined,
    ownerName: item.nomeTutor,
    ownerPhone: item.telefoneTutor,
    reward: item.recompensa ?? false,
    lastSeenDate: item.dataDesaparecimento,
    lastSeenAddress: item.localDesaparecimento,
    color: item.cor,
    castrated: item.castrado ?? false,
    vaccinated: item.vacinado ?? false,
  };
}
