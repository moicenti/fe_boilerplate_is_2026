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

type ErrorBody = {
  message?: string | string[];
  codigo?: string;
  mensaje?: string;
};

function errorMessage(status: number, body: ErrorBody): string {
  if (typeof body.mensaje === "string" && body.mensaje) return body.mensaje;
  if (Array.isArray(body.message)) return body.message.join(", ");
  if (typeof body.message === "string" && body.message) return body.message;
  return `Error ${status}`;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getSession();
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (typeof options.body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(buildUrl(path), {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    let body: ErrorBody = {};
    try {
      body = await res.json();
    } catch {
      body = {};
    }
    throw new ApiError(res.status, errorMessage(res.status, body), body.codigo);
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
