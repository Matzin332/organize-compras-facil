import React from 'react';
import { Heart, Code, Coffee } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-16 py-8 border-t border-border bg-muted/20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <span className="text-sm text-muted-foreground">Feito com</span>
          <Heart className="w-4 h-4 text-error fill-current animate-pulse" />
          <span className="text-sm text-muted-foreground">e</span>
          <Coffee className="w-4 h-4 text-warning" />
          <span className="text-sm text-muted-foreground">pela equipe</span>
          <Code className="w-4 h-4 text-primary" />
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          <div className="text-sm text-muted-foreground">
            <p><strong>Compras Organizadas</strong> v1.0.0</p>
            <p>PWA para gestão inteligente de compras</p>
          </div>
          
          <div className="text-sm text-muted-foreground text-center sm:text-right">
            <p>Desenvolvido por: <span className="font-semibold text-primary">Grupo TechSmart</span></p>
            <p className="text-xs">Projeto de Desenvolvimento Web Avançado</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Compras Organizadas. 
            Reduzindo desperdício, organizando o futuro. 🌱
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;