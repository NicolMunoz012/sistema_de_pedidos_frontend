'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { pedidoService } from '@/lib/services/pedidoService';
import { facturaService } from '@/lib/services/facturaService';
import { Pedido } from '@/lib/types';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/common/Loading';
import { ESTADO_COLORS, ESTADO_LABELS } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { Package, Calendar, MapPin, FileText, XCircle } from 'lucide-react';

export default function DetallePedidoPage() {
  const params = useParams();
  const router = useRouter();
  const { usuario, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [generatingFactura, setGeneratingFactura] = useState(false);

  const codigoPedido = parseInt(params.id as string);

  useEffect(() => {
    if (!authLoading && !usuario) {
      router.push('/login');
      return;
    }

    if (codigoPedido) {
      loadPedido();
    }
  }, [codigoPedido, usuario, authLoading]);

  const loadPedido = async () => {
    try {
      setLoading(true);
      const data = await pedidoService.getPedido(codigoPedido);
      setPedido(data);

      // Obtener el total
      const totalData = await pedidoService.calcularTotal(codigoPedido);
      setTotal(totalData);
    } catch (err: any) {
      console.error('Error cargando pedido:', err);
      toast({
        title: 'Error',
        description: 'No se pudo cargar el pedido',
        variant: 'destructive',
      });
      router.push('/mis-pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelarPedido = async () => {
    if (!confirm('¿Estás seguro de cancelar este pedido?')) return;

    try {
      await pedidoService.cancelarPedido(codigoPedido);
      toast({
        title: 'Pedido cancelado',
        description: 'Tu pedido ha sido cancelado correctamente',
      });
      router.push('/mis-pedidos');
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'No se pudo cancelar el pedido',
        variant: 'destructive',
      });
    }
  };

  const handleGenerarFactura = async () => {
    setGeneratingFactura(true);
    try {
      const factura = await facturaService.generarFactura(codigoPedido);
      toast({
        title: 'Factura generada',
        description: `Factura #${factura.codigoFactura} creada exitosamente`,
      });
      router.push(`/factura/${factura.codigoFactura}`);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'No se pudo generar la factura',
        variant: 'destructive',
      });
    } finally {
      setGeneratingFactura(false);
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

  if (!pedido) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header del pedido */}
        <Card className="p-6 mb-6 bg-white border-2 border-orange-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Pedido #{pedido.codigoPedido}
              </h1>
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
            </div>
            <Badge className={`${ESTADO_COLORS[pedido.estado]} text-lg px-4 py-2`}>
              {ESTADO_LABELS[pedido.estado]}
            </Badge>
          </div>

          <div className="flex items-start gap-2 p-4 bg-orange-50 rounded-lg">
            <MapPin className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Dirección de entrega:</p>
              <p className="font-semibold">{pedido.usuario.direccion}</p>
            </div>
          </div>
        </Card>

        {/* Items del pedido */}
        <Card className="p-6 mb-6 bg-white border-2 border-orange-100">
          <h2 className="font-serif text-2xl font-bold mb-4">Items del Pedido</h2>
          <div className="space-y-4">
            {pedido.detalles.map((detalle) => (
              <div key={detalle.idDetalle} className="flex gap-4 p-4 bg-orange-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{detalle.item.nombre}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    ${detalle.precioUnitario.toFixed(2)} × {detalle.cantidad}
                  </p>
                  {detalle.observaciones && (
                    <p className="text-sm text-muted-foreground italic">
                      Nota: {detalle.observaciones}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-primary">
                    ${detalle.subtotal.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t-2 border-orange-200">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">Total</span>
              <span className="text-3xl font-bold text-primary">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3">
          {pedido.estado === 'ENTREGADO' && (
            <Button
              onClick={handleGenerarFactura}
              disabled={generatingFactura}
              className="flex-1 bg-primary hover:bg-primary/90 py-6"
            >
              <FileText className="w-5 h-5 mr-2" />
              {generatingFactura ? 'Generando...' : 'Generar Factura'}
            </Button>
          )}

          {pedido.estado === 'PENDIENTE' && (
            <Button
              variant="outline"
              onClick={handleCancelarPedido}
              className="flex-1 border-2 border-destructive text-destructive hover:bg-destructive/10 py-6"
            >
              <XCircle className="w-5 h-5 mr-2" />
              Cancelar Pedido
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => router.push('/mis-pedidos')}
            className="flex-1 py-6"
          >
            Volver a Mis Pedidos
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
