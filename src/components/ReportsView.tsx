import React, { useMemo, useRef, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
import { Card } from '@/components/ui/card';
import { useShoppingContext } from '@/contexts/ShoppingContext';
import { CATEGORY_LABELS, WASTE_REASON_LABELS } from '@/types/shopping';

const ReportsView: React.FC = () => {
  const { shoppingHistory, wasteReports } = useShoppingContext();

  const stats = useMemo(() => {
    const totalLists = shoppingHistory.length;
    const totalItems = shoppingHistory.reduce((acc, list) => acc + list.items.length, 0);
    const completedItems = shoppingHistory.reduce((acc, list) => 
      acc + list.items.filter(item => item.completed).length, 0
    );
    const wasteItems = wasteReports.length;
    const totalWasteValue = wasteReports.reduce((acc, report) => 
      acc + (report.estimatedValue || 0), 0
    );
    const efficiency = totalItems > 0 ? ((completedItems - wasteItems) / completedItems) * 100 : 0;

    return {
      totalLists,
      totalItems,
      completedItems,
      wasteItems,
      totalWasteValue,
      efficiency: Math.max(0, efficiency),
      savings: Math.max(0, completedItems - wasteItems),
    };
  }, [shoppingHistory, wasteReports]);

  const categoryData = useMemo(() => {
    const categoryCount: Record<string, number> = {};
    const categoryWaste: Record<string, number> = {};

    // Count purchased items by category
    shoppingHistory.forEach(list => {
      list.items.forEach(item => {
        if (item.completed) {
          categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
        }
      });
    });

    // Count waste by category
    wasteReports.forEach(report => {
      categoryWaste[report.category] = (categoryWaste[report.category] || 0) + 1;
    });

    return Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
      category: label,
      purchased: categoryCount[key] || 0,
      wasted: categoryWaste[key] || 0,
      efficiency: categoryCount[key] 
        ? (((categoryCount[key] - (categoryWaste[key] || 0)) / categoryCount[key]) * 100).toFixed(1)
        : '0',
    }));
  }, [shoppingHistory, wasteReports]);

  const wasteReasonData = useMemo(() => {
    const reasonCount: Record<string, number> = {};
    
    wasteReports.forEach(report => {
      reasonCount[report.reason] = (reasonCount[report.reason] || 0) + 1;
    });

    return Object.entries(WASTE_REASON_LABELS).map(([key, label]) => ({
      reason: label,
      count: reasonCount[key] || 0,
      value: wasteReports
        .filter(r => r.reason === key)
        .reduce((acc, r) => acc + (r.estimatedValue || 0), 0),
    })).filter(item => item.count > 0);
  }, [wasteReports]);

  const monthlyData = useMemo(() => {
    const monthlyStats: Record<string, { purchased: number; wasted: number }> = {};

    // Process completed items
    shoppingHistory.forEach(list => {
      if (list.completedAt) {
        const month = list.completedAt.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        if (!monthlyStats[month]) monthlyStats[month] = { purchased: 0, wasted: 0 };
        monthlyStats[month].purchased += list.items.filter(item => item.completed).length;
      }
    });

    // Process waste reports
    wasteReports.forEach(report => {
      const month = report.date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
      if (!monthlyStats[month]) monthlyStats[month] = { purchased: 0, wasted: 0 };
      monthlyStats[month].wasted += 1;
    });

    return Object.entries(monthlyStats)
      .map(([month, data]) => ({
        month,
        purchased: data.purchased,
        wasted: data.wasted,
        efficiency: data.purchased > 0 ? ((data.purchased - data.wasted) / data.purchased * 100).toFixed(1) : '0',
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6); // Last 6 months
  }, [shoppingHistory, wasteReports]);

  const COLORS = ['#4ade80', '#60a5fa', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4'];

  if (stats.totalItems === 0) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <Card className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="mx-auto w-12 h-12 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Sem dados para relatórios</h2>
            <p>Complete algumas listas de compras para ver os relatórios aqui!</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <p className="text-2xl font-bold text-primary">{stats.completedItems}</p>
          <p className="text-sm text-muted-foreground">Itens Comprados</p>
        </Card>

        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <TrendingDown className="w-6 h-6 text-error" />
          </div>
          <p className="text-2xl font-bold text-error">{stats.wasteItems}</p>
          <p className="text-sm text-muted-foreground">Desperdiçados</p>
        </Card>

        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <TrendingUp className="w-6 h-6 text-success" />
          </div>
          <p className="text-2xl font-bold text-success">{stats.efficiency.toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground">Eficiência</p>
        </Card>

        <Card className="p-4 text-center">
          <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <DollarSign className="w-6 h-6 text-warning" />
          </div>
          <p className="text-2xl font-bold text-warning">R$ {stats.totalWasteValue.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">Valor Desperdiçado</p>
        </Card>
      </div>

      {/* Category Analysis */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Análise por Categoria</h3>
        <div className="h-[300px]">
          <Bar
            data={{
              labels: categoryData.map(item => item.category),
              datasets: [
                {
                  label: 'Comprados',
                  data: categoryData.map(item => item.purchased),
                  backgroundColor: '#4ade80',
                  borderRadius: 4,
                },
                {
                  label: 'Desperdiçados',
                  data: categoryData.map(item => item.wasted),
                  backgroundColor: '#ef4444',
                  borderRadius: 4,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </Card>

      {/* Waste Reasons */}
      {wasteReasonData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Motivos do Desperdício</h3>
            <div className="h-[250px]">
              <Pie
                data={{
                  labels: wasteReasonData.map(item => item.reason),
                  datasets: [
                    {
                      data: wasteReasonData.map(item => item.count),
                      backgroundColor: COLORS,
                      borderWidth: 2,
                      borderColor: '#ffffff',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right' as const,
                    },
                  },
                }}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Detalhamento dos Motivos</h3>
            <div className="space-y-3">
              {wasteReasonData.map((item, index) => (
                <div key={item.reason} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{item.reason}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{item.count} itens</p>
                    {item.value > 0 && (
                      <p className="text-sm text-error">R$ {item.value.toFixed(2)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Monthly Trend */}
      {monthlyData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Tendência Mensal</h3>
          <div className="h-[300px]">
            <Bar
              data={{
                labels: monthlyData.map(item => item.month),
                datasets: [
                  {
                    label: 'Comprados',
                    data: monthlyData.map(item => item.purchased),
                    backgroundColor: '#4ade80',
                    borderRadius: 4,
                  },
                  {
                    label: 'Desperdiçados',
                    data: monthlyData.map(item => item.wasted),
                    backgroundColor: '#ef4444',
                    borderRadius: 4,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default ReportsView;