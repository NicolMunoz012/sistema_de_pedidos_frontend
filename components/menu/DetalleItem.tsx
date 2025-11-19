'use client';

import { Item } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface DetalleItemProps {
  item: Item;
  onClose: () => void;
  onAddToCart: (item: Item) => void;
}

export function DetalleItem({ item, onClose, onAddToCart }: DetalleItemProps) {
  const handleAddToCart = () => {
    onAddToCart(item);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-border p-4 flex justify-between items-center z-10">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Detalle del Producto
            </h2>
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="rounded-full w-10 h-10 p-0"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Imagen */}
            <div className="relative h-80 rounded-xl overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
              <img 
                src={`/.jpg?height=400&width=600&query=${encodeURIComponent(item.nombre)}`}
                alt={item.nombre}
                className="w-full h-full object-cover"
              />
              {!item.disponibilidad && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Badge className="bg-red-600 text-white px-6 py-3 text-xl font-bold">
                    No Disponible
                  </Badge>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-serif text-3xl font-bold text-foreground">
                  {item.nombre}
                </h3>
                <Badge className="bg-primary text-primary-foreground px-4 py-2 text-xl font-bold">
                  ${item.precio.toFixed(2)}
                </Badge>
              </div>

              <Badge variant="outline" className="text-base px-3 py-1">
                {item.categoria.replace('_', ' ')}
              </Badge>

              <p className="text-muted-foreground text-lg leading-relaxed">
                {item.descripcion}
              </p>

              <div className="pt-4">
                <Button 
                  onClick={handleAddToCart}
                  disabled={!item.disponibilidad}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  {item.disponibilidad ? 'Agregar al Carrito' : 'No Disponible'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
