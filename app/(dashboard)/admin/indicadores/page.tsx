import { Suspense } from "react";
import { obtenerResumenReportes } from "@/lib/reportes-api";
import { FiltrosReportes } from "@/components/reportes/filtros-reportes";
import { IndicadorCard } from "@/components/reportes/indicador-card";
import type { ResumenReporte } from "@/lib/reportes";

function getFechasPorDefecto(searchParams: any) {
    const desde = searchParams.desde;
    const hasta = searchParams.hasta;

    if (desde && hasta) {
        return {
            desde,
            hasta,
            seccion: searchParams.seccion ? Number(searchParams.seccion) : undefined,
        };
    }

    const hoy = new Date();
    const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    return {
        desde: primerDia.toISOString().split("T")[0],
        hasta: hoy.toISOString().split("T")[0],
        seccion: searchParams.seccion ? Number(searchParams.seccion) : undefined,
    };
}

export default async function IndicadoresPage({
                                                  searchParams,
                                              }: {
    searchParams: Promise<{ desde?: string; hasta?: string; seccion?: string }>;
}) {
    const sp = await searchParams;
    const { desde, hasta, seccion } = getFechasPorDefecto(sp);

    let datos: ResumenReporte | null = null;
    let error: string | null = null;

    try {
        datos = await obtenerResumenReportes(desde, hasta, seccion);
    } catch (e) {
        console.error("Error cargando resumen de reportes:", e);
        error =
            "No se pudieron cargar los indicadores. Verifica los filtros o intenta más tarde.";
    }

    return (
        <div className="mx-auto max-w-7xl space-y-8 p-6">
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-habita-700">
                    INFORMACIÓN PARA TU GESTIÓN
                </p>
                <h1 className="mt-1 font-serif text-4xl font-bold text-habita-900">
                    Panel de indicadores
                </h1>
                <p className="mt-2 text-gray-600">
                    Una mirada compartida al uso de los espacios, la atención y la
                    participación.
                </p>
            </div>

            <Suspense
                fallback={<div className="h-32 animate-pulse rounded-2xl bg-gray-100" />}
            >
                <FiltrosReportes />
            </Suspense>

            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
                    {error}
                </div>
            ) : datos ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <IndicadorCard clave="ocupacion" datos={datos.ocupacion} />
                    <IndicadorCard clave="incidencias" datos={datos.incidencias} />
                    <IndicadorCard clave="participacion" datos={datos.participacion} />
                    <IndicadorCard clave="morosidad" datos={datos.morosidad} />
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-100" />
                    ))}
                </div>
            )}
        </div>
    );
}