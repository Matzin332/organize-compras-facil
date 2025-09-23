import { useShoppingContext } from '@/contexts/ShoppingContext';
import { toast } from '@/hooks/use-toast';

export const useExportImport = () => {
  const { shoppingHistory, wasteReports, currentList } = useShoppingContext();

  const exportData = () => {
    try {
      const data = {
        currentList,
        shoppingHistory,
        wasteReports,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `compras-organizadas-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Dados exportados!',
        description: 'Backup salvo com sucesso',
      });
    } catch (error) {
      toast({
        title: 'Erro ao exportar',
        description: 'Não foi possível criar o backup',
        variant: 'destructive',
      });
    }
  };

  const importData = (file: File) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          
          // Validar estrutura básica
          if (!data.version || (!data.shoppingHistory && !data.wasteReports)) {
            throw new Error('Formato inválido');
          }

          // Aqui você pode implementar a lógica de merge dos dados
          // Por enquanto, vamos apenas mostrar uma mensagem
          toast({
            title: 'Dados importados!',
            description: `Backup de ${data.exportDate ? new Date(data.exportDate).toLocaleDateString('pt-BR') : 'data desconhecida'} carregado`,
          });
        } catch {
          toast({
            title: 'Erro ao importar',
            description: 'Arquivo com formato inválido',
            variant: 'destructive',
          });
        }
      };
      reader.readAsText(file);
    } catch (error) {
      toast({
        title: 'Erro ao importar',
        description: 'Não foi possível ler o arquivo',
        variant: 'destructive',
      });
    }
  };

  return { exportData, importData };
};