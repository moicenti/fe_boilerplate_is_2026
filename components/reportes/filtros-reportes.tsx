"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { obtenerSecciones, type Seccion } from "@/lib/reportes-api";

export function FiltrosReportes() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [secciones, setSecciones] = useState<Seccion[]>([]);

    useEffect(() => {
        obtenerSecciones().then(setSecciones).catch(() => {});
    }, []);

    const desde = searchParams.get("desde") || "";
    const hasta = searchParams.get("hasta") || "";
    const seccion = searchParams.get("seccion") || "todas";

    function aplicarFiltros(
        nuevoDesde: string,
        nuevoHasta: string,
        nuevaSeccion: string,
    ) {
        const params = new URLSearchParams();
        if (nuevoDesde) params.set("desde", nuevoDesde);
        if (nuevoHasta) params.set("hasta", nuevoHasta);
        if (nuevaSeccion && nuevaSeccion !== "todas")
            params.set("seccion", nuevaSeccion);
        router.push(`/admin/indicadores?${params.toString()}`);
    }

    function setPeriodo(tipo: "mes" | "trimestre") {
        const hoy = new Date();
        const d = new Date();
        if (tipo === "mes") {
            d.setDate(1);
        } else {
            d.setMonth(Math.floor(hoy.getMonth() / 3) * 3, 1);
        }
        aplicarFiltros(
            d.toISOString().split("T")[0],
            hoy.toISOString().split("T")[0],
            seccion,
        );
    }

    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-borde bg-white p-6 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => setPeriodo("mes")}
                    className="rounded-lg border border-borde px-4 py-2 text-sm font-medium text-habita-900 hover:bg-arena"
                >
                    Mes actual
                </button>
                <button
                    onClick={() => setPeriodo("trimestre")}
                    className="rounded-lg border border-borde px-4 py-2 text-sm font-medium text-habita-900 hover:bg-arena"
                >
                    Trimestre
                </button>
            </div>

            <div className="flex flex-wrap gap-3">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-habita-700">Desde</label>
                    <input
                        type="date"
                        value={desde}
                        onChange={(e) => aplicarFiltros(e.target.value, hasta, seccion)}
                        className="rounded-lg border border-borde px-3 py-2 text-sm"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-habita-700">Hasta</label>
                    <input
                        type="date"
                        value={hasta}
                        onChange={(e) => aplicarFiltros(desde, e.target.value, seccion)}
                        className="rounded-lg border border-borde px-3 py-2 text-sm"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-habita-700">Sección</label>
                    <select
                        value={seccion}
                        onChange={(e) => aplicarFiltros(desde, hasta, e.target.value)}
                        className="rounded-lg border border-borde px-3 py-2 text-sm"
                    >
                        <option value="todas">Todas las secciones</option>
                        {secciones.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.torre} - {s.nombre}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}