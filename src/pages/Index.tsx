import React, { useState } from 'react';
import { ShoppingBag, TrendingUp, Clock, Sparkles, Trash2 } from 'lucide-react';
import { CATEGORY_ICONS } from '@/types/shopping';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Header from '@/components/Header';
import AddItemForm from '@/components/AddItemForm';
import ShoppingListView from '@/components/ShoppingListView';
import FloatingActionButtons from '@/components/FloatingActionButtons';
import WasteQuestionnaire from '@/components/WasteQuestionnaire';
import ReportsView from '@/components/ReportsView';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useShoppingContext } from '@/contexts/ShoppingContext';

type ViewType = 'home' | 'list' | 'history' | 'reports' | 'waste';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [showAddForm, setShowAddForm] = useState(false);
  const { currentList, shoppingHistory, wasteReports, startNewList, clearHistory } = useShoppingContext();

  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    setShowAddForm(false);
  };

  const handleAddItem = () => {
    setShowAddForm(true);
  };

  // Calculate stats
  const totalLists = shoppingHistory.length;
  const totalItems = shoppingHistory.reduce((acc, list) => acc + list.items.length, 0);
  const wasteItems = wasteReports.length;
  const savings = Math.max(0, totalItems - wasteItems);

  const renderHomeView = () => (
    <div className="space-y-6 animate-fade-in-up">
      {/* Hero Section */}
      <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-none">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Compras Organizadas</h1>
          <p className="text-muted-foreground mb-6">
            Gerencie suas compras de forma inteligente e reduza o desperdício
          </p>
          
          {!currentList ? (
            <Button
              onClick={() => {
                startNewList();
                setCurrentView('list');
              }}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              size="lg"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Criar Nova Lista
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentView('list')}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              size="lg"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Continuar Lista ({currentList.items.length} itens)
            </Button>
          )}
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </div>
          <p className="text-2xl font-bold text-primary">{totalLists}</p>
          <p className="text-sm text-muted-foreground">Listas Criadas</p>
        </Card>
        
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Clock className="w-6 h-6 text-secondary" />
          </div>
          <p className="text-2xl font-bold text-secondary">{totalItems}</p>
          <p className="text-sm text-muted-foreground">Itens Comprados</p>
        </Card>
        
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-6 h-6 text-error" />
          </div>
          <p className="text-2xl font-bold text-error">{wasteItems}</p>
          <p className="text-sm text-muted-foreground">Itens Desperdiçados</p>
        </Card>
        
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-6 h-6 text-success" />
          </div>
          <p className="text-2xl font-bold text-success">{savings}</p>
          <p className="text-sm text-muted-foreground">Itens Aproveitados</p>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentView('history')}
            className="h-20 flex-col space-y-2"
          >
            <Clock className="w-6 h-6" />
            <span>Ver Histórico</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setCurrentView('reports')}
            className="h-20 flex-col space-y-2"
          >
            <TrendingUp className="w-6 h-6" />
            <span>Relatórios</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setCurrentView('waste')}
            className="h-20 flex-col space-y-2"
          >
            <Sparkles className="w-6 h-6" />
            <span>Avaliar Desperdício</span>
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderListView = () => (
    <div className="space-y-6">
      {showAddForm ? (
        <div>
          <Button
            variant="ghost"
            onClick={() => setShowAddForm(false)}
            className="mb-4"
          >
            ← Voltar para Lista
          </Button>
          <AddItemForm />
        </div>
      ) : (
        <ShoppingListView onAddItem={handleAddItem} />
      )}
    </div>
  );

  const renderHistoryView = () => (
    <div className="space-y-6 animate-fade-in-up">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Histórico de Compras</h2>
          {shoppingHistory.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar Histórico
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar Limpeza</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja limpar todo o histórico de compras? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={clearHistory}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Limpar Histórico
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        {shoppingHistory.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="mx-auto w-12 h-12 mb-4" />
            <p>Nenhuma lista finalizada ainda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {shoppingHistory.map((list) => (
              <Card key={list.id} className="p-4 border-l-4 border-l-primary">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{list.name}</h3>
                  <span className="text-sm text-muted-foreground">
                    {list.completedAt?.toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {list.items.length} itens • 
                  {list.items.filter(item => item.completed).length} concluídos
                </p>
                
                {/* Items bought */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Itens Comprados:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {list.items.filter(item => item.completed).map((item) => (
                      <div key={item.id} className="flex items-center space-x-2 p-2 bg-muted/30 rounded-md">
                        <span className="text-sm">{CATEGORY_ICONS[item.category]}</span>
                        <span className="text-sm">{item.name}</span>
                        {item.quantity && (
                          <span className="text-xs text-muted-foreground">({item.quantity})</span>
                        )}
                      </div>
                    ))}
                  </div>
                  {list.items.filter(item => item.completed).length === 0 && (
                    <p className="text-xs text-muted-foreground italic">Nenhum item foi marcado como comprado</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );

  const renderReportsView = () => (
    <ReportsView />
  );

  const renderWasteView = () => (
    <WasteQuestionnaire />
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return renderHomeView();
      case 'list':
        return renderListView();
      case 'history':
        return renderHistoryView();
      case 'reports':
        return renderReportsView();
      case 'waste':
        return renderWasteView();
      default:
        return renderHomeView();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentView={currentView} onViewChange={handleViewChange} />
      
      <main className="container mx-auto px-4 pt-20 pb-24">
        {renderCurrentView()}
      </main>

      <FloatingActionButtons
        currentView={currentView}
        onViewChange={handleViewChange}
        onAddItem={handleAddItem}
      />

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Compras Organizadas v1.0 • Desenvolvido com ❤️ para reduzir desperdícios</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;