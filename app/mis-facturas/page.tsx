'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { facturaService } from '@/lib/services/facturaService';
import { Factura } from '@/lib/types';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loading } from '@/components/common/Loading';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { FileText, Calendar, DollarSign, Eye, Filter } from 'lucide-react';

export default function MisFacturasPage() {
  const { usuario, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [filtering, setFiltering] = useState(false);

  useEffect(() => {
    if (!authLoading && !usuario) {
      router.push('/login');
      return;
    }

    if (usuario?.idUsuario) {
      loadFacturas();
    }
  }, [usuario, authLoading]);

  const loadFacturas = async () => {
    if (!usuario?.idUsuario) return;

    try {
      setLoading(true);
      const data = await facturaService.getFacturasByUsuario(usuario.idUsuario);
      // Ordenar por fecha más reciente
      const sorted = data.sort((a, b) => 
        new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime()
      );
      setFacturas(sorted);
      setError('');
    } catch (err: any) {
      console.error('Error cargando facturas:', err);
      setError('Error al cargar tus facturas');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltrarPorRango = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fechaInicio || !fechaFin) {
      toast({
        title: 'Error',
        description: 'Debes seleccionar ambas fechas',
        variant: 'destructive',
      });
      return;
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      toast({
        title: 'Error',
        description: 'La fecha de inicio debe ser anterior a la fecha fin',
        variant: 'destructive',
      });
      return;
    }

    setFiltering(true);
    try {
      const data = await facturaService.getFacturasByRango(fechaInicio, fechaFin);
      const sorted = data.sort((a, b) => 
        new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime()
      );
      setFacturas(sorted);
      toast({
        title: 'Filtro aplicado',
        description: `Mostrando facturas del ${fechaInicio} al ${fechaFin}`,
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: 'Error al filtrar facturas',
        variant: 'destructive',
      });
    } finally {
      setFiltering(false);
    }
  };

  const handleLimpiarFiltro = () => {
    setFechaInicio('');
    setFechaFin('');
    loadFacturas();
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
            Mis Facturas
          </h1>
          <p className="text-muted-foreground">
            Historial completo de tus facturas
          </p>
        </div>

        {/* Filtro por rango de fechas */}
        <Card className="p-6 mb-6 bg-white border-2 border-orange-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Filtrar por Fecha</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilter(!showFilter)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilter ? 'Ocultar' : 'Mostrar'} Filtros
            </Button>
          </div>

          {showFilter && (
            <form onSubmit={handleFiltrarPorRango} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                  <Input
                    id="fechaInicio"
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="fechaFin">Fecha Fin</Label>
                  <Input
                    id="fechaFin"
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={filtering}
                  className="bg-primary hover:bg-primary/90"
                >
                  {filtering ? 'Filtrando...' : 'Aplicar Filtro'}
                </Button>
                {(fechaInicio || fechaFin) && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLimpiarFiltro}
                  >
                    Limpiar Filtro
                  </Button>
                )}
              </div>
            </form>
          )}
        </Card>

        {error && (
          <Card className="p-4 mb-6 bg-red-50 border-red-200">
            <p className="text-red-700">{error}</p>
          </Card>
        )}

        {facturas.length === 0 ? (
          <Card className="p-12 text-center bg-white">
            <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
            <h3 className="text-xl font-semibold mb-2">No tienes facturas</h3>
            <p className="text-muted-foreground mb-6">
              Las facturas se generan automáticamente cuando tus pedidos son entregados
            </p>
            <Link href="/mis-pedidos">
              <Button className="bg-primary hover:bg-primary/90">
                Ver Mis Pedidos
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {facturas.map((factura) => (
              <Card key={factura.codigoFactura} className="p-6 bg-white border-2 border-orange-100 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-6 h-6 text-primary" />
                      <h3 className="font-serif text-2xl font-bold text-foreground">
                        Factura #{factura.codigoFactura}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(factura.fechaEmision).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>

                      <div className="flex items-center gap-2 font-semibold text-primary">
                        <DollarSign className="w-4 h-4" />
                        ${factura.montoTotal.toFixed(2)}
                      </div>

                      <div className="text-muted-foreground">
                        Método de pago: {factura.metodoPago}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Link href={`/factura/${factura.codigoFactura}`}>
                      <Button variant="outline" className="w-full md:w-auto">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalle
                      </Button>
                    </Link>
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
