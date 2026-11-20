import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Search, ShieldCheck, UserPlus, UserRound } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { DesactivarCuenta } from "@/app/components/usuarios/DesactivarCuenta";
import { ApiError } from "@/lib/api";
import { CONDOMINIO } from "@/lib/condominio";
import { listarUsuarios } from "@/lib/usuarios-api";
import { leerEstado, leerRol, type EstadoFiltro, type RolCreable, type Usuario } from "@/lib/usuarios";

export const metadata: Metadata = {
  title: "Usuarios",
};

type Filtros = { rol?: RolCreable; estado: EstadoFiltro; q: string };

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function query({ rol, estado, q }: Filtros) {
  const sp = new URLSearchParams();
  if (rol) sp.set("rol", rol);
  if (estado !== "activos") sp.set("estado", estado);
  if (q) sp.set("q", q);
  return sp.toString();
}

function href(filtros: Filtros) {
  const qs = query(filtros);
  return `/usuarios${qs ? `?${qs}` : ""}`;
}

const fechaAlta = new Intl.DateTimeFormat("es-SV", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: CONDOMINIO.zonaHoraria,
});

const OPCIONES_ROL: { valor?: RolCreable; etiqueta: string }[] = [
  { etiqueta: "Todos" },
  { valor: "RESIDENTE", etiqueta: "Residentes" },
  { valor: "SEGURIDAD", etiqueta: "Seguridad" },
];

const OPCIONES_ESTADO: { valor: EstadoFiltro; etiqueta: string }[] = [
  { valor: "activos", etiqueta: "Activas" },
  { valor: "inactivos", etiqueta: "Desactivadas" },
  { valor: "todos", etiqueta: "Todas" },
];

export default async function UsuariosPage(props: PageProps<"/usuarios">) {
  const sp = await props.searchParams;
  const filtros: Filtros = {
    rol: leerRol(first(sp.rol)),
    estado: leerEstado(first(sp.estado)),
    q: (first(sp.q) ?? "").trim().toLowerCase(),
  };
  const desactivado = first(sp.desactivado);

  let usuarios: Usuario[] = [];
  let loadError: "sesion" | "general" | null = null;
  try {
    usuarios =
      (await listarUsuarios({
        role: filtros.rol,
        activo: filtros.estado === "todos" ? undefined : filtros.estado === "activos",
      })) ?? [];
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    loadError = error.status === 401 ? "sesion" : "general";
    if (loadError === "general") console.error("Error al listar usuarios:", error);
  }

  // El backend no busca por texto; la lista de un condominio es corta.
  const visibles = filtros.q ? usuarios.filter((u) => u.email.includes(filtros.q)) : usuarios;
  const volver = query(filtros);

  const chip = (activo: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm transition-colors ${
      activo ? "border-secondary bg-secondary text-primary-foreground" : "border-border hover:border-sage"
    }`;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-[11px] font-medium tracking-[0.2em] text-secondary uppercase">Administración</p>
          <h1 className="mt-2 font-serif text-4xl text-foreground sm:text-[40px]">Usuarios</h1>
          <p className="mt-2 text-sm text-secondary">
            Residentes y personal de seguridad de {CONDOMINIO.nombre}. Los administradores no aparecen aquí.
          </p>
        </div>
        <Link
          href="/usuarios/nuevo"
          className="inline-flex items-center gap-3 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-moss"
        >
          <UserPlus className="size-4" aria-hidden="true" />
          Registrar usuario
        </Link>
      </div>

      {desactivado && (
        <p role="status" className="flex items-center gap-3 rounded-lg bg-sage/25 px-5 py-3 text-sm text-foreground">
          <CheckCircle2 className="size-5 shrink-0 text-secondary" aria-hidden="true" />
          La cuenta de {desactivado} quedó desactivada.
        </p>
      )}

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:p-5">
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <nav aria-label="Filtrar por tipo" className="flex flex-wrap gap-2">
            {OPCIONES_ROL.map((o) => (
              <Link
                key={o.etiqueta}
                href={href({ ...filtros, rol: o.valor })}
                aria-current={filtros.rol === o.valor ? "page" : undefined}
                className={chip(filtros.rol === o.valor)}
              >
                {o.etiqueta}
              </Link>
            ))}
          </nav>
          <nav aria-label="Filtrar por estado" className="flex flex-wrap gap-2">
            {OPCIONES_ESTADO.map((o) => (
              <Link
                key={o.valor}
                href={href({ ...filtros, estado: o.valor })}
                aria-current={filtros.estado === o.valor ? "page" : undefined}
                className={chip(filtros.estado === o.valor)}
              >
                {o.etiqueta}
              </Link>
            ))}
          </nav>
        </div>
        <form action="/usuarios" role="search" className="flex gap-2">
          {filtros.rol && <input type="hidden" name="rol" value={filtros.rol} />}
          {filtros.estado !== "activos" && <input type="hidden" name="estado" value={filtros.estado} />}
          <label htmlFor="q" className="sr-only">
            Buscar por correo
          </label>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={filtros.q}
              placeholder="Buscar por correo"
              className="w-full rounded-lg border border-sage bg-background py-2.5 pr-3 pl-9 text-sm outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
            />
          </div>
          <button type="submit" className="rounded-lg border border-sage px-4 text-sm font-medium hover:bg-sage/20">
            Buscar
          </button>
        </form>
      </div>

      {loadError === "sesion" ? (
        <div className="flex flex-col items-start gap-3 rounded-xl border border-border bg-surface px-6 py-8 text-sm">
          <p>Tu sesión venció. Inicia sesión de nuevo para continuar.</p>
          <form action={logout}>
            <button type="submit" className="font-semibold text-secondary underline underline-offset-4">
              Ir a iniciar sesión
            </button>
          </form>
        </div>
      ) : loadError ? (
        <p role="alert" className="rounded-xl border border-border bg-surface px-6 py-8 text-sm">
          No se pudo cargar la lista de usuarios. Intenta más tarde.
        </p>
      ) : (
        <section aria-labelledby="titulo-lista" className="overflow-hidden rounded-xl border border-border bg-surface">
          <h2 id="titulo-lista" className="border-b border-border px-5 py-4 text-sm text-secondary">
            {visibles.length} {visibles.length === 1 ? "cuenta" : "cuentas"}
            {filtros.q && ` que ${visibles.length === 1 ? "coincide" : "coinciden"} con “${filtros.q}”`}
          </h2>
          {visibles.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-secondary">No hay cuentas con estos filtros.</p>
          ) : (
            <ul className="divide-y divide-border">
              {visibles.map((u) => {
                const esResidente = u.role === "RESIDENTE";
                const Icono = esResidente ? UserRound : ShieldCheck;
                return (
                  <li key={u.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4">
                    <Icono className="size-5 shrink-0 text-muted" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold break-all text-foreground sm:truncate sm:break-normal">{u.email}</p>
                      <p className="mt-0.5 text-xs text-secondary">
                        {esResidente ? "Residente" : "Seguridad"}
                        {esResidente && ` · ${u.unit ? `${u.unit.code} · ${u.unit.tower}` : "Sin unidad"}`}
                        {` · Alta ${fechaAlta.format(new Date(u.createdAt)).replace(/\./g, "")}`}
                      </p>
                    </div>
                    {u.isActive ? (
                      <DesactivarCuenta id={u.id} email={u.email} esResidente={esResidente} volver={volver} />
                    ) : (
                      <span className="rounded-full bg-sand/40 px-3 py-1 text-xs font-medium text-foreground">
                        Desactivada
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
