import "server-only";
import { apiFetch } from "@/lib/api";
import type { AreaComunesRow, ResumenReporte, Seccion } from "./reportes";


function crearParametros(desde: string, hasta: string, seccion?: string) {
    const params = new URLSearchParams({ desde, hasta });
    if (seccion) params.set("seccion", seccion);
    return params.toString();
}

export function obtenerResumenReportes(
    desde: string,
    hasta: string,
    seccion?: string,
): Promise<ResumenReporte> {
    return apiFetch<ResumenReporte>(
        `reportes/resumen?${crearParametros(desde, hasta, seccion)}`,
    );
}

export function obtenerSecciones(): Promise<Seccion[]> {
    return apiFetch<Seccion[]>("reportes/secciones");
}

export function obtenerAreasComunes(
    desde: string,
    hasta: string,
    seccion?: string,
): Promise<AreaComunesRow[]> {
    return apiFetch<AreaComunesRow[]>(
        `reportes/areas-comunes?${crearParametros(desde, hasta, seccion)}`,
    );
}
