import Link from "next/link";
import type { Filtro } from "@/lib/notificaciones";

const TABS: { valor: Filtro; etiqueta: string }[] = [
  { valor: "todas", etiqueta: "Todas" },
  { valor: "sin-leer", etiqueta: "Sin leer" },
  { valor: "leidas", etiqueta: "Leídas" },
];

export function hrefNotificaciones(filtro: Filtro, page = 1) {
  const params = new URLSearchParams();
  if (filtro !== "todas") params.set("filtro", filtro);
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/notificaciones?${qs}` : "/notificaciones";
}

export function FilterTabs({
  activo,
  noLeidas,
}: {
  activo: Filtro;
  noLeidas: number | null;
}) {
  return (
    <nav aria-label="Filtrar notificaciones" className="flex gap-2">
      {TABS.map((t) => {
        const seleccionado = t.valor === activo;
        const sufijo = t.valor === "sin-leer" && noLeidas ? ` (${noLeidas})` : "";
        return (
          <Link
            key={t.valor}
            href={hrefNotificaciones(t.valor)}
            aria-current={seleccionado ? "page" : undefined}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${
              seleccionado
                ? "bg-habita-900 text-white"
                : "bg-arena text-habita-800 hover:bg-borde"
            }`}
          >
            {t.etiqueta}
            {sufijo}
          </Link>
        );
      })}
    </nav>
  );
}
