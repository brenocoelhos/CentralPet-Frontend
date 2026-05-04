export type AuthRoutes = {
  login: string;
  cadastro: string;
  me: string;
  logout: string;
  google: string;
};

export type PetsRoutes = {
  cadastroPet: string;
  buscaPets: string;
  deletePet: string;
};

export type ApiRoutes = {
  auth: AuthRoutes;
  pets: PetsRoutes;
};

export const apiRoutes: ApiRoutes = {
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
};
