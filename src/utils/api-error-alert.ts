import { Alert } from "react-native";
import { ApiError } from "@/services/api";

/**
 * Extrai a mensagem de um erro da API e exibe um Alert padronizado.
 *
 * Cobre todos os formatos do backend:
 *   - { erro: string }          → campo único
 *   - { erros: string[] }       → lista de erros de validação
 *   - string pura               → resposta de texto simples
 *   - erro desconhecido         → mensagem genérica de fallback
 */
export function showApiErrorAlert(title: string, error: unknown, fallback?: string): void {
  const message = extractApiErrorMessage(error, fallback);
  Alert.alert(title, message);
}

export function extractApiErrorMessage(error: unknown, fallback?: string): string {
  const defaultMessage = fallback ?? "Algo deu errado. Tente novamente.";

  if (!(error instanceof ApiError)) {
    return defaultMessage;
  }

  const { data } = error;

  // string pura vinda do backend
  if (typeof data === "string" && data.trim().length > 0) {
    return data.trim();
  }

  // objeto com { erro } ou { erros }
  if (data !== null && typeof data === "object") {
    const obj = data as Record<string, unknown>;

    if (typeof obj.erro === "string" && obj.erro.trim()) {
      return obj.erro.trim();
    }

    if (Array.isArray(obj.erros) && obj.erros.length > 0) {
      return obj.erros.filter((e) => typeof e === "string").join("\n");
    }

    if (typeof obj.message === "string" && obj.message.trim()) {
      return obj.message.trim();
    }
  }

  return defaultMessage;
}
