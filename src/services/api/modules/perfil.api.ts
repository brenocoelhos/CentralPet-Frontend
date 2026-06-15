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
    async uploadFoto(uri: string, fileName = "perfil.jpg") {
      const formData = new FormData();

      if (Platform.OS === "web") {
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append("file", blob, fileName);
      } else {
        const fileObject = {
          uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
          name: fileName,
          type: "image/jpeg",
        };
        formData.append("file", JSON.parse(JSON.stringify(fileObject)));
      }

      // Rota mapeada no .permitAll() do Spring Security
      return http.uploadFormData<{ fotoPerfil: string }>(
        "/auth/usuarios/upload-perfil",
        formData,
      );
    },
  };
}
