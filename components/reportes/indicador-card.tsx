import type { IndicadorValor } from "@/lib/reportes";
import { CONFIG_INDICADORES, formatearValor } from "@/lib/reportes";

type Props = {
    clave: keyof typeof CONFIG_INDICADORES;
    datos: IndicadorValor<any>;
};

export function IndicadorCard({ clave, datos }: Props) {
    const config = CONFIG_INDICADORES[clave];
    const esNoDisponible = 'estado' in datos && datos.estado === 'no_disponible';
    const valorTexto = formatearValor(datos, clave);

    return (
        <div
            className={`relative overflow-hidden rounded-2xl border p-6 transition-all ${
                esNoDisponible
                    ? "border-gray-200 bg-gray-50"
                    : "border-borde bg-white shadow-sm hover:shadow-md"
            }`}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-habita-700">
                        {config.subtitulo}
                    </p>
                    <h3 className="mt-1 font-serif text-xl font-semibold text-habita-900">
                        {config.titulo}
                    </h3>
                </div>
                <span className="text-2xl">{config.icono}</span>
            </div>

            <div className="mt-6 flex items-baseline gap-1">
                {esNoDisponible ? (
                    <span className="text-3xl font-bold text-gray-400">N/D</span>
                ) : (
                    <>
            <span className="text-4xl font-bold text-habita-900">
              {valorTexto}
            </span>
                        {clave === 'morosidad' && 'monto' in datos && (
                            <span className="text-sm text-gray-500">
                (${(datos.monto || 0).toLocaleString()})
              </span>
                        )}
                    </>
                )}
            </div>

            {esNoDisponible && (
                <p className="mt-2 text-xs italic text-gray-500">
                    Datos no disponibles en este momento.
                </p>
            )}
        </div>
    );
}