import type { HttpClient } from "../http-client";
import type { ProfileRoutes } from "../routes";

export type Profile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
};

export type UpdateProfilePayload = Partial<Pick<Profile, "name" | "phone" | "address">>;

export function createProfileApi(http: HttpClient, routes: ProfileRoutes) {
  return {
    get() {
      return http.get<Profile>(routes.get);
    },
    update(payload: UpdateProfilePayload) {
      return http.put<Profile>(routes.update, payload);
    },
  };
}
