import type { HttpClient } from "../http-client";
import type { AuthRoutes } from "../routes";

export type LoginPayload = {
  email: string;
  senha: string;
};

export type GoogleLoginPayload = {
  idToken: string;
};

export type CadastroPayload = {
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  senha: string;
  telefone: string;
  rua?: string;
  numero?: string;
  cidade?: string;
  estado?: string;
};

export type LoginResponse =
  | string
  | {
      token: string;
      tipo?: string;
      expiraEmMs?: number;
      nome?: string;
      email?: string;
    };

export type AuthMessageResponse = string;

export type MeResponse = {
  id?: string;
  usuarioId?: string;
  uid?: string;
  nome?: string;
  name?: string;
  displayName?: string;
  email?: string;
  [key: string]: unknown;
};

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
      return http.post<LoginResponse>(routes.login, payload);
    },
    google(payload: GoogleLoginPayload) {
      return http.post<LoginResponse>(routes.google, payload);
    },
    cadastro(payload: CadastroPayload) {
      return http.post<AuthMessageResponse>(routes.cadastro, payload);
    },
    me() {
      return http.get<MeResponse>(routes.me);
    },
    logout() {
      return http.post<AuthMessageResponse>(routes.logout);
    },
  };
}
