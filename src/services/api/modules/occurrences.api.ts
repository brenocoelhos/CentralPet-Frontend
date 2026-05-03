import type { HttpClient } from "../http-client";
import type { OccurrencesRoutes } from "../routes";

export type Occurrence = {
  id: string;
  petId: string;
  status: "PERDIDO" | "ENCONTRADO";
  neighborhood: string;
  createdAt: string;
};

export type CreateOccurrencePayload = {
  petId: string;
  status: "PERDIDO" | "ENCONTRADO";
  neighborhood: string;
};

export function createOccurrencesApi(http: HttpClient, routes: OccurrencesRoutes) {
  return {
    list() {
      return http.get<Occurrence[]>(routes.list);
    },
    detail(id: string) {
      return http.get<Occurrence>(routes.detail(id));
    },
    create(payload: CreateOccurrencePayload) {
      return http.post<Occurrence>(routes.create, payload);
    },
  };
}
