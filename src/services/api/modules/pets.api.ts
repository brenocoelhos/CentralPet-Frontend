// src/services/api/modules/pets.api.ts

import { ClienteHttp } from "../cliente-http";
import { RotasPets } from "../rotas";

export type CadastroPetPayload = {
  usuarioId: string;
  nome: string;
  especie: string;
  raca?: string; // Tornou-se opcional conforme solicitado
  cor?: string;
  porte?: string;
  dataDesaparecimento: string; // Formato AAAA-MM-DD enviado à API
  localDesaparecimento: string;
  descricao: string[];
  fotoUrl?: string;
  nomeTutor?: string;
  telefoneTutor?: string;
  castrado: boolean;
  vacinado: boolean;
  recompensa: boolean;
  dataCadastro?: string;
  idade?: string; // Novo campo opcional adicionado
  cep?: string;   // Novo campo opcional adicionado
};

export type CadastroPetResponse = {
  id: string | number;
  usuarioId: string;
  nome: string;
  especie: string;
  raca?: string;
  cor?: string;
  porte?: string;
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
  idade?: string;
  cep?: string;
  imagens?: string[];
};

export type PetItemResponse = CadastroPetResponse;

export function criarApiPets(http: ClienteHttp, routes: RotasPets) {
  return {
    /**
     * Cadastra um novo pet desaparecido no sistema
     */
    cadastroPet(payload: CadastroPetPayload) {
      return http.post<CadastroPetResponse>(routes.cadastroPet, payload);
    },

    /**
     * Atualiza os dados de um pet existente (Função de Edição)
     */
    atualizarPet(petId: string | number, payload: Partial<CadastroPetPayload>) {
      return http.put<CadastroPetResponse>(
        `${routes.cadastroPet}/${encodeURIComponent(String(petId))}`,
        payload
      );
    },

    /**
     * Busca os dados completos de um pet específico pelo ID (Usado para carregar o formulário de edição)
     */
    buscarPetPorId(petId: string | number) {
      return http.get<PetItemResponse>(
        `${routes.cadastroPet}/${encodeURIComponent(String(petId))}`
      );
    },

    /**
     * Lista todos os pets cadastrados
     */
    listarPets() {
      return http.get<PetItemResponse[]>(routes.listarPets);
    },

    /**
     * Lista os pets pertencentes a um usuário específico
     */
    listarPetsPorUsuario(usuarioId: string) {
      return http.get<PetItemResponse[]>(
        `${routes.listarPetsPorUsuario}/${encodeURIComponent(usuarioId)}`
      );
    },

    /**
     * Remove o registro de um pet do sistema
     */
    deletarPet(petId: string | number) {
      return http.delete<void>(
        `${routes.cadastroPet}/${encodeURIComponent(String(petId))}`
      );
    },

    /**
     * Faz o upload multipart/form-data de uma imagem vinculada ao pet
     */
    async uploadImagem(petId: string | number, uri: string, name: string) {
      const formData = new FormData();

      // No React Native, o objeto de arquivo precisa dessa estrutura específica
      formData.append("image", {
        uri,
        name,
        type: "image/jpeg",
      } as any);

      return http.post<void>(
        `${routes.cadastroPet}/${encodeURIComponent(String(petId))}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
  };
}
