'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export function Login() {
  const [gmail, setGmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(gmail, contraseña);
      router.push('/menu');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white/95 backdrop-blur border-2 border-orange-100 shadow-2xl">
        <div className="text-center">
          <div className="text-6xl mb-4">🍕</div>
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
            Sabor Express
          </h1>
          <p className="text-muted-foreground">
            Inicia sesión para ordenar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="gmail" className="block text-sm font-medium text-foreground mb-2">
              Correo electrónico
            </label>
            <Input
              id="gmail"
              type="email"
              placeholder="tu@email.com"
              value={gmail}
              onChange={(e) => setGmail(e.target.value)}
              required
              className="w-full"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
              className="w-full"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="text-center space-y-3">
          <Link
            href="/recuperar"
            className="block text-sm text-primary hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
          
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">
              ¿No tienes cuenta?
            </p>
            <Link href="/registro">
              <Button
                variant="outline"
                className="w-full border-2 border-primary text-primary hover:bg-primary/5 py-5 font-semibold"
              >
                Crear cuenta nueva
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
