import "server-only";
import { apiFetch } from "@/lib/api";
import type { ResumenReporte, Seccion } from "./reportes";


export interface AreaComunesRow {
    areaId: number;
    nombre: string;
    reservas: number;
    horasReservadas: number;
    porcentaje: number;
}

export function obtenerAreasComunes(
    desde: string,
    hasta: string,
    seccion?: number,
): Promise<AreaComunesRow[]> {
    const params = new URLSearchParams({ desde, hasta });
    if (seccion) params.set("seccion", String(seccion));
    return apiFetch<AreaComunesRow[]>(
        `reportes/areas-comunes?${params.toString()}`,
    );
}