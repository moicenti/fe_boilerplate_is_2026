import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ApiError } from "@/lib/api";
import type { Preferencia } from "@/lib/preferencias";
import { obtenerPreferencias } from "@/lib/preferencias-api";
import { ErrorPanel } from "@/components/notificaciones/error-panel";
import { PreferenciasForm } from "@/components/preferencias/preferencias-form";

export const metadata: Metadata = { title: "Preferencias de avisos" };

function mensajeDeError(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 0) return "No se pudo conectar con el servidor.";
    if (error.status === 403) return "Tu cuenta no puede ver esta pantalla.";
  }
  return "Ocurrió un problema al consultar el servidor. Intenta de nuevo.";
}

export default async function PreferenciasPage() {
  // Página siempre dinámica (depende de la sesión): se declara antes del try/catch
  // para que Next no confunda su señal interna con un error de la API.
  await connection();

  let preferencias: Preferencia[] | null = null;
  let error: string | null = null;

  try {
    preferencias = await obtenerPreferencias();
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/login");
    console.error("Error al cargar preferencias:", e);
    error = mensajeDeError(e);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/notificaciones"
        className="text-sm text-habita-700 underline underline-offset-4"
      >
        ← Volver al centro de notificaciones
      </Link>

      <p className="mt-6 text-[11px] font-semibold tracking-[0.18em] text-habita-700">
        MI COMUNIDAD · AVISOS
      </p>
      <h1 className="mt-2 font-serif text-4xl">Preferencias de avisos</h1>
      <p className="mt-2 text-sm text-habita-700">
        Elige de qué módulos quieres recibir avisos. Los cambios se aplican a los
        avisos que lleguen a partir de que los guardes.
      </p>

      <div
        role="note"
        className="mt-6 rounded-xl border border-borde bg-arena px-4 py-3 text-sm text-habita-900"
      >
        La administración puede enviar comunicados urgentes aunque desactives un
        módulo.
      </div>

      {error ? (
        <section className="mt-6 rounded-2xl border border-borde bg-white">
          <ErrorPanel titulo="No pudimos cargar tus preferencias" mensaje={error} />
        </section>
      ) : (
        preferencias && <PreferenciasForm inicial={preferencias} />
      )}
    </div>
  );
}
