'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { facturaService } from '@/lib/services/facturaService';
import { Factura } from '@/lib/types';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/common/Loading';
import { useToast } from '@/hooks/use-toast';
import { FileText, Calendar, DollarSign, CreditCard, Download } from 'lucide-react';

export default function DetalleFacturaPage() {
  const params = useParams();
  const router = useRouter();
  const { usuario, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [factura, setFactura] = useState<Factura | null>(null);
  const [loading, setLoading] = useState(true);

  const codigoFactura = parseInt(params.id as string);

  useEffect(() => {
    if (!authLoading && !usuario) {
      router.push('/login');
      return;
    }

    if (codigoFactura) {
      loadFactura();
    }
  }, [codigoFactura, usuario, authLoading]);

  const loadFactura = async () => {
    try {
      setLoading(true);
      const data = await facturaService.getDetalleFactura(codigoFactura);
      setFactura(data);
    } catch (err: any) {
      console.error('Error cargando factura:', err);
      toast({
        title: 'Error',
        description: 'No se pudo cargar la factura',
        variant: 'destructive',
      });
      router.push('/mis-facturas');
    } finally {
      setLoading(false);
    }
  };

  const handleDescargar = () => {
    toast({
      title: 'Descarga iniciada',
      description: 'La factura se descargará en breve',
    });
    // Aquí podrías implementar la descarga real del PDF
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

  if (!factura) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header de la factura */}
        <Card className="p-8 mb-6 bg-white border-2 border-orange-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-10 h-10 text-primary" />
              <div>
                <h1 className="font-serif text-3xl font-bold text-foreground">
                  Factura #{factura.codigoFactura}
                </h1>
                <p className="text-muted-foreground">Sabor Express</p>
              </div>
            </div>
            <Button onClick={handleDescargar} className="bg-primary hover:bg-primary/90">
              <Download className="w-4 h-4 mr-2" />
              Descargar PDF
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-5 h-5" />
                <div>
                  <p className="text-sm">Fecha de Emisión</p>
                  <p className="font-semibold text-foreground">
                    {new Date(factura.fechaEmision).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="w-5 h-5" />
                <div>
                  <p className="text-sm">Método de Pago</p>
                  <p className="font-semibold text-foreground">{factura.metodoPago}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Monto Total</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-8 h-8 text-primary" />
                  <p className="text-4xl font-bold text-primary">
                    {factura.montoTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <h3 className="font-semibold text-lg mb-3">Información del Cliente</h3>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="font-semibold">{usuario?.nombre}</p>
              <p className="text-sm text-muted-foreground">{usuario?.gmail}</p>
              <p className="text-sm text-muted-foreground">{usuario?.direccion}</p>
            </div>
          </div>
        </Card>

        {/* Información adicional */}
        <Card className="p-6 bg-blue-50 border-2 border-blue-200 mb-6">
          <h3 className="font-semibold text-lg mb-3">📋 Información Importante</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Esta factura es un comprobante oficial de tu compra</li>
            <li>• Conserva este documento para futuras referencias</li>
            <li>• Para cualquier consulta, contacta a nuestro servicio al cliente</li>
          </ul>
        </Card>

        {/* Acciones */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push('/mis-facturas')}
            className="flex-1 py-6"
          >
            Volver a Mis Facturas
          </Button>
          <Button
            onClick={handleDescargar}
            className="flex-1 bg-primary hover:bg-primary/90 py-6"
          >
            <Download className="w-5 h-5 mr-2" />
            Descargar PDF
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
