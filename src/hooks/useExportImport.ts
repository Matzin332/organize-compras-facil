import { useCallback } from 'react';
import { useShoppingContext } from '@/contexts/ShoppingContext';
import { useToast } from '@/hooks/use-toast';

export const useExportImport = () => {
  const { currentList, shoppingHistory, wasteReports, loadData } = useShoppingContext();
  const { toast } = useToast();

  const exportData = useCallback(() => {
    try {
      const data = {
        currentList,
        shoppingHistory,
        wasteReports,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `compras-organizadas-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Dados exportados!",
        description: "Seu histórico foi salvo com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados.",
        variant: "destructive",
      });
    }
  }, [currentList, shoppingHistory, wasteReports, toast]);

  const importData = useCallback((file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonString = e.target?.result as string;
          const data = JSON.parse(jsonString);
          
          // Validate data structure
          if (!data.shoppingHistory && !data.wasteReports) {
            throw new Error('Formato de arquivo inválido');
          }

          // Process dates
          if (data.currentList?.createdAt) {
            data.currentList.createdAt = new Date(data.currentList.createdAt);
            data.currentList.items = data.currentList.items?.map((item: any) => ({
              ...item,
              createdAt: new Date(item.createdAt),
              completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
            })) || [];
          }

          data.shoppingHistory = data.shoppingHistory?.map((list: any) => ({
            ...list,
            createdAt: new Date(list.createdAt),
            completedAt: list.completedAt ? new Date(list.completedAt) : undefined,
            items: list.items?.map((item: any) => ({
              ...item,
              createdAt: new Date(item.createdAt),
              completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
            })) || [],
          })) || [];

          data.wasteReports = data.wasteReports?.map((report: any) => ({
            ...report,
            date: new Date(report.date),
          })) || [];

          loadData(data);
          resolve(data);

          toast({
            title: "Dados importados!",
            description: "Seu histórico foi restaurado com sucesso.",
          });
        } catch (error) {
          console.error('Erro ao importar dados:', error);
          toast({
            title: "Erro na importação",
            description: "Arquivo inválido ou corrompido.",
            variant: "destructive",
          });
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  }, [toast, loadData]);

  return { exportData, importData };
};