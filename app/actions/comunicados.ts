'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.API_URL;

export async function publicarComunicadoAction(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  try {
    const response = await fetch(`${API_URL}/anuncios`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: Array.isArray(data.message)
          ? data.message.join('. ')
          : (data.message || 'Error al publicar el comunicado'),
      };
    }

    return { success: true, data };
  } catch {
    return {
      success: false,
      error: 'No se pudo conectar con el servidor backend.',
    };
  }
}

export async function obtenerMuroComunicadosAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  try {
    const response = await fetch(`${API_URL}/anuncios/muro`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'No se pudieron cargar los comunicados.',
        data: [],
      };
    }

    return { success: true, data };
  } catch {
    return {
      success: false,
      error: 'Error de conexión con el servidor.',
      data: [],
    };
  }
}

export async function marcarComunicadoLeidoAction(comunicadoId: number) {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  try {
    const response = await fetch(`${API_URL}/anuncios/${comunicadoId}/leer`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'No se pudo registrar la lectura.',
      };
    }

    return { success: true, data };
  } catch {
    return {
      success: false,
      error: 'Error de conexión al confirmar lectura.',
    };
  }
}