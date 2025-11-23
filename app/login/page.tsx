import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { LoginContent } from '@/components/auth/LoginContent';

// Loading fallback component
function LoginLoading() {
  return (
    <Card className="w-full max-w-md p-8 space-y-6 bg-white/95 backdrop-blur border-2 border-orange-100 shadow-2xl animate-slide-up mt-20">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-spin">⏳</div>
        <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
          Cargando...
        </h1>
        <p className="text-muted-foreground">
          Preparando el formulario de inicio de sesión
        </p>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      {/* Navbar fijo */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="text-4xl">🍕</div>
              <div>
                <h1 className="font-serif text-3xl font-bold text-primary">
                  Sabor Express
                </h1>
                <p className="text-xs text-muted-foreground">Delicia en cada bocado</p>
              </div>
            </Link>
            
            <Link href="/">
              <Button variant="ghost">
                Volver al Inicio
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Contenido principal con Suspense */}
      <Suspense fallback={<LoginLoading />}>
        <LoginContent />
      </Suspense>

      {/* Footer minimalista */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-orange-100 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Sabor Express. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
