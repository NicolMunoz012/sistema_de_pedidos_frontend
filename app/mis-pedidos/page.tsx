'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { pedidoService } from '@/lib/services/pedidoService';
import { Pedido } from '@/lib/types';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/common/Loading';
import { ESTADO_COLORS, ESTADO_LABELS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Package, Calendar, DollarSign, Eye, XCircle } from 'lucide-react';

export default function MisPedidosPage() {
  const { usuario, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !usuario) {
      router.push('/login');
      return;
    }

    if (usuario?.idUsuario) {
      loadPedidos();
    }
  }, [usuario, authLoading]);

  const loadPedidos = async () => {
    if (!usuario?.idUsuario) return;

    try {
      setLoading(true);
      const data = await pedidoService.getPedidosByUsuario(usuario.idUsuario);
      // Ordenar por fecha más reciente
      const sorted = data.sort((a, b) => 
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
      setPedidos(sorted);
      setError('');
    } catch (err: any) {
      console.error('Error cargando pedidos:', err);
      setError('Error al cargar tus pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarPedido = async (codigoPedido: number) => {
    if (!confirm('¿Estás seguro de cancelar este pedido?')) return;

    try {
      await pedidoService.cancelarPedido(codigoPedido);
      toast({
        title: 'Pedido cancelado',
        description: 'Tu pedido ha sido cancelado correctamente',
      });
      loadPedidos();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'No se pudo cancelar el pedido',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
            Mis Pedidos
          </h1>
          <p className="text-muted-foreground">
            Historial completo de tus pedidos
          </p>
        </div>

        {error && (
          <Card className="p-4 mb-6 bg-red-50 border-red-200">
            <p className="text-red-700">{error}</p>
          </Card>
        )}

        {pedidos.length === 0 ? (
          <Card className="p-12 text-center bg-white">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
            <h3 className="text-xl font-semibold mb-2">No tienes pedidos</h3>
            <p className="text-muted-foreground mb-6">
              Comienza a ordenar tus platillos favoritos
            </p>
            <Link href="/menu">
              <Button className="bg-primary hover:bg-primary/90">
                Ver Menú
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <Card key={pedido.codigoPedido} className="p-6 bg-white border-2 border-orange-100 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-serif text-2xl font-bold text-foreground">
                        Pedido #{pedido.codigoPedido}
                      </h3>
                      <Badge className={ESTADO_COLORS[pedido.estado]}>
                        {ESTADO_LABELS[pedido.estado]}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(pedido.fecha).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Package className="w-4 h-4" />
                        {pedido.detalles.length} {pedido.detalles.length === 1 ? 'item' : 'items'}
                      </div>

                      {pedido.total !== undefined && (
                        <div className="flex items-center gap-2 font-semibold text-primary">
                          <DollarSign className="w-4 h-4" />
                          ${pedido.total.toFixed(2)}
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground">
                        Items: {pedido.detalles.map(d => d.item.nombre).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Link href={`/pedido/${pedido.codigoPedido}`}>
                      <Button variant="outline" className="w-full md:w-auto">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalle
                      </Button>
                    </Link>

                    {pedido.estado === 'PENDIENTE' && (
                      <Button
                        variant="ghost"
                        onClick={() => handleCancelarPedido(pedido.codigoPedido!)}
                        className="w-full md:w-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
