import "server-only";
import { apiFetch } from "@/lib/api";
import type { Filtro, PaginaNotificaciones } from "@/lib/notificaciones";

// GET /notificaciones?page&size[&leida=true|false]
export function listarNotificaciones(opts: {
  page: number;
  size: number;
  filtro: Filtro;
}) {
  const params = new URLSearchParams({
    page: String(opts.page),
    size: String(opts.size),
  });
  if (opts.filtro === "sin-leer") params.set("leida", "false");
  if (opts.filtro === "leidas") params.set("leida", "true");
  return apiFetch<PaginaNotificaciones>(`notificaciones?${params}`);
}

// GET /notificaciones/no-leidas/conteo
export async function contarNoLeidas() {
  const { count } = await apiFetch<{ count: number }>(
    "notificaciones/no-leidas/conteo",
  );
  return count;
}

// PATCH /notificaciones/{id}/leida
export function cambiarLeida(id: number, leida: boolean) {
  return apiFetch<{ id: number; leida: boolean; fechaLectura: string | null }>(
    `notificaciones/${id}/leida`,
    { method: "PATCH", body: JSON.stringify({ leida }) },
  );
}
