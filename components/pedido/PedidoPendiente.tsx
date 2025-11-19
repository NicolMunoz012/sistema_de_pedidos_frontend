'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DetallePedido, Item } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Minus } from 'lucide-react';

interface PedidoPendienteProps {
  onConfirmar: () => void;
}

export function PedidoPendiente({ onConfirmar }: PedidoPendienteProps) {
  const { usuario } = useAuth();
  const [detalles, setDetalles] = useState<DetallePedido[]>([]);

  useEffect(() => {
    // Cargar carrito del localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setDetalles(JSON.parse(savedCart));
      } catch (err) {
        console.error('Error al cargar carrito:', err);
      }
    }
  }, []);

  const updateCantidad = (index: number, delta: number) => {
    const newDetalles = [...detalles];
    const newCantidad = newDetalles[index].cantidad + delta;
    
    if (newCantidad > 0) {
      newDetalles[index].cantidad = newCantidad;
      newDetalles[index].subtotal = newCantidad * newDetalles[index].precioUnitario;
      setDetalles(newDetalles);
      localStorage.setItem('cart', JSON.stringify(newDetalles));
    }
  };

  const eliminarItem = (index: number) => {
    const newDetalles = detalles.filter((_, i) => i !== index);
    setDetalles(newDetalles);
    localStorage.setItem('cart', JSON.stringify(newDetalles));
  };

  const updateObservaciones = (index: number, observaciones: string) => {
    const newDetalles = [...detalles];
    newDetalles[index].observaciones = observaciones;
    setDetalles(newDetalles);
    localStorage.setItem('cart', JSON.stringify(newDetalles));
  };

  const calcularTotal = () => {
    return detalles.reduce((sum, detalle) => sum + detalle.subtotal, 0);
  };

  if (detalles.length === 0) {
    return (
      <Card className="p-12 text-center bg-white">
        <div className="text-6xl mb-4 opacity-30">🛒</div>
        <p className="text-muted-foreground text-lg">
          No hay items en tu pedido pendiente
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lista de items */}
      <div className="space-y-4">
        {detalles.map((detalle, index) => (
          <Card key={index} className="p-6 bg-white border-2 border-orange-100">
            <div className="flex gap-4">
              <img 
                src={`/placeholder.jpg?height=100&width=100`}
                alt={detalle.item.nombre}
                className="w-20 h-20 object-cover rounded-lg"
              />
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">
                      {detalle.item.nombre}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      ${detalle.precioUnitario.toFixed(2)} c/u
                    </p>
                  </div>
                  <p className="font-bold text-lg text-foreground">
                    ${detalle.subtotal.toFixed(2)}
                  </p>
                </div>
                
                {/* Controles de cantidad */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => updateCantidad(index, -1)}
                      className="w-8 h-8 rounded-full p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="font-semibold text-lg w-8 text-center">
                      {detalle.cantidad}
                    </span>
                    <Button 
                      size="sm"
                      onClick={() => updateCantidad(index, 1)}
                      className="w-8 h-8 rounded-full p-0 bg-primary"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => eliminarItem(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
                
                {/* Observaciones */}
                <Textarea 
                  placeholder="Observaciones (ej: sin cebolla, bien cocido...)"
                  value={detalle.observaciones}
                  onChange={(e) => updateObservaciones(index, e.target.value)}
                  rows={2}
                  className="text-sm"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Total y botón confirmar */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-primary/20">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold text-foreground">Total</span>
          <span className="text-2xl font-bold text-primary">
            ${calcularTotal().toFixed(2)}
          </span>
        </div>
        
        {usuario && (
          <div className="mb-4 p-3 bg-white rounded-lg border border-orange-100">
            <p className="text-sm text-muted-foreground mb-1">Dirección de entrega:</p>
            <p className="font-semibold text-foreground">{usuario.direccion}</p>
          </div>
        )}
        
        <Button 
          onClick={onConfirmar}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl font-bold text-lg"
        >
          Confirmar Pedido
        </Button>
      </Card>
    </div>
  );
}
