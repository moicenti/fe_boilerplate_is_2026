
import "server-only";
import { getSession } from "@/lib/session";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public codigo?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    throw new Error("Falta la variable de entorno API_URL.");
  }

  const token = await getSession();

  if (!token) {
    throw new ApiError(401, "No hay sesión iniciada.", "NO_AUTENTICADO");
  }

  const url = new URL(
    path.replace(/^\/+/, ""),
    `${apiUrl.replace(/\/+$/, "")}/`,
  );

  const headers = new Headers(init.headers);

  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${token}`);

  if (init.body instanceof FormData) {
    // FormData necesita que fetch genere automáticamente el boundary.
    headers.delete("Content-Type");
  } else if (init.body !== undefined && init.body !== null) {
    // Las peticiones JSON conservan su Content-Type.
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  let res: Response;

  try {
    res = await fetch(url, {
      ...init,
      cache: "no-store",
      headers,
    });
  } catch {
    throw new ApiError(
      0,
      "No se pudo conectar con el servidor.",
      "SIN_CONEXION",
    );
  }

  if (!res.ok) {
    let codigo: string | undefined;
    let mensaje: string | undefined;

    try {
      const body = await res.json();

      codigo = body.codigo;

      const backendMessage = body.message ?? body.mensaje;

      mensaje = Array.isArray(backendMessage)
        ? backendMessage.join(", ")
        : backendMessage;
    } catch {
      // El cuerpo no era JSON.
    }

    throw new ApiError(
      res.status,
      mensaje ?? `La API respondió ${res.status}.`,
      codigo,
    );
  }

  return (await res.json()) as T;
}
