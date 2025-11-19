'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { pedidoService } from '@/lib/services/pedidoService';
import { Pedido } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EstadoBadge } from '@/components/common/EstadoBadge';
import { Loading } from '@/components/common/Loading';
import Link from 'next/link';

export function HistorialPedidos() {
  const { usuario } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (usuario?.idUsuario) {
      loadPedidos();
    }
  }, [usuario]);

  const loadPedidos = async () => {
    if (!usuario?.idUsuario) return;

    try {
      setLoading(true);
      const data = await pedidoService.getPedidosByUsuario(usuario.idUsuario);
      setPedidos(data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()));
      setError('');
    } catch (err) {
      console.error('[v0] Error cargando pedidos:', err);
      setError('Error al cargar el historial');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadPedidos} variant="outline">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pedidos.length === 0 ? (
        <Card className="p-12 text-center bg-white">
          <div className="text-6xl mb-4 opacity-30">📦</div>
          <p className="text-muted-foreground text-lg mb-4">
            No tienes pedidos aún
          </p>
          <Link href="/menu">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Hacer tu Primer Pedido
            </Button>
          </Link>
        </Card>
      ) : (
        pedidos.map((pedido) => {
          const total = pedido.detalles.reduce((sum, d) => sum + d.subtotal, 0);
          const fecha = new Date(pedido.fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <Card key={pedido.codigoPedido} className="p-6 bg-white hover:shadow-xl transition-all border-2 border-orange-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-1">
                    Pedido #{pedido.codigoPedido}
                  </h3>
                  <p className="text-sm text-muted-foreground">{fecha}</p>
                </div>
                <EstadoBadge estado={pedido.estado} />
              </div>

              <div className="space-y-2 mb-4">
                {pedido.detalles.map((detalle, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {detalle.cantidad}x {detalle.item.nombre}
                    </span>
                    <span className="font-semibold">${detalle.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border">
                <div>
                  <span className="text-sm text-muted-foreground mr-2">Total:</span>
                  <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                </div>
                <Link href={`/pedido/${pedido.codigoPedido}`}>
                  <Button variant="outline">
                    Ver Detalles
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}
