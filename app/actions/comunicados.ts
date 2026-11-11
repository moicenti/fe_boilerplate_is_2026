'use server';

import { apiFetch, ApiError } from '@/lib/api';
import { expireSession } from '@/lib/session';

export async function publicarComunicadoAction(formData: FormData) {
  try {
    const data = await apiFetch('/anuncios', {
      method: 'POST',
      body: formData,
    });
    return { success: true as const, data };
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 401) await expireSession();
      return {
        success: false as const,
        error: error.message || 'Error al publicar el comunicado',
      };
    }
    console.error('Error al publicar el comunicado:', error);
    return {
      success: false as const,
      error: 'No se pudo conectar con el servidor backend.',
    };
  }
}
