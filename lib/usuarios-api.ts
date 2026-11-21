import "server-only";
import { apiFetch } from "@/lib/api";
import type { NuevoUsuario, RolCreable, UnidadCondominio, Usuario } from "@/lib/usuarios";

/** GET /unidades (administrador y seguridad). */
export function listarUnidades() {
  return apiFetch<UnidadCondominio[]>("unidades");
}

/** GET /users: residentes y seguridad, ordenados por correo (solo administrador). */
export function listarUsuarios(filtros: { role?: RolCreable; activo?: boolean }) {
  const sp = new URLSearchParams();
  if (filtros.role) sp.set("role", filtros.role);
  if (filtros.activo !== undefined) sp.set("activo", String(filtros.activo));
  const qs = sp.toString();
  return apiFetch<Usuario[]>(`users${qs ? `?${qs}` : ""}`);
}

/** POST /users (solo administrador). */
export function crearUsuario(input: NuevoUsuario) {
  return apiFetch<Usuario>("users", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

/**
 * PATCH /users/:id/desactivar (solo administrador). El backend cierra sus sesiones, cancela
 * sus reservas futuras y pre-autorizaciones vigentes y lo quita de su unidad.
 */
export function desactivarUsuario(id: string) {
  return apiFetch<Usuario>(`users/${encodeURIComponent(id)}/desactivar`, { method: "PATCH" });
}
