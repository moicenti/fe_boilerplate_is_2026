// lib/notificaciones-api.ts
import "server-only";
import { apiFetch } from "@/lib/api";
import type { Filtro, ModuloFiltro, PaginaNotificaciones } from "@/lib/notificaciones";

// ✅ EXPORTADO: Función para listar notificaciones
export function listarNotificaciones(opts: {
  page: number;
  size: number;
  filtro: Filtro;
  modulo?: ModuloFiltro;
}) {
  const params = new URLSearchParams({
    page: String(opts.page),
    size: String(opts.size),
  });

  // Traducción: el backend espera 'leidas', no 'filtro'
  if (opts.filtro === "sin_leer") params.set("leidas", "sin_leer");
  if (opts.filtro === "leidas") params.set("leidas", "leidas");

  if (opts.modulo && opts.modulo !== "todos") {
    params.set("modulo", opts.modulo);
  }

  return apiFetch<PaginaNotificaciones>(`notificaciones?${params}`);
}

// ✅ EXPORTADO: Función para contar no leídas
export async function contarNoLeidas() {
  const { count } = await apiFetch<{ count: number }>(
      "notificaciones/no-leidas/conteo",
  );
  return count;
}

// ✅ EXPORTADO: Función para cambiar estado de leída
export function cambiarLeida(id: number, leida: boolean) {
  return apiFetch<{ id: number; leida: boolean; fechaLectura: string | null }>(
      `notificaciones/${id}/leida`,
      { method: "PATCH", body: JSON.stringify({ leida }) },
  );
}

// ✅ NUEVO: Función para marcar todas como leídas
export function marcarTodasLeidas() {
  return apiFetch<{ actualizadas: number }>(
      "notificaciones/leidas/todas",
      { method: "PATCH" },
  );
}