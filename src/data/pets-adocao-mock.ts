// Dados das telas de adoção.
// TODO: substituir por uma chamada real assim que o backend expuser um
// endpoint de pets disponíveis para adoção (hoje `pets.api.ts` só cobre pets perdidos).
// Enquanto isso, os pets cadastrados pelo próprio usuário ficam guardados
// localmente (AsyncStorage) e são somados aos pets de exemplo abaixo.

import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY_LOCAIS = "@centralpet:pets-adocao-locais";

export type ContatoResponsavelAdocao = {
  nome: string;
  cargo: string;
  avatarUrl?: string;
  telefone?: string;
};

export type PetAdocao = {
  id: string;
  nome: string;
  especie: "Cão" | "Gato";
  raca: string;
  idade: string;
  sexo: "Macho" | "Fêmea";
  personalidade: string;
  amigavelComCriancas: boolean;
  sobre: string;
  vacinado: boolean;
  castrado: boolean;
  vermifugado: boolean;
  localizacao: string;
  distancia?: string;
  fotos: string[];
  responsavel: ContatoResponsavelAdocao;
};

const FOTO_1 = "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80";
const FOTO_2 = "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80";
const FOTO_3 = "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=800&q=80";

export const PETS_ADOCAO_MOCK: PetAdocao[] = [
  {
    id: "bento",
    nome: "Bento",
    especie: "Cão",
    raca: "Mistura de Golden Retriever",
    idade: "2 anos",
    sexo: "Macho",
    personalidade: "Brincalhão",
    amigavelComCriancas: true,
    sobre:
      "Bento é um pacotinho de alegria esperando por seu lar definitivo. Ele é um companheiro calmo mas brincalhão que adora longas caminhadas no parque e carinhos no sofá. Foi resgatado de um abrigo e se tornou um cão amigável e sociável que se dá perfeitamente com crianças e outros pets.",
    vacinado: true,
    castrado: true,
    vermifugado: true,
    localizacao: "Mission District, SF",
    distancia: "4 km de você",
    fotos: [FOTO_1, FOTO_2],
    responsavel: {
      nome: "Sarah Jenkins",
      cargo: "Gerente do Abrigo",
      telefone: "5511999990001",
    },
  },
  {
    id: "luna",
    nome: "Luna",
    especie: "Gato",
    raca: "Persa",
    idade: "1 ano",
    sexo: "Fêmea",
    personalidade: "Carinhosa",
    amigavelComCriancas: true,
    sobre:
      "Luna é uma gatinha tranquila que adora um colo quentinho e uma janela ensolarada para observar o dia passar. Se dá bem com outros gatos e é muito independente na hora das brincadeiras.",
    vacinado: true,
    castrado: true,
    vermifugado: true,
    localizacao: "Downtown, SF",
    distancia: "2 km de você",
    fotos: [FOTO_3, FOTO_1],
    responsavel: {
      nome: "Marcos Lima",
      cargo: "Voluntário do Abrigo",
      telefone: "5511999990002",
    },
  },
  {
    id: "thor",
    nome: "Thor",
    especie: "Cão",
    raca: "Vira-lata caramelo",
    idade: "3 anos",
    sexo: "Macho",
    personalidade: "Protetor",
    amigavelComCriancas: true,
    sobre:
      "Thor é leal e atento, sempre de olho em quem ele ama. Precisa de um tutor com experiência em cães de porte médio e adora um bom passeio pela manhã.",
    vacinado: true,
    castrado: true,
    vermifugado: false,
    localizacao: "Noe Valley, SF",
    distancia: "6 km de você",
    fotos: [FOTO_2, FOTO_3],
    responsavel: {
      nome: "Sarah Jenkins",
      cargo: "Gerente do Abrigo",
      telefone: "5511999990001",
    },
  },
  {
    id: "mel",
    nome: "Mel",
    especie: "Gato",
    raca: "SRD",
    idade: "6 meses",
    sexo: "Fêmea",
    personalidade: "Curiosa",
    amigavelComCriancas: true,
    sobre:
      "Mel é uma filhote cheia de energia, sempre explorando cada cantinho da casa. Ainda está aprendendo o básico, mas já é super carinhosa com quem cuida dela.",
    vacinado: true,
    castrado: false,
    vermifugado: true,
    localizacao: "Castro, SF",
    distancia: "3 km de você",
    fotos: [FOTO_1, FOTO_3],
    responsavel: {
      nome: "Marcos Lima",
      cargo: "Voluntário do Abrigo",
      telefone: "5511999990002",
    },
  },
  {
    id: "rex",
    nome: "Rex",
    especie: "Cão",
    raca: "Pastor Alemão",
    idade: "4 anos",
    sexo: "Macho",
    personalidade: "Leal",
    amigavelComCriancas: false,
    sobre:
      "Rex é um cão dedicado e inteligente, ideal para um tutor experiente. Prefere um lar mais tranquilo, sem crianças pequenas, onde possa receber toda a atenção.",
    vacinado: true,
    castrado: true,
    vermifugado: true,
    localizacao: "Richmond, SF",
    distancia: "5 km de você",
    fotos: [FOTO_3, FOTO_2],
    responsavel: {
      nome: "Sarah Jenkins",
      cargo: "Gerente do Abrigo",
      telefone: "5511999990001",
    },
  },
  {
    id: "nina",
    nome: "Nina",
    especie: "Cão",
    raca: "Poodle",
    idade: "1 ano",
    sexo: "Fêmea",
    personalidade: "Alegre",
    amigavelComCriancas: true,
    sobre:
      "Nina é só alegria: adora brincar de buscar bolinha e receber visitas. É ótima com crianças e se adapta rápido a qualquer rotina.",
    vacinado: true,
    castrado: true,
    vermifugado: true,
    localizacao: "Sunset, SF",
    distancia: "7 km de você",
    fotos: [FOTO_2, FOTO_1],
    responsavel: {
      nome: "Marcos Lima",
      cargo: "Voluntário do Abrigo",
      telefone: "5511999990002",
    },
  },
];

async function lerPetsAdocaoLocais(): Promise<PetAdocao[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_LOCAIS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function listarTodosPetsAdocao(): Promise<PetAdocao[]> {
  const locais = await lerPetsAdocaoLocais();
  return [...locais, ...PETS_ADOCAO_MOCK];
}

export async function adicionarPetAdocao(pet: PetAdocao): Promise<void> {
  const locais = await lerPetsAdocaoLocais();
  await AsyncStorage.setItem(
    STORAGE_KEY_LOCAIS,
    JSON.stringify([pet, ...locais]),
  );
}

export async function buscarPetAdocaoPorId(
  id: string,
): Promise<PetAdocao | undefined> {
  const todos = await listarTodosPetsAdocao();
  return todos.find((pet) => pet.id === id);
}
