// Adicione ou atualize esses tipos no arquivo pets.api.ts

export type CadastroPetPayload = {
  usuarioId: string;
  nome: string;
  especie: string;
  raca?: string;
  cor?: string;
  porte?: string;
  dataDesaparecimento: string;
  localDesaparecimento: string;
  descricao: string[];
  fotoUrl?: string;
  nomeTutor?: string;
  telefoneTutor?: string;
  castrado: boolean;
  vacinado: boolean;
  recompensa: boolean;
  dataCadastro?: string;
  idade?: string; // Novo campo opcional
  cep?: string;   // Novo campo opcional
};

// Dentro da função criarApiPets adicione a rota de atualização:
export function criarApiPets(http: ClienteHttp, routes: RotasPets) {
  return {
    cadastroPet(payload: CadastroPetPayload) {
      return http.post<CadastroPetResponse>(routes.cadastroPet, payload);
    },
    atualizarPet(petId: string, payload: Partial<CadastroPetPayload>) {
      return http.put<CadastroPetResponse>(`${routes.cadastroPet}/${encodeURIComponent(petId)}`, payload);
    },
    // ... manter os demais métodos intactos
