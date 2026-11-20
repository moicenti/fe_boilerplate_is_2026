"use server";

import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api";
import type { Preferencia } from "@/lib/preferencias";
import { reemplazarPreferencias } from "@/lib/preferencias-api";

export type ResultadoGuardado =
  | { ok: true; data: Preferencia[] }
  | { ok: false; mensaje: string };

// Guarda las preferencias del residente autenticado (FE-25.2 / BE-25.2).
// El residente lo identifica el backend por la sesión; aquí nunca se envía su ID.
export async function guardarPreferencias(
  preferencias: Preferencia[],
): Promise<ResultadoGuardado> {
  const valido =
    Array.isArray(preferencias) &&
    preferencias.length > 0 &&
    preferencias.every(
      (p) => typeof p?.modulo === "string" && typeof p?.activo === "boolean",
    );
  if (!valido) {
    return { ok: false, mensaje: "Las preferencias enviadas no son válidas." };
  }

  try {
    // Se envía solo { modulo, activo }, sin campos adicionales.
    const data = await reemplazarPreferencias(
      preferencias.map(({ modulo, activo }) => ({ modulo, activo })),
    );
    return { ok: true, data };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) redirect("/login");
      if (error.status === 400) {
        return { ok: false, mensaje: "Alguno de los módulos no es válido." };
      }
      if (error.status === 403) {
        return { ok: false, mensaje: "No puedes modificar estas preferencias." };
      }
      if (error.status === 0) {
        return { ok: false, mensaje: "No se pudo conectar con el servidor." };
      }
    } else {
      console.error("Error al guardar preferencias:", error);
    }
    return { ok: false, mensaje: "No se pudo guardar. Intenta de nuevo." };
  }
}
