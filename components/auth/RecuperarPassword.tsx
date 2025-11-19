'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export function RecuperarPassword() {
  const [gmail, setGmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await authService.recuperar(gmail);
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al recuperar contraseña. Verifica tu correo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white/95 backdrop-blur border-2 border-orange-100 shadow-2xl">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
            Recuperar Contraseña
          </h1>
          <p className="text-muted-foreground">
            Ingresa tu correo para recibir instrucciones
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-green-700 font-medium mb-2">
                Correo enviado exitosamente
              </p>
              <p className="text-green-600 text-sm">
                Revisa tu bandeja de entrada para restablecer tu contraseña
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Redirigiendo al inicio de sesión...
            </p>
          </div>
        ) : (
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
                disabled={loading}
                className="w-full"
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
              {loading ? 'Enviando...' : 'Enviar Instrucciones'}
            </Button>
          </form>
        )}

        <div className="text-center pt-4 border-t border-border">
          <Link
            href="/login"
            className="text-sm text-primary hover:underline"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </Card>
    </div>
  );
}
