'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

export function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    gmail: '',
    contraseña: '',
    confirmarContraseña: '',
    direccion: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { registro } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (formData.contraseña !== formData.confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.contraseña.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const { confirmarContraseña, ...usuarioData } = formData;
      await registro(usuarioData);
      router.push('/menu');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrarse. Intenta de nuevo.');
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
            Crear Cuenta
          </h1>
          <p className="text-muted-foreground">
            Únete a Sabor Express
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-foreground mb-2">
              Nombre completo
            </label>
            <Input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Juan Pérez"
              value={formData.nombre}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="gmail" className="block text-sm font-medium text-foreground mb-2">
              Correo electrónico
            </label>
            <Input
              id="gmail"
              name="gmail"
              type="email"
              placeholder="tu@email.com"
              value={formData.gmail}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="contraseña" className="block text-sm font-medium text-foreground mb-2">
              Contraseña
            </label>
            <Input
              id="contraseña"
              name="contraseña"
              type="password"
              placeholder="••••••••"
              value={formData.contraseña}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="confirmarContraseña" className="block text-sm font-medium text-foreground mb-2">
              Confirmar contraseña
            </label>
            <Input
              id="confirmarContraseña"
              name="confirmarContraseña"
              type="password"
              placeholder="••••••••"
              value={formData.confirmarContraseña}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="direccion" className="block text-sm font-medium text-foreground mb-2">
              Dirección de entrega
            </label>
            <Textarea
              id="direccion"
              name="direccion"
              placeholder="Calle, número, ciudad, código postal"
              value={formData.direccion}
              onChange={handleChange}
              required
              disabled={loading}
              rows={3}
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
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </Button>
        </form>

        <div className="text-center pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">
            ¿Ya tienes cuenta?
          </p>
          <Link href="/login">
            <Button
              variant="outline"
              className="w-full border-2 border-primary text-primary hover:bg-primary/5 py-5 font-semibold"
            >
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
