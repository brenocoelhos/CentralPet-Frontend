import type { UsuarioAutenticado } from "@/context/contexto-autenticacao";
import type { criarApi } from "@/services/api";

export function useNotificacoesPush(
  _user: UsuarioAutenticado | null,
  _getApi: () => ReturnType<typeof criarApi>,
) {
  return undefined;
}