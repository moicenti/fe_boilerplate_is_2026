"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  CalendarPlus,
  FileText,
  Grid,
  ShieldCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";

type NavItem = { href: string; label: string; icon: LucideIcon };

const GRUPOS: { titulo: string; items: NavItem[] }[] = [
  {
    titulo: "Mi Cuenta",
    items: [
      { href: "#", label: "Estado de cuenta", icon: FileText },
      { href: "#", label: "Realizar pago", icon: Wallet },
    ],
  },
  {
    titulo: "Mi Comunidad",
    items: [
      { href: "/areas/disponibilidad", label: "Áreas comunes", icon: Grid },
      { href: "/reservas/nueva", label: "Nueva reserva", icon: CalendarPlus },
      { href: "/reservas", label: "Mis reservas", icon: Calendar },
      { href: "/incidencias", label: "Incidencias", icon: FileText },
    ],
  },
];

const GRUPO_ADMIN = {
  titulo: "Administración",
  items: [{ href: "/admin/incidencias", label: "Panel de incidencias", icon: ShieldCheck }],
};

const HREFS = [...GRUPOS, GRUPO_ADMIN]
  .flatMap((g) => g.items.map((i) => i.href))
  .filter((h) => h !== "#");

// Activo solo el enlace más específico: en /reservas/nueva no se marca también /reservas.
function isActive(pathname: string, href: string): boolean {
  const coincide = (h: string) => pathname === h || pathname.startsWith(`${h}/`);
  if (href === "#" || !coincide(href)) return false;
  return !HREFS.some((h) => h.length > href.length && coincide(h));
}

export default function ResidentNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const grupos = isAdmin ? [...GRUPOS, GRUPO_ADMIN] : GRUPOS;

  return (
    <nav className="space-y-6">
      {grupos.map((grupo) => (
        <div key={grupo.titulo}>
          <p className="text-xs text-gray-400 font-semibold mb-2 px-2 uppercase tracking-wider">
            {grupo.titulo}
          </p>
          {grupo.items.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={label}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 px-2 py-2 text-sm rounded-md transition mt-1 ${
                  active
                    ? "bg-[#164a33] text-white"
                    : "text-gray-300 hover:text-white hover:bg-[#164a33]"
                }`}
              >
                <Icon size={18} /> {label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
