// Tipos y textos de las preferencias de avisos. Sin dependencias de servidor.

export type Preferencia = { modulo: string; activo: boolean };

// Texto de ayuda de cada módulo (el nombre visible sale de lib/notificaciones).
export const DESCRIPCIONES: Record<string, string> = {
  pagos: "Cuotas, recordatorios de pago y novedades de tu estado de cuenta.",
  reservas: "Confirmaciones y cambios de tus reservas de áreas comunes.",
  incidencias: "Respuestas y seguimiento de las incidencias que reportes.",
  visitas: "Autorizaciones y llegada de tus visitas.",
  paqueteria: "Llegada de paquetes y código de retiro.",
  votaciones: "Asambleas y votaciones abiertas en tu comunidad.",
  anuncios: "Comunicados y avisos de la administración.",
};

export function descripcionModulo(modulo: string) {
  return DESCRIPCIONES[modulo] ?? "";
}
