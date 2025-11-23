'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { itemService } from '@/lib/services/itemService';
import { Item, Categoria } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const { usuario } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'TODOS', name: 'Todos', icon: '🍽️' },
    { id: Categoria.ENTRADA, name: 'Entradas', icon: '🥗' },
    { id: Categoria.PLATO_PRINCIPAL, name: 'Platos Principales', icon: '🍝' },
    { id: Categoria.POSTRES, name: 'Postres', icon: '🍰' },
    { id: Categoria.BEBIDAS, name: 'Bebidas', icon: '🥤' },
  ];

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await itemService.getAllItems();
      // Mostrar solo los primeros 8 items en la página principal
      setItems(data.slice(0, 8));
    } catch (err) {
      console.error('Error cargando items:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'TODOS' 
    ? items 
    : items.filter(item => item.categoria === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3 animate-slide-up">
              <div className="text-4xl animate-float">🍕</div>
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
              {usuario && (
                <>
                  <Link href="/mis-pedidos" className="text-foreground hover:text-primary font-medium transition-colors">
                    Mis Pedidos
                  </Link>
                  <Link href="/perfil" className="text-foreground hover:text-primary font-medium transition-colors">
                    Perfil
                  </Link>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {usuario ? (
                <>
                  <span className="hidden md:block text-sm text-muted-foreground">
                    Hola, {usuario.nombre}
                  </span>
                  <Link href="/menu">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
                      Ver Menú
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="hidden md:flex">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/registro">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="font-serif text-6xl md:text-7xl font-bold text-foreground mb-6 animate-slide-up text-balance">
            Ordena tu comida favorita
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-slide-up font-light text-pretty" style={{animationDelay: '0.1s'}}>
            De manera fácil y rápida. Delivery en 30 minutos o menos.
          </p>
          <div className="flex gap-4 justify-center animate-slide-up flex-wrap" style={{animationDelay: '0.2s'}}>
            <Link href="/menu">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                Ver Menú Completo
              </Button>
            </Link>
            {!usuario && (
              <Link href="/registro">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 border-2 border-primary text-primary hover:bg-primary/5">
                  Registrarse
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 text-center hover:shadow-xl transition-all hover:-translate-y-2 border-2 border-orange-100 bg-white/80 backdrop-blur">
            <div className="text-5xl mb-4 animate-float">🍽️</div>
            <h3 className="font-serif text-2xl font-bold mb-3 text-foreground">Menú Variado</h3>
            <p className="text-muted-foreground">
              Platillos deliciosos para satisfacer todos los gustos
            </p>
          </Card>
          <Card className="p-8 text-center hover:shadow-xl transition-all hover:-translate-y-2 border-2 border-orange-100 bg-white/80 backdrop-blur" style={{animationDelay: '0.1s'}}>
            <div className="text-5xl mb-4 animate-float" style={{animationDelay: '0.5s'}}>⚡</div>
            <h3 className="font-serif text-2xl font-bold mb-3 text-foreground">Entrega Rápida</h3>
            <p className="text-muted-foreground">
              Tu comida llega caliente en 30 minutos o menos garantizado
            </p>
          </Card>
          <Card className="p-8 text-center hover:shadow-xl transition-all hover:-translate-y-2 border-2 border-orange-100 bg-white/80 backdrop-blur" style={{animationDelay: '0.2s'}}>
            <div className="text-5xl mb-4 animate-float" style={{animationDelay: '1s'}}>💳</div>
            <h3 className="font-serif text-2xl font-bold mb-3 text-foreground">Pago Seguro</h3>
            <p className="text-muted-foreground">
              Múltiples métodos de pago con total seguridad
            </p>
          </Card>
        </div>
      </section>

      {/* Menu Preview Section */}
      <section id="menu" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-5xl font-bold text-center mb-4 text-foreground">
            Nuestro Menú
          </h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Platillos preparados con ingredientes frescos y mucho amor
          </p>

          {/* Category Tabs */}
          <div className="flex gap-3 mb-10 overflow-x-auto pb-4 justify-center flex-wrap">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`rounded-full px-6 py-6 text-base font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category.id 
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                    : 'hover:bg-primary/5 border-2 border-muted'
                }`}
              >
                <span className="text-2xl mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>

          {/* Menu Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 animate-spin">⏳</div>
              <p className="text-muted-foreground">Cargando menú...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <Card className="p-12 text-center bg-white">
              <div className="text-6xl mb-4 opacity-30">🍽️</div>
              <h3 className="text-xl font-semibold mb-2">No hay items disponibles</h3>
              <p className="text-muted-foreground mb-6">
                Pronto agregaremos deliciosos platillos a nuestro menú
              </p>
              {usuario && (
                <Link href="/admin">
                  <Button className="bg-primary hover:bg-primary/90">
                    Ir al Panel Admin
                  </Button>
                </Link>
              )}
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item, index) => (
                  <Card 
                    key={item.idItem || item.nombre}
                    className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group border-2 border-orange-100 bg-white"
                    style={{animationDelay: `${index * 0.05}s`}}
                  >
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
                      <img 
                        src="/placeholder.jpg"
                        alt={item.nombre}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold shadow-lg">
                        ${item.precio.toFixed(2)}
                      </Badge>
                      {!item.disponibilidad && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <Badge className="bg-red-600 text-white px-4 py-2 text-base font-bold">
                            No Disponible
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-foreground mb-2 font-serif">
                        {item.nombre}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {item.descripcion}
                      </p>
                      
                      <Link href="/menu">
                        <Button 
                          disabled={!item.disponibilidad}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                        >
                          Ver Detalles
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link href="/menu">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                    Ver Menú Completo
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="font-serif text-5xl font-bold mb-6">
            ¿Listo para ordenar?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Regístrate ahora y disfruta de nuestros deliciosos platillos
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {usuario ? (
              <Link href="/menu">
                <Button size="lg" variant="secondary" className="px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                  Ir al Menú
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/registro">
                  <Button size="lg" variant="secondary" className="px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105">
                    Registrarse Gratis
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 border-2 border-white text-white hover:bg-white/10">
                    Iniciar Sesión
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-orange-900 to-amber-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo y descripción */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">🍕</div>
                <h2 className="font-serif text-3xl font-bold">
                  Sabor Express
                </h2>
              </div>
              <p className="text-orange-100 mb-4">
                Tu restaurante favorito ahora más cerca. Ordena en línea y disfruta de la mejor comida con entrega rápida.
              </p>
            </div>
            
            {/* Enlaces rápidos */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/menu" className="text-orange-100 hover:text-white transition-colors">
                    Menú
                  </Link>
                </li>
                <li>
                  <Link href="/mis-pedidos" className="text-orange-100 hover:text-white transition-colors">
                    Mis Pedidos
                  </Link>
                </li>
                <li>
                  <Link href="/perfil" className="text-orange-100 hover:text-white transition-colors">
                    Mi Perfil
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Contacto */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Contacto</h3>
              <ul className="space-y-2 text-orange-100">
                <li>📞 +1 (555) 123-4567</li>
                <li>📧 info@saborexpress.com</li>
                <li>📍 Calle Principal #123</li>
                <li>🕐 Lun-Dom: 10:00 - 22:00</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-orange-700 pt-8 text-center">
            <p className="text-orange-200 text-sm">
              © 2024 Sabor Express. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
