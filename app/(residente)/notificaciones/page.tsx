import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ApiError } from "@/lib/api";
import { contarNoLeidas, listarNotificaciones } from "@/lib/notificaciones-api";
import {
  formatearFecha,
  parseFiltro,
  TAMANO_PAGINA,
  type Filtro,
  type PaginaNotificaciones,
} from "@/lib/notificaciones";
import { ErrorPanel } from "@/components/notificaciones/error-panel";
import { FilterTabs, hrefNotificaciones } from "@/components/notificaciones/filter-tabs";
import { NotificationItem } from "@/components/notificaciones/notification-item";
import { Pagination } from "@/components/notificaciones/pagination";

export const metadata: Metadata = { title: "Notificaciones" };

type Props = {
  searchParams: Promise<{ page?: string; filtro?: string }>;
};

const VACIO: Record<Filtro, { titulo: string; texto: string }> = {
  todas: {
    titulo: "Aún no tienes notificaciones",
    texto: "Cuando haya novedades de tu unidad o de la comunidad, aparecerán aquí.",
  },
  "sin-leer": {
    titulo: "Estás al día",
    texto: "No tienes notificaciones sin leer.",
  },
  leidas: {
    titulo: "Sin notificaciones leídas",
    texto: "Las que marques como leídas aparecerán aquí.",
  },
};

function mensajeDeError(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 0) return "No se pudo conectar con el servidor.";
    if (error.status === 403) return "Tu cuenta no puede ver esta pantalla.";
  }
  return "Ocurrió un problema al consultar el servidor. Intenta de nuevo.";
}

export default async function NotificacionesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const filtro = parseFiltro(sp.filtro);
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

  let pagina: PaginaNotificaciones | null = null;
  let noLeidas: number | null = null;
  let error: string | null = null;

  try {
    [pagina, noLeidas] = await Promise.all([
      listarNotificaciones({ page, size: TAMANO_PAGINA, filtro }),
      contarNoLeidas(),
    ]);
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login");
    console.error("Error al cargar notificaciones:", e);
    error = mensajeDeError(e);
  }

  // Página fuera de rango (por ejemplo ?page=99): volver a la primera.
  if (pagina && pagina.items.length === 0 && page > 1) {
    redirect(hrefNotificaciones(filtro, 1));
  }

  const leidas =
    filtro === "todas" && pagina && noLeidas !== null
      ? Math.max(0, pagina.total - noLeidas)
      : null;

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-habita-700">
        MI COMUNIDAD · AVISOS
      </p>
      <h1 className="mt-2 font-serif text-4xl">Centro de notificaciones</h1>
      <p className="mt-2 text-sm text-habita-700">
        Todas las novedades de tu unidad y tu comunidad, organizadas para ti.
      </p>

      {noLeidas !== null && (
        <section
          aria-label="Resumen"
          className="mt-7 flex items-center justify-between gap-4 rounded-2xl bg-habita-900 px-6 py-5 text-white"
        >
          <div>
            <p className="font-semibold" data-testid="banner-titulo">
              {noLeidas === 0
                ? "No tienes notificaciones sin leer"
                : noLeidas === 1
                  ? "Tienes 1 notificación sin leer"
                  : `Tienes ${noLeidas} notificaciones sin leer`}
            </p>
            <p className="mt-1 text-sm text-white/75">
              {noLeidas === 0
                ? "Estás al día con los avisos de tu comunidad."
                : "Ábrelas para marcarlas como leídas."}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-arena px-3 py-1 text-xs font-medium text-habita-900">
            {noLeidas} sin leer{leidas !== null ? ` · ${leidas} leídas` : ""}
          </span>
        </section>
      )}

      <section className="mt-6 overflow-hidden rounded-2xl border border-borde bg-white">
        <div className="px-6 pb-4 pt-5">
          <h2 className="text-lg font-semibold">Tus notificaciones</h2>
          <div className="mt-3">
            <FilterTabs activo={filtro} noLeidas={noLeidas} />
          </div>
        </div>

        {error ? (
          <ErrorPanel mensaje={error} />
        ) : pagina && pagina.items.length === 0 ? (
          <div className="border-t border-borde px-6 py-14 text-center">
            <p className="font-semibold">{VACIO[filtro].titulo}</p>
            <p className="mt-1 text-sm text-habita-700">{VACIO[filtro].texto}</p>
          </div>
        ) : (
          pagina && (
            <>
              <ul className="border-t border-borde">
                {pagina.items.map((n) => (
                  <NotificationItem
                    key={`${n.id}-${n.leida}`}
                    notificacion={n}
                    fechaTexto={formatearFecha(n.fechaCreacion)}
                  />
                ))}
              </ul>
              <Pagination
                filtro={filtro}
                page={pagina.page}
                size={pagina.size}
                total={pagina.total}
              />
            </>
          )
        )}
      </section>

      <p className="mt-4 text-xs text-habita-700/80">
        Marcar un aviso como leído solo cambia su estado en este centro; no
        modifica pagos, reservas ni otros registros.
      </p>
    </div>
  );
}
