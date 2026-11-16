import Link from "next/link";
import type { Filtro } from "@/lib/notificaciones";
import { hrefNotificaciones } from "./filter-tabs";

export function Pagination({
  filtro,
  page,
  size,
  total,
}: {
  filtro: Filtro;
  page: number;
  size: number;
  total: number;
}) {
  const totalPaginas = Math.max(1, Math.ceil(total / size));
  const desde = total === 0 ? 0 : (page - 1) * size + 1;
  const hasta = Math.min(page * size, total);
  const base = "rounded-lg px-3 py-1.5 text-sm";
  const apagado = `${base} text-habita-700/40`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-borde px-6 py-4 text-xs text-habita-700">
      <p>
        {desde}–{hasta} de {total} notificaciones
      </p>
      <nav aria-label="Paginación" className="flex items-center gap-1">
        {page > 1 ? (
          <Link href={hrefNotificaciones(filtro, page - 1)} className={`${base} hover:bg-arena`}>
            Anterior
          </Link>
        ) : (
          <span className={apagado}>Anterior</span>
        )}
        <span className={`${base} bg-arena font-medium`} aria-current="page">
          {page} / {totalPaginas}
        </span>
        {page < totalPaginas ? (
          <Link href={hrefNotificaciones(filtro, page + 1)} className={`${base} hover:bg-arena`}>
            Siguiente
          </Link>
        ) : (
          <span className={apagado}>Siguiente</span>
        )}
      </nav>
    </div>
  );
}
