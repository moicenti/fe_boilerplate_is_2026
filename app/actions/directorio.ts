'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.API_URL;

export interface PreferenciasPrivacidadPayload {
  visibleGlobal: boolean;
  mostrarTelefono: boolean;
  mostrarCorreo: boolean;
  mostrarNombre: boolean;
  mostrarUnidad: boolean;
}

export async function obtenerPreferenciasDirectorioAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  try {
    const response = await fetch(`${API_URL}/directorio/preferencias`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store',
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.message || 'No se pudo cargar tu configuración.' };
    }
    return { success: true, data };
  } catch {
    return { success: false, error: 'No se pudo conectar con el servidor.' };
  }
}

export async function actualizarPreferenciasDirectorioAction(
  payload: PreferenciasPrivacidadPayload,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  try {
    const response = await fetch(`${API_URL}/directorio/preferencias`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      return {
        success: false,
        error: Array.isArray(data.message) ? data.message.join('. ') : data.message,
      };
    }
    return { success: true, data };
  } catch {
    return { success: false, error: 'Error de conexión al guardar preferencias.' };
  }
}