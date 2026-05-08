import type { ClienteHttp } from "../cliente-http";
import type { RotasPets } from "../rotas";

export type PetImagemDto = {
  id: number;
  url: string;
};

export type PetDashboardDto = {
  id: string;
  name: string;
  nome: string;
  especie: string;
  raca?: string;
  cor?: string;
  porte?: string;
  dataDesaparecimento: string;
  dataCadastro?: string;
  localDesaparecimento: string;
  descricao: string[];
  castrado?: boolean;
  vacinado?: boolean;
  recompensa?: boolean;
  fotoUrl?: string;
  imagens?: string[];
  nomeTutor: string;
  telefoneTutor: string;
  usuarioId: string;
};

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
};

export type BuscaPetsParams = {
  nome?: string;
  especie?: string;
  cor?: string;
  porte?: string;
  usuarioId?: string;
};

export type CadastroPetResponse = {
  id: string | number;
  nome: string;
  message?: string;
};

function toBuscaPetsQuery(params?: Partial<BuscaPetsParams>) {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();

  if (params.nome) searchParams.set("nome", params.nome);
  if (params.especie) searchParams.set("especie", params.especie);
  if (params.cor) searchParams.set("cor", params.cor);
  if (params.porte) searchParams.set("porte", params.porte);
  if (params.usuarioId) searchParams.set("usuarioId", params.usuarioId);

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export function criarApiPets(http: ClienteHttp, routes: RotasPets) {
  return {
    cadastroPet(payload: CadastroPetPayload) {
      return http.post<CadastroPetResponse>(routes.cadastroPet, payload);
    },
    buscaPets(params?: Partial<BuscaPetsParams>) {
      return http.get<PetDashboardDto[]>(`${routes.buscaPets}${toBuscaPetsQuery(params)}`);
    },
    deletePet(petId: string) {
      return http.delete<void>(`${routes.cadastroPet}/${encodeURIComponent(petId)}`);
    },
    async uploadImagem(petId: string, uri: string, fileName = "foto.jpg"): Promise<PetImagemDto> {
      const blob = await fetch(uri).then((r) => r.blob());
      const formData = new FormData();
      formData.append("file", blob, fileName);
      return http.uploadFormData<PetImagemDto>(
        `/auth/pets/${encodeURIComponent(petId)}/imagens`,
        formData,
      );
    },
    buscarImagens(petId: string): Promise<PetImagemDto[]> {
      return http.get<PetImagemDto[]>(
        `/auth/pets/${encodeURIComponent(petId)}/imagens`,
      );
    },
    deletarImagem(petId: string, imagemId: number): Promise<void> {
      return http.delete<void>(
        `/auth/pets/${encodeURIComponent(petId)}/imagens/${imagemId}`,
      );
    },
  };
}
