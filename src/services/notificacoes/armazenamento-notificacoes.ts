import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@centralpet:notificacoes-locais";
const LIMITE_NOTIFICACOES = 50;

export type NotificacaoLocal = {
  id: string;
  titulo: string;
  corpo?: string;
  petId?: string;
  tipo?: "pet_perdido" | "avistamento" | "outro";
  recebidoEm: string;
  lida: boolean;
};

export type NovaNotificacaoLocal = Omit<NotificacaoLocal, "id" | "recebidoEm" | "lida"> & {
  id?: string;
  recebidoEm?: string;
  lida?: boolean;
};

type Ouvinte = () => void;

const ouvintes = new Set<Ouvinte>();

function notificarOuvintes() {
  ouvintes.forEach((ouvinte) => ouvinte());
}

export function inscreverAtualizacoes(ouvinte: Ouvinte): () => void {
  ouvintes.add(ouvinte);
  return () => ouvintes.delete(ouvinte);
}

async function lerTudo(): Promise<NotificacaoLocal[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function salvarTudo(notificacoes: NotificacaoLocal[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notificacoes));
}

export async function listarNotificacoes(): Promise<NotificacaoLocal[]> {
  const todas = await lerTudo();
  return [...todas].sort(
    (a, b) => new Date(b.recebidoEm).getTime() - new Date(a.recebidoEm).getTime(),
  );
}

export async function contarNaoLidas(): Promise<number> {
  const todas = await lerTudo();
  return todas.filter((n) => !n.lida).length;
}

export async function adicionarNotificacao(
  input: NovaNotificacaoLocal,
): Promise<void> {
  const todas = await lerTudo();

  const nova: NotificacaoLocal = {
    id: input.id ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    titulo: input.titulo,
    corpo: input.corpo,
    petId: input.petId,
    tipo: input.tipo,
    recebidoEm: input.recebidoEm ?? new Date().toISOString(),
    lida: input.lida ?? false,
  };

  const atualizadas = [nova, ...todas].slice(0, LIMITE_NOTIFICACOES);
  await salvarTudo(atualizadas);
  notificarOuvintes();
}

export async function marcarComoLida(id: string): Promise<void> {
  const todas = await lerTudo();
  const atualizadas = todas.map((n) => (n.id === id ? { ...n, lida: true } : n));
  await salvarTudo(atualizadas);
  notificarOuvintes();
}

export async function marcarTodasComoLidas(): Promise<void> {
  const todas = await lerTudo();
  const atualizadas = todas.map((n) => ({ ...n, lida: true }));
  await salvarTudo(atualizadas);
  notificarOuvintes();
}

export async function limparNotificacoes(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
  notificarOuvintes();
}
