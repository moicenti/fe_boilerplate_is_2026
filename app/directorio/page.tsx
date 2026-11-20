'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  buscarDirectorioAction,
  obtenerPreferenciasDirectorioAction,
} from '@/app/actions/directorio';

interface VecinoDirectorio {
  id: string;
  esPropio: boolean;
  esPrivado: boolean;
  visibleGlobal: boolean;
  nombreCompleto: string;
  iniciales: string;
  unidad: string;
  unidadVisible: boolean;
  torre: string;
  correo: string | null;
  telefono: string | null;
  etiquetaContacto: string | null;
}

export default function DirectorioVecinosPage() {
  const [vecinos, setVecinos] = useState<VecinoDirectorio[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState<'TODOS' | 'CON_CONTACTO' | 'MI_PERFIL'>('TODOS');
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [perfilesVisibles, setPerfilesVisibles] = useState(0);
  const [conContactoCount, setConContactoCount] = useState(0);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Datos de sesión y resumen de privacidad del usuario actual
  const [miNombre, setMiNombre] = useState('Residente');
  const [miUnidad, setMiUnidad] = useState('A-304');
  const [miTorre, setMiTorre] = useState('Torre A');
  const [resumenMiPrivacidad, setResumenMiPrivacidad] = useState(
    'Configura qué información deseas compartir con tus vecinos.',
  );

  // Cargar resumen del usuario autenticado
  useEffect(() => {
    async function cargarMiPerfil() {
      const res = await obtenerPreferenciasDirectorioAction();
      if (res.success && res.data) {
        setMiNombre(res.data.nombreCompleto || 'Residente');
        setMiUnidad(res.data.unidad?.codigo || 'Sin unidad');
        setMiTorre(res.data.unidad?.torre || 'Torre A');

        if (!res.data.visibleGlobal) {
          setResumenMiPrivacidad(
            'Tu perfil está oculto en el directorio. Solo tú puedes activar tu visibilidad.',
          );
        } else {
          const compartidos: string[] = [];
          if (res.data.mostrarNombre) compartidos.push('tu nombre');
          if (res.data.mostrarUnidad) compartidos.push('tu unidad');
          if (res.data.mostrarCorreo) compartidos.push('tu correo');
          if (res.data.mostrarTelefono) compartidos.push('tu teléfono');

          const textoCompartidos =
            compartidos.length > 0
              ? `compartes ${compartidos.join(', ')}.`
              : 'no compartes datos de contacto.';
          const textoOcultos = !res.data.mostrarTelefono
            ? ' Tu teléfono no aparece en el directorio.'
            : '';

          setResumenMiPrivacidad(
            `${res.data.nombreCompleto.split(' ')[0]}, ${textoCompartidos}${textoOcultos}`,
          );
        }
      }
    }
    cargarMiPerfil();
  }, []);

  // Búsqueda reactiva con debounce de 250 ms (FE-22.1)
  useEffect(() => {
    let activo = true;
    const timer = setTimeout(async () => {
      setCargando(true);
      const res = await buscarDirectorioAction({
        q: busqueda,
        filtro: filtroActivo,
        pagina,
        tamano: 10,
      });

      if (!activo) return;

      if (!res.success) {
        setError(res.error || 'No se pudo consultar el directorio.');
        setVecinos([]);
      } else {
        setError(null);
        setVecinos(res.data.items || []);
        setTotal(res.data.total ?? 0);
        setTotalPaginas(res.data.totalPaginas ?? 1);
        setPerfilesVisibles(res.data.resumen?.perfilesVisibles ?? 0);
        setConContactoCount(res.data.resumen?.conContacto ?? 0);
      }
      setCargando(false);
    }, 250);

    return () => {
      activo = false;
      clearTimeout(timer);
    };
  }, [busqueda, filtroActivo, pagina]);

  const misIniciales =
    miNombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || 'RS';

  const inicioMostrado = total === 0 ? 0 : (pagina - 1) * 10 + 1;
  const finMostrado = Math.min(pagina * 10, total);

  return (
    <div className="flex min-h-screen bg-[#FAF8F4] text-[#1F2937]">
      {/* Sidebar estilo Habita */}
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
              {miTorre} · Unidad {miUnidad}
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

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col">
        {/* Barra superior */}
        <header className="h-16 bg-[#FAF8F4] border-b border-[#EAE5DC] flex items-center justify-between px-8">
          <div className="text-xs text-[#6B7280]">
            Mi comunidad <span className="mx-1.5">&gt;</span>{' '}
            <span className="font-medium text-[#111827]">Directorio</span>
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
                {misIniciales}
              </div>
              <div>
                <p className="text-xs font-semibold text-[#111827] leading-none">{miNombre}</p>
                <p className="text-[10px] text-[#6B7280] leading-none mt-1">
                  Residente · {miUnidad}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl w-full mx-auto space-y-6">
          {/* Encabezado */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#143728]">
                MI COMUNIDAD
              </p>
              <h1 className="text-3xl sm:text-[34px] font-serif text-[#111827] mt-1">
                Directorio de vecinos
              </h1>
              <p className="text-xs text-[#6B7280] mt-1">
                Conoce a quienes comparten tu comunidad, con la información que eligieron mostrar.
              </p>
            </div>

            <Link
              href="/perfil/privacidad"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E0D5] rounded-xl text-xs font-medium text-[#111827] hover:bg-[#F5F2EB] transition-colors shrink-0 self-start sm:self-auto"
            >
              <span>🛡️</span> Privacidad de mi perfil
            </Link>
          </div>

          {/* Banner informativo */}
          <div className="bg-[#EFECE4] border border-[#E4DFD3] rounded-2xl px-6 py-4 flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-full border border-[#143728]/30 flex items-center justify-center text-[#143728] text-xs shrink-0">
              👥
            </div>
            <div>
              <p className="text-xs font-semibold text-[#111827]">
                Un directorio construido entre vecinos
              </p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">
                Solo aparecen los perfiles que han elegido participar. Cada persona decide qué datos de contacto y unidad comparte.
              </p>
            </div>
          </div>

          {/* Tarjeta principal con filtros, buscador y tabla */}
          <section className="bg-white rounded-2xl border border-[#E5E0D5] overflow-hidden">
            <div className="p-6 space-y-4">
              {/* Título de tarjeta y contador */}
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-[#111827]">Vecinos de Los Olivos</h2>
                <span className="text-xs text-[#6B7280]">
                  {perfilesVisibles} {perfilesVisibles === 1 ? 'perfil visible' : 'perfiles visibles'}
                </span>
              </div>

              {/* Pestañas de filtro rápido */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFiltroActivo('TODOS');
                    setPagina(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                    filtroActivo === 'TODOS'
                      ? 'bg-[#143728] text-white'
                      : 'bg-[#EFECE4] text-[#374151] hover:bg-[#E5E0D5]'
                  }`}
                >
                  Todas las torres
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFiltroActivo('CON_CONTACTO');
                    setPagina(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                    filtroActivo === 'CON_CONTACTO'
                      ? 'bg-[#143728] text-white'
                      : 'bg-[#EFECE4] text-[#374151] hover:bg-[#E5E0D5]'
                  }`}
                >
                  Con contacto ({conContactoCount})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFiltroActivo('MI_PERFIL');
                    setPagina(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                    filtroActivo === 'MI_PERFIL'
                      ? 'bg-[#143728] text-white'
                      : 'bg-[#EFECE4] text-[#374151] hover:bg-[#E5E0D5]'
                  }`}
                >
                  Mi perfil (1)
                </button>
              </div>

              {/* Barra de búsqueda en tiempo real y orden */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="relative max-w-md w-full">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    🔍
                  </span>
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => {
                      setBusqueda(e.target.value);
                      setPagina(1);
                    }}
                    placeholder="Buscar por nombre, apellido o unidad (ej. A-304)"
                    className="w-full pl-9 pr-3 py-2 border border-[#E5E0D5] rounded-xl text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#143728]"
                  />
                </div>

                <span className="text-[11px] text-[#6B7280]">Orden: nombre A–Z ↓</span>
              </div>
            </div>

            {/* Tabla de resultados */}
            {error ? (
              <div className="px-6 pb-6">
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  {error}
                </div>
              </div>
            ) : cargando ? (
              <div className="py-12 text-center text-xs text-[#6B7280] border-t border-[#EFECE4]">
                Buscando vecinos en el directorio...
              </div>
            ) : vecinos.length === 0 ? (
              <div className="py-12 px-6 text-center border-t border-[#EFECE4] space-y-1">
                <p className="text-sm font-medium text-[#111827]">No se encontraron resultados</p>
                <p className="text-xs text-[#6B7280]">
                  No hay vecinos que coincidan con los filtros seleccionados.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F4EFE6] border-y border-[#E5E0D5] text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                      <th className="py-3 px-6">VECINO / NOMBRE ↓</th>
                      <th className="py-3 px-6">UNIDAD ↕</th>
                      <th className="py-3 px-6">INFORMACIÓN COMPARTIDA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFECE4] text-xs">
                    {vecinos.map((vecino) => (
                      <tr
                        key={vecino.id}
                        className={vecino.esPropio ? 'bg-[#EDF3EF]' : 'hover:bg-[#FAF8F4]'}
                      >
                        {/* Columna 1: Avatar + Nombre */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 ${
                                vecino.esPropio
                                  ? 'bg-[#D9E5DD] text-[#143728]'
                                  : 'bg-[#EFECE4] text-[#374151]'
                              }`}
                            >
                              {vecino.iniciales}
                            </div>
                            <div>
                              <p className="font-semibold text-[#111827]">{vecino.nombreCompleto}</p>
                              {vecino.esPropio && (
                                <p className="text-[11px] text-[#6B7280] mt-0.5">
                                  Tu perfil · {vecino.visibleGlobal ? 'Visible' : 'Oculto'}
                                </p>
                              )}
                              {vecino.esPrivado && !vecino.esPropio && (
                                <p className="text-[11px] text-[#6B7280] mt-0.5">
                                  Visibilidad desactivada
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Columna 2: Unidad */}
                        <td className="py-4 px-6">
                          {vecino.unidadVisible ? (
                            <span className="font-medium text-[#143728]">{vecino.unidad}</span>
                          ) : (
                            <span className="text-[#6B7280]">No compartida</span>
                          )}
                        </td>

                        {/* Columna 3: Información compartida / Contacto privado */}
                        <td className="py-4 px-6">
                          {vecino.esPrivado ? (
                            <span className="inline-block px-2.5 py-1 bg-[#EFECE4] text-[#4B5563] rounded-md text-[11px] font-medium">
                              Contacto privado
                            </span>
                          ) : !vecino.correo && !vecino.telefono ? (
                            <span className="text-[#6B7280]">
                              {vecino.etiquetaContacto || 'Sin datos de contacto compartidos'}
                            </span>
                          ) : (
                            <div className="space-y-1">
                              {vecino.correo && (
                                <a
                                  href={`mailto:${vecino.correo}`}
                                  className="flex items-center gap-2 text-[#143728] hover:underline"
                                >
                                  <span>✉️</span>
                                  <span>{vecino.correo}</span>
                                </a>
                              )}
                              {vecino.telefono ? (
                                <a
                                  href={`tel:${vecino.telefono}`}
                                  className="flex items-center gap-2 text-[#143728] hover:underline"
                                >
                                  <span>📞</span>
                                  <span>{vecino.telefono}</span>
                                </a>
                              ) : (
                                vecino.esPropio && (
                                  <p className="text-[11px] text-[#9CA3AF]">
                                    Teléfono no compartido
                                  </p>
                                )
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pie de tabla con conteo y paginación */}
            <div className="px-6 py-4 border-t border-[#EFECE4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#6B7280]">
              <span>
                {inicioMostrado}–{finMostrado} de {total} vecinos · Todas las torres
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagina <= 1}
                  onClick={() => setPagina((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded-lg hover:bg-[#EFECE4] disabled:opacity-40 cursor-pointer"
                >
                  Anterior
                </button>

                <span className="w-7 h-7 rounded-lg bg-[#EFECE4] text-[#111827] font-semibold flex items-center justify-center">
                  {pagina}
                </span>

                <button
                  type="button"
                  disabled={pagina >= totalPaginas}
                  onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                  className="px-2.5 py-1 rounded-lg hover:bg-[#EFECE4] disabled:opacity-40 cursor-pointer"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </section>

          {/* Tarjetas inferiores */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E5E0D5] p-6 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <h3 className="text-sm font-semibold text-[#111827]">Tu perfil, a tu manera</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">{resumenMiPrivacidad}</p>
              </div>
              <div>
                <Link
                  href="/perfil/privacidad"
                  className="inline-block text-xs font-medium text-[#111827] underline underline-offset-4 hover:text-[#143728]"
                >
                  Revisar privacidad de mi perfil →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#EFECE4] border border-[#E4DFD3] rounded-2xl p-6 space-y-1.5">
              <h3 className="text-xs font-semibold text-[#111827]">Contactos simulados</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Los correos y teléfonos mostrados son ejemplos ficticios para esta demostración. No corresponden a contactos reales.
              </p>
            </div>
          </div>

          <div className="text-[10px] text-[#9CA3AF]">Fechas y horas locales de Los Olivos.</div>

          <footer className="pt-4 pb-6 border-t border-[#EAE5DC] flex justify-between text-[10px] text-[#9CA3AF]">
            <span>Entorno de demostración · Datos simulados.</span>
            <span>Privacidad y términos</span>
          </footer>
        </div>
      </main>
    </div>
  );
}