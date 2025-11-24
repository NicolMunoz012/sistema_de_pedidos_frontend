'use client';

import { useState, useEffect } from 'react';
import { itemService } from '@/lib/services/itemService';
import { Item, Categoria } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/common/Loading';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function AdministrarMenu() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState<Item>({
    nombre: '',
    categoria: Categoria.PLATO_PRINCIPAL,
    descripcion: '',
    precio: 0,
    disponibilidad: true,
    imagen: ''
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await itemService.getAllItems();
      setItems(data);
      setError('');
    } catch (err) {
      console.error('[v0] Error cargando items:', err);
      setError('Error al cargar el menú');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item?: Item) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
      setSelectedImage(null);
      setImagePreview(item.imagen || '');
    } else {
      setEditingItem(null);
      setFormData({
        nombre: '',
        categoria: Categoria.PLATO_PRINCIPAL,
        descripcion: '',
        precio: 0,
        disponibilidad: true,
        imagen: ''
      });
      setSelectedImage(null);
      setImagePreview('');
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setSelectedImage(null);
    setImagePreview('');
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño de archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es demasiado grande. Máximo 5MB.');
        return;
      }

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido.');
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData({ ...formData, imagen: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingItem && editingItem.idItem) {
        await itemService.updateItem(editingItem.idItem, formData);
      } else {
        await itemService.createItem(formData);
      }

      handleCloseDialog();
      loadItems();
    } catch (err: any) {
      console.error('Error guardando item:', err);
      alert(err.response?.data?.message || 'Error al guardar el item');
    }
  };

  const handleToggleDisponibilidad = async (idItem: string, disponibilidad: boolean) => {
    try {
      await itemService.toggleDisponibilidad(idItem, !disponibilidad);
      loadItems();
    } catch (err) {
      console.error('Error actualizando disponibilidad:', err);
      alert('Error al actualizar la disponibilidad');
    }
  };

  const handleDelete = async (idItem: string, nombre: string) => {
    if (!confirm(`¿Estás seguro de eliminar ${nombre}?`)) return;

    try {
      await itemService.deleteItem(idItem);
      loadItems();
    } catch (err) {
      console.error('Error eliminando item:', err);
      alert('Error al eliminar el item');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-serif text-2xl font-bold text-foreground">
              Administrar Menú
            </h3>
            <p className="text-muted-foreground">
              {items.length} items en el menú
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => handleOpenDialog()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Agregar Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-2xl">
                  {editingItem ? 'Editar Item' : 'Nuevo Item'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre</label>
                  <Input
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                    disabled={!!editingItem}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Categoría</label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) => setFormData({ ...formData, categoria: value as Categoria })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Categoria.ENTRADA}>Entrada</SelectItem>
                      <SelectItem value={Categoria.PLATO_PRINCIPAL}>Plato Principal</SelectItem>
                      <SelectItem value={Categoria.POSTRES}>Postre</SelectItem>
                      <SelectItem value={Categoria.BEBIDAS}>Bebida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descripción</label>
                  <Textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    required
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Precio</label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Imagen del Producto</label>
                  <div className="space-y-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    {imagePreview && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-lg border"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Imagen seleccionada</p>
                          <p className="text-xs text-muted-foreground">
                            {selectedImage ? `${selectedImage.name} (${(selectedImage.size / 1024).toFixed(1)} KB)` : 'Imagen existente'}
                          </p>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Selecciona una imagen para el producto. Si no se proporciona, se usará una imagen por defecto.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="disponibilidad"
                    checked={formData.disponibilidad}
                    onChange={(e) => setFormData({ ...formData, disponibilidad: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="disponibilidad" className="text-sm font-medium">
                    Disponible
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                    {editingItem ? 'Actualizar' : 'Crear'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCloseDialog} className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      {/* Lista de Items */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.idItem || item.nombre} className="p-6 bg-white border-2 border-orange-100">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-serif text-xl font-bold text-foreground">
                {item.nombre}
              </h4>
              <Badge className="bg-primary text-primary-foreground px-3 py-1">
                ${item.precio.toFixed(2)}
              </Badge>
            </div>

            <Badge variant="outline" className="mb-3">
              {item.categoria.replace('_', ' ')}
            </Badge>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {item.descripcion}
            </p>

            <div className="flex items-center gap-2 mb-4">
              <Badge className={item.disponibilidad ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {item.disponibilidad ? 'Disponible' : 'No Disponible'}
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenDialog(item)}
                className="flex-1"
                disabled={!item.idItem}
              >
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => item.idItem && handleToggleDisponibilidad(item.idItem, item.disponibilidad)}
                className="flex-1"
                disabled={!item.idItem}
              >
                {item.disponibilidad ? 'Desactivar' : 'Activar'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => item.idItem && handleDelete(item.idItem, item.nombre)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={!item.idItem}
              >
                Eliminar
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
