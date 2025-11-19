import api from '../api';
import { Factura } from '../types';

export const facturaService = {
  // Generar factura
  generarFactura: async (codigoPedido: number): Promise<Factura> => {
    const response = await api.post(`/facturas/generar/${codigoPedido}`);
    return response.data;
  },

  // Obtener factura
  getFactura: async (codigoFactura: number): Promise<Factura> => {
    const response = await api.get(`/facturas/${codigoFactura}`);
    return response.data;
  },

  // Listar facturas
  getAllFacturas: async (): Promise<Factura[]> => {
    const response = await api.get('/facturas');
    return response.data;
  },

  // Facturas por usuario
  getFacturasByUsuario: async (idUsuario: string): Promise<Factura[]> => {
    const response = await api.get(`/facturas/usuario/${idUsuario}`);
    return response.data;
  }
};
