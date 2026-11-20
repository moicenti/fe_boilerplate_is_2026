"use client";

import { usePathname } from "next/navigation";

function crumbsFor(pathname: string, role?: string): string[] {
  if (role === "RESIDENTE" && pathname.startsWith("/paquetes")) {
    return pathname === "/paquetes"
      ? ["Mi comunidad", "Paquetes"]
      : ["Mi comunidad", "Paquetes", "Detalle"];
  }
  if (pathname === "/paquetes/nuevo") {
    return ["Caseta de seguridad", "Recepción de paquetes"];
  }
  if (/^\/paquetes\/[^/]+\/entrega$/.test(pathname)) {
    return ["Caseta de seguridad", "Paquetes · Entrega"];
  }
  if (pathname.startsWith("/paquetes")) {
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
  if (pathname.startsWith("/areas/disponibilidad") || pathname.startsWith("/reservas")) {
    return ["Mi comunidad", "Áreas y reservas"];
  }
  if (pathname.startsWith("/estado-de-cuenta") || pathname.startsWith("/pagos")) {
    return role === "ADMINISTRADOR"
      ? ["Administración financiera", "Estado de cuenta"]
      : ["Mi cuenta", "Cuotas y pagos"];
  }
  return ["Mi comunidad", "Incidencias"];
}

export default function Breadcrumb({ role }: { role?: string }) {
  const crumbs = crumbsFor(usePathname(), role);

  return (
    <div className="flex min-w-0 items-center gap-2 text-sm text-gray-600">
      {crumbs.map((crumb, i) => {
        const ultimo = i === crumbs.length - 1;
        return (
          // En pantallas angostas solo se muestra la sección actual.
          <span key={crumb} className={`min-w-0 items-center gap-2 ${ultimo ? "flex" : "hidden sm:flex"}`}>
            {i > 0 && <span className="hidden text-gray-400 sm:inline">&gt;</span>}
            <span className={ultimo ? "truncate font-medium text-gray-900" : undefined}>{crumb}</span>
          </span>
        );
      })}
    </div>
  );
}
