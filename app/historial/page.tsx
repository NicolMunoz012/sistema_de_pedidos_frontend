'use client';

import { HistorialPedidos } from '@/components/pedido/HistorialPedidos';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function HistorialPage() {
  const { usuario, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-md shadow-lg z-40 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/menu" className="flex items-center gap-3">
              <div className="text-4xl">🍕</div>
              <div>
                <h1 className="font-serif text-3xl font-bold text-primary">
                  Sabor Express
                </h1>
              </div>
            </Link>
            
            <div className="flex items-center gap-3">
              {usuario && (
                <>
                  <Link href="/menu">
                    <Button variant="ghost">Menú</Button>
                  </Link>
                  <Button variant="ghost" onClick={logout}>
                    Cerrar Sesión
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="font-serif text-4xl font-bold text-foreground mb-8">
          Historial de Pedidos
        </h2>
        
        <HistorialPedidos />
      </div>
    </div>
  );
}
