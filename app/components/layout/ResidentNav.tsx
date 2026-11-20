
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  CalendarCheck,
  CalendarPlus,
  FileText,
  Grid,
  Package,
  ShieldCheck,
  Users,
  Wallet,
  Bell,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/current-user";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type NavGroup = {
  titulo: string;
  items: NavItem[];
};

const GRUPOS: NavGroup[] = [
  {
    titulo: "General",
    items: [
      { href: "/estado-de-cuenta", label: "Estado de cuenta", icon: FileText },
      { href: "/pagos", label: "Realizar pago", icon: Wallet, soloResidente: true },
    ],
  },
  {
    titulo: "Mi Comunidad",
    items: [
      { href: "/areas/disponibilidad", label: "Áreas comunes", icon: Grid },
      { href: "/reservas/nueva", label: "Nueva reserva", icon: CalendarPlus },
      { href: "/reservas", label: "Mis reservas", icon: Calendar },
      { href: "/incidencias", label: "Incidencias", icon: FileText },
      { href: "/visitas", label: "Mis visitas", icon: Users },
      { href: "/paquetes", label: "Paquetes", icon: Package },
    ],
  },
];

const GRUPO_ADMIN: NavGroup = {
  titulo: "Administración",
  items: [
    { href: "/admin/incidencias", label: "Panel de incidencias", icon: ShieldCheck },
    { href: "/admin/asambleas/nueva", label: "Convocar asamblea", icon: CalendarPlus },
    { href: "/admin/asambleas", label: "Asambleas", icon: CalendarCheck },
    { href: "/areas", label: "Gestión de áreas", icon: Grid },
    { href: "/cuotas/reglas", label: "Cuotas y reglas", icon: Wallet },
  ],
};

const GRUPO_MANTENIMIENTO: NavGroup = {
  titulo: "Mantenimiento",
  items: [
    { href: "/incidencias", label: "Incidencias", icon: ClipboardList },
    { href: "/areas", label: "Áreas comunes", icon: Grid },
  ],
};

const HREFS = [
  ...GRUPOS.flatMap((group) => group.items),
  ...GRUPO_ADMIN.items,
  ...GRUPO_MANTENIMIENTO.items,
].map((item) => item.href);

function matches(pathname: string, href: string): boolean {
  if (href === "/reservas") {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function isActive(pathname: string, href: string): boolean {
  if (!matches(pathname, href)) return false;

  return !HREFS.some(
    (other) =>
      other !== href &&
      other.length > href.length &&
      matches(pathname, other),
  );
}

export default function ResidentNav({ role }: { role?: Role }) {
  const pathname = usePathname();

  const grupos: NavGroup[] = [
    ...GRUPOS,
    ...(role === "ADMINISTRADOR" ? [GRUPO_ADMIN] : []),
    ...(role === "MANTENIMIENTO" ? [GRUPO_MANTENIMIENTO] : []),
  ];

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
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
