'use client';

import { useState, useEffect } from 'react';
import { facturaService } from '@/lib/services/facturaService';
import { pedidoService } from '@/lib/services/pedidoService';
import { Factura, Pedido } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/common/Loading';
import Link from 'next/link';

interface DetalleFacturaProps {
  codigoFactura: number;
}

export function DetalleFactura({ codigoFactura }: DetalleFacturaProps) {
  const [factura, setFactura] = useState<Factura | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFactura();
  }, [codigoFactura]);

  const loadFactura = async () => {
    try {
      setLoading(true);
      const data = await facturaService.getFactura(codigoFactura);
      setFactura(data);
      setError('');
    } catch (err) {
      console.error('[v0] Error cargando factura:', err);
      setError('Error al cargar la factura');
    } finally {
      setLoading(false);
    }
  };

  const handleImprimir = () => {
    window.print();
  };

  if (loading) {
    return <Loading />;
  }

  if (error || !factura) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md">
          <p className="text-red-600 mb-4">{error || 'Factura no encontrada'}</p>
          <Link href="/menu">
            <Button>Volver al Menú</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const fecha = new Date(factura.fechaEmision).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Navbar - No se imprime */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-md shadow-lg z-40 border-b border-orange-100 print:hidden">
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
              <Button onClick={handleImprimir} variant="outline">
                Imprimir
              </Button>
              <Link href="/menu">
                <Button>Volver al Menú</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Confirmación de Pago */}
        <Card className="p-8 mb-8 text-center bg-white border-2 border-green-200 print:border-0">
          <div className="text-6xl mb-4 print:hidden">💳</div>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
            Pago Procesado Exitosamente
          </h2>
          <p className="text-muted-foreground text-lg mb-4">
            Tu factura ha sido generada correctamente
          </p>
        </Card>

        {/* Factura */}
        <Card className="p-8 bg-white border-2 border-orange-100 print:border-0 print:shadow-none">
          {/* Header de la Factura */}
          <div className="text-center mb-8 pb-6 border-b-2 border-border">
            <div className="text-5xl mb-3 print:hidden">🍕</div>
            <h1 className="font-serif text-4xl font-bold text-primary mb-2">
              Sabor Express
            </h1>
            <p className="text-muted-foreground">Delicia en cada bocado</p>
            <p className="text-sm text-muted-foreground mt-2">
              Calle Principal 123, Ciudad | Tel: (555) 123-4567
            </p>
          </div>

          {/* Info de la Factura */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-bold text-lg text-foreground mb-3">
                Información de la Factura
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Número de Factura</p>
                  <p className="font-bold text-xl text-primary">#{factura.codigoFactura}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Emisión</p>
                  <p className="font-semibold">{fecha}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Método de Pago</p>
                  <p className="font-semibold">{factura.metodoPago}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg text-foreground mb-3">
                Estado del Pago
              </h3>
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg print:border print:border-green-300">
                <p className="font-bold text-green-700 text-lg">PAGADO</p>
                <p className="text-sm text-green-600 mt-1">
                  Pago procesado exitosamente
                </p>
              </div>
            </div>
          </div>

          {/* Resumen del Monto */}
          <div className="border-t-2 border-border pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-foreground">Subtotal</span>
              <span className="text-xl font-semibold">${(factura.montoTotal - 5).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold text-foreground">Envío</span>
              <span className="text-xl font-semibold">$5.00</span>
            </div>
            <div className="border-t-2 border-primary/20 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-foreground">Total Pagado</span>
                <span className="text-4xl font-bold text-primary">
                  ${factura.montoTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Mensaje de Agradecimiento */}
          <div className="mt-8 text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg print:bg-gray-50">
            <p className="text-lg font-semibold text-foreground mb-2">
              Gracias por tu compra
            </p>
            <p className="text-muted-foreground">
              Esperamos que disfrutes tu pedido. Si tienes alguna pregunta o comentario, no dudes en contactarnos.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            <p>Esta es una factura válida generada electrónicamente</p>
            <p className="mt-1">Sabor Express - Todos los derechos reservados</p>
          </div>
        </Card>

        {/* Botones - No se imprimen */}
        <div className="mt-8 flex gap-4 justify-center print:hidden">
          <Button onClick={handleImprimir} variant="outline" className="px-8">
            Imprimir Factura
          </Button>
          <Link href="/menu">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
              Volver al Menú
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
