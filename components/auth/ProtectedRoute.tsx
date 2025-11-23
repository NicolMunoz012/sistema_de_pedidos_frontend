'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loading } from '@/components/common/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { usuario, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!usuario) {
        // No hay usuario logueado, redirigir al login
        router.push('/login');
      } else if (requireAdmin && usuario.rol !== 'ADMINISTRADOR') {
        // Requiere admin pero el usuario no lo es
        router.push('/menu');
      }
    }
  }, [usuario, loading, requireAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  if (requireAdmin && usuario.rol !== 'ADMINISTRADOR') {
    return null;
  }

  return <>{children}</>;
}
