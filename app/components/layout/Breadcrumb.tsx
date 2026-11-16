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
  if (pathname.startsWith("/areas/disponibilidad")) {
    return ["Mi comunidad", "Áreas y reservas"];
  }
  return ["Mi comunidad", "Incidencias"];
}

export default function Breadcrumb({ role }: { role?: string }) {
  const crumbs = crumbsFor(usePathname(), role);

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      {crumbs.map((crumb, i) => (
        <span key={crumb} className="flex items-center gap-2">
          {i > 0 && <span className="text-gray-400">&gt;</span>}
          <span
            className={
              i === crumbs.length - 1 ? "font-medium text-gray-900" : undefined
            }
          >
            {crumb}
          </span>
        </span>
      ))}
    </div>
  );
}
