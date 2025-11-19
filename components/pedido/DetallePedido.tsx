'use client';

import { useState, useEffect } from 'react';
import { pedidoService } from '@/lib/services/pedidoService';
import { Pedido } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EstadoBadge } from '@/components/common/EstadoBadge';
import { Loading } from '@/components/common/Loading';
import { GenerarFactura } from '@/components/factura/GenerarFactura';
import Link from 'next/link';

interface DetallePedidoProps {
  codigoPedido: number;
}

export function DetallePedido({ codigoPedido }: DetallePedidoProps) {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFacturaForm, setShowFacturaForm] = useState(false);

  useEffect(() => {
    loadPedido();
  }, [codigoPedido]);

  const loadPedido = async () => {
    try {
      setLoading(true);
      const data = await pedidoService.getPedido(codigoPedido);
      setPedido(data);
      setError('');
    } catch (err: any) {
      console.error('[v0] Error cargando pedido:', err);
      setError('Error al cargar el pedido');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !pedido) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <p className="text-red-600 mb-4">{error || 'Pedido no encontrado'}</p>
          <Link href="/menu">
            <Button>Volver al Menú</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const total = pedido.detalles.reduce((sum, d) => sum + d.subtotal, 0);
  const deliveryFee = 5.00;
  const montoTotal = total + deliveryFee;

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
              <Link href="/historial">
                <Button variant="ghost">
                  Mis Pedidos
                </Button>
              </Link>
              <Link href="/menu">
                <Button variant="ghost">
                  Menú
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Confirmación */}
        <Card className="p-8 mb-8 text-center bg-white border-2 border-green-200">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
            Pedido Confirmado
          </h2>
          <p className="text-muted-foreground text-lg mb-4">
            Tu pedido ha sido recibido y está siendo preparado
          </p>
          <div className="flex items-center justify-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Número de pedido</p>
              <p className="font-bold text-2xl text-primary">#{pedido.codigoPedido}</p>
            </div>
            <EstadoBadge estado={pedido.estado} />
          </div>
        </Card>

        {/* Detalles del Pedido */}
        <Card className="p-8 bg-white mb-8">
          <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
            Detalles del Pedido
          </h3>
          
          <div className="space-y-4 mb-6">
            {pedido.detalles.map((detalle, index) => (
              <div key={index} className="flex gap-4 pb-4 border-b border-border last:border-0">
                <img 
                  src={`/.jpg?key=ftq9z&height=80&width=80&query=${encodeURIComponent(detalle.item.nombre)}`}
                  alt={detalle.item.nombre}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-lg text-foreground">
                      {detalle.item.nombre}
                    </h4>
                    <p className="font-bold text-lg text-foreground">
                      ${detalle.subtotal.toFixed(2)}
                    </p>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-2">
                    ${detalle.precioUnitario.toFixed(2)} x {detalle.cantidad}
                  </p>
                  
                  {detalle.observaciones && (
                    <p className="text-sm text-muted-foreground italic">
                      Nota: {detalle.observaciones}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-border pt-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-semibold text-foreground">Subtotal</span>
              <span className="text-lg font-semibold">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-semibold text-foreground">Envío</span>
              <span className="text-lg font-semibold">${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="border-t-2 border-primary/20 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-foreground">Total</span>
                <span className="text-3xl font-bold text-primary">
                  ${montoTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Información de Entrega */}
        <Card className="p-8 bg-white mb-8">
          <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
            Información de Entrega
          </h3>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Dirección</p>
              <p className="font-semibold text-foreground">{pedido.usuario.direccion}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Cliente</p>
              <p className="font-semibold text-foreground">{pedido.usuario.nombre}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground mb-1">Contacto</p>
              <p className="font-semibold text-foreground">{pedido.usuario.gmail}</p>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-1">Tiempo estimado de entrega</p>
              <p className="font-bold text-xl text-primary">30-40 minutos</p>
            </div>
          </div>
        </Card>

        {showFacturaForm ? (
          <GenerarFactura codigoPedido={codigoPedido} montoTotal={montoTotal} />
        ) : (
          <Card className="p-8 bg-white mb-8 text-center">
            <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
              Procesar Pago
            </h3>
            <p className="text-muted-foreground mb-6">
              Genera tu factura y completa el pago de tu pedido
            </p>
            <Button
              onClick={() => setShowFacturaForm(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-bold"
            >
              Proceder al Pago
            </Button>
          </Card>
        )}

        <div className="flex gap-4 justify-center">
          <Link href="/menu">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
              Hacer Otro Pedido
            </Button>
          </Link>
          <Link href="/historial">
            <Button variant="outline" className="px-8">
              Ver Historial
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
