"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import { logout } from "@/app/actions/auth";
import {
  CalendarPlusIcon,
  ClipboardIcon,
  ClockIcon,
  FilePlusIcon,
  GridIcon,
  HomeIcon,
  LogOutIcon,
  MessageIcon,
  SlidersIcon,
  UsersIcon,
  WalletIcon,
} from "@/components/icons";
import { CONDOMINIO } from "@/lib/condominio";

type NavItem = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Sin href el botón se muestra pero no hace nada. */
  href?: string;
};

const NAV: { titulo: string; items: NavItem[] }[] = [
  {
    titulo: "Comunidad",
    items: [
      { label: "Residentes", icon: UsersIcon },
      { label: "Áreas comunes", icon: GridIcon, href: "/areas" },
      { label: "Incidencias", icon: ClipboardIcon },
      { label: "Convocar asamblea", icon: CalendarPlusIcon },
    ],
  },
  {
    titulo: "Administración financiera",
    items: [
      { label: "Estado de cuenta", icon: WalletIcon },
      { label: "Morosidad", icon: ClockIcon },
      { label: "Reglas de cuotas", icon: SlidersIcon },
      { label: "Generación manual", icon: FilePlusIcon },
    ],
  },
];

export function Logo() {
  return (
    <span className="flex items-center gap-3">
      <span className="grid size-9 place-items-center rounded-lg border border-sand/70 text-sand">
        <HomeIcon className="size-5" />
      </span>
      <span className="leading-none">
        <span className="block font-serif text-3xl text-cream">habita</span>
        <span className="mt-1 block text-[9px] tracking-[0.2em] text-sand uppercase">
          Gestión de condominios
        </span>
      </span>
    </span>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-forest px-5 py-8 text-cream lg:flex">
      <Link href="/areas" className="px-2" aria-label="Habita, inicio">
        <Logo />
      </Link>

      <div className="mt-9 rounded-lg border border-cream/20 p-4">
        <p className="font-semibold">{CONDOMINIO.nombre}</p>
        <p className="mt-1 text-xs text-cream/70">Administración del condominio</p>
        <span className="mt-2 inline-block rounded bg-moss px-2 py-1 text-[11px]">
          {CONDOMINIO.rol}
        </span>
      </div>

      <nav className="mt-8 flex flex-col gap-6" aria-label="Principal">
        {NAV.map((grupo) => (
          <div key={grupo.titulo}>
            <p className="mb-2 text-[10px] tracking-[0.15em] text-cream/60 uppercase">
              {grupo.titulo}
            </p>
            <ul className="flex flex-col gap-1">
              {grupo.items.map(({ label, icon: Icon, href }) => {
                const active = href && pathname.startsWith(href);
                const classes = `flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition-colors hover:bg-moss/60 ${
                  active ? "bg-moss font-medium" : ""
                }`;
                return (
                  <li key={label}>
                    {href ? (
                      <Link
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={classes}
                      >
                        <Icon />
                        {label}
                      </Link>
                    ) : (
                      // Sin href todavía: se ve igual que el resto pero no hace nada.
                      <button type="button" className={classes}>
                        <Icon />
                        {label}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-4 pt-10">
        <div className="rounded-lg border border-cream/20 p-4 text-xs">
          <MessageIcon className="size-5 text-sand" />
          <p className="mt-3 text-sm font-semibold">Acompañamos tu gestión</p>
          <p className="mt-1 leading-relaxed text-cream/70">
            ¿Necesitas ayuda con Habita? Nuestro equipo está contigo.
          </p>
        </div>

        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-cream/80 transition-colors hover:bg-moss/60 hover:text-cream"
          >
            <LogOutIcon />
            Cerrar sesión
          </button>
        </form>
        <p className="px-1 text-[11px] text-cream/60">© 2026 Habita</p>
      </div>
    </aside>
  );
}
