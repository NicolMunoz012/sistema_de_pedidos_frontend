'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { pedidoService } from '@/lib/services/pedidoService';
import { DetallePedido, Estado } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export function CrearPedido() {
  const { usuario } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<DetallePedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Cargar carrito del localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error('[v0] Error al cargar carrito:', err);
      }
    }
  }, []);

  const updateQuantity = (index: number, delta: number) => {
    const newCart = [...cart];
    const newQuantity = newCart[index].cantidad + delta;
    
    if (newQuantity > 0) {
      newCart[index].cantidad = newQuantity;
      newCart[index].subtotal = newQuantity * newCart[index].precioUnitario;
      setCart(newCart);
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  };

  const removeItem = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateObservaciones = (index: number, observaciones: string) => {
    const newCart = [...cart];
    newCart[index].observaciones = observaciones;
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const calcularTotal = () => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const handleConfirmarPedido = async () => {
    if (!usuario) {
      router.push('/login');
      return;
    }

    if (cart.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const pedidoData = {
        usuario,
        fecha: new Date(),
        estado: Estado.PENDIENTE,
        detalles: cart
      };

      const pedidoCreado = await pedidoService.createPedido(pedidoData);
      
      // Limpiar carrito
      localStorage.removeItem('cart');
      
      // Redirigir a confirmación
      router.push(`/pedido/${pedidoCreado.codigoPedido}`);
    } catch (err: any) {
      console.error('[v0] Error al crear pedido:', err);
      setError(err.response?.data?.message || 'Error al crear el pedido. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const deliveryFee = 5.00;
  const subtotal = calcularTotal();
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white/95 backdrop-blur-md shadow-lg z-40 border-b border-orange-100">
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
              <Link href="/menu">
                <Button variant="ghost">
                  Volver al Menú
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="font-serif text-4xl font-bold text-foreground mb-8">
          Tu Pedido
        </h2>

        {cart.length === 0 ? (
          <Card className="p-12 text-center bg-white">
            <div className="text-6xl mb-4 opacity-30">🛒</div>
            <p className="text-muted-foreground text-lg mb-4">
              Tu carrito está vacío
            </p>
            <Link href="/menu">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Ir al Menú
              </Button>
            </Link>
          </Card>
        ) : (
          <>
            {/* Items */}
            <div className="space-y-4 mb-8">
              {cart.map((detalle, index) => (
                <Card key={index} className="p-6 bg-white border-2 border-orange-100">
                  <div className="flex gap-4">
                    <img 
                      src={`/.jpg?key=0lpm5&height=120&width=120&query=${encodeURIComponent(detalle.item.nombre)}`}
                      alt={detalle.item.nombre}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-xl text-foreground">
                          {detalle.item.nombre}
                        </h3>
                        <p className="font-bold text-lg text-foreground">
                          ${detalle.subtotal.toFixed(2)}
                        </p>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-3">
                        ${detalle.precioUnitario.toFixed(2)} c/u
                      </p>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(index, -1)}
                            className="w-8 h-8 rounded-full p-0 border-2"
                          >
                            -
                          </Button>
                          <span className="font-semibold text-lg w-8 text-center">
                            {detalle.cantidad}
                          </span>
                          <Button 
                            size="sm"
                            onClick={() => updateQuantity(index, 1)}
                            className="w-8 h-8 rounded-full p-0 bg-primary text-primary-foreground"
                          >
                            +
                          </Button>
                        </div>
                        
                        <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          Eliminar
                        </Button>
                      </div>
                      
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

            {/* Resumen y Confirmación */}
            <Card className="p-8 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-primary/20">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
                Resumen del Pedido
              </h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-lg">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="font-semibold">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-primary/20 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-foreground">Total</span>
                    <span className="text-3xl font-bold text-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {usuario && (
                <div className="mb-6 p-4 bg-white rounded-lg border border-orange-100">
                  <p className="text-sm text-muted-foreground mb-2">Dirección de entrega:</p>
                  <p className="font-semibold text-foreground">{usuario.direccion}</p>
                  <Link href="/perfil" className="text-sm text-primary hover:underline">
                    Cambiar dirección
                  </Link>
                </div>
              )}

              {error && (
                <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              <Button 
                onClick={handleConfirmarPedido}
                disabled={loading || cart.length === 0}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                {loading ? 'Procesando...' : 'Confirmar Pedido'}
              </Button>
              
              <p className="text-center text-sm text-muted-foreground mt-4">
                Entrega estimada: 30-40 minutos
              </p>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
