'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS')
  const [cart, setCart] = useState<any[]>([])

  const categories = [
    { id: 'TODOS', name: 'Todos', icon: '🍽️' },
    { id: 'ENTRADA', name: 'Entradas', icon: '🥗' },
    { id: 'PLATO_PRINCIPAL', name: 'Platos Principales', icon: '🍝' },
    { id: 'POSTRES', name: 'Postres', icon: '🍰' },
    { id: 'BEBIDAS', name: 'Bebidas', icon: '🥤' },
  ]

  const menuItems = [
    {
      nombre: 'Ensalada César',
      categoria: 'ENTRADA',
      descripcion: 'Lechuga fresca, crutones crujientes, queso parmesano y aderezo césar casero',
      precio: 12.99,
      disponibilidad: true,
      imagen: '/ensalada-cesar-fresca.jpg'
    },
    {
      nombre: 'Pasta Carbonara',
      categoria: 'PLATO_PRINCIPAL',
      descripcion: 'Pasta fresca con salsa carbonara cremosa, panceta y queso parmesano',
      precio: 18.99,
      disponibilidad: true,
      imagen: '/pasta-carbonara-deliciosa.jpg'
    },
    {
      nombre: 'Pizza Margherita',
      categoria: 'PLATO_PRINCIPAL',
      descripcion: 'Pizza artesanal con tomate san marzano, mozzarella fresca y albahaca',
      precio: 16.99,
      disponibilidad: true,
      imagen: '/pizza-margherita-artesanal.jpg'
    },
    {
      nombre: 'Hamburguesa Premium',
      categoria: 'PLATO_PRINCIPAL',
      descripcion: 'Carne angus, queso cheddar, bacon, lechuga, tomate y papas fritas',
      precio: 15.99,
      disponibilidad: true,
      imagen: '/hamburguesa-gourmet-jugosa.jpg'
    },
    {
      nombre: 'Tiramisú',
      categoria: 'POSTRES',
      descripcion: 'Postre italiano tradicional con café, mascarpone y cacao',
      precio: 8.99,
      disponibilidad: true,
      imagen: '/tiramisu-italiano-autentico.jpg'
    },
    {
      nombre: 'Cheesecake de Fresa',
      categoria: 'POSTRES',
      descripcion: 'Tarta de queso cremosa con coulis de fresas frescas',
      precio: 9.99,
      disponibilidad: true,
      imagen: '/cheesecake-fresa-delicioso.jpg'
    },
    {
      nombre: 'Limonada Natural',
      categoria: 'BEBIDAS',
      descripcion: 'Limonada fresca con hierbabuena y hielo',
      precio: 4.99,
      disponibilidad: true,
      imagen: '/limonada-fresca-natural.jpg'
    },
    {
      nombre: 'Smoothie Tropical',
      categoria: 'BEBIDAS',
      descripcion: 'Batido de mango, piña y maracuyá con yogurt',
      precio: 6.99,
      disponibilidad: true,
      imagen: '/smoothie-tropical-colorido.jpg'
    },
  ]

  const filteredItems = selectedCategory === 'TODOS' 
    ? menuItems 
    : menuItems.filter(item => item.categoria === selectedCategory)

  const addToCart = (item: any) => {
    const existingItem = cart.find(cartItem => cartItem.nombre === item.nombre)
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.nombre === item.nombre 
          ? { ...cartItem, cantidad: cartItem.cantidad + 1 }
          : cartItem
      ))
    } else {
      setCart([...cart, { ...item, cantidad: 1, observaciones: '' }])
    }
  }

  const updateQuantity = (nombre: string, delta: number) => {
    setCart(cart.map(item => 
      item.nombre === nombre 
        ? { ...item, cantidad: Math.max(1, item.cantidad + delta) }
        : item
    ).filter(item => item.cantidad > 0))
  }

  const removeFromCart = (nombre: string) => {
    setCart(cart.filter(item => item.nombre !== nombre))
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
  const deliveryFee = 5.00
  const total = cartTotal + deliveryFee

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 animate-slide-up">
              <div className="text-4xl animate-float">🍕</div>
              <div>
                <h1 className="font-serif text-3xl font-bold text-primary">
                  Sabor Express
                </h1>
                <p className="text-xs text-muted-foreground">Delicia en cada bocado</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#menu" className="text-foreground hover:text-primary font-medium transition-colors">
                Menú
              </a>
              <a href="#pedidos" className="text-foreground hover:text-primary font-medium transition-colors">
                Mis Pedidos
              </a>
              <a href="#contacto" className="text-foreground hover:text-primary font-medium transition-colors">
                Contacto
              </a>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="hidden md:flex">
                Iniciar Sesión
              </Button>
              <Button 
                onClick={() => setCartOpen(!cartOpen)}
                className="relative bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
              >
                <span className="text-xl mr-2">🛒</span>
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
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/deliciosa-comida-restaurante.jpg')] bg-cover bg-center opacity-5"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="font-serif text-6xl md:text-7xl font-bold text-foreground mb-6 animate-slide-up text-balance">
            Ordena tu comida favorita
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-slide-up font-light text-pretty" style={{animationDelay: '0.1s'}}>
            De manera fácil y rápida. Delivery en 30 minutos o menos.
          </p>
          <div className="flex gap-4 justify-center animate-slide-up" style={{animationDelay: '0.2s'}}>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105">
              Ver Menú Completo
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 border-2 border-primary text-primary hover:bg-primary/5">
              Registrarse
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-6xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 text-center hover:shadow-xl transition-all hover:-translate-y-2 border-2 border-orange-100 bg-white/80 backdrop-blur">
            <div className="text-5xl mb-4 animate-float">🍽️</div>
            <h3 className="font-serif text-2xl font-bold mb-3 text-foreground">Menú Variado</h3>
            <p className="text-muted-foreground">
              Más de 50 platillos diferentes para satisfacer todos los gustos
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
              Acepta múltiples métodos de pago con total seguridad
            </p>
          </Card>
        </div>
      </section>

      {/* Menu Section */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <Card 
                key={item.nombre}
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group border-2 border-orange-100 bg-white"
                style={{animationDelay: `${index * 0.05}s`}}
              >
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
                  <img 
                    src={item.imagen || "/placeholder.svg"}
                    alt={item.nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold shadow-lg">
                    ${item.precio.toFixed(2)}
                  </Badge>
                </div>
                
                <div className="p-5">
                  <h3 className="text-xl font-bold text-foreground mb-2 font-serif">
                    {item.nombre}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {item.descripcion}
                  </p>
                  
                  <Button 
                    onClick={() => addToCart(item)}
                    disabled={!item.disponibilidad}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    <span className="mr-2">🛒</span>
                    Agregar al Carrito
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      {cartOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setCartOpen(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-full md:w-[500px] bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border p-6 flex justify-between items-center shadow-sm z-10">
              <div>
                <h3 className="font-serif text-3xl font-bold text-foreground">Tu Pedido</h3>
                <p className="text-muted-foreground text-sm mt-1">{cart.length} productos</p>
              </div>
              <Button 
                variant="ghost" 
                onClick={() => setCartOpen(false)}
                className="text-2xl hover:bg-muted rounded-full w-12 h-12"
              >
                ✕
              </Button>
            </div>

            {cart.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4 opacity-30">🛒</div>
                <p className="text-muted-foreground text-lg">Tu carrito está vacío</p>
                <p className="text-muted-foreground text-sm mt-2">¡Agrega algunos platillos deliciosos!</p>
              </div>
            ) : (
              <>
                <div className="p-6 space-y-4">
                  {cart.map((item) => (
                    <Card key={item.nombre} className="p-4 border-2 border-orange-100">
                      <div className="flex gap-4">
                        <img 
                          src={item.imagen || "/placeholder.svg"}
                          alt={item.nombre}
                          className="w-20 h-20 object-cover rounded-xl"
                        />
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-foreground mb-1">
                            {item.nombre}
                          </h4>
                          <p className="text-muted-foreground text-sm mb-2">
                            ${item.precio.toFixed(2)} c/u
                          </p>
                          
                          <div className="flex items-center gap-3">
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.nombre, -1)}
                              className="w-8 h-8 rounded-full p-0 border-2"
                            >
                              -
                            </Button>
                            <span className="font-semibold text-lg w-8 text-center">
                              {item.cantidad}
                            </span>
                            <Button 
                              size="sm"
                              onClick={() => updateQuantity(item.nombre, 1)}
                              className="w-8 h-8 rounded-full p-0 bg-primary text-primary-foreground"
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-right flex flex-col justify-between">
                          <p className="font-bold text-lg text-foreground">
                            ${(item.precio * item.cantidad).toFixed(2)}
                          </p>
                          <Button 
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.nombre)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <label className="text-sm text-muted-foreground mb-1 block">
                          Observaciones (opcional)
                        </label>
                        <Input 
                          placeholder="Ej: Sin cebolla, bien cocido..."
                          value={item.observaciones}
                          onChange={(e) => {
                            setCart(cart.map(cartItem => 
                              cartItem.nombre === item.nombre 
                                ? { ...cartItem, observaciones: e.target.value }
                                : cartItem
                            ))
                          }}
                          className="text-sm"
                        />
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="sticky bottom-0 bg-gradient-to-br from-orange-50 to-amber-50 p-6 border-t-2 border-primary/20">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-base">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-muted-foreground">Envío</span>
                      <span className="font-semibold">${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t-2 border-primary/20 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-foreground">Total</span>
                        <span className="text-3xl font-bold text-primary">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02]"
                  >
                    <span className="mr-2 text-xl">🎉</span>
                    Confirmar Pedido
                  </Button>
                  
                  <p className="text-center text-xs text-muted-foreground mt-3">
                    🚚 Entrega estimada: 30-40 minutos
                  </p>
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="bg-gradient-to-r from-primary to-accent text-primary-foreground py-12 px-4 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-5xl mb-4">🍕</div>
          <h3 className="font-serif text-3xl font-bold mb-2">Sabor Express</h3>
          <p className="mb-6 opacity-90">Delicia en cada bocado</p>
          <div className="flex gap-6 justify-center mb-6">
            <a href="#" className="hover:opacity-80 transition-opacity">Términos</a>
            <a href="#" className="hover:opacity-80 transition-opacity">Privacidad</a>
            <a href="#" className="hover:opacity-80 transition-opacity">Contacto</a>
          </div>
          <p className="text-sm opacity-75">
            © 2025 Sabor Express. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
