export type RotasAutenticacao = {
  login: string;
  cadastro: string;
  me: string;
  logout: string;
  google: string;
};

export type RotasPets = {
  cadastroPet: string;
  buscaPets: string;
  deletePet: string;
};

export type RotasOcorrencias = {
  list: string;
  detail: (id: string) => string;
  create: string;
};

export type RotasPerfil = {
  get: string;
  update: string;
};

export type RotasNotificacoes = {
  registrarToken: string;
};

export type RotasApi = {
  auth: RotasAutenticacao;
  pets: RotasPets;
  notificacoes: RotasNotificacoes;
};

export const rotasApi: RotasApi = {
  auth: {
    login: "/auth/login",
    cadastro: "/auth/cadastro",
    me: "/auth/me",
    logout: "/auth/logout",
    google: "/auth/google",
  },
  pets: {
    cadastroPet: "/auth/cadastro-pet",
    buscaPets: "/auth/busca-pets",
    deletePet: "/auth/cadastro-pet",
  },
  notificacoes: {
    registrarToken: "/notificacoes/token",
  },
};
