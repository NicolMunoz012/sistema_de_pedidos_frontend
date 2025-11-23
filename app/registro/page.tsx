'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    gmail: '',
    contraseña: '',
    confirmarContraseña: '',
    direccion: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.gmail.trim() || 
        !formData.contraseña.trim() || !formData.confirmarContraseña.trim() || !formData.direccion.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (!validateEmail(formData.gmail)) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    if (formData.contraseña.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.contraseña !== formData.confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para el backend
      const usuarioData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        gmail: formData.gmail,
        contraseña: formData.contraseña,
        direccion: formData.direccion,
        rol: 'CLIENTE' as const // Siempre CLIENTE por defecto
      };

      await authService.registro(usuarioData);
      
      // Redirigir al login con mensaje de éxito
      router.push('/login?registro=exitoso');
    } catch (err: any) {
      console.error('Error en registro:', err);
      
      // Manejar diferentes tipos de errores
      if (err.response?.status === 409) {
        setError('Este correo electrónico ya está registrado. ¿Quieres iniciar sesión?');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Datos inválidos. Verifica la información.');
      } else {
        setError(err.response?.data?.message || 'Error al crear la cuenta. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

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

      {/* Contenido principal */}
      <Card className="w-full max-w-md p-8 space-y-6 bg-white/95 backdrop-blur border-2 border-orange-100 shadow-2xl animate-slide-up mt-20 mb-20">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-float">🎉</div>
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
            Crear Cuenta
          </h1>
          <p className="text-muted-foreground">
            Únete a Sabor Express y disfruta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-foreground mb-2">
                Nombre
              </label>
              <Input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Juan"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 rounded-xl border-2 border-orange-100 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-foreground mb-2">
                Apellido
              </label>
              <Input
                id="apellido"
                name="apellido"
                type="text"
                placeholder="Pérez"
                value={formData.apellido}
                onChange={handleChange}
                required
                className="w-full h-12 px-4 rounded-xl border-2 border-orange-100 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                disabled={loading}
              />
            </div>
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
              className="w-full h-12 px-4 rounded-xl border-2 border-orange-100 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="direccion" className="block text-sm font-medium text-foreground mb-2">
              Dirección de entrega
            </label>
            <Input
              id="direccion"
              name="direccion"
              type="text"
              placeholder="Calle Principal #123, Ciudad"
              value={formData.direccion}
              onChange={handleChange}
              required
              className="w-full h-12 px-4 rounded-xl border-2 border-orange-100 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
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
              minLength={6}
              className="w-full h-12 px-4 rounded-xl border-2 border-orange-100 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Mínimo 6 caracteres
            </p>
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
              minLength={6}
              className="w-full h-12 px-4 rounded-xl border-2 border-orange-100 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              disabled={loading}
            />
          </div>

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
                Creando cuenta...
              </span>
            ) : (
              'Crear Cuenta'
            )}
          </Button>
        </form>

        <div className="text-center pt-4 border-t-2 border-orange-100">
          <p className="text-sm text-muted-foreground mb-3">
            ¿Ya tienes cuenta?
          </p>
          <Link href="/login">
            <Button
              variant="outline"
              className="w-full border-2 border-primary text-primary hover:bg-primary/5 py-5 font-semibold rounded-xl transition-all hover:scale-[1.02]"
            >
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </Card>

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
