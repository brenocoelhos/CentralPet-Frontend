import {
  contarNaoLidas,
  inscreverAtualizacoes,
} from "@/services/notificacoes/armazenamento-notificacoes";
import { usePathname } from "expo-router";
import { useEffect, useState } from "react";

export function useContagemNotificacoesNaoLidas(): number {
  const [contagem, setContagem] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    let ativo = true;

    const atualizar = () => {
      void contarNaoLidas().then((valor) => {
        if (ativo) setContagem(valor);
      });
    };

    atualizar();
    const cancelarInscricao = inscreverAtualizacoes(atualizar);

    return () => {
      ativo = false;
      cancelarInscricao();
    };
  }, [pathname]);

  return contagem;
}
