import { getSession } from "@/lib/session";
import { apiFetch } from "@/lib/api";

export type Role = "RESIDENTE" | "ADMINISTRADOR" | "SEGURIDAD";

export type CurrentUser = {
  id: string;
  email: string;
  unit?: string | null;
  role?: Role;
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
