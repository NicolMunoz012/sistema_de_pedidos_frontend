import api from '../api';
import { Usuario } from '../types';

export const usuarioService = {
  // Registrar usuario
  registro: async (usuarioData: Usuario): Promise<Usuario> => {
    const response = await api.post('/usuarios/registro', usuarioData);
    return response.data;
  },

  // Iniciar sesión
  login: async (gmail: string, contraseña: string): Promise<Usuario> => {
    const response = await api.post('/usuarios/login', { gmail, contraseña });
    return response.data;
  },

  // Recuperar contraseña
  recuperar: async (gmail: string): Promise<any> => {
    const response = await api.post('/usuarios/recuperar', { gmail });
    return response.data;
  },

  // Obtener usuario
  getUsuario: async (id: string): Promise<Usuario> => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  // Actualizar usuario
  updateUsuario: async (id: string, usuarioData: Partial<Usuario>): Promise<Usuario> => {
    const response = await api.put(`/usuarios/${id}`, usuarioData);
    return response.data;
  },

  // Actualizar dirección
  updateDireccion: async (id: string, direccion: string): Promise<Usuario> => {
    const response = await api.put(`/usuarios/${id}/direccion`, { direccion });
    return response.data;
  },

  // Cerrar sesión / eliminar
  deleteUsuario: async (id: string): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
  }
};
