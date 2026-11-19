'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  obtenerPreferenciasDirectorioAction,
  actualizarPreferenciasDirectorioAction,
  PreferenciasPrivacidadPayload,
} from '@/app/actions/directorio';

function ToggleSwitch({
  checked,
  disabled = false,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (val: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
      } ${checked ? 'bg-[#143728]' : 'bg-[#D1CEC4]'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function PrivacidadDirectorioPage() {
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [feedback, setFeedback] = useState<{ tipo: 'ok' | 'err'; texto: string } | null>(null);

  // Datos de sesión (solo lectura)
  const [nombreCompleto, setNombreCompleto] = useState('Residente');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState<string | null>(null);
  const [unidadCodigo, setUnidadCodigo] = useState('A-304');
  const [unidadTorre, setUnidadTorre] = useState('Torre A');

  // Estado guardado en servidor (para botón "Cancelar cambios")
  const [estadoInicial, setEstadoInicial] = useState<PreferenciasPrivacidadPayload>({
    visibleGlobal: false,
    mostrarNombre: false,
    mostrarUnidad: false,
    mostrarCorreo: false,
    mostrarTelefono: false,
  });

  // Estado editable de los interruptores
  const [opciones, setOpciones] = useState<PreferenciasPrivacidadPayload>(estadoInicial);

  useEffect(() => {
    async function cargar() {
      const res = await obtenerPreferenciasDirectorioAction();
      if (res.success && res.data) {
        setNombreCompleto(res.data.nombreCompleto || 'Residente');
        setCorreo(res.data.correo || '');
        setTelefono(res.data.telefono || null);
        setUnidadCodigo(res.data.unidad?.codigo || 'Sin unidad');
        setUnidadTorre(res.data.unidad?.torre || 'Torre A');

        const cargado: PreferenciasPrivacidadPayload = {
          visibleGlobal: res.data.visibleGlobal,
          mostrarNombre: res.data.mostrarNombre,
          mostrarUnidad: res.data.mostrarUnidad,
          mostrarCorreo: res.data.mostrarCorreo,
          mostrarTelefono: res.data.mostrarTelefono,
        };
        setEstadoInicial(cargado);
        setOpciones(cargado);
      } else {
        setFeedback({ tipo: 'err', texto: res.error || 'No se pudo cargar tu privacidad.' });
      }
      setCargando(false);
    }
    cargar();
  }, []);

  const hayCambios =
    opciones.visibleGlobal !== estadoInicial.visibleGlobal ||
    opciones.mostrarNombre !== estadoInicial.mostrarNombre ||
    opciones.mostrarUnidad !== estadoInicial.mostrarUnidad ||
    opciones.mostrarCorreo !== estadoInicial.mostrarCorreo ||
    opciones.mostrarTelefono !== estadoInicial.mostrarTelefono;

  const datosCompartidosCount = [
    opciones.mostrarNombre,
    opciones.mostrarUnidad,
    opciones.mostrarCorreo,
    opciones.mostrarTelefono,
  ].filter(Boolean).length;

  const iniciales =
    nombreCompleto
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || 'RS';

  const handleCancelar = () => {
    setOpciones(estadoInicial);
    setFeedback(null);
  };

  const handleGuardar = async () => {
    setGuardando(true);
    setFeedback(null);

    const res = await actualizarPreferenciasDirectorioAction(opciones);
    if (res.success) {
      setEstadoInicial(opciones);
      setFeedback({
        tipo: 'ok',
        texto: 'Privacidad guardada. Los cambios ya se reflejan en el directorio de vecinos.',
      });
    } else {
      setFeedback({
        tipo: 'err',
        texto: res.error || 'No se pudieron guardar los cambios de privacidad.',
      });
    }
    setGuardando(false);
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F4] text-[#1F2937]">
      {/* Barra lateral izquierda estilo Habita */}
      <aside className="w-64 bg-[#143728] text-[#E5E7EB] flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl border border-[#2C5E47] flex items-center justify-center text-white text-lg">
              ⌂
            </div>
            <div>
              <h2 className="font-serif text-white tracking-wide text-lg leading-none">habita</h2>
              <p className="text-[9px] tracking-widest text-[#9CA3AF] mt-1">
                GESTIÓN DE CONDOMINIOS
              </p>
            </div>
          </div>

          <div className="mx-4 my-2 p-4 bg-[#1B4634] border border-[#285C46] rounded-xl">
            <p className="text-xs font-semibold text-white">Los Olivos</p>
            <p className="text-[11px] text-[#D1D5DB] mt-0.5">
              {unidadTorre} · Unidad {unidadCodigo}
            </p>
            <span className="inline-block mt-2.5 px-2.5 py-0.5 bg-[#2A624B] text-[10px] text-white rounded-md font-medium">
              Residente
            </span>
          </div>

          <nav className="px-4 mt-4 space-y-5 text-xs">
            <div>
              <p className="px-3 mb-2 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold">
                Mi cuenta
              </p>
              <div className="space-y-1">
                <Link
                  href="/estado-de-cuenta"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#D1D5DB] hover:bg-[#1B4634]"
                >
                  <span>💳</span> Estado de cuenta
                </Link>
                <Link
                  href="/pagos"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#D1D5DB] hover:bg-[#1B4634]"
                >
                  <span>🧾</span> Realizar pago
                </Link>
              </div>
            </div>

            <div>
              <p className="px-3 mb-2 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold">
                Mi comunidad
              </p>
              <div className="space-y-1">
                <Link
                  href="/areas"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#D1D5DB] hover:bg-[#1B4634]"
                >
                  <span>▦</span> Áreas comunes
                </Link>
                <Link
                  href="/incidencias"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#D1D5DB] hover:bg-[#1B4634]"
                >
                  <span>📋</span> Incidencias
                </Link>
                <Link
                  href="/visitas"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#D1D5DB] hover:bg-[#1B4634]"
                >
                  <span>🪪</span> Visitas
                </Link>
                <Link
                  href="/mis-paquetes"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#D1D5DB] hover:bg-[#1B4634]"
                >
                  <span>📦</span> Paquetes
                </Link>
                <Link
                  href="/mis-asambleas"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#D1D5DB] hover:bg-[#1B4634]"
                >
                  <span>🗳️</span> Asambleas
                </Link>
                <Link
                  href="/cartelera"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#D1D5DB] hover:bg-[#1B4634]"
                >
                  <span>📰</span> Cartelera
                </Link>
                <Link
                  href="/directorio"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#2A624B] text-white font-medium"
                >
                  <span>📖</span> Directorio
                </Link>
                <Link
                  href="/notificaciones"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#D1D5DB] hover:bg-[#1B4634]"
                >
                  <span>🔔</span> Notificaciones
                </Link>
              </div>
            </div>
          </nav>
        </div>

        <div className="p-4 space-y-4">
          <div className="p-3.5 bg-[#1B4634] border border-[#285C46] rounded-xl text-[11px] space-y-1.5">
            <p className="font-semibold text-white">Estamos para ayudarte</p>
            <p className="text-[#D1D5DB] leading-relaxed">
              ¿Una duda con tu comunidad? Contacta a la administración.
            </p>
            <Link href="/incidencias" className="inline-block underline text-white pt-1">
              Contactar administración
            </Link>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 px-2 text-xs text-[#D1D5DB] hover:text-white"
          >
            <span>⎋</span> Cerrar sesión
          </button>
          <p className="px-2 text-[10px] text-[#9CA3AF]">© 2026 Habita</p>
        </div>
      </aside>

      {/* Área principal */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-[#FAF8F4] border-b border-[#EAE5DC] flex items-center justify-between px-8">
          <div className="text-xs text-[#6B7280]">
            Mi comunidad <span className="mx-1.5">&gt;</span>
            <Link href="/directorio" className="hover:text-[#111827]">
              Directorio
            </Link>
            <span className="mx-1.5">&gt;</span>
            <span className="font-medium text-[#111827]">Privacidad</span>
          </div>

          <div className="flex items-center gap-5">
            <Link href="/notificaciones" className="relative text-gray-600 hover:text-gray-900">
              <span className="text-base">🔔</span>
              <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 bg-[#E5DEC9] text-[#143728] text-[10px] font-bold rounded-full">
                2
              </span>
            </Link>

            <div className="h-6 w-px bg-[#E5E0D5]" />

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#EFECE4] text-[#143728] flex items-center justify-center font-semibold text-xs">
                {iniciales}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#111827] leading-none">{nombreCompleto}</p>
                <p className="text-[10px] text-[#6B7280] leading-none mt-1">
                  Residente · {unidadCodigo}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl w-full mx-auto space-y-6">
          {/* Encabezado de página */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#143728]">
                DIRECTORIO · PRIVACIDAD
              </p>
              <h1 className="text-3xl sm:text-[34px] font-serif text-[#111827] mt-1">
                Tú decides qué compartir
              </h1>
              <p className="text-xs text-[#6B7280] mt-1">
                Elige si quieres aparecer en el directorio y qué información verán tus vecinos.
              </p>
            </div>

            <Link
              href="/directorio"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E0D5] rounded-xl text-xs font-medium text-[#111827] hover:bg-[#F5F2EB] transition-colors shrink-0 self-start sm:self-auto"
            >
              <span>←</span> Ver directorio
            </Link>
          </div>

          {/* Banner de sesión no editable */}
          <div className="bg-[#EFECE4] border border-[#E4DFD3] rounded-2xl px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-full border border-[#143728]/30 flex items-center justify-center text-[#143728] text-xs">
                🛡️
              </div>
              <div>
                <p className="text-xs font-semibold text-[#111827]">
                  {nombreCompleto} · Los Olivos
                </p>
                <p className="text-[11px] text-[#6B7280] mt-0.5">
                  Residente · Unidad {unidadCodigo} · Datos de tu sesión, no editables aquí.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-[#111827] shrink-0">Tu perfil</span>
          </div>

          {feedback && (
            <div
              className={`p-4 rounded-xl text-xs border ${
                feedback.tipo === 'ok'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              {feedback.texto}
            </div>
          )}

          {cargando ? (
            <div className="bg-white p-10 rounded-2xl border border-[#E5E0D5] text-center text-xs text-[#6B7280]">
              Cargando configuración de privacidad...
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Columna izquierda (Controles de privacidad) */}
              <div className="lg:col-span-8 space-y-5">
                {/* Tarjeta 1: Participación voluntaria */}
                <section className="bg-white rounded-2xl border border-[#E5E0D5] p-6 space-y-4">
                  <h2 className="text-base font-semibold text-[#111827]">
                    Participación voluntaria
                  </h2>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold text-[#111827]">
                        Aparecer en el directorio de vecinos
                      </p>
                      <p className="text-xs text-[#6B7280] mt-1">
                        Tu perfil aparecerá con los datos que actives a continuación. Puedes cambiar esta elección.
                      </p>
                    </div>
                    <ToggleSwitch
                      label="Aparecer en el directorio de vecinos"
                      disabled={guardando}
                      checked={opciones.visibleGlobal}
                      onChange={(val) =>
                        setOpciones((prev) => ({ ...prev, visibleGlobal: val }))
                      }
                    />
                  </div>

                  <div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[11px] font-medium ${
                        opciones.visibleGlobal
                          ? 'bg-[#143728] text-white'
                          : 'bg-[#EFECE4] text-[#4B5563]'
                      }`}
                    >
                      {opciones.visibleGlobal ? 'Perfil visible' : 'Perfil oculto'}
                    </span>
                  </div>
                </section>

                {/* Tarjeta 2: Información que compartes */}
                <section
                  className={`bg-white rounded-2xl border border-[#E5E0D5] p-6 transition-opacity ${
                    opciones.visibleGlobal ? 'opacity-100' : 'opacity-60'
                  }`}
                >
                  <div className="pb-4 border-b border-[#EFECE4]">
                    <h2 className="text-base font-semibold text-[#111827]">
                      Información que compartes
                    </h2>
                    <p className="text-xs text-[#6B7280] mt-1">
                      Cada opción controla únicamente lo que se muestra a otros vecinos en el directorio.
                    </p>
                  </div>

                  <div className="divide-y divide-[#EFECE4]">
                    {/* Fila 1: Nombre completo */}
                    <div className="py-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-[#111827]">Nombre completo</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">{nombreCompleto}</p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <ToggleSwitch
                          label="Mostrar nombre completo"
                          disabled={!opciones.visibleGlobal || guardando}
                          checked={opciones.mostrarNombre}
                          onChange={(val) =>
                            setOpciones((prev) => ({ ...prev, mostrarNombre: val }))
                          }
                        />
                        <span className="text-[11px] text-[#6B7280] w-11">
                          {opciones.mostrarNombre ? 'Visible' : 'Oculto'}
                        </span>
                      </div>
                    </div>

                    {/* Fila 2: Unidad en el directorio */}
                    <div className="py-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-[#111827]">
                          Unidad en el directorio
                        </p>
                        <p className="text-xs text-[#6B7280] mt-0.5">
                          Mostrar {unidadCodigo} junto a mi nombre. No modifica tu unidad.
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <ToggleSwitch
                          label="Mostrar unidad en el directorio"
                          disabled={!opciones.visibleGlobal || guardando}
                          checked={opciones.mostrarUnidad}
                          onChange={(val) =>
                            setOpciones((prev) => ({ ...prev, mostrarUnidad: val }))
                          }
                        />
                        <span className="text-[11px] text-[#6B7280] w-11">
                          {opciones.mostrarUnidad ? 'Visible' : 'Oculto'}
                        </span>
                      </div>
                    </div>

                    {/* Fila 3: Correo de contacto */}
                    <div className="py-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-[#111827]">Correo de contacto</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">{correo}</p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <ToggleSwitch
                          label="Mostrar correo de contacto"
                          disabled={!opciones.visibleGlobal || guardando}
                          checked={opciones.mostrarCorreo}
                          onChange={(val) =>
                            setOpciones((prev) => ({ ...prev, mostrarCorreo: val }))
                          }
                        />
                        <span className="text-[11px] text-[#6B7280] w-11">
                          {opciones.mostrarCorreo ? 'Visible' : 'Oculto'}
                        </span>
                      </div>
                    </div>

                    {/* Fila 4: Teléfono de contacto */}
                    <div className="pt-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold text-[#111827]">Teléfono de contacto</p>
                        <p className="text-xs text-[#6B7280] mt-0.5">
                          {opciones.mostrarTelefono && telefono
                            ? telefono
                            : 'No se mostrará en tu perfil público.'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <ToggleSwitch
                          label="Mostrar teléfono de contacto"
                          disabled={!opciones.visibleGlobal || guardando}
                          checked={opciones.mostrarTelefono}
                          onChange={(val) =>
                            setOpciones((prev) => ({ ...prev, mostrarTelefono: val }))
                          }
                        />
                        <span className="text-[11px] text-[#6B7280] w-11">
                          {opciones.mostrarTelefono ? 'Visible' : 'Oculto'}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Botones de acción */}
                <div className="flex items-center justify-end gap-3 pt-1">
                  <button
                    type="button"
                    disabled={!hayCambios || guardando}
                    onClick={handleCancelar}
                    className="px-4 py-2.5 bg-white border border-[#E5E0D5] rounded-xl text-xs font-medium text-[#111827] hover:bg-[#F5F2EB] disabled:opacity-50 cursor-pointer"
                  >
                    Cancelar cambios
                  </button>

                  <button
                    type="button"
                    disabled={guardando}
                    onClick={handleGuardar}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#143728] text-white rounded-xl text-xs font-medium hover:bg-[#0F2A1E] disabled:bg-gray-300 cursor-pointer"
                  >
                    <span>✓</span>
                    <span>{guardando ? 'Guardando...' : 'Guardar privacidad'}</span>
                  </button>
                </div>

                <div className="space-y-1 text-[11px] text-[#6B7280]">
                  <p>La vista previa refleja las opciones mostradas. Guarda para conservar tu elección.</p>
                  <p className="text-[10px] text-[#9CA3AF]">Fechas y horas locales de Los Olivos.</p>
                </div>
              </div>

              {/* Columna derecha (Vista previa y tarjetas informativas) */}
              <div className="lg:col-span-4 space-y-4">
                <aside className="bg-white rounded-2xl border border-[#E5E0D5] p-6 space-y-4">
                  <div>
                    <h2 className="text-base font-semibold text-[#111827]">
                      Así te ven tus vecinos
                    </h2>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] mt-2">
                      VISTA PREVIA DEL DIRECTORIO
                    </p>
                  </div>

                  {!opciones.visibleGlobal ? (
                    <div className="p-4 rounded-xl bg-[#FAF8F4] border border-[#EFECE4] text-xs text-[#6B7280]">
                      Tu ficha aparecerá únicamente como <strong>Unidad {unidadCodigo} · Contacto privado</strong>.
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-full bg-[#EFECE4] text-[#143728] flex items-center justify-center font-semibold text-sm shrink-0">
                          {opciones.mostrarNombre ? iniciales : '••'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#111827]">
                            {opciones.mostrarNombre ? nombreCompleto : 'Residente (Nombre oculto)'}
                          </p>
                          <p className="text-xs text-[#6B7280] mt-0.5">
                            {opciones.mostrarUnidad ? `Unidad ${unidadCodigo}` : 'Unidad oculta'}
                          </p>
                        </div>
                      </div>

                      <hr className="border-[#EFECE4]" />

                      <div className="space-y-2 text-xs">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                          CORREO COMPARTIDO
                        </p>
                        {opciones.mostrarCorreo ? (
                          <p className="text-[#143728] font-medium break-all">{correo}</p>
                        ) : (
                          <p className="text-[#6B7280] flex items-center gap-1.5">
                            <span>🚫</span> Correo no compartido
                          </p>
                        )}

                        {opciones.mostrarTelefono && telefono ? (
                          <p className="text-[#111827] pt-1">📞 {telefono}</p>
                        ) : (
                          <p className="text-[#6B7280] flex items-center gap-1.5 pt-1">
                            <span>🚫</span> Teléfono no compartido
                          </p>
                        )}
                      </div>

                      <div className="pt-1">
                        <span className="inline-block px-3 py-1 bg-[#EFECE4] text-[#374151] text-[11px] font-medium rounded-full">
                          Perfil visible · {datosCompartidosCount}{' '}
                          {datosCompartidosCount === 1 ? 'dato compartido' : 'datos compartidos'}
                        </span>
                      </div>
                    </>
                  )}
                </aside>

                <div className="bg-[#EFECE4] border border-[#E4DFD3] rounded-2xl p-5 flex items-start gap-3">
                  <span className="text-sm text-[#4B5563] mt-0.5">🔒</span>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-[#111827]">
                      Compartir es tu elección
                    </p>
                    <p className="text-xs text-[#4B5563] leading-relaxed">
                      Si dejas de aparecer en el directorio, tu ficha no será visible para otros vecinos. Tu cuenta y tu unidad no se modifican desde esta sección.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-[#E5E0D5] rounded-2xl p-5 space-y-2.5">
                  <p className="text-xs font-semibold text-[#111827]">¿Buscas tus avisos?</p>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    La privacidad del directorio y las preferencias de notificación son ajustes diferentes.
                  </p>
                  <Link
                    href="/notificaciones"
                    className="inline-block text-xs font-medium text-[#111827] underline underline-offset-4 hover:text-[#143728]"
                  >
                    Ir a preferencias de avisos →
                  </Link>
                </div>
              </div>
            </div>
          )}

          <footer className="pt-4 pb-6 border-t border-[#EAE5DC] flex justify-between text-[10px] text-[#9CA3AF]">
            <span>Entorno de demostración · Datos simulados.</span>
            <span>Privacidad y términos</span>
          </footer>
        </div>
      </main>
    </div>
  );
}