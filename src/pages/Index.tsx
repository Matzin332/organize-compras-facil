import React, { useState } from 'react';
import Header, { ViewType } from '@/components/Header';
import AddItemForm from '@/components/AddItemForm';
import ShoppingListView from '@/components/ShoppingListView';
import ReportsView from '@/components/ReportsView';
import WasteQuestionnaire from '@/components/WasteQuestionnaire';
import FloatingActionButtons from '@/components/FloatingActionButtons';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { useShoppingContext } from '@/contexts/ShoppingContext';

const Index = () => {
  const [activeView, setActiveView] = useState<ViewType>('shopping');
  const { shoppingHistory } = useShoppingContext();

  const renderHistoryView = () => {
    if (shoppingHistory.length === 0) {
      return (
        <div className="text-center py-12 animate-fade-in-up">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            📋
          </div>
          <h3 className="text-xl font-semibold mb-2">Nenhum histórico ainda</h3>
          <p className="text-muted-foreground">
            Complete algumas listas de compras para ver o histórico aqui!
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4 animate-fade-in-up">
        <h2 className="text-2xl font-semibold mb-6">Histórico de Compras</h2>
        {shoppingHistory.map((list) => (
          <Card key={list.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{list.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Concluída em {list.completedAt?.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Itens</p>
                <p className="text-xl font-semibold text-primary">
                  {list.items.filter(item => item.completed).length}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {list.items.filter(item => item.completed).map((item) => (
                <div key={item.id} className="text-sm p-2 bg-muted/30 rounded">
                  <span className="mr-2">📦</span>
                  {item.name}
                  {item.quantity && item.unit && (
                    <span className="text-muted-foreground ml-1">
                      ({item.quantity} {item.unit})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case 'shopping':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AddItemForm />
            <ShoppingListView />
          </div>
        );
      case 'reports':
        return <ReportsView />;
      case 'history':
        return renderHistoryView();
      case 'waste':
        return <WasteQuestionnaire />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header activeView={activeView} onViewChange={setActiveView} />
      
      <main className="container mx-auto px-4 py-8" style={{ paddingTop: 'calc(var(--header-height) + 2rem)' }}>
        {renderContent()}
      </main>

      <FloatingActionButtons activeView={activeView} onViewChange={setActiveView} />
      <Footer />
    </div>
  );
};

export default Index;