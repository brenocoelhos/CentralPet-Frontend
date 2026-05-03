import type { HttpClient } from "../http-client";
import type { PetsRoutes } from "../routes";

export type Pet = {
  id: string;
  name: string;
  species: string;
  breed: string;
  location: string;
  imageUrl?: string;
  status?: "Perdido" | "Encontrado";
};

export type CreatePetPayload = {
  name: string;
  species: string;
  breed: string;
  location: string;
  status?: "Perdido" | "Encontrado";
};

export function createPetsApi(http: HttpClient, routes: PetsRoutes) {
  return {
    list() {
      return http.get<Pet[]>(routes.list);
    },
    detail(id: string) {
      return http.get<Pet>(routes.detail(id));
    },
    create(payload: CreatePetPayload) {
      return http.post<Pet>(routes.create, payload);
    },
    update(id: string, payload: Partial<CreatePetPayload>) {
      return http.put<Pet>(routes.update(id), payload);
    },
    remove(id: string) {
      return http.delete<void>(routes.remove(id));
    },
  };
}
