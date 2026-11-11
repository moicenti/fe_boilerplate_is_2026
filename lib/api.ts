// lib/api.ts
import { getSession } from "@/lib/session";

const API_URL = process.env.API_URL;

if (!API_URL) {
  throw new Error("Falta la variable de entorno API_URL.");
}

// Resuelve `path` contra API_URL (que incluye el prefijo, p. ej. /api/v1).
function buildUrl(path: string): string {
  const normalized = path.replace(/^\/+/, ""); // quita "/" iniciales
  return new URL(normalized, API_URL!.replace(/\/?$/, "/")).toString();
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    /** Código de error de la API (p. ej. "AREA_DUPLICADA"), si lo envía. */
    public readonly codigo?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// La API responde errores como { codigo, mensaje } o { message: string | string[] }.
async function readError(res: Response): Promise<ApiError> {
  let message = `Error ${res.status}`;
  let codigo: string | undefined;
  try {
    const body = await res.json();
    if (typeof body?.codigo === "string") codigo = body.codigo;
    if (typeof body?.mensaje === "string") {
      message = body.mensaje;
    } else if (Array.isArray(body?.message)) {
      message = body.message.join(", ");
    } else if (typeof body?.message === "string") {
      message = body.message;
    }
  } catch {
    // Cuerpo vacío o no JSON: se queda el mensaje genérico.
  }
  return new ApiError(res.status, message, codigo);
}

// fetch contra API_URL con el token de la sesión. Solo usar en el servidor.
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getSession();
  if (!token) {
    throw new ApiError(401, "No hay una sesión activa.");
  }

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${token}`);
  // Los cuerpos string son JSON; FormData define su propio Content-Type (multipart).
  if (typeof options.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(buildUrl(path), {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    throw await readError(res);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
