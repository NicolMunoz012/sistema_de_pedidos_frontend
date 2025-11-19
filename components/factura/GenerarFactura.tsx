'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { facturaService } from '@/lib/services/facturaService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface GenerarFacturaProps {
  codigoPedido: number;
  montoTotal: number;
}

export function GenerarFactura({ codigoPedido, montoTotal }: GenerarFacturaProps) {
  const router = useRouter();
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerar = async () => {
    setLoading(true);
    setError('');

    try {
      const factura = await facturaService.generarFactura(codigoPedido);
      router.push(`/factura/${factura.codigoFactura}`);
    } catch (err: any) {
      console.error('[v0] Error generando factura:', err);
      setError(err.response?.data?.message || 'Error al generar la factura');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-8 bg-white border-2 border-orange-100">
      <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
        Generar Factura
      </h3>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Método de Pago
          </label>
          <Select value={metodoPago} onValueChange={setMetodoPago}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Efectivo">Efectivo</SelectItem>
              <SelectItem value="Tarjeta de Crédito">Tarjeta de Crédito</SelectItem>
              <SelectItem value="Tarjeta de Débito">Tarjeta de Débito</SelectItem>
              <SelectItem value="Transferencia">Transferencia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-foreground">Total a Pagar:</span>
            <span className="text-3xl font-bold text-primary">
              ${montoTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <Button
        onClick={handleGenerar}
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
      >
        {loading ? 'Generando Factura...' : 'Generar Factura y Pagar'}
      </Button>
    </Card>
  );
}
