import { Sidebar } from "@/components/sidebar";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        {children}
        <footer className="mt-auto flex flex-wrap justify-between gap-2 border-t border-border px-4 py-5 text-[11px] text-muted sm:px-10">
          <span>Habita · Gestión de condominios</span>
          <span>Privacidad y términos</span>
        </footer>
      </div>
    </div>
  );
}
