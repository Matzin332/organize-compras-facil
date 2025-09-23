import React from 'react';
import { Home, ShoppingBag, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';

type ViewType = 'home' | 'list' | 'history' | 'reports' | 'waste';

interface HeaderProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Header = ({ currentView, onViewChange }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => onViewChange('home')}
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Compras Organizadas
            </h1>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant={currentView === 'home' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('home')}
              >
                <Home className="w-4 h-4 mr-2" />
                Início
              </Button>

              <Button
                variant={currentView === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('list')}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Lista
              </Button>

              <Button
                variant={currentView === 'history' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('history')}
              >
                <Clock className="w-4 h-4 mr-2" />
                Histórico
              </Button>

              <Button
                variant={currentView === 'reports' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('reports')}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Relatórios
              </Button>

              <Button
                variant={currentView === 'waste' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('waste')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Desperdício
              </Button>
            </div>
            
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;