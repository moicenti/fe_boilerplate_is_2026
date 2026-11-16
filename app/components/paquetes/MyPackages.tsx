"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PackageCheck, RotateCw, ChevronRight } from "lucide-react";
import PackageStatusBadge from "@/app/components/paquetes/PackageStatusBadge";
import InfoTimestamp from "@/app/components/paquetes/InfoTimestamp";
import {
  PICKUP_LOCATION,
  formatDate,
  formatTime,
  readError,
  type MyPackagePage,
  type PackageStatus,
} from "@/lib/paquetes";

type Tab = "TODOS" | PackageStatus;

const TABS: { value: Tab; label: string }[] = [
  { value: "TODOS", label: "Todos" },
  { value: "PENDIENTE_RETIRO", label: "Pendiente de retiro" },
  { value: "ENTREGADO", label: "Entregado" },
];

const EMPTY_MESSAGE: Record<Tab, string> = {
  TODOS: "Aún no hay paquetes registrados para tu unidad.",
  PENDIENTE_RETIRO: "No tienes paquetes pendientes de retiro.",
  ENTREGADO: "Todavía no hay paquetes entregados para tu unidad.",
};

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

export default function MyPackages() {
  const [tab, setTab] = useState<Tab>("TODOS");
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [data, setData] = useState<MyPackagePage | null>(null);
  const [result, setResult] = useState<{ key: string; error: string | null } | null>(null);

  const requestKey = `${attempt}|${tab}|${page}`;
  const isLoading = result?.key !== requestKey;
  const error = isLoading ? null : (result?.error ?? null);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ page: String(page) });
    if (tab !== "TODOS") params.set("estado", tab);

    fetch(`/api/paquetes/mis-paquetes?${params}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await readError(res));
        return (await res.json()) as MyPackagePage;
      })
      .then((next) => {
        if (cancelled) return;
        setData(next);
        setResult({ key: requestKey, error: null });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setResult({
          key: requestKey,
          error:
            e instanceof Error ? e.message : "No se pudieron cargar tus paquetes.",
        });
      });

    return () => {
      cancelled = true;
    };
  }, [tab, page, requestKey]);

  const selectTab = (next: Tab) => {
    setTab(next);
    setPage(1);
  };

  const items = data?.items ?? [];
  const from = data && data.total > 0 ? (data.page - 1) * data.pageSize + 1 : 0;
  const to = data ? from + items.length - 1 : 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
          Paquetes
        </p>
        <h1 className="text-4xl font-serif text-gray-900 mb-2">Mis paquetes</h1>
        <p className="text-gray-600">
          Consulta los paquetes que llegaron para tu unidad y cuáles aún no has
          recogido.
        </p>
      </div>

      {data && data.pendingCount > 0 && (
        <div className="bg-[#f5f0e6] border border-[#e8dfcf] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <PackageCheck className="text-[#0a2f1f]" size={24} />
            <div>
              <p className="font-semibold text-gray-900">
                {data.pendingCount === 1
                  ? "Tienes 1 paquete listo para recoger"
                  : `Tienes ${data.pendingCount} paquetes listos para recoger`}
              </p>
              <p className="text-sm text-gray-600">
                Están en la {PICKUP_LOCATION.toLowerCase()}. Abre el detalle para
                ver tu código de retiro.
              </p>
            </div>
          </div>
          {tab !== "PENDIENTE_RETIRO" && (
            <button
              type="button"
              onClick={() => selectTab("PENDIENTE_RETIRO")}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition whitespace-nowrap"
            >
              Ver pendientes
            </button>
          )}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
          <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Filtrar por estado">
            {TABS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={tab === value}
                onClick={() => selectTab(value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  tab === value
                    ? "bg-[#0a2f1f] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {label}
                {value === "PENDIENTE_RETIRO" && data ? ` (${data.pendingCount})` : ""}
              </button>
            ))}
          </div>
          {data && (
            <span className="px-3 py-1 rounded-full bg-[#f5f0e6] text-xs font-semibold text-gray-900 whitespace-nowrap">
              {plural(data.pendingCount, "pendiente", "pendientes")} de retiro
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-3">Paquete</th>
                <th scope="col" className="px-4 py-3">Recepción</th>
                <th scope="col" className="px-4 py-3">Transportista</th>
                <th scope="col" className="px-4 py-3">Estado</th>
                <th scope="col" className="px-6 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {isLoading &&
                Array.from({ length: 3 }, (_, i) => (
                  <tr key={i} className="border-t border-gray-200">
                    <td colSpan={5} className="px-6 py-5">
                      <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))}

              {!isLoading && error && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <p className="text-red-700 mb-3">{error}</p>
                    <button
                      type="button"
                      onClick={() => setAttempt((a) => a + 1)}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50"
                    >
                      <RotateCw size={16} /> Reintentar
                    </button>
                  </td>
                </tr>
              )}

              {!isLoading && !error && items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-600">
                    {EMPTY_MESSAGE[tab]}
                  </td>
                </tr>
              )}

              {!isLoading &&
                !error &&
                items.map((pkg) => (
                  <tr
                    key={pkg.id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-5">
                      <p className="font-semibold text-gray-900 text-sm">{pkg.folio}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Para {pkg.recipientName}
                      </p>
                    </td>
                    <td className="px-4 py-5 text-sm text-gray-900">
                      <p>{formatDate(pkg.receivedAt)}</p>
                      <p className="text-gray-600">{formatTime(pkg.receivedAt)}</p>
                    </td>
                    <td className="px-4 py-5 text-sm text-gray-900">{pkg.carrier}</td>
                    <td className="px-4 py-5">
                      <PackageStatusBadge status={pkg.status} />
                      {pkg.status === "ENTREGADO" && pkg.deliveredAt && (
                        <p className="text-xs text-gray-600 mt-2">
                          {formatDate(pkg.deliveredAt)} · {formatTime(pkg.deliveredAt)}
                          <br />
                          Recibió: {pkg.deliveredTo}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link
                        href={`/paquetes/${pkg.id}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-[#0a2f1f] hover:underline"
                      >
                        {pkg.status === "PENDIENTE_RETIRO" ? "Ver código" : "Ver detalle"}
                        <ChevronRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex flex-wrap justify-between items-center gap-3 text-sm text-gray-600">
          <span>
            {data && data.total > 0
              ? `${from}–${to} de ${plural(data.total, "paquete", "paquetes")}`
              : "Sin paquetes"}
          </span>
          {data && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage(data.page - 1)}
                disabled={data.page <= 1 || isLoading}
                className="px-3 py-1 text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  aria-current={n === data.page ? "page" : undefined}
                  disabled={isLoading}
                  className={`px-3 py-1 rounded ${
                    n === data.page
                      ? "bg-[#e6f0eb] font-semibold text-gray-900"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPage(data.page + 1)}
                disabled={data.page >= data.totalPages || isLoading}
                className="px-3 py-1 text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>

      <InfoTimestamp />
    </div>
  );
}
