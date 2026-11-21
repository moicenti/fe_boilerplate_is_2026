export type IndicadorValor<T> = T | { estado: 'no_disponible' };

export interface ResumenReporte {
    morosidad: IndicadorValor<{ porcentaje: number; monto: number }>;
    ocupacion: IndicadorValor<{ porcentaje: number }>;
    incidencias: IndicadorValor<{ cantidad: number }>;
    participacion: IndicadorValor<{ porcentaje: number }>;
}

export interface Seccion {
    id: number;
    nombre: string;
    torre: string;
}

export const CONFIG_INDICADORES: Record<keyof ResumenReporte, { titulo: string; subtitulo: string; unidad: string; icono: string }> = {
    ocupacion: {
        titulo: "Reservas confirmadas",
        subtitulo: "Ocupación de áreas comunes",
        unidad: "%",
        icono: "📅"
    },
    incidencias: {
        titulo: "Incidencias no cerradas",
        subtitulo: "Abiertas o en proceso",
        unidad: "",
        icono: "⚠️"
    },
    participacion: {
        titulo: "Participación en votaciones",
        subtitulo: "Unidades habilitadas",
        unidad: "%",
        icono: "🗳️"
    },
    morosidad: {
        titulo: "Morosidad general", // O "Cierre de incidencias" si prefieres forzar el texto de la captura
        subtitulo: "Unidades con cuotas vencidas",
        unidad: "%",
        icono: "💰"
    },
};

export function formatearValor(valor: IndicadorValor<any>, clave: keyof ResumenReporte): string {
    if ('estado' in valor && valor.estado === 'no_disponible') {
        return "N/D";
    }
    const config = CONFIG_INDICADORES[clave];
    if (clave === 'incidencias') return String(valor.cantidad);
    return `${valor.porcentaje.toFixed(1)}${config.unidad}`;
}