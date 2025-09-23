import React from 'react';
import { Check, X, ShoppingBag, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useShoppingContext } from '@/contexts/ShoppingContext';
import { CATEGORY_LABELS, CATEGORY_ICONS } from '@/types/shopping';
import { cn } from '@/lib/utils';

const ShoppingListView: React.FC = () => {
  const { currentList, toggleItem, removeItem, completeList } = useShoppingContext();

  if (!currentList || currentList.items.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in-up">
        <Package className="mx-auto w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Lista Vazia</h3>
        <p className="text-muted-foreground">
          Adicione alguns itens para começar suas compras organizadas!
        </p>
      </div>
    );
  }

  const completedItems = currentList.items.filter(item => item.completed);
  const pendingItems = currentList.items.filter(item => !item.completed);
  const progress = (completedItems.length / currentList.items.length) * 100;

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      fruits: 'category-fruits',
      vegetables: 'category-vegetables',
      dairy: 'category-dairy',
      meat: 'category-meat',
      grains: 'category-grains',
      beverages: 'category-beverages',
      cleaning: 'category-cleaning',
      personal: 'category-personal',
    };
    return colorMap[category] || 'category-fruits';
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Progress Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Lista Atual</h2>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Progresso</p>
            <p className="text-lg font-semibold">
              {completedItems.length}/{currentList.items.length}
            </p>
          </div>
        </div>
        
        <div className="w-full bg-muted rounded-full h-3 mb-4">
          <div
            className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {progress === 100 && (
          <Button
            onClick={completeList}
            className="w-full bg-gradient-to-r from-success to-primary hover:from-success/90 hover:to-primary/90"
            size="lg"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Finalizar Lista
          </Button>
        )}
      </Card>

      {/* Pending Items */}
      {pendingItems.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-muted-foreground">
            Itens Pendentes ({pendingItems.length})
          </h3>
          <div className="grid gap-3">
            {pendingItems.map((item) => (
              <Card
                key={item.id}
                className={cn(
                  "p-4 transition-all duration-300 hover:scale-[1.02] cursor-pointer border-l-4",
                  `border-l-categories-${item.category}`
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleItem(item.id)}
                  className="w-8 h-8 border-2 border-muted-foreground rounded-full flex items-center justify-center hover:border-primary transition-all duration-300 hover:scale-110 animate-pulse-soft"
                >
                  {item.completed && <Check className="w-5 h-5 text-primary" />}
                </button>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{CATEGORY_ICONS[item.category]}</span>
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {CATEGORY_LABELS[item.category]}
                          {item.quantity && item.unit && ` • ${item.quantity} ${item.unit}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-error hover:text-error hover:bg-error/10 hover:scale-110 transition-all duration-300 hover:rotate-12"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Items */}
      {completedItems.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-muted-foreground">
            Itens Concluídos ({completedItems.length})
          </h3>
          <div className="grid gap-3">
            {completedItems.map((item) => (
              <Card
                key={item.id}
                className="p-4 bg-muted/50 opacity-75 border-l-4 border-l-success animate-fade-in"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className="w-8 h-8 bg-success border-2 border-success rounded-full flex items-center justify-center hover:bg-success/90 transition-colors"
                    >
                      <Check className="w-5 h-5 text-success-foreground" />
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xl opacity-50">{CATEGORY_ICONS[item.category]}</span>
                      <div>
                        <h4 className="font-medium line-through text-muted-foreground">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {CATEGORY_LABELS[item.category]}
                          {item.quantity && item.unit && ` • ${item.quantity} ${item.unit}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-error hover:text-error hover:bg-error/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListView;