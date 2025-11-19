'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/lib/services/authService';
import { MapPin, Check } from 'lucide-react';

export function GestionDirecciones() {
  const { usuario, updateUsuario } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [nuevaDireccion, setNuevaDireccion] = useState('');

  const handleActualizarDireccion = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuario?.idUsuario || !nuevaDireccion.trim()) {
      return;
    }

    setLoading(true);

    try {
      await authService.updateDireccion(usuario.idUsuario, nuevaDireccion);
      await updateUsuario({ direccion: nuevaDireccion });
      
      toast({
        title: 'Dirección actualizada',
        description: 'Tu dirección de entrega se ha actualizado correctamente',
      });
      
      setNuevaDireccion('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Error al actualizar la dirección',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-8 bg-white border-2 border-orange-100">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-8 h-8 text-primary" />
          <h2 className="font-serif text-3xl font-bold text-foreground">
            Dirección de Entrega
          </h2>
        </div>

        {/* Dirección actual */}
        <div className="mb-8 p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-primary/20">
          <div className="flex items-start gap-3">
            <Check className="w-6 h-6 text-primary mt-1" />
            <div>
              <p className="text-sm text-muted-foreground mb-2">Dirección actual:</p>
              <p className="font-semibold text-lg text-foreground">
                {usuario?.direccion || 'No hay dirección registrada'}
              </p>
            </div>
          </div>
        </div>

        {/* Formulario para actualizar */}
        <form onSubmit={handleActualizarDireccion} className="space-y-4">
          <div>
            <Label htmlFor="direccion">Nueva dirección de entrega</Label>
            <Input
              id="direccion"
              type="text"
              value={nuevaDireccion}
              onChange={(e) => setNuevaDireccion(e.target.value)}
              placeholder="Calle, número, colonia, ciudad, código postal"
              required
              disabled={loading}
              className="mt-2"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Asegúrate de incluir todos los detalles para una entrega precisa
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading || !nuevaDireccion.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl font-bold text-lg"
          >
            {loading ? 'Actualizando...' : 'Actualizar Dirección'}
          </Button>
        </form>
      </Card>

      {/* Información adicional */}
      <Card className="p-6 bg-blue-50 border-2 border-blue-200">
        <h3 className="font-semibold text-lg mb-3 text-foreground">
          💡 Consejos para tu dirección
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Incluye referencias cercanas (ej: "frente al parque")</li>
          <li>• Especifica el número de departamento o piso si aplica</li>
          <li>• Agrega instrucciones especiales si es necesario</li>
          <li>• Verifica que el código postal sea correcto</li>
        </ul>
      </Card>
    </div>
  );
}
