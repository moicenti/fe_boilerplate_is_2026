// app/(dashboard)/incidencias/page.tsx
import ReportesList from '@/app/components/incidencias/ReportesList';
import { getSession } from '@/lib/session';
import { apiFetch } from '@/lib/api';

type Me = { id: string; email: string; unit?: string | null };

async function getCurrentUser(): Promise<Me | null> {
  const token = await getSession();
  if (!token) return null;
  try {
    return await apiFetch<Me>('/auth/me');
  } catch {
    return null;
  }
}

function getDisplayName(email: string | undefined): string {
  if (!email) return 'Usuario';
  const local = email.split('@')[0] ?? '';
  return local
    .replace(/[._-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function MisReportesPage() {
  const user = await getCurrentUser();
  const displayName = getDisplayName(user?.email);

  return <ReportesList displayName={displayName} />;
}