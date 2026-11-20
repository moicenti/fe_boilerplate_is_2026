"use client";

import { useEffect, useState, useTransition } from "react";
import { guardarPreferencias } from "@/app/actions/preferencias";
import { etiquetaModulo } from "@/lib/notificaciones";
import { descripcionModulo, type Preferencia } from "@/lib/preferencias";
import { ModuleIcon } from "@/components/notificaciones/module-icon";
import { Switch } from "./switch";

type Aviso = { tipo: "ok" | "error"; texto: string };

export function PreferenciasForm({ inicial }: { inicial: Preferencia[] }) {
  // `guardado` = último estado confirmado por el backend; `actual` = lo que ve el residente.
  const [guardado, setGuardado] = useState(inicial);
  const [actual, setActual] = useState(inicial);
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [guardando, iniciar] = useTransition();

  const hayCambios = actual.some((p, i) => p.activo !== guardado[i]?.activo);
  const activas = actual.filter((p) => p.activo).length;

  // El mensaje (toast) desaparece solo a los 5 s.
  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 5000);
    return () => clearTimeout(t);
  }, [aviso]);

  // Estado local optimista: el interruptor cambia al instante.
  function cambiar(modulo: string, activo: boolean) {
    setActual((prev) => prev.map((p) => (p.modulo === modulo ? { ...p, activo } : p)));
  }

  function guardar() {
    if (guardando || !hayCambios) return; // evita el doble clic
    setAviso(null);
    iniciar(async () => {
      const r = await guardarPreferencias(actual);
      if (r.ok) {
        setGuardado(r.data);
        setActual(r.data);
        setAviso({ tipo: "ok", texto: "Preferencias guardadas." });
      } else {
        // Si falla, se conserva el estado anterior y se muestra el motivo.
        setActual(guardado);
        setAviso({ tipo: "error", texto: r.mensaje });
      }
    });
  }

  return (
    <>
      <section className="mt-6 overflow-hidden rounded-2xl border border-borde bg-white">
        <div className="px-6 pb-4 pt-5">
          <h2 className="text-lg font-semibold">Avisos por módulo</h2>
          <p className="mt-1 text-sm text-habita-700">
            Activa solo los módulos de los que quieres recibir avisos.
          </p>
        </div>

        <ul className="border-t border-borde">
          {actual.map((p) => {
            const nombre = etiquetaModulo(p.modulo);
            return (
              <li
                key={p.modulo}
                data-testid="preferencia"
                className="flex items-center gap-4 border-t border-borde px-6 py-4 first:border-t-0"
              >
                <ModuleIcon modulo={p.modulo} />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{nombre}</p>
                  <p className="text-sm text-habita-700">{descripcionModulo(p.modulo)}</p>
                </div>
                <Switch
                  checked={p.activo}
                  disabled={guardando}
                  label={`Avisos de ${nombre}`}
                  onChange={(v) => cambiar(p.modulo, v)}
                />
              </li>
            );
          })}
        </ul>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-borde px-6 py-4">
          <p className="text-sm text-habita-700" aria-live="polite">
            {hayCambios
              ? "Tienes cambios sin guardar."
              : `${activas} de ${actual.length} módulos activados.`}
          </p>
          <button
            type="button"
            onClick={guardar}
            disabled={guardando || !hayCambios}
            className="rounded-lg bg-habita-900 px-5 py-2.5 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </section>

      {aviso && (
        <div
          role={aviso.tipo === "error" ? "alert" : "status"}
          data-testid="toast"
          className={`fixed bottom-6 right-6 z-50 max-w-sm rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
            aviso.tipo === "ok" ? "bg-habita-900 text-white" : "bg-red-700 text-white"
          }`}
        >
          {aviso.texto}
        </div>
      )}
    </>
  );
}
