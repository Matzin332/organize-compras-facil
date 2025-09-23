import React from 'react';
import { TrendingUp, PieChart, AlertTriangle, Leaf, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useShoppingContext } from '@/contexts/ShoppingContext';
import { CATEGORY_LABELS, WASTE_REASON_LABELS } from '@/types/shopping';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import ExportImportButtons from '@/components/ExportImportButtons';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ReportsView = () => {
  const { wasteReports, shoppingHistory } = useShoppingContext();

  const totalWaste = wasteReports.length;
  const totalValue = wasteReports.reduce((acc, report) => acc + (report.estimatedValue || 0), 0);
  const totalItems = shoppingHistory.reduce((acc, list) => acc + list.items.length, 0);
  const wastePercentage = totalItems > 0 ? Math.round((totalWaste / totalItems) * 100) : 0;

  // Preparar dados para gráficos
  const wasteByCategory = wasteReports.reduce((acc, report) => {
    acc[report.category] = (acc[report.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const wasteByReason = wasteReports.reduce((acc, report) => {
    acc[report.reason] = (acc[report.reason] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryChartData = {
    labels: Object.keys(wasteByCategory).map(key => CATEGORY_LABELS[key as keyof typeof CATEGORY_LABELS]),
    datasets: [
      {
        data: Object.values(wasteByCategory),
        backgroundColor: [
          'hsl(350, 70%, 60%)',
          'hsl(120, 60%, 45%)',
          'hsl(200, 80%, 65%)',
          'hsl(15, 80%, 55%)',
          'hsl(45, 70%, 60%)',
          'hsl(280, 60%, 55%)',
          'hsl(190, 70%, 50%)',
          'hsl(300, 50%, 60%)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const reasonChartData = {
    labels: Object.keys(wasteByReason).map(key => WASTE_REASON_LABELS[key as keyof typeof WASTE_REASON_LABELS]),
    datasets: [
      {
        data: Object.values(wasteByReason),
        backgroundColor: [
          'hsl(0, 70%, 55%)',
          'hsl(45, 90%, 60%)',
          'hsl(210, 15%, 55%)',
          'hsl(280, 60%, 55%)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  // Principais itens desperdiçados
  const wasteItemsCount = wasteReports.reduce((acc, report) => {
    acc[report.itemName] = (acc[report.itemName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topWastedItems = Object.entries(wasteItemsCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([item]) => item);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Relatórios de Desperdício</h2>
          <ExportImportButtons />
        </div>

        {wasteReports.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="mx-auto w-12 h-12 mb-4" />
            <p>Nenhum desperdício registrado ainda</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <p className="text-2xl font-bold text-primary">{totalWaste}</p>
              <p className="text-sm text-muted-foreground">Itens Desperdiçados</p>
            </Card>
            
            <Card className="p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <PieChart className="w-6 h-6 text-error" />
              </div>
              <p className="text-2xl font-bold text-error">R$ {totalValue.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Valor Perdido</p>
            </Card>
            
            <Card className="p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
              <p className="text-2xl font-bold text-warning">{wastePercentage}%</p>
              <p className="text-sm text-muted-foreground">Taxa de Desperdício</p>
            </Card>
            
            <Card className="p-4 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Leaf className="w-6 h-6 text-success" />
              </div>
              <p className="text-2xl font-bold text-success">{totalItems - totalWaste}</p>
              <p className="text-sm text-muted-foreground">Itens Aproveitados</p>
            </Card>
          </div>
        )}

        {/* Gráficos */}
        {wasteReports.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Desperdício por Categoria</h3>
              <div className="h-64">
                <Pie data={categoryChartData} options={chartOptions} />
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Motivos do Desperdício</h3>
              <div className="h-64">
                <Pie data={reasonChartData} options={chartOptions} />
              </div>
            </Card>
          </div>
        )}

        {/* Key Insights */}
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-none">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-medium">Insight do Mês</h3>
          </div>
          <p className="text-muted-foreground">
            {totalWaste > 0 
              ? `Você desperdiçou ${totalWaste} ${totalWaste === 1 ? 'item' : 'itens'} este mês${
                  topWastedItems.length > 0 
                    ? ` (${topWastedItems.join(', ')} foram os mais afetados)` 
                    : ''
                }. ${
                  wastePercentage > 10 
                    ? 'Considere planejar melhor suas compras para reduzir o desperdício.' 
                    : 'Parabéns! Você está mantendo um baixo nível de desperdício.'
                }`
              : 'Parabéns! Você não registrou nenhum desperdício este mês.'
            }
          </p>
        </Card>
      </Card>
    </div>
  );
};

export default ReportsView;