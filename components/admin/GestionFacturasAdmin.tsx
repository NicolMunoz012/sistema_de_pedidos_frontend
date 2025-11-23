'use client';

import { useState, useEffect } from 'react';
import { facturaService } from '@/lib/services/facturaService';
import { Factura } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loading } from '@/components/common/Loading';
import { FileText, Calendar, DollarSign, Filter, Eye } from 'lucide-react';
import Link from 'next/link';

export function GestionFacturasAdmin() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [filtering, setFiltering] = useState(false);

  useEffect(() => {
    loadFacturas();
  }, []);

  const loadFacturas = async () => {
    try {
      setLoading(true);
      const data = await facturaService.getAllFacturas();
      const sorted = data.sort((a, b) => 
        new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime()
      );
      setFacturas(sorted);
      setError('');
    } catch (err) {
      console.error('Error cargando facturas:', err);
      setError('Error al cargar las facturas');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltrarPorRango = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fechaInicio || !fechaFin) {
      alert('Debes seleccionar ambas fechas');
      return;
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      alert('La fecha de inicio debe ser anterior a la fecha fin');
      return;
    }

    setFiltering(true);
    try {
      const data = await facturaService.getFacturasByRango(fechaInicio, fechaFin);
      const sorted = data.sort((a, b) => 
        new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime()
      );
      setFacturas(sorted);
    } catch (err) {
      console.error('Error filtrando facturas:', err);
      alert('Error al filtrar facturas');
    } finally {
      setFiltering(false);
    }
  };

  const handleLimpiarFiltro = () => {
    setFechaInicio('');
    setFechaFin('');
    loadFacturas();
  };

  if (loading) {
    return <Loading />;
  }

  const totalFacturado = facturas.reduce((sum, f) => sum + f.montoTotal, 0);

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-white border-2 border-orange-100">
          <div className="flex items-center gap-3">
            <FileText className="w-10 h-10 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Facturas</p>
              <p className="text-3xl font-bold text-foreground">{facturas.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-2 border-green-100">
          <div className="flex items-center gap-3">
            <DollarSign className="w-10 h-10 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total Facturado</p>
              <p className="text-3xl font-bold text-green-600">${totalFacturado.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-2 border-blue-100">
          <div className="flex items-center gap-3">
            <Calendar className="w-10 h-10 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Promedio por Factura</p>
              <p className="text-3xl font-bold text-blue-600">
                ${facturas.length > 0 ? (totalFacturado / facturas.length).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtro por rango de fechas */}
      <Card className="p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Filtrar por Rango de Fechas</h3>
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
                <Label htmlFor="fechaInicio">Fecha Inicio (YYYY-MM-DD)</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="fechaFin">Fecha Fin (YYYY-MM-DD)</Label>
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
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      {/* Lista de Facturas */}
      <div className="space-y-4">
        {facturas.length === 0 ? (
          <Card className="p-12 text-center bg-white">
            <p className="text-muted-foreground text-lg">
              No hay facturas en el sistema
            </p>
          </Card>
        ) : (
          facturas.map((factura) => (
            <Card key={factura.codigoFactura} className="p-6 bg-white border-2 border-orange-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-6 h-6 text-primary" />
                    <h3 className="font-serif text-2xl font-bold text-foreground">
                      Factura #{factura.codigoFactura}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
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
                      Método: {factura.metodoPago}
                    </div>
                  </div>
                </div>

                <div>
                  <Link href={`/factura/${factura.codigoFactura}`}>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalle
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
