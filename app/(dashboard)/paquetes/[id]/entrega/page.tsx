import type { Metadata } from "next";
import DeliverPackage from "@/app/components/paquetes/DeliverPackage";
import { getCurrentUser } from "@/lib/current-user";
import { displayName } from "@/lib/paquetes";

export const metadata: Metadata = {
  title: "Entrega de paquete",
};

export default async function EntregaPaquetePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();

  return (
    <DeliverPackage
      packageId={id}
      guardName={user ? displayName(user.email) : "Personal de seguridad"}
    />
  );
}
