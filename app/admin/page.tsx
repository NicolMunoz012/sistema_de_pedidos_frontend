'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { itemService } from '@/lib/services/itemService';
import { pedidoService } from '@/lib/services/pedidoService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Package, UtensilsCrossed, FileText, Users, TrendingUp, Clock } from 'lucide-react';

export default function AdminPage() {
  const { usuario, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalItems: 0,
    pedidosActivos: 0,
    pedidosHoy: 0,
    totalFacturado: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [items, pedidos] = await Promise.all([
        itemService.getAllItems(),
        pedidoService.getPedidosActivos()
      ]);

      const hoy = new Date().toDateString();
      const pedidosHoy = pedidos.filter(p => 
        new Date(p.fecha).toDateString() === hoy
      );

      setStats({
        totalItems: items.length,
        pedidosActivos: pedidos.length,
        pedidosHoy: pedidosHoy.length,
        totalFacturado: 0 // Esto se puede calcular si tienes el endpoint
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

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
                <Link href="/">
                  <Button variant="ghost">
                    Ver Sitio
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="border-2 border-destructive text-destructive hover:bg-destructive/10"
                >
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Título y descripción */}
          <div className="mb-8">
            <h2 className="font-serif text-4xl font-bold text-foreground mb-2">
              Dashboard Administrativo
            </h2>
            <p className="text-muted-foreground text-lg">
              Gestiona tu restaurante desde un solo lugar
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-white border-2 border-orange-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <UtensilsCrossed className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Items en Menú</p>
                  <p className="text-3xl font-bold text-foreground">
                    {loading ? '...' : stats.totalItems}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border-2 border-orange-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Package className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pedidos Activos</p>
                  <p className="text-3xl font-bold text-foreground">
                    {loading ? '...' : stats.pedidosActivos}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border-2 border-orange-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pedidos Hoy</p>
                  <p className="text-3xl font-bold text-foreground">
                    {loading ? '...' : stats.pedidosHoy}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white border-2 border-orange-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-xl">
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">En Crecimiento</p>
                  <p className="text-3xl font-bold text-foreground">
                    +{stats.pedidosHoy}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Accesos rápidos */}
          <div className="mb-8">
            <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
              Accesos Rápidos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/admin/menu">
                <Card className="p-8 bg-white border-2 border-orange-100 hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group">
                  <div className="text-center">
                    <div className="inline-flex p-4 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                      <UtensilsCrossed className="w-12 h-12 text-primary" />
                    </div>
                    <h4 className="font-serif text-2xl font-bold text-foreground mb-2">
                      Gestionar Menú
                    </h4>
                    <p className="text-muted-foreground">
                      Agregar, editar y eliminar items del menú
                    </p>
                  </div>
                </Card>
              </Link>

              <Link href="/admin/pedidos">
                <Card className="p-8 bg-white border-2 border-orange-100 hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group">
                  <div className="text-center">
                    <div className="inline-flex p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                      <Package className="w-12 h-12 text-green-600" />
                    </div>
                    <h4 className="font-serif text-2xl font-bold text-foreground mb-2">
                      Administrar Pedidos
                    </h4>
                    <p className="text-muted-foreground">
                      Ver y gestionar pedidos activos e historial
                    </p>
                  </div>
                </Card>
              </Link>

              <Link href="/admin/facturas">
                <Card className="p-8 bg-white border-2 border-orange-100 hover:shadow-2xl transition-all hover:-translate-y-2 cursor-pointer group">
                  <div className="text-center">
                    <div className="inline-flex p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                      <FileText className="w-12 h-12 text-blue-600" />
                    </div>
                    <h4 className="font-serif text-2xl font-bold text-foreground mb-2">
                      Gestión de Facturas
                    </h4>
                    <p className="text-muted-foreground">
                      Ver facturas y estadísticas de ventas
                    </p>
                  </div>
                </Card>
              </Link>
            </div>
          </div>

          {/* Información adicional */}
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💡</div>
              <div>
                <h4 className="font-semibold text-lg mb-2">Consejo del día</h4>
                <p className="text-muted-foreground">
                  Mantén tu menú actualizado y revisa regularmente el estado de los pedidos para brindar un mejor servicio a tus clientes.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
