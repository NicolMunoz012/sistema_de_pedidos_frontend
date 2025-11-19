'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut } from 'lucide-react';

interface HeaderProps {
  cartItemCount?: number;
}

export function Header({ cartItemCount = 0 }: HeaderProps) {
  const { usuario, logout } = useAuth();

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-md shadow-lg z-40 border-b border-orange-100">
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
          
          <nav className="flex items-center gap-4">
            {usuario ? (
              <>
                <Link href="/menu">
                  <Button variant="ghost">
                    Menú
                  </Button>
                </Link>
                
                <Link href="/historial">
                  <Button variant="ghost">
                    Mis Pedidos
                  </Button>
                </Link>
                
                <Link href="/pedido">
                  <Button variant="ghost" className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {cartItemCount}
                      </span>
                    )}
                  </Button>
                </Link>
                
                <Link href="/perfil">
                  <Button variant="ghost">
                    <User className="w-5 h-5 mr-2" />
                    {usuario.nombre}
                  </Button>
                </Link>
                
                <Button 
                  variant="ghost" 
                  onClick={logout}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/registro">
                  <Button className="bg-primary hover:bg-primary/90">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
