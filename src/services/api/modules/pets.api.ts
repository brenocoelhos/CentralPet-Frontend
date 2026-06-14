import { Platform } from "react-native";
import type { ClienteHttp } from "../cliente-http";
import type { RotasPets } from "../rotas";

export type PetImagemDto = {
  id: number;
  url: string;
};

export type PetDashboardDto = {
  id: string | number;
  name: string;
  nome: string;
  especie: string;
  raca?: string;
  cor?: string;
  porte?: string;
  idade?: string;
  dataDesaparecimento: string;
  dataCadastro?: string;
  localDesaparecimento: string;
  descricao: string[];
  castrado?: boolean;
  vacinado?: boolean;
  recompensa?: boolean;
  fotoUrl?: string;
  imagens?: string[];
  nomeTutor: string;
  telefoneTutor: string;
  usuarioId: string;
  cep?: string;
  latitude?: number;
  longitude?: number;
};

export type CadastroPetPayload = {
  usuarioId: string;
  nome: string;
  especie: string;
  raca?: string;
  cor?: string;
  porte?: string;
  idade?: string;
  dataDesaparecimento: string;
  localDesaparecimento: string;
  descricao: string[];
  fotoUrl?: string;
  nomeTutor?: string;
  telefoneTutor?: string;
  castrado: boolean;
  vacinado: boolean;
  recompensa: boolean;
  dataCadastro?: string;
  cep?: string;
  latitude?: number;
  longitude?: number;
};

export type AtualizarPetPayload = Partial<Omit<CadastroPetPayload, "usuarioId">>;

export type PaginatedResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
};

export type BuscaPetsParams = {
  termo?: string;
  nome?: string;
  especie?: string;
  grupoEspecie?: string;
  raca?: string;
  cor?: string;
  porte?: string;
  bairro?: string;
  usuarioId?: string;
};

export type CadastroPetResponse = {
  id: string | number;
  nome: string;
  message?: string;
};

function toBuscaPetsQuery(params?: Partial<BuscaPetsParams>) {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();

  if (params.termo) searchParams.set("termo", params.termo);
  if (params.nome) searchParams.set("nome", params.nome);
  if (params.especie) searchParams.set("especie", params.especie);
  if (params.grupoEspecie) searchParams.set("grupoEspecie", params.grupoEspecie);
  if (params.raca) searchParams.set("raca", params.raca);
  if (params.cor) searchParams.set("cor", params.cor);
  if (params.porte) searchParams.set("porte", params.porte);
  if (params.bairro) searchParams.set("bairro", params.bairro);
  if (params.usuarioId) searchParams.set("usuarioId", params.usuarioId);

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export function criarApiPets(http: ClienteHttp, routes: RotasPets) {
  return {
    cadastroPet(payload: CadastroPetPayload) {
      return http.post<CadastroPetResponse>(routes.cadastroPet, payload);
    },
    atualizarPet(petId: string, payload: AtualizarPetPayload) {
      return http.put<CadastroPetResponse>(
        `${routes.cadastroPet}/${encodeURIComponent(petId)}`,
        payload,
      );
    },
    buscaPets(params?: Partial<BuscaPetsParams>) {
      return http.get<PaginatedResponse<PetDashboardDto>>(
        `${routes.buscaPets}${toBuscaPetsQuery(params)}`,
      );
    },
    buscarPetPorId(petId: string) {
      return http.get<PetDashboardDto>(
        `${routes.cadastroPet}/${encodeURIComponent(petId)}`,
      );
    },
    deletePet(petId: string) {
      return http.delete<void>(
        `${routes.cadastroPet}/${encodeURIComponent(petId)}`,
      );
    },
    async uploadImagem(
      petId: string,
      uri: string,
      fileName = "foto.jpg",
      webFile?: Blob,
    ): Promise<PetImagemDto> {
      const formData = new FormData();

      const extensao = fileName.split(".").pop()?.toLowerCase() || "jpg";
      let mimeType = "image/jpeg";
      if (extensao === "png") mimeType = "image/png";
      else if (extensao === "webp") mimeType = "image/webp";
      else if (extensao === "heic") mimeType = "image/heic";
      else if (extensao === "heif") mimeType = "image/heif";

      if (Platform.OS === "web") {
        const fileBlob = webFile ?? (await fetch(uri).then((response) => response.blob()));
        if (!fileBlob) {
          throw new Error("Arquivo da imagem nao encontrado.");
        }
        formData.append("file", fileBlob, fileName);
      } else {
        let imageUri = uri;
        if (Platform.OS === "ios") {
          imageUri = uri.replace("file://", "");
        }

        const fileObject = {
          uri: imageUri,
          name: fileName,
          type: mimeType,
        };

        formData.append("file", JSON.parse(JSON.stringify(fileObject)));
      }

      return http.uploadFormData<PetImagemDto>(
        `/auth/pets/${encodeURIComponent(petId)}/imagens`,
        formData,
      );
    },
    buscarImagens(petId: string): Promise<PetImagemDto[]> {
      return http.get<PetImagemDto[]>(
        `/auth/pets/${encodeURIComponent(petId)}/imagens`,
      );
    },
    deletarImagem(petId: string, imagemId: number): Promise<void> {
      return http.delete<void>(
        `/auth/pets/${encodeURIComponent(petId)}/imagens/${imagemId}`,
      );
    },
  };
}
