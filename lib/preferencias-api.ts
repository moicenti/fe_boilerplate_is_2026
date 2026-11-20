import "server-only";
import { apiFetch } from "@/lib/api";
import type { Preferencia } from "@/lib/preferencias";

// GET /notificaciones/preferencias
export function obtenerPreferencias() {
  return apiFetch<Preferencia[]>("notificaciones/preferencias");
}

// PUT /notificaciones/preferencias (devuelve la lista completa actualizada)
export function reemplazarPreferencias(preferencias: Preferencia[]) {
  return apiFetch<Preferencia[]>("notificaciones/preferencias", {
    method: "PUT",
    body: JSON.stringify(preferencias),
  });
}
