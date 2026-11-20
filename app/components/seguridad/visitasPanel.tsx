'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, DoorOpen, DoorClosed, UserCheck, AlertCircle } from 'lucide-react';

type Pre = {
  id: string;
  codigo: string;
  nombreVisitante: string;
  documento: string;
  acompanantes: number;
  inicio: string;
  fin: string;
  estado: string;
};

type VisitaActiva = {
  id: string;
  nombreVisitante: string;
  documento: string;
  acompanantes: number;
  estado: 'DENTRO' | 'DENTRO_SIN_AUTORIZACION';
  entrada: string;
  motivo: string | null;
  unidad: { id: string; code: string; tower: string } | null;
  preautorizacion: { codigo: string } | null;
};

type Tab = 'registrar' | 'activos';

export default function VisitasPanel() {
  const [tab, setTab] = useState<Tab>('registrar');

  // Búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Pre[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Entrada
  const [selectedPre, setSelectedPre] = useState<Pre | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [manualForm, setManualForm] = useState({
    nombreVisitante: '',
    documento: '',
    acompanantes: 0,
    unidadCode: '',
    motivo: '',
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Activos
  const [activos, setActivos] = useState<VisitaActiva[]>([]);
  const [loadingActivos, setLoadingActivos] = useState(false);
  const [errorActivos, setErrorActivos] = useState<string | null>(null);

  const cargarActivos = useCallback(async () => {
    setLoadingActivos(true);
    setErrorActivos(null);
    try {
      const res = await fetch('/api/visitas/activas');
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? 'Error al cargar visitantes activos');
      }
      const data = await res.json();
      setActivos(data);
    } catch (e) {
      setErrorActivos(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setLoadingActivos(false);
    }
  }, []);

useEffect(() => {
  if (tab !== 'activos') return;

  let ignore = false;

  const run = async () => {
    // Esperar un tick para que el render inicial termine
    await Promise.resolve();
    if (!ignore) await cargarActivos();
  };

  run();

  return () => {
    ignore = true;
  };
}, [tab, cargarActivos]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchError(null);
    setSearchResults([]);
    setSelectedPre(null);
    try {
      const res = await fetch(`/api/visitas/buscar?query=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? 'Error al buscar');
      }
      const data = await res.json();
      setSearchResults(data);
    } catch (e) {
      setSearchError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setSearching(false);
    }
  };

  const handleRegistrarEntrada = async () => {
    setSubmitError(null);
    setSubmitting(true);

    const payload = selectedPre
      ? { preautorizacionId: selectedPre.id }
      : manualForm;

    try {
      const res = await fetch('/api/visitas/entrada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? 'Error al registrar entrada');
      }
      // Reset
      setSelectedPre(null);
      setSearchResults([]);
      setSearchQuery('');
      setManualMode(false);
      setManualForm({ nombreVisitante: '', documento: '', acompanantes: 0, unidadCode: '', motivo: '' });
      setTab('activos');
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegistrarSalida = async (visitaId: string) => {
    try {
      const res = await fetch(`/api/visitas/${visitaId}/salida`, {
        method: 'PATCH',
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? 'Error al registrar salida');
      }
      cargarActivos();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Error desconocido');
    }
  };

  const inputClass = (hasError = false) =>
    `w-full px-3 py-2 border rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#0a2f1f] focus:border-transparent outline-none transition ${
      hasError ? 'border-red-500' : 'border-gray-300'
    }`;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
          Seguridad
        </p>
        <h1 className="text-4xl font-serif text-gray-900 mb-2">
          Registro de visitantes
        </h1>
        <p className="text-gray-600">
          Busca autorizaciones, registra entradas y salidas, y consulta quién está dentro.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('registrar')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            tab === 'registrar'
              ? 'bg-[#0a2f1f] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Registrar entrada
        </button>
        <button
          onClick={() => setTab('activos')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            tab === 'activos'
              ? 'bg-[#0a2f1f] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Dentro del condominio ({activos.length})
        </button>
      </div>

      {/* TAB: Registrar */}
      {tab === 'registrar' && (
        <div className="space-y-6">
          {/* Buscador */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Buscar pre-autorización
            </h2>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Código, documento o nombre del visitante"
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={searching}
                className="px-4 py-2 bg-[#0a2f1f] text-white rounded-lg text-sm font-medium hover:bg-[#164a33] disabled:opacity-50"
              >
                {searching ? 'Buscando...' : 'Buscar'}
              </button>
            </div>

            {searchError && (
              <div className="mt-4 bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">
                {searchError}
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase">
                  {searchResults.length} resultado(s)
                </p>
                {searchResults.map((pre) => (
                  <div
                    key={pre.id}
                    className={`border rounded-lg p-3 cursor-pointer transition ${
                      selectedPre?.id === pre.id
                        ? 'border-[#0a2f1f] bg-[#f0f5f2]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPre(pre)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-sm text-gray-900">
                          {pre.nombreVisitante}
                        </p>
                        <p className="text-xs text-gray-500">
                          Doc: {pre.documento} · {pre.acompanantes} acomp.
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(pre.inicio).toLocaleString()} → {new Date(pre.fin).toLocaleString()}
                        </p>
                      </div>
                      <span className="font-mono text-sm font-bold text-[#0a2f1f]">
                        {pre.codigo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchResults.length === 0 && searchQuery && !searching && (
              <p className="mt-4 text-sm text-gray-500">
                No se encontraron pre-autorizaciones vigentes.
              </p>
            )}
          </div>

          {/* Botón para modo manual */}
          {!selectedPre && (
            <div className="text-center">
              <button
                onClick={() => setManualMode(!manualMode)}
                className="text-sm text-[#0a2f1f] underline"
              >
                {manualMode ? 'Cancelar registro manual' : 'El visitante no tiene autorización'}
              </button>
            </div>
          )}

          {/* Formulario manual (sin pre-autorización) */}
          {manualMode && !selectedPre && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className="text-orange-500" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Registrar sin autorización
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nombre del visitante *
                  </label>
                  <input
                    type="text"
                    value={manualForm.nombreVisitante}
                    onChange={(e) => setManualForm({ ...manualForm, nombreVisitante: e.target.value })}
                    className={inputClass()}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Documento *
                  </label>
                  <input
                    type="text"
                    value={manualForm.documento}
                    onChange={(e) => setManualForm({ ...manualForm, documento: e.target.value })}
                    className={inputClass()}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Unidad (código) *
                  </label>
                  <input
                    type="text"
                    value={manualForm.unidadCode}
                    onChange={(e) => setManualForm({ ...manualForm, unidadCode: e.target.value })}
                    placeholder="Ej. A-19"
                    className={inputClass()}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Acompañantes (0-5)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    value={manualForm.acompanantes}
                    onChange={(e) => setManualForm({ ...manualForm, acompanantes: Number(e.target.value) })}
                    className={inputClass()}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Motivo (10-200 caracteres) *
                </label>
                <textarea
                  value={manualForm.motivo}
                  onChange={(e) => setManualForm({ ...manualForm, motivo: e.target.value })}
                  rows={3}
                  className={`${inputClass()} resize-none`}
                  placeholder="Describe el motivo de la visita sin autorización"
                />
              </div>
            </div>
          )}

          {/* Botón de registrar entrada */}
          {(selectedPre || manualMode) && (
            <div className="flex justify-end">
              <button
                onClick={handleRegistrarEntrada}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-[#0a2f1f] text-white rounded-lg text-sm font-medium hover:bg-[#164a33] disabled:opacity-50"
              >
                <DoorOpen size={16} />
                {submitting ? 'Registrando...' : 'Registrar entrada'}
              </button>
            </div>
          )}

          {submitError && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">
              {submitError}
            </div>
          )}
        </div>
      )}

      {/* TAB: Activos */}
      {tab === 'activos' && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Visitantes dentro ({activos.length})
            </h2>
            <button
              onClick={cargarActivos}
              disabled={loadingActivos}
              className="text-sm text-[#0a2f1f] underline disabled:opacity-50"
            >
              {loadingActivos ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>

          {loadingActivos && (
            <div className="p-8 text-center text-gray-500">Cargando...</div>
          )}
          {errorActivos && (
            <div className="p-8 text-center text-red-600">{errorActivos}</div>
          )}
          {!loadingActivos && !errorActivos && activos.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No hay visitantes dentro del condominio.
            </div>
          )}

          {!loadingActivos && !errorActivos && activos.map((v) => (
            <div
              key={v.id}
              className="grid grid-cols-12 gap-4 items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
            >
              <div className="col-span-3">
                <p className="font-semibold text-sm text-gray-900">{v.nombreVisitante}</p>
                <p className="text-xs text-gray-500">Doc: {v.documento}</p>
              </div>
              <div className="col-span-2 text-xs text-gray-700">
                {v.unidad ? `${v.unidad.tower} · ${v.unidad.code}` : '—'}
              </div>
              <div className="col-span-2">
                {v.preautorizacion ? (
                  <span className="font-mono text-xs font-bold text-[#0a2f1f]">
                    {v.preautorizacion.codigo}
                  </span>
                ) : (
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                    Sin autorización
                  </span>
                )}
              </div>
              <div className="col-span-2 text-xs text-gray-700">
                <p className="flex items-center gap-1">
                  <UserCheck size={12} /> {new Date(v.entrada).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-gray-400">
                  {new Date(v.entrada).toLocaleDateString('es-MX')}
                </p>
              </div>
              <div className="col-span-2 text-xs text-gray-500">
                {v.acompanantes} acomp.
              </div>
              <div className="col-span-1 text-right">
                <button
                  onClick={() => handleRegistrarSalida(v.id)}
                  className="flex items-center gap-1 text-xs font-medium text-red-600 hover:underline"
                >
                  <DoorClosed size={14} /> Salida
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}