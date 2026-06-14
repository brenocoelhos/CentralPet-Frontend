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
    uploadFoto(uri: string, fileName = "perfil.jpg") {
      const formData = new FormData();
      const fileObject = {
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
        name: fileName,
        type: "image/jpeg",
      };

      // O React Native precisa deste truque com JSON.parse para enviar o ficheiro corretamente no FormData
      formData.append("file", JSON.parse(JSON.stringify(fileObject)));

      return http.uploadFormData<{ fotoPerfil: string; message: string }>(
        "/auth/perfil/foto",
        formData,
      );
    },
  };
}
