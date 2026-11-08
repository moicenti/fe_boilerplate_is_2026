import { apiFetch } from "@/lib/api";
import type { Area, AreaInput } from "@/lib/areas";
import type { Bloqueo, BloqueoInput } from "@/lib/bloqueos";

export function listAreas() {
  return apiFetch<Area[]>("areas");
}

export function createArea(input: AreaInput) {
  return apiFetch<Area>("areas", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateArea(id: number, input: AreaInput) {
  return apiFetch<Area>(`areas/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteArea(id: number) {
  return apiFetch<void>(`areas/${id}`, { method: "DELETE" });
}

// Bloqueos de un área.

export function listBloqueos(areaId: number) {
  return apiFetch<Bloqueo[]>(`areas/${areaId}/bloqueos`);
}

export function createBloqueo(areaId: number, input: BloqueoInput) {
  return apiFetch<Bloqueo>(`areas/${areaId}/bloqueos`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function deleteBloqueo(areaId: number, bloqueoId: number) {
  return apiFetch<void>(`areas/${areaId}/bloqueos/${bloqueoId}`, { method: "DELETE" });
}
