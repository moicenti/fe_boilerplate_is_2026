"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  CalendarCheck,
  CalendarPlus,
  FileText,
  Grid,
  Package,
  ShieldCheck,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  soloResidente?: boolean;
};

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
      { href: "/visitas", label: "Mis visitas", icon: Users, soloResidente: true },
      { href: "/paquetes", label: "Paquetes", icon: Package, soloResidente: true },
    ],
  },
];

const GRUPO_ADMIN = {
  titulo: "Administración",
  items: [
    { href: "/admin/incidencias", label: "Panel de incidencias", icon: ShieldCheck },
    { href: "/admin/asambleas/nueva", label: "Convocar asamblea", icon: CalendarPlus },
    { href: "/admin/asambleas", label: "Asambleas", icon: CalendarCheck },
  ],
};

const HREFS = [...GRUPOS.flatMap((g) => g.items), ...GRUPO_ADMIN.items].map(
  (item) => item.href,
);

function matches(pathname: string, href: string): boolean {
  if (href === "#") return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isActive(pathname: string, href: string): boolean {
  if (!matches(pathname, href)) return false;
  return !HREFS.some(
    (other) => other.length > href.length && matches(pathname, other),
  );
}

export default function ResidentNav({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();

  const grupos = isAdmin
    ? [
        ...GRUPOS.map((grupo) => ({
          ...grupo,
          items: grupo.items.filter((item) => !item.soloResidente),
        })),
        GRUPO_ADMIN,
      ]
    : GRUPOS;

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