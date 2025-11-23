import api from '../api';
import { Item, Categoria } from '../types';

export const itemService = {
  // Listar todos los items - ENDPOINT REAL: GET /items
  getAllItems: async (): Promise<Item[]> => {
    const response = await api.get('/items');
    return response.data;
  },

  // Obtener item por ID - ENDPOINT REAL: GET /items/{idItem}
  getItemById: async (idItem: string): Promise<Item> => {
    const response = await api.get(`/items/${idItem}`);
    return response.data;
  },

  // Filtrar por categoría - ENDPOINT REAL: GET /items/categoria/{categoria}
  getItemsByCategoria: async (categoria: Categoria): Promise<Item[]> => {
    const response = await api.get(`/items/categoria/${categoria}`);
    return response.data;
  },

  // Buscar items - ENDPOINT REAL: GET /items/buscar?textoBusqueda=x
  buscarItems: async (textoBusqueda: string): Promise<Item[]> => {
    const response = await api.get(`/items/buscar?textoBusqueda=${encodeURIComponent(textoBusqueda)}`);
    return response.data;
  },

  // Crear item (admin) - ENDPOINT REAL: POST /items
  createItem: async (itemData: Item): Promise<Item> => {
    const response = await api.post('/items', itemData);
    return response.data;
  },

  // Actualizar item (admin) - ENDPOINT REAL: PUT /items/{idItem}
  updateItem: async (idItem: string, itemData: Item): Promise<Item> => {
    const response = await api.put(`/items/${idItem}`, itemData);
    return response.data;
  },

  // Eliminar item (admin) - ENDPOINT REAL: DELETE /items/{idItem}
  deleteItem: async (idItem: string): Promise<void> => {
    await api.delete(`/items/${idItem}`);
  },

  // Cambiar disponibilidad (admin) - ENDPOINT REAL: PATCH /items/{idItem}/disponibilidad
  toggleDisponibilidad: async (idItem: string, disponible: boolean): Promise<Item> => {
    const response = await api.patch(`/items/${idItem}/disponibilidad`, { disponible });
    return response.data;
  }
};
