"use client";

import { usePathname } from "next/navigation";

function crumbsFor(pathname: string): [string, string] {
  if (pathname === "/paquetes/nuevo") {
    return ["Caseta de seguridad", "Recepción de paquetes"];
  }
  if (/^\/paquetes\/[^/]+\/entrega$/.test(pathname)) {
    return ["Caseta de seguridad", "Paquetes · Entrega"];
  }
  if (pathname.startsWith("/paquetes")) {
    return ["Caseta de seguridad", "Paquetes"];
  }
  return ["Mi comunidad", "Incidencias"];
}

export default function Breadcrumb() {
  const [section, page] = crumbsFor(usePathname());

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span>{section}</span>
      <span className="text-gray-400">&gt;</span>
      <span className="font-medium text-gray-900">{page}</span>
    </div>
  );
}
