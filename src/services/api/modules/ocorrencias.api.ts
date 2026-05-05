import type { ClienteHttp } from "../cliente-http";
import type { RotasOcorrencias } from "../rotas";

export type Ocorrencia = {
  id: string;
  petId: string;
  status: "PERDIDO" | "ENCONTRADO";
  neighborhood: string;
  createdAt: string;
};

export type CriarOcorrenciaPayload = {
  petId: string;
  status: "PERDIDO" | "ENCONTRADO";
  neighborhood: string;
};

export function criarApiOcorrencias(http: ClienteHttp, routes: RotasOcorrencias) {
  return {
    list() {
      return http.get<Ocorrencia[]>(routes.list);
    },
    detail(id: string) {
      return http.get<Ocorrencia>(routes.detail(id));
    },
    create(payload: CriarOcorrenciaPayload) {
      return http.post<Ocorrencia>(routes.create, payload);
    },
  };
}
