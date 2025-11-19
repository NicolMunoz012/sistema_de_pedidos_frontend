'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { facturaService } from '@/lib/services/facturaService';
import { Factura } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/common/Loading';
import Link from 'next/link';

export function ListaFacturas() {
  const { usuario } = useAuth();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (usuario?.idUsuario) {
      loadFacturas();
    }
  }, [usuario]);

  const loadFacturas = async () => {
    if (!usuario?.idUsuario) return;

    try {
      setLoading(true);
      const data = await facturaService.getFacturasByUsuario(usuario.idUsuario);
      setFacturas(data.sort((a, b) => new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime()));
      setError('');
    } catch (err) {
      console.error('[v0] Error cargando facturas:', err);
      setError('Error al cargar las facturas');
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
        <Button onClick={loadFacturas} variant="outline">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {facturas.length === 0 ? (
        <Card className="p-12 text-center bg-white">
          <div className="text-6xl mb-4 opacity-30">🧾</div>
          <p className="text-muted-foreground text-lg mb-4">
            No tienes facturas generadas
          </p>
          <Link href="/menu">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Hacer un Pedido
            </Button>
          </Link>
        </Card>
      ) : (
        facturas.map((factura) => {
          const fecha = new Date(factura.fechaEmision).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <Card key={factura.codigoFactura} className="p-6 bg-white hover:shadow-xl transition-all border-2 border-orange-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-foreground mb-1">
                    Factura #{factura.codigoFactura}
                  </h3>
                  <p className="text-sm text-muted-foreground">{fecha}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">Método de Pago</p>
                  <p className="font-semibold">{factura.metodoPago}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-border">
                <div>
                  <span className="text-sm text-muted-foreground mr-2">Total Pagado:</span>
                  <span className="text-2xl font-bold text-primary">${factura.montoTotal.toFixed(2)}</span>
                </div>
                <Link href={`/factura/${factura.codigoFactura}`}>
                  <Button variant="outline">
                    Ver Factura
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
