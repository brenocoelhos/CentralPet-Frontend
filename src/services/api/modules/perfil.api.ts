import { Platform } from "react-native";
import type { ClienteHttp } from "../cliente-http";
import type { RotasPerfil } from "../rotas";

export type Perfil = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
};

export type AtualizarPerfilPayload = Partial<
  Pick<Perfil, "name" | "phone" | "address">
>;

export function criarApiPerfil(http: ClienteHttp, routes: RotasPerfil) {
  return {
    get() {
      return http.get<Perfil>(routes.get);
    },
    update(payload: AtualizarPerfilPayload) {
      return http.put<Perfil>(routes.update, payload);
    },
    async uploadFoto(uri: string, fileName = "perfil.jpg", webFile?: Blob) {
      const formData = new FormData();

      // Identifica a extensão e define o MimeType dinâmico igualzinho ao pet
      const extensao = fileName.split(".").pop()?.toLowerCase() || "jpg";
      let mimeType = "image/jpeg";
      if (extensao === "png") mimeType = "image/png";
      else if (extensao === "webp") mimeType = "image/webp";
      else if (extensao === "heic") mimeType = "image/heic";
      else if (extensao === "heif") mimeType = "image/heif";

      if (Platform.OS === "web") {
        // Na Web, usa o blob passado ou converte a URI local de forma segura
        const fileBlob =
          webFile ?? (await fetch(uri).then((response) => response.blob()));
        if (!fileBlob) {
          throw new Error("Arquivo da imagem não encontrado.");
        }
        formData.append("file", fileBlob, fileName);
      } else {
        // No Mobile, trata a URI de acordo com o sistema operacional
        let imageUri = uri;
        if (Platform.OS === "ios") {
          imageUri = uri.replace("file://", "");
        }

        const fileObject = {
          uri: imageUri,
          name: fileName,
          type: mimeType,
        };

        // Usa o encapsulamento seguro para o FormData do React Native
        formData.append("file", JSON.parse(JSON.stringify(fileObject)));
      }

      // Rota unificada do upload do perfil
      return http.uploadFormData<{ fotoPerfil: string }>(
        "/auth/usuarios/upload-perfil",
        formData,
      );
    },
  };
}
