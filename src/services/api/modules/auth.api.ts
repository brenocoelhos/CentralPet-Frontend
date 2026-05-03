import type { HttpClient } from "../http-client";
import type { AuthRoutes } from "../routes";

export type LoginPayload = {
  email: string;
  senha: string;
};

export type CadastroPayload = {
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  senha: string;
  telefone: string;
  endereco?: string;
};

export type AuthMessageResponse = string;

export type ApiValidationError = {
  status: number;
  erros: string[];
};

export type ApiBusinessError = {
  status: number;
  erro: string;
};

export function createAuthApi(http: HttpClient, routes: AuthRoutes) {
  return {
    login(payload: LoginPayload) {
      return http.post<AuthMessageResponse>(routes.login, payload);
    },
    cadastro(payload: CadastroPayload) {
      return http.post<AuthMessageResponse>(routes.cadastro, payload);
    },
  };
}
