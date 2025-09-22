import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ItemCategory, CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/shopping';
import { useShoppingContext } from '@/contexts/ShoppingContext';
import { cn } from '@/lib/utils';

const AddItemForm: React.FC = () => {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('fruits');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const { addItem } = useShoppingContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    addItem({
      name: itemName.trim(),
      category,
      quantity: quantity ? parseFloat(quantity) : undefined,
      unit: unit.trim() || undefined,
    });

    setItemName('');
    setQuantity('');
    setUnit('');
  };

  const categories = Object.entries(CATEGORY_LABELS) as [ItemCategory, string][];

  return (
    <Card className="p-6 animate-fade-in-up">
      <h2 className="text-2xl font-semibold mb-6 text-center">Adicionar Item</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="itemName" className="block text-sm font-medium mb-2">
            Nome do Item
          </label>
          <Input
            id="itemName"
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Ex: Maçã, Leite, Arroz..."
            className="w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Categoria
          </label>
          <Select value={category} onValueChange={(value: ItemCategory) => setCategory(value)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{CATEGORY_ICONS[key]}</span>
                    <span>{label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium mb-2">
              Quantidade (opcional)
            </label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="1"
              min="0"
              step="0.1"
            />
          </div>
          <div>
            <label htmlFor="unit" className="block text-sm font-medium mb-2">
              Unidade (opcional)
            </label>
            <Input
              id="unit"
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="kg, litros, unid..."
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar à Lista
        </Button>
      </form>
    </Card>
  );
};

export default AddItemForm;