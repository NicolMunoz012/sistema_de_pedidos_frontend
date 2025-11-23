'use client';

import { useState } from 'react';
import { GestionPedidosAdmin } from '@/components/admin/GestionPedidosAdmin';
import { AdministrarMenu } from '@/components/admin/AdministrarMenu';
import { GestionFacturasAdmin } from '@/components/admin/GestionFacturasAdmin';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function AdminPage() {
  const { usuario } = useAuth();
  const [activeTab, setActiveTab] = useState<'pedidos' | 'menu' | 'facturas'>('menu');

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-md shadow-lg z-40 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="text-4xl">👨‍💼</div>
              <div>
                <h1 className="font-serif text-3xl font-bold text-primary">
                  Panel Admin
                </h1>
                <p className="text-xs text-muted-foreground">
                  Bienvenido, {usuario?.nombre}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Link href="/menu">
                <Button variant="ghost">
                  Ver Sitio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <Card className="p-2 mb-8 bg-white inline-flex gap-2">
          <Button
            variant={activeTab === 'pedidos' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('pedidos')}
            className={activeTab === 'pedidos' ? 'bg-primary text-primary-foreground' : ''}
          >
            Gestión de Pedidos
          </Button>
          <Button
            variant={activeTab === 'menu' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('menu')}
            className={activeTab === 'menu' ? 'bg-primary text-primary-foreground' : ''}
          >
            Administrar Menú
          </Button>
          <Button
            variant={activeTab === 'facturas' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('facturas')}
            className={activeTab === 'facturas' ? 'bg-primary text-primary-foreground' : ''}
          >
            Gestión de Facturas
          </Button>
        </Card>

        {/* Content */}
        {activeTab === 'pedidos' && <GestionPedidosAdmin />}
        {activeTab === 'menu' && <AdministrarMenu />}
        {activeTab === 'facturas' && <GestionFacturasAdmin />}
      </div>
    </div>
    </ProtectedRoute>
  );
}
