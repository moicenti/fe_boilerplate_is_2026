import { apiFetch } from "@/lib/api";
import type { Area, AreaInput } from "@/lib/areas";

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
