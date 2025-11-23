'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { GestionPedidosAdmin } from '@/components/admin/GestionPedidosAdmin';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Package, History } from 'lucide-react';

export default function AdminPedidosPage() {
  const [activeTab, setActiveTab] = useState<'activos' | 'historial'>('activos');

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        {/* Navbar */}
        <nav className="sticky top-0 bg-white/95 backdrop-blur-md shadow-lg z-40 border-b border-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center gap-3">
                <div className="text-4xl">📦</div>
                <div>
                  <h1 className="font-serif text-3xl font-bold text-primary">
                    Administrar Pedidos
                  </h1>
                  <p className="text-xs text-muted-foreground">Gestiona los pedidos del restaurante</p>
                </div>
              </div>
              
              <Link href="/admin">
                <Button variant="ghost" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Volver al Panel
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Tabs */}
          <Card className="p-2 mb-8 bg-white inline-flex gap-2">
            <Button
              variant={activeTab === 'activos' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('activos')}
              className={`gap-2 ${activeTab === 'activos' ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <Package className="w-4 h-4" />
              Pedidos Activos
            </Button>
            <Button
              variant={activeTab === 'historial' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('historial')}
              className={`gap-2 ${activeTab === 'historial' ? 'bg-primary text-primary-foreground' : ''}`}
            >
              <History className="w-4 h-4" />
              Historial
            </Button>
          </Card>

          {/* Content */}
          <GestionPedidosAdmin mostrarHistorial={activeTab === 'historial'} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
