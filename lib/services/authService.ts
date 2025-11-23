import api from '../api';
import { Usuario } from '../types';

export const authService = {
  // Registrar usuario
  registro: async (usuarioData: Usuario) => {
    const response = await api.post('/usuarios/registro', usuarioData);
    return response.data;
  },

  // Iniciar sesión - ENDPOINT REAL: POST /login?gmail=x&contraseña=x
  login: async (gmail: string, contraseña: string) => {
    const response = await api.post(`/usuarios/login?gmail=${encodeURIComponent(gmail)}&contraseña=${encodeURIComponent(contraseña)}`);
    return response.data;
  },

  // Recuperar contraseña - ENDPOINT REAL: POST /recuperar?gmail=x
  recuperar: async (gmail: string) => {
    const response = await api.post(`/usuarios/recuperar?gmail=${encodeURIComponent(gmail)}`);
    return response.data;
  },

  // Cerrar sesión - ENDPOINT REAL: POST /logout/{idUsuario}
  logout: async (idUsuario: string) => {
    const response = await api.post(`/usuarios/logout/${idUsuario}`);
    return response.data;
  },

  // Obtener usuario
  getUsuario: async (id: string) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  },

  // Actualizar usuario
  updateUsuario: async (id: string, usuarioData: Usuario) => {
    const response = await api.put(`/usuarios/${id}`, usuarioData);
    return response.data;
  },

  // Cambiar contraseña - ENDPOINT REAL: PUT /{idUsuario}/cambiar-contraseña?contraseñaAntigua=X&contraseñaNueva=Y
  cambiarContraseña: async (idUsuario: string, contraseñaAntigua: string, contraseñaNueva: string) => {
    const response = await api.put(
      `/usuarios/${idUsuario}/cambiar-contraseña?contraseñaAntigua=${encodeURIComponent(contraseñaAntigua)}&contraseñaNueva=${encodeURIComponent(contraseñaNueva)}`
    );
    return response.data;
  }
};
