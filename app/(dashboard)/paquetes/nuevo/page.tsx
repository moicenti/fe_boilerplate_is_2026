import type { Metadata } from "next";
import RegisterPackageForm from "@/app/components/paquetes/RegisterPackageForm";
import { getCurrentUser } from "@/lib/current-user";
import { displayName } from "@/lib/paquetes";

export const metadata: Metadata = {
  title: "Registrar llegada de paquete",
};

export default async function NuevoPaquetePage() {
  const user = await getCurrentUser();

  return (
    <RegisterPackageForm
      guardName={user ? displayName(user.email) : "Personal de seguridad"}
    />
  );
}
