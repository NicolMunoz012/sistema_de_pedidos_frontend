import api from '../api';
import { Pedido, Estado } from '../types';

export const pedidoService = {
  // Crear pedido
  createPedido: async (pedidoData: Partial<Pedido>): Promise<Pedido> => {
    const response = await api.post('/pedidos', pedidoData);
    return response.data;
  },

  // Obtener pedido
  getPedido: async (codigoPedido: number): Promise<Pedido> => {
    const response = await api.get(`/pedidos/${codigoPedido}`);
    return response.data;
  },

  // Listar todos los pedidos (admin)
  getAllPedidos: async (): Promise<Pedido[]> => {
    const response = await api.get('/pedidos');
    return response.data;
  },

  // Pedidos por usuario
  getPedidosByUsuario: async (idUsuario: string): Promise<Pedido[]> => {
    const response = await api.get(`/pedidos/usuario/${idUsuario}`);
    return response.data;
  },

  // Pedidos por estado (admin)
  getPedidosByEstado: async (estado: Estado): Promise<Pedido[]> => {
    const response = await api.get(`/pedidos/estado/${estado}`);
    return response.data;
  },

  // Actualizar estado (admin)
  updateEstado: async (codigoPedido: number, estado: Estado): Promise<Pedido> => {
    const response = await api.put(`/pedidos/${codigoPedido}/estado`, { estado });
    return response.data;
  },

  // Agregar item al pedido
  addItem: async (codigoPedido: number, itemData: any): Promise<Pedido> => {
    const response = await api.post(`/pedidos/${codigoPedido}/items`, itemData);
    return response.data;
  },

  // Eliminar item del pedido
  removeItem: async (codigoPedido: number, nombreItem: string): Promise<Pedido> => {
    const response = await api.delete(`/pedidos/${codigoPedido}/items/${nombreItem}`);
    return response.data;
  },

  // Confirmar pedido
  confirmarPedido: async (codigoPedido: number): Promise<Pedido> => {
    const response = await api.put(`/pedidos/${codigoPedido}/confirmar`);
    return response.data;
  },

  // Cancelar pedido
  cancelarPedido: async (codigoPedido: number): Promise<void> => {
    await api.delete(`/pedidos/${codigoPedido}`);
  }
};
