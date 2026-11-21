import "server-only";
import { apiFetch } from "@/lib/api";
import type { ResumenReporte, Seccion } from "./reportes";

// ✅ Re-exportar Seccion para que pueda importarse desde aquí
export type { Seccion };

export function obtenerResumenReportes(
    desde: string,
    hasta: string,
    seccion?: number,
) {
    const params = new URLSearchParams({ desde, hasta });
    if (seccion) params.set("seccion", String(seccion));
    return apiFetch<ResumenReporte>(`reportes/resumen?${params.toString()}`);
}

export function obtenerSecciones() {
    return apiFetch<Seccion[]>("reportes/secciones");
}