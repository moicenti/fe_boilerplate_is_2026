// app/(dashboard)/incidencias/nuevo/page.tsx
import ReportForm from '@/app/components/incidencias/ReportForm';
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

export default async function NuevoReportePage() {
  const user = await getCurrentUser();

  return (
    <div className="py-8 px-4">
      <ReportForm
        userUnit={user?.unit ?? null}
        userEmail={user?.email ?? ''}
      />
    </div>
  );
}