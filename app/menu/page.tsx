'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ListaItems } from '@/components/menu/ListaItems';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Item, DetallePedido } from '@/lib/types';
import Link from 'next/link';

export default function MenuPage() {
  const { usuario, logout } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState<DetallePedido[]>([]);

  const addToCart = (item: Item) => {
    const existingItem = cart.find(cartItem => cartItem.item.nombre === item.nombre);
    
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.item.nombre === item.nombre 
          ? { ...cartItem, cantidad: cartItem.cantidad + 1, subtotal: (cartItem.cantidad + 1) * item.precio }
          : cartItem
      ));
    } else {
      const newDetalle: DetallePedido = {
        item,
        cantidad: 1,
        precioUnitario: item.precio,
        subtotal: item.precio,
        observaciones: ''
      };
      setCart([...cart, newDetalle]);
    }
  };

  const handleVerCarrito = () => {
    // Guardamos el carrito en localStorage para usarlo en la página de pedido
    localStorage.setItem('cart', JSON.stringify(cart));
    router.push('/pedido');
  };

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
                <p className="text-xs text-muted-foreground">Delicia en cada bocado</p>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="/menu" className="text-foreground hover:text-primary font-medium transition-colors">
                Menú
              </Link>
              <Link href="/historial" className="text-foreground hover:text-primary font-medium transition-colors">
                Mis Pedidos
              </Link>
              <Link href="/perfil" className="text-foreground hover:text-primary font-medium transition-colors">
                Perfil
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              {usuario ? (
                <>
                  <span className="hidden md:block text-sm text-muted-foreground">
                    Hola, {usuario.nombre}
                  </span>
                  <Button variant="ghost" onClick={logout}>
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <Button variant="ghost">
                    Iniciar Sesión
                  </Button>
                </Link>
              )}
              
              <Button 
                onClick={handleVerCarrito}
                className="relative bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
              >
                Carrito
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-serif text-5xl md:text-6xl font-bold text-foreground mb-4">
            Nuestro Menú
          </h2>
          <p className="text-xl text-muted-foreground">
            Platillos preparados con ingredientes frescos y mucho amor
          </p>
        </div>
      </section>

      {/* Menu Section */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <ListaItems onAddToCart={addToCart} />
        </div>
      </section>
    </div>
  );
}
