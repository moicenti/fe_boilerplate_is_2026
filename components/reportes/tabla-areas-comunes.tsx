"use client";

import type { AreaComunesRow } from "@/lib/reportes-api";

type Props = {
    datos: AreaComunesRow[];
};

export function TablaAreasComunes({ datos }: Props) {
    if (datos.length === 0) {
        return (
            <div className="rounded-2xl border border-borde bg-white p-12 text-center">
                <p className="text-lg text-gray-500">
                    Sin reservas confirmadas en el periodo seleccionado.
                </p>
                <p className="mt-2 text-sm text-gray-400">
                    Prueba con un rango de fechas diferente o sin filtro de sección.
                </p>
            </div>
        );
    }

    // Identificar área más y menos usada
    const masUsada = datos.reduce((max, row) =>
        row.porcentaje > max.porcentaje ? row : max,
    );
    const menosUsada = datos.reduce((min, row) =>
        row.porcentaje < min.porcentaje ? row : min,
    );

    return (
        <div className="rounded-2xl border border-borde bg-white shadow-sm">
            {/* Encabezado con resumen */}
            <div className="border-b border-borde p-6">
                <h3 className="font-serif text-xl font-semibold text-habita-900">
                    Ocupación por área
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                    {datos.length} área{datos.length !== 1 ? "s" : ""} con reservas en el
                    periodo
                </p>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="border-b border-borde bg-arena/50">
                        <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-habita-700">
                            Área
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-habita-700">
                            Reservas
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-habita-700">
                            Horas
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-habita-700">
                            Ocupación
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-borde">
                    {datos.map((row) => {
                        const esMasUsada = row.areaId === masUsada.areaId;
                        const esMenosUsada =
                            datos.length > 1 && row.areaId === menosUsada.areaId;

                        return (
                            <tr
                                key={row.areaId}
                                className={`transition-colors hover:bg-arena/30 ${
                                    esMasUsada
                                        ? "bg-green-50"
                                        : esMenosUsada
                                            ? "bg-amber-50"
                                            : ""
                                }`}
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                      <span className="font-medium text-habita-900">
                        {row.nombre}
                      </span>
                                        {esMasUsada && (
                                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                          Más usada
                        </span>
                                        )}
                                        {esMenosUsada && (
                                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                          Menos usada
                        </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-habita-900">
                                    {row.reservas}
                                </td>
                                <td className="px-6 py-4 text-right font-mono text-habita-900">
                                    {row.horasReservadas.toFixed(1)}h
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                                            <div
                                                className="h-full bg-habita-700"
                                                style={{
                                                    width: `${Math.min(row.porcentaje, 100)}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="font-mono text-sm font-semibold text-habita-900">
                        {row.porcentaje.toFixed(1)}%
                      </span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}