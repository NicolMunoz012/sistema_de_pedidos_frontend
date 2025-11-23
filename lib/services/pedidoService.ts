import api from '../api';
import { Pedido, Estado } from '../types';

export const pedidoService = {
  // Crear pedido - ENDPOINT REAL: POST /api/pedidos
  createPedido: async (pedidoData: Partial<Pedido>): Promise<Pedido> => {
    const response = await api.post('/pedidos', pedidoData);
    return response.data;
  },

  // Obtener pedido - ENDPOINT REAL: GET /api/pedidos/{codigoPedido}
  getPedido: async (codigoPedido: number): Promise<Pedido> => {
    const response = await api.get(`/pedidos/${codigoPedido}`);
    return response.data;
  },

  // Listar todos los pedidos (admin) - ENDPOINT REAL: GET /api/pedidos/todos
  getAllPedidos: async (): Promise<Pedido[]> => {
    const response = await api.get('/pedidos/todos');
    return response.data;
  },

  // Pedidos activos (admin) - ENDPOINT: GET /api/pedidos/activos
  getPedidosActivos: async (): Promise<Pedido[]> => {
    const response = await api.get('/pedidos/activos');
    return response.data;
  },

  // Historial de pedidos (admin) - ENDPOINT: GET /api/pedidos/historial
  getHistorialPedidos: async (): Promise<Pedido[]> => {
    const response = await api.get('/pedidos/historial');
    return response.data;
  },

  // Pedidos por usuario - ENDPOINT REAL: GET /api/pedidos/por-usuario/{idUsuario}
  getPedidosByUsuario: async (idUsuario: string): Promise<Pedido[]> => {
    const response = await api.get(`/pedidos/por-usuario/${idUsuario}`);
    return response.data;
  },

  // Pedidos por estado (admin) - ENDPOINT REAL: GET /api/pedidos/por-estado/{estado}
  getPedidosByEstado: async (estado: Estado): Promise<Pedido[]> => {
    const response = await api.get(`/pedidos/por-estado/${estado}`);
    return response.data;
  },

  // Calcular total - ENDPOINT REAL: GET /api/pedidos/{codigoPedido}/total
  calcularTotal: async (codigoPedido: number): Promise<number> => {
    const response = await api.get(`/pedidos/${codigoPedido}/total`);
    return response.data;
  },

  // Cambiar estado (admin) - ENDPOINT REAL: PATCH /api/pedidos/{codigoPedido}/estado
  updateEstado: async (codigoPedido: number, nuevoEstado: Estado): Promise<Pedido> => {
    const response = await api.patch(`/pedidos/${codigoPedido}/estado`, { estado: nuevoEstado });
    return response.data;
  },

  // Agregar item al pedido - ENDPOINT REAL: POST /api/pedidos/{codigoPedido}/items?idItem=X&cantidad=Y&observaciones=Z
  addItem: async (
    codigoPedido: number, 
    idItem: string, 
    cantidad: number, 
    observaciones?: string
  ): Promise<Pedido> => {
    let url = `/pedidos/${codigoPedido}/items?idItem=${idItem}&cantidad=${cantidad}`;
    if (observaciones) {
      url += `&observaciones=${encodeURIComponent(observaciones)}`;
    }
    const response = await api.post(url);
    return response.data;
  },

  // Eliminar item del pedido - ENDPOINT REAL: DELETE /api/pedidos/{codigoPedido}/items/{idDetalle}
  removeItem: async (codigoPedido: number, idDetalle: number): Promise<Pedido> => {
    const response = await api.delete(`/pedidos/${codigoPedido}/items/${idDetalle}`);
    return response.data;
  },

  // Actualizar cantidad - ENDPOINT REAL: PUT /api/pedidos/{codigoPedido}/items/{idDetalle}?cantidad=X
  updateCantidad: async (codigoPedido: number, idDetalle: number, cantidad: number): Promise<Pedido> => {
    const response = await api.put(`/pedidos/${codigoPedido}/items/${idDetalle}?cantidad=${cantidad}`);
    return response.data;
  },

  // Cancelar pedido - ENDPOINT REAL: DELETE /api/pedidos/{codigoPedido}/cancelar
  cancelarPedido: async (codigoPedido: number): Promise<void> => {
    await api.delete(`/pedidos/${codigoPedido}/cancelar`);
  }
};
