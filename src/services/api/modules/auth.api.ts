import type { HttpClient } from "../http-client";
import type { AuthRoutes } from "../routes";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthTokenResponse = {
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
};

export function createAuthApi(http: HttpClient, routes: AuthRoutes) {
  return {
    login(payload: LoginPayload) {
      return http.post<AuthTokenResponse>(routes.login, payload);
    },
    register(payload: RegisterPayload) {
      return http.post<AuthTokenResponse>(routes.register, payload);
    },
    me() {
      return http.get<AuthUser>(routes.me);
    },
  };
}
