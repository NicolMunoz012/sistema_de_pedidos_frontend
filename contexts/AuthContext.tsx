'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario } from '@/lib/types';
import { authService } from '@/lib/services/authService';

interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  login: (gmail: string, contraseña: string) => Promise<void>;
  registro: (usuarioData: Usuario) => Promise<void>;
  logout: () => void;
  updateUsuario: (usuarioData: Partial<Usuario>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Recuperar usuario del localStorage al cargar
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (error) {
        console.error('[v0] Error al parsear usuario guardado:', error);
        localStorage.removeItem('usuario');
      }
    }
    setLoading(false);
  }, []);

  const login = async (gmail: string, contraseña: string) => {
    try {
      const usuarioData = await authService.login(gmail, contraseña);
      setUsuario(usuarioData);
      localStorage.setItem('usuario', JSON.stringify(usuarioData));
    } catch (error) {
      console.error('[v0] Error en login:', error);
      throw error;
    }
  };

  const registro = async (usuarioData: Usuario) => {
    try {
      const nuevoUsuario = await authService.registro(usuarioData);
      setUsuario(nuevoUsuario);
      localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
    } catch (error) {
      console.error('[v0] Error en registro:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (usuario?.idUsuario) {
      try {
        await authService.logout(usuario.idUsuario);
      } catch (error) {
        console.error('[v0] Error en logout:', error);
      }
    }
    setUsuario(null);
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
  };

  const updateUsuario = async (usuarioData: Partial<Usuario>) => {
    if (!usuario?.idUsuario) return;
    
    try {
      const usuarioActualizado = await authService.updateUsuario(usuario.idUsuario, usuarioData);
      setUsuario(usuarioActualizado);
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
    } catch (error) {
      console.error('[v0] Error al actualizar usuario:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, login, registro, logout, updateUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};
