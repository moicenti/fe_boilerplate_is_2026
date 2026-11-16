// Tipos y utilidades de notificaciones. Sin dependencias de servidor, para poder
// importarlo también desde componentes de cliente.

export type Notificacion = {
  id: number;
  titulo: string | null;
  mensaje: string;
  moduloOrigen: string;
  fechaCreacion: string;
  leida: boolean;
  enlaceAccion: string | null;
};

export type PaginaNotificaciones = {
  total: number;
  page: number;
  size: number;
  items: Notificacion[];
};

export type Filtro = "todas" | "sin-leer" | "leidas";

export const TAMANO_PAGINA = 20;

export function parseFiltro(valor: string | undefined): Filtro {
  return valor === "sin-leer" || valor === "leidas" ? valor : "todas";
}

// Catálogo de módulos de origen (debe coincidir con el del backend, H25).
export const MODULOS: Record<string, { etiqueta: string; accion: string }> = {
  pagos: { etiqueta: "Cuotas", accion: "Ver estado de cuenta" },
  reservas: { etiqueta: "Reservas", accion: "Ver mis reservas" },
  incidencias: { etiqueta: "Incidencias", accion: "Ver mis reportes" },
  visitas: { etiqueta: "Visitas", accion: "Ver autorización" },
  paqueteria: { etiqueta: "Paquetes", accion: "Ver paquete" },
  votaciones: { etiqueta: "Asambleas", accion: "Ver asamblea" },
  anuncios: { etiqueta: "Comunicados", accion: "Leer comunicado" },
};

export function etiquetaModulo(modulo: string) {
  return MODULOS[modulo]?.etiqueta ?? modulo;
}

export function etiquetaAccion(modulo: string) {
  return MODULOS[modulo]?.accion ?? "Ver detalle";
}

// Solo se navega a rutas internas: evita redirecciones a otros sitios si el
// enlace guardado en la notificación viniera mal formado.
export function rutaSegura(enlace: string | null): string | null {
  if (!enlace) return null;
  return enlace.startsWith("/") && !enlace.startsWith("//") ? enlace : null;
}

const TZ = "America/El_Salvador";

// "05 nov 2026 · 10:30 h"
export function formatearFecha(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const fecha = new Intl.DateTimeFormat("es-SV", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: TZ,
  })
    .format(d)
    .replace(/\./g, "")
    .replace(/ de /g, " ");
  const hora = new Intl.DateTimeFormat("es-SV", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TZ,
  }).format(d);
  return `${fecha} · ${hora} h`;
}
