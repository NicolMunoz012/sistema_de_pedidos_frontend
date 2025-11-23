'use client';

import { useState, useEffect } from 'react';
import { itemService } from '@/lib/services/itemService';
import { Item, Categoria } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loading } from '@/components/common/Loading';
import { ItemImage } from '@/components/common/ItemImage';
import { DetalleItem } from './DetalleItem';
import { Search } from 'lucide-react';

interface ListaItemsProps {
  onAddToCart: (item: Item) => void;
}

export function ListaItems({ onAddToCart }: ListaItemsProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(false);

  const categories = [
    { id: 'TODOS', name: 'Todos', icon: '🍽️' },
    { id: Categoria.ENTRADA, name: 'Entradas', icon: '🥗' },
    { id: Categoria.PLATO_PRINCIPAL, name: 'Platos Principales', icon: '🍝' },
    { id: Categoria.POSTRES, name: 'Postres', icon: '🍰' },
    { id: Categoria.BEBIDAS, name: 'Bebidas', icon: '🥤' },
  ];

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      filterItems();
    }
  }, [selectedCategory, items, searchText]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await itemService.getAllItems();
      setItems(data);
      setFilteredItems(data);
      setError('');
    } catch (err) {
      console.error('Error cargando items:', err);
      setError('Error al cargar el menú. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    if (selectedCategory === 'TODOS') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.categoria === selectedCategory));
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchText.trim() === '') {
      filterItems();
      return;
    }

    setSearching(true);
    try {
      const results = await itemService.buscarItems(searchText);
      setFilteredItems(results);
      setSelectedCategory('TODOS');
    } catch (err) {
      console.error('Error buscando items:', err);
      setError('Error al buscar. Intenta de nuevo.');
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchText('');
    filterItems();
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadItems} variant="outline">
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Buscador */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar platillos..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 py-6 text-lg"
              />
            </div>
            <Button 
              type="submit" 
              disabled={searching}
              className="px-8 py-6"
            >
              {searching ? 'Buscando...' : 'Buscar'}
            </Button>
            {searchText && (
              <Button 
                type="button"
                variant="outline"
                onClick={handleClearSearch}
                className="px-6 py-6"
              >
                Limpiar
              </Button>
            )}
          </div>
        </form>

        {/* Category Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 justify-center flex-wrap">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`rounded-full px-6 py-6 text-base font-medium transition-all whitespace-nowrap ${
                selectedCategory === category.id 
                  ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                  : 'hover:bg-primary/5 border-2 border-muted'
              }`}
            >
              <span className="text-2xl mr-2">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card 
              key={item.idItem || item.nombre}
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group border-2 border-orange-100 bg-white"
              onClick={() => setSelectedItem(item)}
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
                <ItemImage
                  src={item.imagen}
                  alt={item.nombre}
                  className="group-hover:scale-110 transition-transform duration-500"
                />
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold shadow-lg">
                  ${item.precio.toFixed(2)}
                </Badge>
                {!item.disponibilidad && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Badge className="bg-red-600 text-white px-4 py-2 text-base font-bold">
                      No Disponible
                    </Badge>
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <h3 className="text-xl font-bold text-foreground mb-2 font-serif">
                  {item.nombre}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {item.descripcion}
                </p>
                
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(item);
                  }}
                  disabled={!item.disponibilidad}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Agregar al Carrito
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchText ? 'No se encontraron resultados' : 'No hay items disponibles en esta categoría'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Detalle */}
      {selectedItem && (
        <DetalleItem
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </>
  );
}
