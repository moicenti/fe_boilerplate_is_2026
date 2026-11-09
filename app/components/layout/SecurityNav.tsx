"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogIn,
  Users,
  PackagePlus,
  Package,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

type NavItem = { href: string; label: string; icon: LucideIcon };

const ITEMS: NavItem[] = [
  { href: "#", label: "Registro de entrada", icon: LogIn },
  { href: "#", label: "Visitantes dentro", icon: Users },
  { href: "/paquetes/nuevo", label: "Llegada de paquete", icon: PackagePlus },
  { href: "/paquetes", label: "Paquetes pendientes", icon: Package },
  { href: "#", label: "Disponibilidad de áreas", icon: LayoutGrid },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "#") return false;
  if (href === "/paquetes") {
    return pathname === "/paquetes" || /^\/paquetes\/[^/]+\/entrega$/.test(pathname);
  }
  return pathname === href;
}

export default function SecurityNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-6">
      <div>
        <p className="text-xs text-gray-400 font-semibold mb-2 px-2 uppercase tracking-wider">
          Operación de caseta
        </p>
        {ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            aria-current={isActive(pathname, href) ? "page" : undefined}
            className={`flex items-center gap-3 px-2 py-2 text-sm rounded-md transition mt-1 ${
              isActive(pathname, href)
                ? "bg-[#164a33] text-white"
                : "text-gray-300 hover:text-white hover:bg-[#164a33]"
            }`}
          >
            <Icon size={18} /> {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
