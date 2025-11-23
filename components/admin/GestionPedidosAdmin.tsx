'use client';

import { useState, useEffect } from 'react';
import { pedidoService } from '@/lib/services/pedidoService';
import { Pedido, Estado } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EstadoBadge } from '@/components/common/EstadoBadge';
import { Loading } from '@/components/common/Loading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function GestionPedidosAdmin() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtro, setFiltro] = useState<string>('TODOS');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingPedido, setUpdatingPedido] = useState<number | null>(null);

  useEffect(() => {
    loadPedidos();
  }, [filtro]);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      let data: Pedido[];
      
      if (filtro === 'TODOS') {
        data = await pedidoService.getAllPedidos();
      } else {
        data = await pedidoService.getPedidosByEstado(filtro as Estado);
      }
      
      // Cargar el total de cada pedido
      const pedidosConTotal = await Promise.all(
        data.map(async (pedido) => {
          try {
            const total = await pedidoService.calcularTotal(pedido.codigoPedido!);
            return { ...pedido, total };
          } catch {
            return pedido;
          }
        })
      );
      
      setPedidos(pedidosConTotal.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()));
      setError('');
    } catch (err) {
      console.error('Error cargando pedidos:', err);
      setError('Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEstado = async (codigoPedido: number, nuevoEstado: Estado) => {
    try {
      setUpdatingPedido(codigoPedido);
      await pedidoService.updateEstado(codigoPedido, nuevoEstado);
      
      // Actualizar localmente
      setPedidos(pedidos.map(p => 
        p.codigoPedido === codigoPedido 
          ? { ...p, estado: nuevoEstado }
          : p
      ));
    } catch (err) {
      console.error('Error actualizando estado:', err);
      alert('Error al actualizar el estado del pedido');
    } finally {
      setUpdatingPedido(null);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="p-6 bg-white">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-foreground">
            Filtrar por estado:
          </label>
          <Select value={filtro} onValueChange={setFiltro}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos</SelectItem>
              <SelectItem value={Estado.PENDIENTE}>Pendiente</SelectItem>
              <SelectItem value={Estado.EN_PROCESO}>En Proceso</SelectItem>
              <SelectItem value={Estado.PREPARADO}>Preparado</SelectItem>
              <SelectItem value={Estado.ENTREGADO}>Entregado</SelectItem>
              <SelectItem value={Estado.CANCELADO}>Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      {/* Lista de Pedidos */}
      <div className="space-y-4">
        {pedidos.length === 0 ? (
          <Card className="p-12 text-center bg-white">
            <p className="text-muted-foreground text-lg">
              No hay pedidos con el estado seleccionado
            </p>
          </Card>
        ) : (
          pedidos.map((pedido) => {
            const total = pedido.total || pedido.detalles.reduce((sum, d) => sum + d.subtotal, 0);
            const fecha = new Date(pedido.fecha).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <Card key={pedido.codigoPedido} className="p-6 bg-white border-2 border-orange-100">
                <div className="grid md:grid-cols-[auto_1fr_auto] gap-6 items-start">
                  {/* Info Principal */}
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-foreground mb-1">
                      Pedido #{pedido.codigoPedido}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">{fecha}</p>
                    <EstadoBadge estado={pedido.estado} />
                  </div>

                  {/* Detalles */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Cliente:</p>
                      <p className="font-semibold">{pedido.usuario.nombre}</p>
                      <p className="text-sm text-muted-foreground">{pedido.usuario.gmail}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Dirección:</p>
                      <p className="text-sm">{pedido.usuario.direccion}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Items:</p>
                      <div className="space-y-1">
                        {pedido.detalles.map((detalle, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>
                              {detalle.cantidad}x {detalle.item.nombre}
                              {detalle.observaciones && (
                                <span className="text-muted-foreground italic ml-2">
                                  ({detalle.observaciones})
                                </span>
                              )}
                            </span>
                            <span className="font-semibold">${detalle.subtotal.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Total:</span>
                        <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Actualizar Estado:
                      </label>
                      <Select
                        value={pedido.estado}
                        onValueChange={(value) => handleUpdateEstado(pedido.codigoPedido!, value as Estado)}
                        disabled={updatingPedido === pedido.codigoPedido}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={Estado.PENDIENTE}>Pendiente</SelectItem>
                          <SelectItem value={Estado.EN_PROCESO}>En Proceso</SelectItem>
                          <SelectItem value={Estado.PREPARADO}>Preparado</SelectItem>
                          <SelectItem value={Estado.ENTREGADO}>Entregado</SelectItem>
                          <SelectItem value={Estado.CANCELADO}>Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {updatingPedido === pedido.codigoPedido && (
                      <p className="text-sm text-muted-foreground">Actualizando...</p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
