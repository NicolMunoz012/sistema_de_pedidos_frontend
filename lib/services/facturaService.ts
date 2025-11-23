import api from '../api';
import { Factura } from '../types';

export const facturaService = {
  // Generar factura - ENDPOINT REAL: POST /api/facturas/generar/{codigoPedido}
  generarFactura: async (codigoPedido: number): Promise<Factura> => {
    const response = await api.post(`/facturas/generar/${codigoPedido}`);
    return response.data;
  },

  // Obtener factura - ENDPOINT REAL: GET /api/facturas/{codigoFactura}
  getFactura: async (codigoFactura: number): Promise<Factura> => {
    const response = await api.get(`/facturas/${codigoFactura}`);
    return response.data;
  },

  // Obtener detalle factura - ENDPOINT REAL: GET /api/facturas/{codigoFactura}/detalle
  getDetalleFactura: async (codigoFactura: number): Promise<Factura> => {
    const response = await api.get(`/facturas/${codigoFactura}/detalle`);
    return response.data;
  },

  // Listar todas (admin) - ENDPOINT REAL: GET /api/facturas
  getAllFacturas: async (): Promise<Factura[]> => {
    const response = await api.get('/facturas');
    return response.data;
  },

  // Facturas por usuario - ENDPOINT REAL: GET /api/facturas/usuario/{idUsuario}
  getFacturasByUsuario: async (idUsuario: string): Promise<Factura[]> => {
    const response = await api.get(`/facturas/usuario/${idUsuario}`);
    return response.data;
  },

  // Filtrar por rango de fechas - ENDPOINT REAL: GET /api/facturas/rango?fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD
  getFacturasByRango: async (fechaInicio: string, fechaFin: string): Promise<Factura[]> => {
    const response = await api.get(`/facturas/rango?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
    return response.data;
  }
};
