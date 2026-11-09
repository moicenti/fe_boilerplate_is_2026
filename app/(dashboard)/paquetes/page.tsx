import type { Metadata } from "next";
import PendingPackages from "@/app/components/paquetes/PendingPackages";

export const metadata: Metadata = {
  title: "Paquetes pendientes",
};

export default async function PaquetesPage({
  searchParams,
}: {
  searchParams: Promise<{ entregado?: string | string[] }>;
}) {
  const { entregado } = await searchParams;

  return (
    <PendingPackages
      deliveredFolio={typeof entregado === "string" ? entregado : null}
    />
  );
}
