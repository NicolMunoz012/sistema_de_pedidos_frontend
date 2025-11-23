'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authService } from '@/lib/services/authService';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { useToast } from '@/hooks/use-toast';
import { User, Lock, MapPin } from 'lucide-react';

export default function PerfilPage() {
  const { usuario, updateUsuario, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Formulario de perfil
  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || '',
    gmail: usuario?.gmail || '',
    direccion: usuario?.direccion || ''
  });

  // Formulario de cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    contraseñaAntigua: '',
    contraseñaNueva: '',
    confirmarContraseña: ''
  });

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!usuario) {
    router.push('/login');
    return null;
  }

  const handleUpdatePerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUsuario({
        ...usuario,
        ...formData
      });
      
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

  const handleCambiarContraseña = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.contraseñaNueva !== passwordData.confirmarContraseña) {
      toast({
        title: 'Error',
        description: 'Las contraseñas no coinciden',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.contraseñaNueva.length < 6) {
      toast({
        title: 'Error',
        description: 'La contraseña debe tener al menos 6 caracteres',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      await authService.cambiarContraseña(
        usuario.idUsuario!,
        passwordData.contraseñaAntigua,
        passwordData.contraseñaNueva
      );
      
      toast({
        title: 'Contraseña actualizada',
        description: 'Tu contraseña se ha cambiado correctamente',
      });

      setPasswordData({
        contraseñaAntigua: '',
        contraseñaNueva: '',
        confirmarContraseña: ''
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Error al cambiar la contraseña',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl text-white font-bold">
            {usuario.nombre.charAt(0).toUpperCase()}
          </div>
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
            Mi Perfil
          </h1>
          <p className="text-muted-foreground">
            Gestiona tu información personal
          </p>
        </div>

        <Tabs defaultValue="perfil" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="perfil" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Información Personal
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Cambiar Contraseña
            </TabsTrigger>
          </TabsList>

          <TabsContent value="perfil">
            <Card className="p-8 bg-white border-2 border-orange-100">
              <form onSubmit={handleUpdatePerfil} className="space-y-6">
                <div>
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <Input
                    id="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    disabled={loading}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="gmail">Correo electrónico</Label>
                  <Input
                    id="gmail"
                    type="email"
                    value={formData.gmail}
                    onChange={(e) => setFormData({ ...formData, gmail: e.target.value })}
                    required
                    disabled={loading}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="direccion" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Dirección de entrega
                  </Label>
                  <Input
                    id="direccion"
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
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
                  <p>ID de Usuario: {usuario.idUsuario}</p>
                  <p>Miembro desde: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card className="p-8 bg-white border-2 border-orange-100">
              <form onSubmit={handleCambiarContraseña} className="space-y-6">
                <div>
                  <Label htmlFor="contraseñaAntigua">Contraseña actual</Label>
                  <Input
                    id="contraseñaAntigua"
                    type="password"
                    value={passwordData.contraseñaAntigua}
                    onChange={(e) => setPasswordData({ ...passwordData, contraseñaAntigua: e.target.value })}
                    required
                    disabled={loading}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="contraseñaNueva">Nueva contraseña</Label>
                  <Input
                    id="contraseñaNueva"
                    type="password"
                    value={passwordData.contraseñaNueva}
                    onChange={(e) => setPasswordData({ ...passwordData, contraseñaNueva: e.target.value })}
                    required
                    disabled={loading}
                    className="mt-2"
                    minLength={6}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Mínimo 6 caracteres
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmarContraseña">Confirmar nueva contraseña</Label>
                  <Input
                    id="confirmarContraseña"
                    type="password"
                    value={passwordData.confirmarContraseña}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmarContraseña: e.target.value })}
                    required
                    disabled={loading}
                    className="mt-2"
                    minLength={6}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl font-bold text-lg"
                >
                  {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">💡 Consejos de seguridad</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Usa una contraseña única y segura</li>
                  <li>• Combina letras, números y símbolos</li>
                  <li>• No compartas tu contraseña con nadie</li>
                </ul>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
