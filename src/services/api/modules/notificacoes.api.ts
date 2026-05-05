import type { ClienteHttp } from "../cliente-http";
import type { RotasNotificacoes } from "../rotas";

export type RegistroTokenPayload = {
  token: string;
  userId: string;
  lat?: number;
  lng?: number;
  plataforma?: "android" | "ios";
};

export function criarApiNotificacoes(
  http: ClienteHttp,
  routes: RotasNotificacoes,
) {
  return {
    registrarToken: (payload: RegistroTokenPayload) =>
      http.post<void>(routes.registrarToken, payload),

    removerToken: (token: string) =>
      http.delete<void>(`${routes.registrarToken}/${encodeURIComponent(token)}`),
  };
}
