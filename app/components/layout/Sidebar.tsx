// components/layout/Sidebar.tsx
import Link from 'next/link';
import { Home, MessageCircle, LogOut } from 'lucide-react';
import { getCurrentUser } from '@/lib/current-user';
import SecurityNav from '@/app/components/layout/SecurityNav';
import ResidentNav from '@/app/components/layout/ResidentNav';

export default async function Sidebar() {
  const user = await getCurrentUser();
  const unit = user?.unit ?? 'Sin unidad';
  const isSecurity = user?.role === 'SEGURIDAD';

  return (
    <aside className="w-64 bg-[#0a2f1f] text-white min-h-screen flex flex-col justify-between p-4">
      <div>
      
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

     
        <div className="border border-gray-600 rounded-lg p-3 mb-6">
          <h2 className="font-semibold text-sm">Los Olivos</h2>
          <p className="text-xs text-gray-300">{isSecurity ? 'Caseta principal' : `Unidad ${unit}`}</p>
          <span className="inline-block mt-2 bg-[#164a33] text-xs px-2 py-1 rounded">
            {isSecurity ? 'Personal de seguridad' : 'Residente'}
          </span>
        </div>


        {isSecurity ? <SecurityNav /> : <ResidentNav />}
      </div>

   
      <div className="space-y-4">
        <div className="border border-gray-600 rounded-lg p-3 text-sm">
          <div className="flex items-center gap-2 mb-1">
            <MessageCircle size={16} />
            <span className="font-semibold">Estamos para ayudarte</span>
          </div>
          <p className="text-xs text-gray-300 mb-2">
            {isSecurity ? '¿Una duda en caseta?' : '¿Una duda con tus reportes?'} Contacta a la administración.
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