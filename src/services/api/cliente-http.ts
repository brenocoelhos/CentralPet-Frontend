export type MetodoHttp = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type OpcoesRequisicao = {
  method?: MetodoHttp;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export type ClienteHttp = {
  request<T>(path: string, options?: OpcoesRequisicao): Promise<T>;
  get<T>(
    path: string,
    options?: Omit<OpcoesRequisicao, "method" | "body">,
  ): Promise<T>;
  post<T>(
    path: string,
    body?: unknown,
    options?: Omit<OpcoesRequisicao, "method" | "body">,
  ): Promise<T>;
  put<T>(
    path: string,
    body?: unknown,
    options?: Omit<OpcoesRequisicao, "method" | "body">,
  ): Promise<T>;
  patch<T>(
    path: string,
    body?: unknown,
    options?: Omit<OpcoesRequisicao, "method" | "body">,
  ): Promise<T>;
  delete<T>(
    path: string,
    options?: Omit<OpcoesRequisicao, "method" | "body">,
  ): Promise<T>;
  /** Envia FormData sem definir Content-Type (o fetch define o boundary automaticamente). */
  uploadFormData<T>(
    path: string,
    formData: FormData,
    options?: Omit<OpcoesRequisicao, "method" | "body">,
  ): Promise<T>;
};

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

function toUrl(baseUrl: string, path: string): string {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export class ErroApi extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ErroApi";
    this.status = status;
    this.data = data;
  }
}

export function criarClienteHttp(baseUrl: string): ClienteHttp {
  async function request<T>(
    path: string,
    options: OpcoesRequisicao = {},
  ): Promise<T> {
    const { method = "GET", body, headers, signal } = options;

    const response = await fetch(toUrl(baseUrl, path), {
      method,
      signal,
      headers: {
        ...DEFAULT_HEADERS,
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    const text = await response.text();
    const data = text ? safeJsonParse(text) : null;

    if (!response.ok) {
      throw new ErroApi(
        `Request failed with status ${response.status}`,
        response.status,
        data,
      );
    }

    return data as T;
  }

  async function uploadFormData<T>(
    path: string,
    formData: FormData,
    options: Omit<OpcoesRequisicao, "method" | "body"> = {},
  ): Promise<T> {
    const { headers, signal } = options;

    const response = await fetch(toUrl(baseUrl, path), {
      method: "POST",
      signal,
      // Não definir Content-Type: o fetch inclui o boundary correto automaticamente
      headers: {
        Accept: "application/json",
        ...headers,
      },
      body: formData,
    });

    const text = await response.text();
    const data = text ? safeJsonParse(text) : null;

    if (!response.ok) {
      throw new ErroApi(
        `Request failed with status ${response.status}`,
        response.status,
        data,
      );
    }

    return data as T;
  }

  return {
    request,
    get: (path, options) => request(path, { ...options, method: "GET" }),
    post: (path, body, options) =>
      request(path, { ...options, method: "POST", body }),
    put: (path, body, options) =>
      request(path, { ...options, method: "PUT", body }),
    patch: (path, body, options) =>
      request(path, { ...options, method: "PATCH", body }),
    delete: (path, options) => request(path, { ...options, method: "DELETE" }),
    uploadFormData,
  };
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
