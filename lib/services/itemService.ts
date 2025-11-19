import api from '../api';
import { Item, Categoria } from '../types';

export const itemService = {
  // Listar todos los items
  getAllItems: async (): Promise<Item[]> => {
    const response = await api.get('/items');
    return response.data;
  },

  // Obtener item por nombre
  getItemByName: async (nombre: string): Promise<Item> => {
    const response = await api.get(`/items/${nombre}`);
    return response.data;
  },

  // Filtrar por categoría
  getItemsByCategoria: async (categoria: Categoria): Promise<Item[]> => {
    const response = await api.get(`/items/categoria/${categoria}`);
    return response.data;
  },

  // Crear item (admin)
  createItem: async (itemData: Item): Promise<Item> => {
    const response = await api.post('/items', itemData);
    return response.data;
  },

  // Actualizar item (admin)
  updateItem: async (nombre: string, itemData: Partial<Item>): Promise<Item> => {
    const response = await api.put(`/items/${nombre}`, itemData);
    return response.data;
  },

  // Eliminar item (admin)
  deleteItem: async (nombre: string): Promise<void> => {
    await api.delete(`/items/${nombre}`);
  },

  // Cambiar disponibilidad (admin)
  toggleDisponibilidad: async (nombre: string, disponibilidad: boolean): Promise<Item> => {
    const response = await api.put(`/items/${nombre}/disponibilidad`, { disponibilidad });
    return response.data;
  }
};
