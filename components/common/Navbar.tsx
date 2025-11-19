'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const { usuario, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link 
              href="/menu" 
              className={`font-medium transition-colors ${
                isActive('/menu') 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Menú
            </Link>
            
            {usuario && (
              <>
                <Link 
                  href="/historial" 
                  className={`font-medium transition-colors ${
                    isActive('/historial') 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Mis Pedidos
                </Link>
                
                <Link 
                  href="/facturas" 
                  className={`font-medium transition-colors ${
                    isActive('/facturas') 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Facturas
                </Link>
                
                <Link 
                  href="/perfil" 
                  className={`font-medium transition-colors ${
                    isActive('/perfil') 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Perfil
                </Link>
              </>
            )}
          </div>
          
          {usuario && (
            <Button 
              variant="ghost" 
              onClick={logout}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              Cerrar Sesión
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
