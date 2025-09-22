import React from 'react';
import { Plus, CheckCircle, BarChart3, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useShoppingContext } from '@/contexts/ShoppingContext';
import { cn } from '@/lib/utils';

interface FloatingActionButtonsProps {
  currentView: 'home' | 'list' | 'history' | 'reports' | 'waste';
  onViewChange: (view: 'home' | 'list' | 'history' | 'reports' | 'waste') => void;
  onAddItem?: () => void;
}

const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  currentView,
  onViewChange,
  onAddItem,
}) => {
  const { currentList, completeList, startNewList } = useShoppingContext();

  const handleCompleteList = () => {
    if (currentList && currentList.items.length > 0) {
      completeList();
      onViewChange('history');
    }
  };

  const handleNewList = () => {
    startNewList();
    onViewChange('list');
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-40">
      {/* Primary FAB - Context dependent */}
      {currentView === 'home' && !currentList && (
        <Button
          onClick={handleNewList}
          className="fab fab-primary flex items-center justify-center"
          size="lg"
        >
          <ShoppingCart className="w-6 h-6" />
        </Button>
      )}

      {currentView === 'home' && currentList && (
        <Button
          onClick={() => onViewChange('list')}
          className="fab fab-primary flex items-center justify-center"
          size="lg"
        >
          <ShoppingCart className="w-6 h-6" />
        </Button>
      )}

      {currentView === 'list' && (
        <Button
          onClick={onAddItem}
          className="fab fab-primary flex items-center justify-center"
          size="lg"
        >
          <Plus className="w-6 h-6" />
        </Button>
      )}

      {/* Secondary FABs */}
      {currentView === 'list' && currentList && currentList.items.length > 0 && (
        <Button
          onClick={handleCompleteList}
          className="fab fab-secondary flex items-center justify-center"
          size="lg"
          disabled={currentList.items.filter(item => !item.completed).length > 0}
        >
          <CheckCircle className="w-5 h-5" />
        </Button>
      )}

      {(currentView === 'home' || currentView === 'list') && (
        <Button
          onClick={() => onViewChange('reports')}
          className={cn(
            "fab flex items-center justify-center bg-gradient-to-br from-accent to-accent-light text-accent-foreground hover:scale-110 active:scale-95 transition-all duration-300",
            "w-12 h-12 shadow-md"
          )}
          size="sm"
        >
          <BarChart3 className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default FloatingActionButtons;