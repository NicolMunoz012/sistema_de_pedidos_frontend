'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export function PerfilUsuario() {
  const { usuario, updateUsuario } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || '',
    gmail: usuario?.gmail || '',
    direccion: usuario?.direccion || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUsuario(formData);
      toast({
        title: 'Perfil actualizado',
        description: 'Tus datos se han actualizado correctamente',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Error al actualizar el perfil',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-8 bg-white border-2 border-orange-100">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-white font-bold">
            {usuario?.nombre.charAt(0).toUpperCase()}
          </div>
          <h2 className="font-serif text-3xl font-bold text-foreground">
            Mi Perfil
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="gmail">Correo electrónico</Label>
            <Input
              id="gmail"
              name="gmail"
              type="email"
              value={formData.gmail}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="direccion">Dirección de entrega</Label>
            <Input
              id="direccion"
              name="direccion"
              type="text"
              value={formData.direccion}
              onChange={handleChange}
              required
              disabled={loading}
              className="mt-2"
              placeholder="Calle, número, colonia, ciudad"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl font-bold text-lg"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </form>

        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="font-semibold text-lg mb-4">Información de la cuenta</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>ID de Usuario: {usuario?.idUsuario}</p>
            <p>Miembro desde: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
