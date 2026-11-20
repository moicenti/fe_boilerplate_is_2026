
import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";
import {
  Bell,
  CalendarDays,
  ClipboardList,
  FileText,
  Grid2X2,
  Package,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";

export default async function MiComunidadPage() {
  const user = await getCurrentUser();

  const role = user?.role;
  const name = user?.email
    ? user.email
        .split("@")[0]
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "Usuario";

  const sections = [
    ...(role === "RESIDENTE"
      ? [
          {
            title: "Áreas comunes",
            description: "Consulta la disponibilidad de las áreas del condominio.",
            href: "/areas/disponibilidad",
            icon: Grid2X2,
          },
          {
            title: "Reservas",
            description: "Gestiona tus reservas de áreas comunes.",
            href: "/reservas/nueva",
            icon: CalendarDays,
          },
          {
            title: "Mis visitas",
            description: "Consulta y registra las visitas autorizadas.",
            href: "/visitas",
            icon: Users,
          },
          {
            title: "Paquetes",
            description: "Consulta el estado de tus paquetes recibidos.",
            href: "/paquetes",
            icon: Package,
          },
          {
            title: "Incidencias",
            description: "Consulta o registra problemas en el condominio.",
            href: "/incidencias",
            icon: FileText,
          },
        ]
      : []),

    ...(role === "ADMINISTRADOR"
      ? [
          {
            title: "Administración de incidencias",
            description: "Consulta y gestiona los reportes del condominio.",
            href: "/admin/incidencias",
            icon: ShieldCheck,
          },
          {
            title: "Asambleas",
            description: "Gestiona las convocatorias y asambleas.",
            href: "/admin/asambleas",
            icon: CalendarDays,
          },
          {
            title: "Áreas comunes",
            description: "Consulta la gestión de las áreas del condominio.",
            href: "/areas",
            icon: Grid2X2,
          },
          {
            title: "Cuotas y reglas",
            description: "Consulta las reglas y configuraciones de cuotas.",
            href: "/cuotas/reglas",
            icon: Wallet,
          },
        ]
      : []),

    ...(role === "MANTENIMIENTO"
      ? [
          {
            title: "Incidencias",
            description: "Consulta los reportes pendientes y su seguimiento.",
            href: "/incidencias",
            icon: ClipboardList,
          },
          {
            title: "Áreas comunes",
            description: "Consulta la información de las áreas del condominio.",
            href: "/areas",
            icon: Grid2X2,
          },
        ]
      : []),

    ...(role === "SEGURIDAD"
      ? [
          {
            title: "Panel de seguridad",
            description: "Consulta la información y los movimientos de acceso.",
            href: "/seguridad/panel",
            icon: ShieldCheck,
          },
          {
            title: "Registro de visitas",
            description: "Registra entradas y salidas de visitantes.",
            href: "/seguridad/visitas",
            icon: Users,
          },
          {
            title: "Paquetes",
            description: "Registra llegadas y consulta paquetes pendientes.",
            href: "/paquetes/nuevo",
            icon: Package,
          },
        ]
      : []),

    {
      title: "Notificaciones",
      description: "Consulta los avisos y novedades del condominio.",
      href: "/notificaciones",
      icon: Bell,
    },
  ];

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium text-[#164a33] mb-2">
          Los Olivos
        </p>

        <h1 className="text-3xl font-semibold text-gray-900">
          Bienvenido, {name}
        </h1>

        <p className="text-gray-500 mt-2">
          Consulta la información de tu comunidad y accede rápidamente a sus
          funcionalidades.
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Accesos directos
            </h2>
            <p className="text-sm text-gray-500">
              Secciones disponibles para tu cuenta.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {sections.map(({ title, description, href, icon: Icon }) => (
            <Link
              key={title}
              href={href}
              className="group rounded-xl border border-gray-200 bg-white p-5 transition hover:border-[#164a33] hover:shadow-md"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-[#e8f0eb] text-[#164a33] mb-4">
                <Icon size={22} />
              </div>

              <h3 className="font-semibold text-gray-900 group-hover:text-[#164a33]">
                {title}
              </h3>

              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                {description}
              </p>

              <span className="inline-block text-sm font-medium text-[#164a33] mt-4">
                Ir a la sección →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
