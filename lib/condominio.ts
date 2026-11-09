// Datos del condominio y del usuario que se muestran en el panel.
// TODO: reemplazar por los datos de la sesión cuando la API los exponga.
export const CONDOMINIO = {
  nombre: "Los Olivos",
  rol: "Administrador",
  /** Zona horaria en la que se interpretan y muestran las fechas (UTC-06:00). */
  zonaHoraria: "America/El_Salvador",
};

/** Fecha de hoy ("YYYY-MM-DD") en la zona horaria del condominio. */
export function hoyEnCondominio() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: CONDOMINIO.zonaHoraria }).format(new Date());
}

/** Fecha y hora local del condominio a ISO 8601 con desfase: "2026-11-14T10:00:00-06:00". */
export function aIsoCondominio(fecha: string, hora: string) {
  const instante = new Date(`${fecha}T${hora}:00Z`);
  const nombre =
    new Intl.DateTimeFormat("en-US", {
      timeZone: CONDOMINIO.zonaHoraria,
      timeZoneName: "longOffset",
    })
      .formatToParts(instante)
      .find((p) => p.type === "timeZoneName")?.value ?? "GMT";
  const desfase = nombre === "GMT" ? "+00:00" : nombre.replace("GMT", "");
  return `${fecha}T${hora}:00${desfase}`;
}
