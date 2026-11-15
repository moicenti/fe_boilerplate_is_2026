import { Fragment } from "react";
import { BellIcon, ChevronRightIcon } from "@/components/icons";
import { CONDOMINIO } from "@/lib/condominio";

export function Topbar({ crumbs }: { crumbs: string[] }) {
  return (
    <header className="flex h-20 items-center justify-between gap-4 border-b border-border px-4 sm:px-10">
      <nav aria-label="Ruta" className="flex items-center gap-3 text-sm text-muted">
        {crumbs.map((crumb, i) => (
          <Fragment key={crumb}>
            {i > 0 && <ChevronRightIcon className="size-4" />}
            <span
              className={i === crumbs.length - 1 ? "text-foreground" : undefined}
              aria-current={i === crumbs.length - 1 ? "page" : undefined}
            >
              {crumb}
            </span>
          </Fragment>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <span className="text-foreground">
          <BellIcon />
        </span>
        <span className="hidden h-8 w-px bg-border sm:block" />
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full bg-sand/40 text-xs font-semibold">
            AD
          </span>
          <span className="hidden text-sm leading-tight sm:block">
            <span className="block font-semibold">{CONDOMINIO.rol}</span>
            <span className="block text-[11px] text-muted">{CONDOMINIO.nombre}</span>
          </span>
        </div>
      </div>
    </header>
  );
}
