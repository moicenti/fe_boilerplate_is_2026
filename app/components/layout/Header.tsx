import { Bell } from "lucide-react";
import { getSession } from "@/lib/session";
import { apiFetch } from "@/lib/api";

type Me = {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
};

async function getCurrentUser(): Promise<Me | null> {
  const token = await getSession();
  if (!token) return null;

  try {
    return await apiFetch<Me>("/auth/me");
  } catch {
    return null;
  }
}


function getInitials(email: string): string {
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}


function getDisplayName(email: string): string {
  const local = email.split("@")[0] ?? "";
  return local
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function Header() {
  const user = await getCurrentUser();
  const email = user?.email ?? "Invitado";
  const initials = user ? getInitials(user.email) : "??";
  const displayName = user ? getDisplayName(user.email) : "Invitado";

  return (
    <header className="h-16 border-b border-gray-200 bg-[#fbf8f1] flex items-center justify-between px-8">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Mi comunidad</span>
        <span className="text-gray-400">&gt;</span>
        <span className="font-medium text-gray-900">Incidencias</span>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-500 hover:text-gray-900">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
            2
          </span>
        </button>
        <div className="flex items-center gap-3 border-l border-gray-300 pl-6">
          <div className="w-8 h-8 bg-[#0a2f1f] text-white rounded-full flex items-center justify-center text-xs font-semibold">
            {initials}
          </div>
          <div className="text-sm">
            <p className="font-semibold text-gray-900 leading-none truncate max-w-[160px]">
              {displayName}
            </p>
            <p className="text-gray-500 text-xs">Residente</p>
          </div>
        </div>
      </div>
    </header>
  );
}