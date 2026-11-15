'use client';

import { useEffect, useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

type Priority = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

type ReportEvent = {
  id: string;
  action: string;
  metadata: Record<string, unknown> | null;
  userId: string;
  createdAt: string;
};

type Report = {
  id: string;
  folio: string;
  title: string;
  status: string;
  priority: Priority | null;
  assigneeId: string | null;
  dueDate: string | null;
  resolutionComment: string | null;
  events: ReportEvent[];
};

type Responsable = {
  id: string;
  email: string;
};

type Props = {
  report: Report;
  onClose: () => void;
  onSaved: () => void;
};

export default function AsignarModal({ report, onClose, onSaved }: Props) {
  const [priority, setPriority] = useState<Priority>(report.priority ?? 'MEDIA');
  const [assigneeId, setAssigneeId] = useState(report.assigneeId ?? '');
  const [dueDate, setDueDate] = useState(
    report.dueDate ? report.dueDate.slice(0, 10) : '',
  );
  const [justification, setJustification] = useState('');
  const [resolutionComment, setResolutionComment] = useState('');

  const [responsables, setResponsables] = useState<Responsable[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/incidencias/responsables')
      .then((r) => (r.ok ? r.json() : []))
      .then(setResponsables)
      .catch(() => setResponsables([]));
  }, []);

  const handleAssign = async () => {
    setError(null);
    if (!assigneeId) {
      setError('Selecciona un responsable.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/incidencias/${report.id}/asignar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priority,
          assigneeId,
          dueDate: dueDate ? new Date(dueDate).toISOString() : '',
          ...(priority === 'CRITICA' && { priorityJustification: justification }),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? 'Error al asignar');
      }
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResolve = async () => {
    setError(null);
    if (resolutionComment.trim().length < 10) {
      setError('El comentario de resolución debe tener al menos 10 caracteres.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/incidencias/${report.id}/resolver`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolutionComment }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message ?? 'Error al resolver');
      }
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setSubmitting(false);
    }
  };

  const rejections = (report.events ?? []).filter((e) => e.action === 'RECHAZADO');
  const canResolve = report.status === 'En atención';
  const canAssign = report.status !== 'Cerrado';
  const isRejected = report.status === 'Rechazado';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
        {/* Header fijo */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between rounded-t-xl">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{report.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {report.folio} · Estado:{' '}
              <span
                className={`font-medium ${
                  report.status === 'Cerrado'
                    ? 'text-green-700'
                    : report.status === 'Rechazado'
                    ? 'text-red-700'
                    : report.status === 'Resuelto'
                    ? 'text-yellow-700'
                    : report.status === 'En atención'
                    ? 'text-blue-700'
                    : 'text-gray-900'
                }`}
              >
                {report.status}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 shrink-0 ml-4"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Aviso si está rechazado */}
          {isRejected && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
              <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-sm font-semibold text-red-800">
                  Este reporte fue rechazado por el residente
                </p>
                <p className="text-xs text-red-700 mt-1">
                  Reasígnalo para que vuelva a estado &quot;En atención&quot; y puedas resolverlo.
                </p>
              </div>
            </div>
          )}

          {/* Historial de rechazos */}
          {rejections.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Historial de rechazos ({rejections.length})
              </h3>
              <div className="space-y-2">
                {rejections.map((e) => {
                  const comment =
                    typeof e.metadata?.rejectionComment === 'string'
                      ? e.metadata.rejectionComment
                      : '';
                  return (
                    <div
                      key={e.id}
                      className="bg-red-50 border border-red-200 rounded-lg p-3"
                    >
                      <p className="text-xs font-semibold text-red-700">
                        {new Date(e.createdAt).toLocaleString('es-MX', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-sm text-red-900 mt-1">{comment}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Comentario actual (si existe y no está rechazado) */}
          {report.resolutionComment && !isRejected && (
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Comentario de resolución actual
              </h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-900">
                {report.resolutionComment}
              </div>
            </section>
          )}

          {/* Asignación */}
          {canAssign && (
            <section className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                {isRejected ? 'Reasignar reporte' : 'Asignación'}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Prioridad
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                  >
                    <option value="BAJA">Baja</option>
                    <option value="MEDIA">Media</option>
                    <option value="ALTA">Alta</option>
                    <option value="CRITICA">Crítica</option>
                  </select>
                </div>

                {priority === 'CRITICA' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Justificación (10-200 caracteres) *
                    </label>
                    <textarea
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Responsable
                  </label>
                  <select
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                  >
                    <option value="">Selecciona un responsable</option>
                    {responsables.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Fecha compromiso
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900"
                  />
                </div>

                <button
                  onClick={handleAssign}
                  disabled={submitting}
                  className="w-full px-4 py-2.5 bg-[#0a2f1f] text-white rounded-lg text-sm font-medium hover:bg-[#164a33] disabled:opacity-50"
                >
                  {submitting
                    ? 'Guardando...'
                    : isRejected
                    ? 'Reasignar y volver a atención'
                    : 'Guardar asignación'}
                </button>
              </div>
            </section>
          )}

          {/* Resolución (solo si está En atención) */}
          {canResolve && (
            <section className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Resolver reporte
              </h3>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Comentario de resolución (10-200 caracteres)
              </label>
              <textarea
                value={resolutionComment}
                onChange={(e) => setResolutionComment(e.target.value)}
                rows={3}
                placeholder="Describe cómo se resolvió el problema..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 mb-2"
              />
              <button
                onClick={handleResolve}
                disabled={submitting}
                className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? 'Guardando...' : 'Marcar como resuelto'}
              </button>
            </section>
          )}

          {report.status === 'Cerrado' && (
            <div className="bg-green-50 text-green-800 p-3 rounded-lg text-sm text-center">
              Este reporte está cerrado. No se puede modificar.
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}