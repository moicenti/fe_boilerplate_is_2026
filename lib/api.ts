import { getSession } from "@/lib/session";

const API_URL = process.env.API_URL;

if (!API_URL) {
  throw new Error("Falta la variable de entorno API_URL.");
}

function buildUrl(path: string): string {
  const normalized = path.replace(/^\/+/, "");
  return new URL(normalized, API_URL!.replace(/\/?$/, "/")).toString();
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly codigo?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getSession();
  if (!token) {
    throw new ApiError(401, "No hay una sesión activa.");
  }

  const res = await fetch(buildUrl(path), {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    let message = `Error ${res.status}`;
    let codigo: string | undefined;

    try {
      const body = await res.json();
      if (Array.isArray(body?.message)) {
        message = body.message.join(", ");
      } else if (typeof body?.message === "string") {
        message = body.message;
      } else if (typeof body?.mensaje === "string") {
        message = body.mensaje;
      }
      if (typeof body?.codigo === "string") {
        codigo = body.codigo;
      }
    } catch {
      // Sin JSON, se queda el mensaje genérico
    }

    throw new ApiError(res.status, message, codigo);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}