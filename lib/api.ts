// lib/api.ts
import { getSession } from "@/lib/session";

const API_URL = process.env.API_URL;

if (!API_URL) {
  throw new Error("Falta la variable de entorno API_URL.");
}

function buildUrl(path: string): string {
  const normalized = path.replace(/^\/+/, ""); // quita "/" iniciales
  return new URL(normalized, API_URL!.replace(/\/?$/, "/")).toString();
}


export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// fetch contra API_URL (incluye el prefijo, p. ej. /api/v1) con el token de la sesión. Solo usar en el servidor.
export async function apiFetch<T>(path: string, init: RequestInit = {}) {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    throw new Error("Falta la variable de entorno API_URL.");
  }

  const token = await getSession();
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const url = new URL(path.replace(/^\//, ""), apiUrl.replace(/\/?$/, "/"));
  const res = await fetch(url, { ...init, headers, cache: "no-store" });

  if (!res.ok) {
    let body: { codigo?: string; mensaje?: string } = {};
    try {
      body = await res.json();
    } catch {

    }
    throw new ApiError(res.status, body.codigo, body.mensaje);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
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
    },
    cache: "no-store",
  });

  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {

    let message = `Error ${res.status}`;
    try {
      const body = await res.json();
      if (Array.isArray(body?.message)) {
        message = body.message.join(", ");
      } else if (typeof body?.message === "string") {
        message = body.message;
      }
    } catch {
    }
    throw new ApiError(res.status, message);
  }

  return (await res.json()) as T;
}
