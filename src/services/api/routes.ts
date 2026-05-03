export type AuthRoutes = {
  login: string;
  cadastro: string;
};

export type PetsRoutes = {
  cadastroPet: string;
  buscaPets: string;
};

export type ApiRoutes = {
  auth: AuthRoutes;
  pets: PetsRoutes;
};

export const apiRoutes: ApiRoutes = {
  auth: {
    login: "/auth/login",
    cadastro: "/auth/cadastro",
  },
  pets: {
    cadastroPet: "/auth/cadastro-pet",
    buscaPets: "/auth/busca-pets",
  },
};
