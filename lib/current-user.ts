import { getSession } from "@/lib/session";
import { apiFetch } from "@/lib/api";

export type Role = "RESIDENTE" | "ADMINISTRADOR" | "MANTENIMIENTO" | "SEGURIDAD";

export type Unidad = {
  id: string;
  code: string;
  tower: string;
  description: string;
};

export type CurrentUser = {
  id: string;
  email: string;
  unit?: Unidad | null;
  role?: Role;
  isActive?: boolean;
  createdAt?: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = await getSession();
  if (!token) return null;
  try {
    return await apiFetch<CurrentUser>("/auth/me");
  } catch {
    return null;
  }
}
