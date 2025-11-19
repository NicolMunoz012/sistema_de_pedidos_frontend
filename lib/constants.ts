export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export enum Categoria {
  ENTRADA = 'ENTRADA',
  PLATO_PRINCIPAL = 'PLATO_PRINCIPAL',
  POSTRES = 'POSTRES',
  BEBIDAS = 'BEBIDAS'
}

export enum Estado {
  PENDIENTE = 'PENDIENTE',
  EN_PROCESO = 'EN_PROCESO',
  PREPARADO = 'PREPARADO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO'
}

export const ESTADO_COLORS: Record<Estado, string> = {
  [Estado.PENDIENTE]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [Estado.EN_PROCESO]: 'bg-blue-100 text-blue-800 border-blue-200',
  [Estado.PREPARADO]: 'bg-purple-100 text-purple-800 border-purple-200',
  [Estado.ENTREGADO]: 'bg-green-100 text-green-800 border-green-200',
  [Estado.CANCELADO]: 'bg-red-100 text-red-800 border-red-200'
};

export const ESTADO_LABELS: Record<Estado, string> = {
  [Estado.PENDIENTE]: 'Pendiente',
  [Estado.EN_PROCESO]: 'En Proceso',
  [Estado.PREPARADO]: 'Preparado',
  [Estado.ENTREGADO]: 'Entregado',
  [Estado.CANCELADO]: 'Cancelado'
};
