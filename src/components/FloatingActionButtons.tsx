import React from 'react';
import { Plus, BarChart3, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewType } from '@/components/Header';
import { useShoppingContext } from '@/contexts/ShoppingContext';

interface FloatingActionButtonsProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  activeView,
  onViewChange,
}) => {
  const { currentList } = useShoppingContext();

  if (activeView === 'shopping' || activeView === 'reports') {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-40">
      <Button
        onClick={() => onViewChange('reports')}
        className="fab fab-secondary flex items-center justify-center"
        size="lg"
      >
        <BarChart3 className="w-6 h-6" />
      </Button>

      <Button
        onClick={() => onViewChange('shopping')}
        className="fab fab-primary flex items-center justify-center"
        size="lg"
      >
        <ListChecks className="w-6 h-6" />
      </Button>
    </div>
  );
};

export default FloatingActionButtons;