// app/(dashboard)/incidencias/nuevo/page.tsx
import ReportForm from '@/app/components/incidencias/ReportForm';
import { getCurrentUser } from '@/lib/current-user';

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