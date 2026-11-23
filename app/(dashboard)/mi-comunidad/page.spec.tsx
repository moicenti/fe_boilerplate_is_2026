import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MiComunidadPage from './page.js';

// Mock de getCurrentUser
vi.mock('@/lib/current-user', () => ({
  getCurrentUser: vi.fn(),
}));

import { getCurrentUser } from '@/lib/current-user';

describe('MiComunidadPage - H13 (render por rol)', () => {
  it('H13-AC2: admin ve accesos de administración', async () => {
    (getCurrentUser as any).mockResolvedValue({
      id: 'admin-uuid',
      email: 'admin@example.com',
      role: 'ADMINISTRADOR',
      unit: null,
    });

    render(await MiComunidadPage());

    expect(screen.getByText('Usuarios')).toBeInTheDocument();
    expect(screen.getByText('Administración de incidencias')).toBeInTheDocument();
    expect(screen.getByText('Cuotas y reglas')).toBeInTheDocument();
    expect(screen.queryByText('Cartelera de comunicados')).not.toBeInTheDocument();
  });

  it('H13-AC4: seguridad ve accesos de seguridad', async () => {
    (getCurrentUser as any).mockResolvedValue({
      id: 'seg-uuid',
      email: 'seguridad@example.com',
      role: 'SEGURIDAD',
      unit: null,
    });

    render(await MiComunidadPage());

    expect(screen.getByText('Panel de seguridad')).toBeInTheDocument();
    expect(screen.getByText('Registro de visitas')).toBeInTheDocument();
    expect(screen.queryByText('Usuarios')).not.toBeInTheDocument();
  });

  it('H13-AC5: residente ve accesos de residente', async () => {
    (getCurrentUser as any).mockResolvedValue({
      id: 'res-uuid',
      email: 'demo@example.com',
      role: 'RESIDENTE',
      unit: { id: 'u1', code: 'A-19', tower: 'Torre A', description: '' },
    });

    render(await MiComunidadPage());

    expect(screen.getByText('Cartelera de comunicados')).toBeInTheDocument();
    expect(screen.getByText('Directorio de vecinos')).toBeInTheDocument();
    expect(screen.getByText('Mis visitas')).toBeInTheDocument();
    expect(screen.getByText('Incidencias')).toBeInTheDocument();
    expect(screen.queryByText('Usuarios')).not.toBeInTheDocument();
  });

  it('H13-AC6: un rol no ve accesos de otro rol', async () => {
    (getCurrentUser as any).mockResolvedValue({
      id: 'res-uuid',
      email: 'demo@example.com',
      role: 'RESIDENTE',
      unit: null,
    });

    render(await MiComunidadPage());

    expect(screen.queryByText('Panel de seguridad')).not.toBeInTheDocument();
    expect(screen.queryByText('Administración de incidencias')).not.toBeInTheDocument();
  });
});