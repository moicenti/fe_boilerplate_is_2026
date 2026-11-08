import { getSession } from "@/lib/session";

// Error devuelto por la API con el formato común {"codigo": "...", "mensaje": "..."}.
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly codigo?: string,
    mensaje?: string,
  ) {
    super(mensaje ?? `La API respondió ${status}`);
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
