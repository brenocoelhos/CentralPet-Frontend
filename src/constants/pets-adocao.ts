export type PetAdocao = {
  id: string;
  name: string;
  breed: string;
  sex: string;
  age: string;
  photo: string;
  personality: string;
  children: string;
  size: string;
  energy: string;
  about: string;
  health: string[];
  location: string;
  distance: string;
  responsible: string;
  responsibleRole: string;
  responsibleAvatar: string;
  phone: string;
};

export const PETS_ADOCAO: PetAdocao[] = [
  {
    id: "bento",
    name: "Bento",
    breed: "Mistura de Golden Retriever",
    sex: "Macho",
    age: "2 anos",
    photo:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=900&q=85",
    personality: "Brincalhao",
    children: "Amigavel",
    size: "Medio",
    energy: "Passeios diarios",
    about:
      "Bento e um pacotinho de alegria esperando por seu lar definitivo. Ele e um companheiro calmo nas horas de descanso, adora longas caminhadas no parque e carinhos no sofa. Foi resgatado de um abrigo e se tornou um cao sociavel, doce e pronto para fazer parte de uma familia.",
    health: ["Vacinado", "Castrado", "Vermifugado"],
    location: "Mission District, SF",
    distance: "A 4,4 km de voce",
    responsible: "Sarah Jenkins",
    responsibleRole: "Gerente do Abrigo",
    responsibleAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80",
    phone: "5511999999999",
  },
  {
    id: "luna",
    name: "Luna",
    breed: "Vira-lata caramelo",
    sex: "Femea",
    age: "1 ano",
    photo:
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&q=85",
    personality: "Carinhosa",
    children: "Paciente",
    size: "Pequeno",
    energy: "Energia leve",
    about:
      "Luna e delicada, curiosa e muito apegada a pessoas. Gosta de brincar com bolinhas, dormir perto da familia e se adapta bem a apartamentos. Ela procura um lar tranquilo, com carinho e rotina.",
    health: ["Vacinada", "Castrada", "Vermifugada"],
    location: "Pinheiros, SP",
    distance: "A 2,1 km de voce",
    responsible: "Marina Alves",
    responsibleRole: "Voluntaria",
    responsibleAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&q=80",
    phone: "5511988887777",
  },
  {
    id: "thor",
    name: "Thor",
    breed: "Labrador",
    sex: "Macho",
    age: "4 anos",
    photo:
      "https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=900&q=85",
    personality: "Protetor",
    children: "Sociavel",
    size: "Grande",
    energy: "Ativo",
    about:
      "Thor e companheiro, obediente e adora atividades ao ar livre. Ele se da bem com outros caes e precisa de uma familia que goste de passeios e tenha espaco para ele circular.",
    health: ["Vacinado", "Castrado", "Vermifugado"],
    location: "Vila Mariana, SP",
    distance: "A 5,8 km de voce",
    responsible: "Carlos Mendes",
    responsibleRole: "Lar temporario",
    responsibleAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&q=80",
    phone: "5511977776666",
  },
  {
    id: "mel",
    name: "Mel",
    breed: "SRD",
    sex: "Femea",
    age: "8 meses",
    photo:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=900&q=85",
    personality: "Doce",
    children: "Cuidadosa",
    size: "Pequeno",
    energy: "Brincadeiras curtas",
    about:
      "Mel ainda e filhote e esta descobrindo o mundo. E esperta, gosta de colo e aprende comandos com facilidade. Vai muito bem em lares que possam acompanhar sua fase de crescimento.",
    health: ["Vacinada", "Vermifugada"],
    location: "Mooca, SP",
    distance: "A 7,3 km de voce",
    responsible: "Juliana Rocha",
    responsibleRole: "Protetora independente",
    responsibleAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&q=80",
    phone: "5511966665555",
  },
];

export function buscarPetAdocaoPorId(id?: string) {
  return PETS_ADOCAO.find((pet) => pet.id === id) ?? PETS_ADOCAO[0];
}
