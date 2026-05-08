import { criarClienteHttp } from "./cliente-http";
import { criarApiAutenticacao } from "./modules/autenticacao.api";
import { criarApiNotificacoes } from "./modules/notificacoes.api";
import { criarApiPets } from "./modules/pets.api";
import { rotasApi, type RotasApi } from "./rotas";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export function criarApi(options?: {
  baseUrl?: string;
  routes?: RotasApi;
  token?: string;
}) {
  const baseUrl = options?.baseUrl ?? API_BASE_URL;
  const routes = options?.routes ?? rotasApi;
  const token = options?.token;

  const http = criarClienteHttp(baseUrl);

  const authHeaders = token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : undefined;

  const authHttp = {
    ...http,
    get: <T>(path: string) => http.get<T>(path, { headers: authHeaders }),
    post: <T>(path: string, body?: unknown) =>
      http.post<T>(path, body, { headers: authHeaders }),
    put: <T>(path: string, body?: unknown) =>
      http.put<T>(path, body, { headers: authHeaders }),
    patch: <T>(path: string, body?: unknown) =>
      http.patch<T>(path, body, { headers: authHeaders }),
    delete: <T>(path: string) => http.delete<T>(path, { headers: authHeaders }),
    uploadFormData: <T>(path: string, formData: FormData) =>
      http.uploadFormData<T>(path, formData, { headers: authHeaders }),
    request: <T>(path: string, opts?: Parameters<typeof http.request<T>>[1]) =>
      http.request<T>(path, {
        ...opts,
        headers: {
          ...(opts?.headers ?? {}),
          ...(authHeaders ?? {}),
        },
      }),
  };

  return {
    auth: criarApiAutenticacao(authHttp, routes.auth),
    pets: criarApiPets(authHttp, routes.pets),
    notificacoes: criarApiNotificacoes(authHttp, routes.notificacoes),
  };
}

export const api = criarApi();

export * from "./cliente-http";
export * from "./rotas";

