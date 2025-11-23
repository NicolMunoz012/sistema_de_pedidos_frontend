'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export function LoginContent() {
  const [gmail, setGmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Mostrar mensaje de registro exitoso si viene de la página de registro
    if (searchParams.get('registro') === 'exitoso') {
      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
    }
  }, [searchParams]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!gmail.trim() || !contraseña.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (!validateEmail(gmail)) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    setLoading(true);

    try {
      const usuarioLogueado = await login(gmail, contraseña);
      
      // Redirigir según el rol del usuario
      if (usuarioLogueado?.rol === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/menu');
      }
    } catch (err: any) {
      console.error('Error en login:', err);
      
      // Manejar diferentes tipos de errores
      if (err.response?.status === 400) {
        setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
      } else if (err.response?.status === 404) {
        setError('Usuario no encontrado. ¿Necesitas registrarte?');
      } else {
        setError(err.response?.data?.message || 'Error al iniciar sesión. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8 space-y-6 bg-white/95 backdrop-blur border-2 border-orange-100 shadow-2xl animate-slide-up mt-20">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-float">🍕</div>
        <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
          Iniciar Sesión
        </h1>
        <p className="text-muted-foreground">
          Ingresa a tu cuenta para ordenar
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
            className="w-full h-12 px-4 rounded-xl border-2 border-orange-100 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
            className="w-full h-12 px-4 rounded-xl border-2 border-orange-100 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            disabled={loading}
          />
        </div>

        {success && (
          <div className="p-4 rounded-xl bg-green-50 border-2 border-green-200 text-green-700 text-sm animate-slide-up">
            <span className="font-semibold">✅ Éxito:</span> {success}
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200 text-red-700 text-sm animate-slide-up">
            <span className="font-semibold">⚠️ Error:</span> {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Iniciando sesión...
            </span>
          ) : (
            'Iniciar Sesión'
          )}
        </Button>
      </form>

      <div className="text-center space-y-3">
        <Link
          href="/recuperar"
          className="block text-sm text-primary hover:underline transition-colors"
        >
          ¿Olvidaste tu contraseña?
        </Link>
        
        <div className="pt-4 border-t-2 border-orange-100">
          <p className="text-sm text-muted-foreground mb-3">
            ¿No tienes cuenta?
          </p>
          <Link href="/registro">
            <Button
              variant="outline"
              className="w-full border-2 border-primary text-primary hover:bg-primary/5 py-5 font-semibold rounded-xl transition-all hover:scale-[1.02]"
            >
              Crear cuenta nueva
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
