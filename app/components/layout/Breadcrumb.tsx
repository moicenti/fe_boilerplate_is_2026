
"use client";

import { usePathname } from "next/navigation";
import type { Role } from "@/lib/current-user";

function crumbsFor(pathname: string, role?: Role): string[] {
  if (pathname === "/mi-comunidad") {
    return ["Mi comunidad", "Inicio"];
  }

  if (pathname.startsWith("/notificaciones")) {
    return ["Mi comunidad", "Notificaciones"];
  }

  if (pathname.startsWith("/cuotas/reglas")) {
    return ["Administración", "Cuotas y reglas"];
  }

  if (pathname.startsWith("/areas/disponibilidad")) {
    return ["Mi comunidad", "Áreas comunes", "Disponibilidad"];
  }

  if (pathname === "/areas" || pathname.startsWith("/areas/")) {
    return ["Administración", "Gestión de áreas"];
  }

  if (pathname.startsWith("/paquetes")) {
    if (role === "RESIDENTE") {
      if (pathname === "/paquetes") {
        return ["Mi comunidad", "Paquetes"];
      }

      return ["Mi comunidad", "Paquetes", "Detalle"];
    }

    if (pathname === "/paquetes/nuevo") {
      return ["Caseta de seguridad", "Recepción de paquetes"];
    }

    if (/^\/paquetes\/[^/]+\/entrega$/.test(pathname)) {
      return ["Caseta de seguridad", "Paquetes", "Entrega"];
    }

    return ["Caseta de seguridad", "Paquetes"];
  }

  if (pathname === "/admin/asambleas/nueva") {
    return ["Administración", "Convocar asamblea"];
  }

  if (/^\/admin\/asambleas\/[^/]+\/editar$/.test(pathname)) {
    return ["Administración", "Asambleas", "Editar borrador"];
  }

  if (/^\/admin\/asambleas\/[^/]+$/.test(pathname)) {
    return ["Administración", "Asambleas", "Convocatoria"];
  }

  if (pathname === "/admin/asambleas") {
    return ["Administración", "Asambleas"];
  }

  if (pathname.startsWith("/admin/incidencias")) {
    return ["Administración", "Panel de incidencias"];
  }

  if (pathname.startsWith("/seguridad/panel")) {
    return ["Seguridad", "Panel de seguridad"];
  }

  if (pathname.startsWith("/seguridad/visitas")) {
    return ["Seguridad", "Registro de visitas"];
  }

  if (pathname === "/visitas/nueva") {
    return ["Mi comunidad", "Mis visitas", "Nueva visita"];
  }

  if (pathname.startsWith("/visitas")) {
    return ["Mi comunidad", "Mis visitas"];
  }

  if (pathname === "/reservas/nueva") {
    return ["Mi comunidad", "Áreas y reservas", "Nueva reserva"];
  }

  if (pathname.startsWith("/reservas")) {
    return ["Mi comunidad", "Áreas y reservas", "Mis reservas"];
  }

  if (pathname === "/incidencias/nuevo") {
    return ["Mi comunidad", "Incidencias", "Nueva incidencia"];
  }

  if (/^\/incidencias\/[^/]+$/.test(pathname)) {
    return ["Mi comunidad", "Incidencias", "Detalle"];
  }

  if (pathname.startsWith("/incidencias")) {
    return ["Mi comunidad", "Incidencias"];
  }

  return ["Mi comunidad", "Inicio"];
}

export default function Breadcrumb({ role }: { role?: Role }) {
  const pathname = usePathname();
  const crumbs = crumbsFor(pathname, role);

  return (
    <nav aria-label="Ruta de navegación">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        {crumbs.map((crumb, index) => (
          <span key={`${crumb}-${index}`} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-gray-400" aria-hidden="true">
                &gt;
              </span>
            )}

            <span
              className={
                index === crumbs.length - 1
                  ? "font-medium text-gray-900"
                  : undefined
              }
            >
              {crumb}
            </span>
          </span>
        ))}
      </div>
    </nav>
  );
}
