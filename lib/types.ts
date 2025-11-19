import { Categoria, Estado } from './constants';

export interface Usuario {
  idUsuario?: string;
  nombre: string;
  gmail: string;
  contraseña: string;
  direccion: string;
}

export interface Item {
  nombre: string;
  categoria: Categoria;
  descripcion: string;
  precio: number;
  disponibilidad: boolean;
}

export interface DetallePedido {
  idDetalle?: number;
  codigoPedido?: number;
  item: Item;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  observaciones: string;
}

export interface Pedido {
  codigoPedido?: number;
  usuario: Usuario;
  fecha: Date;
  estado: Estado;
  detalles: DetallePedido[];
}

export interface Factura {
  codigoFactura: number;
  fechaEmision: Date;
  montoTotal: number;
  metodoPago: string;
}

export { Categoria, Estado } from './constants';
