import Link from 'next/link';
import {
  Home, Wallet, Grid, CalendarPlus, Calendar, FileText, MessageCircle, LogOut, ShieldCheck,
} from 'lucide-react';
import { getSession } from '@/lib/session';
import { apiFetch } from '@/lib/api';

type Me = {
  id: string;
  email: string;
  role: 'RESIDENTE' | 'ADMINISTRADOR' | 'MANTENIMIENTO' | 'SEGURIDAD';
  unit?: { id: string; code: string; tower: string; description: string } | null;
};

async function getCurrentUser(): Promise<Me | null> {
  const token = await getSession();
  if (!token) return null;
  try {
    return await apiFetch<Me>('/auth/me');
  } catch {
    return null;
  }
}

export default async function Sidebar() {
  const user = await getCurrentUser();
  const isAdmin = user?.role === 'ADMINISTRADOR';

  return (
    <aside className="w-64 bg-[#0a2f1f] text-white min-h-screen flex flex-col justify-between p-4">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 border border-white rounded flex items-center justify-center">
            <Home size={18} />
          </div>
          <div>
            <h1 className="text-xl font-semibold leading-none">habita</h1>
            <span className="text-[10px] text-gray-300 uppercase tracking-widest">
              Gestión de condominios
            </span>
          </div>
        </div>

        {/* Info Usuario */}
        <div className="border border-gray-600 rounded-lg p-3 mb-6">
          <h2 className="font-semibold text-sm">Los Olivos</h2>
          {user?.unit ? (
            <>
              <p className="text-xs text-gray-300 mt-1">
                {user.unit.tower} · {user.unit.code}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">{user.unit.description}</p>
            </>
          ) : (
            <p className="text-xs text-gray-300 mt-1">{user?.role ?? 'Sin unidad asignada'}</p>
          )}
          <span className="inline-block mt-2 bg-[#164a33] text-xs px-2 py-1 rounded">
            {user?.role ?? 'Invitado'}
          </span>
        </div>

        {/* Navegación */}
        <nav className="space-y-6">
          <div>
            <p className="text-xs text-gray-400 font-semibold mb-2 px-2 uppercase tracking-wider">
              Mi Cuenta
            </p>
            <Link href="#" className="flex items-center gap-3 px-2 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#164a33] rounded-md transition">
              <FileText size={18} /> Estado de cuenta
            </Link>
            <Link href="#" className="flex items-center gap-3 px-2 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#164a33] rounded-md transition">
              <Wallet size={18} /> Realizar pago
            </Link>
          </div>

          <div>
            <p className="text-xs text-gray-400 font-semibold mb-2 px-2 uppercase tracking-wider">
              Mi Comunidad
            </p>
            <Link href="#" className="flex items-center gap-3 px-2 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#164a33] rounded-md transition">
              <Grid size={18} /> Áreas comunes
            </Link>
            <Link href="#" className="flex items-center gap-3 px-2 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#164a33] rounded-md transition">
              <CalendarPlus size={18} /> Nueva reserva
            </Link>
            <Link href="#" className="flex items-center gap-3 px-2 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#164a33] rounded-md transition">
              <Calendar size={18} /> Mis reservas
            </Link>
            <Link href="/incidencias" className="flex items-center gap-3 px-2 py-2 text-sm bg-[#164a33] text-white rounded-md mt-1">
              <FileText size={18} /> Incidencias
            </Link>
          </div>

          {isAdmin && (
            <div>
              <p className="text-xs text-gray-400 font-semibold mb-2 px-2 uppercase tracking-wider">
                Administración
              </p>
              <Link
                href="/admin/incidencias"
                className="flex items-center gap-3 px-2 py-2 text-sm text-gray-300 hover:text-white hover:bg-[#164a33] rounded-md transition"
              >
                <ShieldCheck size={18} /> Panel de incidencias
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Footer */}
      <div className="space-y-4">
        <div className="border border-gray-600 rounded-lg p-3 text-sm">
          <div className="flex items-center gap-2 mb-1">
            <MessageCircle size={16} />
            <span className="font-semibold">Estamos para ayudarte</span>
          </div>
          <p className="text-xs text-gray-300 mb-2">
            ¿Una duda con tus reportes? Contacta a la administración.
          </p>
          <Link href="#" className="text-xs text-white underline">
            Contactar administración
          </Link>
        </div>
        <button className="flex items-center gap-3 px-2 py-2 text-sm text-gray-300 hover:text-white w-full transition">
          <LogOut size={18} /> Cerrar sesión
        </button>
      </div>
    </aside>
  );
}