import { createHttpClient } from "./http-client";
import { createAuthApi } from "./modules/auth.api";
import { createPetsApi } from "./modules/pets.api";
import { apiRoutes, type ApiRoutes } from "./routes";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export function createApi(options?: {
  baseUrl?: string;
  routes?: ApiRoutes;
  token?: string;
}) {
  const baseUrl = options?.baseUrl ?? API_BASE_URL;
  const routes = options?.routes ?? apiRoutes;
  const token = options?.token;

  const http = createHttpClient(baseUrl);

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
    auth: createAuthApi(authHttp, routes.auth),
    pets: createPetsApi(authHttp, routes.pets),
  };
}

export const api = createApi();

export * from "./http-client";
export * from "./routes";

