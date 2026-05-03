import type { HttpClient } from "../http-client";
import type { PetsRoutes } from "../routes";

export type PetDashboardDto = {
  id: string;
  name: string;
  nome: string;
  especie: string;
  raca?: string;
  cor?: string;
  porte?: string;
  dataDesaparecimento: string;
  localDesaparecimento: string;
  descricao: string[];
  fotoUrl?: string;
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
  nomeTutor: string;
  telefoneTutor: string;
};

export type BuscaPetsParams = {
  nome?: string;
  especie?: string;
  cor?: string;
  porte?: string;
  usuarioId?: string;
};

export type CadastroPetResponse = string;

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

export function createPetsApi(http: HttpClient, routes: PetsRoutes) {
  return {
    cadastroPet(payload: CadastroPetPayload) {
      return http.post<CadastroPetResponse>(routes.cadastroPet, payload);
    },
    buscaPets(params?: Partial<BuscaPetsParams>) {
      return http.get<PetDashboardDto[]>(`${routes.buscaPets}${toBuscaPetsQuery(params)}`);
    },
  };
}
