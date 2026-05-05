import type { ClienteHttp } from "../cliente-http";
import type { RotasPerfil } from "../rotas";

export type Perfil = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
};

export type AtualizarPerfilPayload = Partial<Pick<Perfil, "name" | "phone" | "address">>;

export function criarApiPerfil(http: ClienteHttp, routes: RotasPerfil) {
  return {
    get() {
      return http.get<Perfil>(routes.get);
    },
    update(payload: AtualizarPerfilPayload) {
      return http.put<Perfil>(routes.update, payload);
    },
  };
}
