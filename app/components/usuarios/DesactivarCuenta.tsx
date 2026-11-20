"use client";

import { useActionState, useState } from "react";
import { TriangleAlert, UserX } from "lucide-react";
import { desactivarCuenta, type DesactivarState } from "@/app/actions/usuarios";

/**
 * Desactivar no se puede deshacer desde la aplicación (el backend no tiene endpoint para
 * reactivar), así que pide confirmación y dice qué va a pasar antes de enviar.
 */
export function DesactivarCuenta({
  id,
  email,
  esResidente,
  volver,
}: {
  id: string;
  email: string;
  esResidente: boolean;
  /** Query string de la lista, para volver a ella con los mismos filtros. */
  volver: string;
}) {
  const [state, formAction, pending] = useActionState<DesactivarState, FormData>(desactivarCuenta, {});
  const [confirmando, setConfirmando] = useState(false);

  if (!confirmando) {
    return (
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-danger/40 px-3 py-2 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
      >
        <UserX className="size-4" aria-hidden="true" />
        Desactivar
      </button>
    );
  }

  return (
    <form
      action={formAction}
      role="group"
      aria-label={`Confirmar desactivación de ${email}`}
      className="w-full rounded-lg border border-danger/40 bg-danger/5 p-4 text-sm"
    >
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="volver" value={volver} />
      <p className="flex items-start gap-2 font-semibold text-foreground">
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden="true" />
        ¿Desactivar la cuenta de {email}?
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-10 text-secondary">
        <li>No podrá volver a iniciar sesión y se cierran sus sesiones abiertas.</li>
        {esResidente && (
          <>
            <li>Se cancelan sus reservas futuras y sus visitas pre-autorizadas.</li>
            <li>Deja de estar asignado a su unidad. Si era el único residente, la unidad queda sin asignar.</li>
          </>
        )}
        <li>No se puede deshacer desde Habita.</li>
      </ul>
      {state.error && (
        <p role="alert" className="mt-3 text-danger">
          {state.error}
        </p>
      )}
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => setConfirmando(false)}
          disabled={pending}
          className="rounded-lg border border-sage px-4 py-2 font-medium text-foreground hover:bg-sage/20 disabled:opacity-60"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={pending}
          autoFocus
          className="rounded-lg bg-danger px-4 py-2 font-semibold text-white hover:bg-danger/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Desactivando…" : "Sí, desactivar"}
        </button>
      </div>
    </form>
  );
}
