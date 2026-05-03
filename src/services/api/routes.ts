export type AuthRoutes = {
  login: string;
  register: string;
  me: string;
};

export type PetsRoutes = {
  list: string;
  detail: (id: string) => string;
  create: string;
  update: (id: string) => string;
  remove: (id: string) => string;
};

export type OccurrencesRoutes = {
  list: string;
  detail: (id: string) => string;
  create: string;
};

export type ProfileRoutes = {
  get: string;
  update: string;
};

export type ApiRoutes = {
  auth: AuthRoutes;
  pets: PetsRoutes;
  occurrences: OccurrencesRoutes;
  profile: ProfileRoutes;
};

export const apiRoutes: ApiRoutes = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    me: "/auth/me",
  },
  pets: {
    list: "/pets",
    detail: (id) => `/pets/${id}`,
    create: "/pets",
    update: (id) => `/pets/${id}`,
    remove: (id) => `/pets/${id}`,
  },
  occurrences: {
    list: "/occurrences",
    detail: (id) => `/occurrences/${id}`,
    create: "/occurrences",
  },
  profile: {
    get: "/profile",
    update: "/profile",
  },
};
