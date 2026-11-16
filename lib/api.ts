import "server-only";
import { getSession } from "@/lib/session";

// Error devuelto por el backend ({ codigo, mensaje }) o por la conexión (status 0).
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
  init: Omit<RequestInit, "headers"> = {},
): Promise<T> {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    throw new Error("Falta la variable de entorno API_URL.");
  }

  const token = await getSession();
  if (!token) {
    throw new ApiError(401, "No hay sesión iniciada.", "NO_AUTENTICADO");
  }

  const url = new URL(path.replace(/^\//, ""), apiUrl.replace(/\/?$/, "/"));

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor.", "SIN_CONEXION");
  }

  if (!res.ok) {
    let codigo: string | undefined;
    let mensaje: string | undefined;
    try {
      const body = await res.json();
      codigo = body.codigo;
      mensaje = body.mensaje;
    } catch {
      // el cuerpo no era JSON
    }
    throw new ApiError(res.status, mensaje ?? `La API respondió ${res.status}.`, codigo);
  }

  return (await res.json()) as T;
}
