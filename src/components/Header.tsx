import React, { useRef } from 'react';
import { ShoppingCart, BarChart3, History, AlertTriangle, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useExportImport } from '@/hooks/useExportImport';
import { cn } from '@/lib/utils';

export type ViewType = 'shopping' | 'reports' | 'history' | 'waste';

interface HeaderProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, onViewChange }) => {
  const { exportData, importData } = useExportImport();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importData(file).then(() => {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }).catch(() => {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      });
    }
  };

  const navItems = [
    { id: 'shopping' as const, label: 'Compras', icon: ShoppingCart },
    { id: 'history' as const, label: 'Histórico', icon: History },
    { id: 'reports' as const, label: 'Relatórios', icon: BarChart3 },
    { id: 'waste' as const, label: 'Desperdício', icon: AlertTriangle },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Compras Organizadas
            </h1>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:block">{item.label}</span>
                </button>
              );
            })}
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="hidden md:flex items-center space-x-1"
            >
              <Upload className="w-4 h-4" />
              <span>Importar</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={exportData}
              className="hidden md:flex items-center space-x-1"
            >
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </Button>
            
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;