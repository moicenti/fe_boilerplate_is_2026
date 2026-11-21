import { Suspense } from "react";
import { obtenerAreasComunes } from "@/lib/reportes-api";
import { FiltrosReportes } from "@/components/reportes/filtros-reportes";
import { TablaAreasComunes } from "@/components/reportes/tabla-areas-comunes";

function getFechasPorDefecto(searchParams: {
    desde?: string;
    hasta?: string;
    seccion?: string;
}) {
    const desde = searchParams.desde;
    const hasta = searchParams.hasta;

    if (desde && hasta) {
        return {
            desde,
            hasta,
            seccion: searchParams.seccion
                ? Number(searchParams.seccion)
                : undefined,
        };
    }

    const hoy = new Date();
    const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    return {
        desde: primerDia.toISOString().split("T")[0],
        hasta: hoy.toISOString().split("T")[0],
        seccion: searchParams.seccion
            ? Number(searchParams.seccion)
            : undefined,
    };
}

export default async function AreasComunesPage({
                                                   searchParams,
                                               }: {
    searchParams: Promise<{
        desde?: string;
        hasta?: string;
        seccion?: string;
    }>;
}) {
    const sp = await searchParams;
    const { desde, hasta, seccion } = getFechasPorDefecto(sp);

    let datos: Awaited<ReturnType<typeof obtenerAreasComunes>> | null = null;
    let error: string | null = null;

    try {
        datos = await obtenerAreasComunes(desde, hasta, seccion);
    } catch (e) {
        console.error("Error cargando reporte de áreas comunes:", e);
        error =
            "No se pudieron cargar los datos. Verifica los filtros o intenta más tarde.";
    }

    return (
        <div className="mx-auto max-w-7xl space-y-8 p-6">
            {/* Encabezado */}
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-habita-700">
                    ANÁLISIS Y SEGUIMIENTO · ÁREAS COMUNES
                </p>
                <h1 className="mt-1 font-serif text-4xl font-bold text-habita-900">
                    Reporte de uso de áreas comunes
                </h1>
                <p className="mt-2 text-gray-600">
                    Ocupación, reservas y horas de uso por área en el periodo
                    seleccionado.
                </p>
            </div>

            {/* Filtros */}
            <Suspense
                fallback={
                    <div className="h-32 animate-pulse rounded-2xl bg-gray-100" />
                }
            >
                <FiltrosReportes />
            </Suspense>

            {/* Contenido */}
            {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
                    {error}
                </div>
            ) : datos ? (
                <TablaAreasComunes datos={datos} />
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-40 animate-pulse rounded-2xl bg-gray-100"
                        />
                    ))}
                </div>
            )}
        </div>
    );
}