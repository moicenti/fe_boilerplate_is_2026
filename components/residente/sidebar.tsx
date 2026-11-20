"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { label: string; href: string; disponible?: boolean };

// Solo las pantallas con `disponible: true` son enlaces; el resto se activa
// conforme se construya cada módulo.
const GRUPOS: { titulo: string; items: Item[] }[] = [
  {
    titulo: "Mi cuenta",
    items: [
      { label: "Estado de cuenta", href: "/estado-de-cuenta", disponible: true },
      { label: "Realizar pago", href: "/pagos", disponible: true },
    ],
  },
  {
    titulo: "Mi comunidad",
    items: [
      { label: "Áreas comunes", href: "/areas-comunes" },
      { label: "Nueva reserva", href: "/reservas/nueva" },
      { label: "Mis reservas", href: "/reservas" },
      { label: "Incidencias", href: "/incidencias" },
      { label: "Visitas", href: "/visitas" },
      { label: "Paquetes", href: "/paquetes" },
      { label: "Asambleas", href: "/asambleas" },
      { label: "Cartelera", href: "/cartelera" },
      { label: "Directorio", href: "/directorio" },
      { label: "Notificaciones", href: "/notificaciones", disponible: true },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-habita-900 px-5 py-7 text-white md:flex">
      <div className="mb-8">
        <p className="font-serif text-3xl leading-none">habita</p>
        <p className="mt-1 text-[10px] tracking-[0.18em] text-white/55">
          GESTIÓN DE CONDOMINIOS
        </p>
      </div>

      <nav aria-label="Principal" className="flex flex-col gap-6">
        {GRUPOS.map((grupo) => (
          <div key={grupo.titulo}>
            <p className="mb-2 px-3 text-[10px] tracking-[0.18em] text-white/50">
              {grupo.titulo.toUpperCase()}
            </p>
            <ul className="flex flex-col gap-0.5">
              {grupo.items.map((item) => {
                // "Preferencias de avisos" cuelga del centro de notificaciones.
                const activo =
                  pathname.startsWith(item.href) ||
                  (item.href === "/notificaciones" && pathname.startsWith("/preferencias"));
                const base = "block rounded-lg px-3 py-2 text-sm";
                return (
                  <li key={item.href}>
                    {item.disponible ? (
                      <Link
                        href={item.href}
                        aria-current={activo ? "page" : undefined}
                        className={`${base} ${
                          activo
                            ? "bg-white/15 font-medium"
                            : "text-white/85 hover:bg-white/10"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span
                        className={`${base} cursor-not-allowed text-white/40`}
                        title="Próximamente"
                      >
                        {item.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
