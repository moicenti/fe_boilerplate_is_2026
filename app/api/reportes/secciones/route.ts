import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api";
import type { Seccion } from "@/lib/reportes";

export async function GET() {
    try {
        const secciones = await apiFetch<Seccion[]>("reportes/secciones");
        return NextResponse.json(secciones);
    } catch (error) {
        const status = error instanceof ApiError
            ? (error.status > 0 ? error.status : 502)
            : 500;
        const message = error instanceof Error
            ? error.message
            : "No se pudieron cargar las secciones.";

        return NextResponse.json({ message }, { status });
    }
}
