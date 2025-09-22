import React, { useState } from 'react';
import { AlertTriangle, Trash2, Clock, DollarSign } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useShoppingContext } from '@/contexts/ShoppingContext';
import { ItemCategory, WasteReason, CATEGORY_LABELS, WASTE_REASON_LABELS, CATEGORY_ICONS } from '@/types/shopping';
import { cn } from '@/lib/utils';

const WasteQuestionnaire: React.FC = () => {
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('fruits');
  const [reason, setReason] = useState<WasteReason>('spoiled');
  const [quantity, setQuantity] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('');
  const { addWasteReport, wasteReports } = useShoppingContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    addWasteReport({
      itemName: itemName.trim(),
      category,
      reason,
      quantity: quantity ? parseFloat(quantity) : undefined,
      estimatedValue: estimatedValue ? parseFloat(estimatedValue) : undefined,
    });

    // Reset form
    setItemName('');
    setQuantity('');
    setEstimatedValue('');
  };

  const getReasonColor = (reason: WasteReason) => {
    const colorMap: Record<WasteReason, string> = {
      spoiled: 'error',
      bought_too_much: 'warning',
      forgot_to_use: 'muted',
      expired: 'info',
    };
    return colorMap[reason];
  };

  const getReasonIcon = (reason: WasteReason) => {
    const iconMap: Record<WasteReason, React.ReactNode> = {
      spoiled: <AlertTriangle className="w-5 h-5" />,
      bought_too_much: <DollarSign className="w-5 h-5" />,
      forgot_to_use: <Clock className="w-5 h-5" />,
      expired: <Trash2 className="w-5 h-5" />,
    };
    return iconMap[reason];
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">Questionário de Desperdício</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="wasteItemName" className="block text-sm font-medium mb-2">
              Nome do Item Desperdiçado
            </label>
            <Input
              id="wasteItemName"
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Ex: Tomate, Leite, Pão..."
              className="w-full"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="wasteCategory" className="block text-sm font-medium mb-2">
                Categoria
              </label>
              <Select value={category} onValueChange={(value: ItemCategory) => setCategory(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{CATEGORY_ICONS[key as ItemCategory]}</span>
                        <span>{label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="wasteReason" className="block text-sm font-medium mb-2">
                Motivo do Desperdício
              </label>
              <Select value={reason} onValueChange={(value: WasteReason) => setReason(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(WASTE_REASON_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center space-x-2">
                        <div className={cn(
                          "w-4 h-4 rounded-full",
                          key === 'spoiled' && "bg-error",
                          key === 'bought_too_much' && "bg-warning",
                          key === 'forgot_to_use' && "bg-muted-foreground",
                          key === 'expired' && "bg-info"
                        )} />
                        <span>{label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="wasteQuantity" className="block text-sm font-medium mb-2">
                Quantidade (opcional)
              </label>
              <Input
                id="wasteQuantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label htmlFor="wasteValue" className="block text-sm font-medium mb-2">
                Valor Estimado (R$)
              </label>
              <Input
                id="wasteValue"
                type="number"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                placeholder="10.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <Button
            type="submit"
            className={cn(
              "w-full",
              reason === 'spoiled' && "bg-error hover:bg-error/90",
              reason === 'bought_too_much' && "bg-warning hover:bg-warning/90 text-warning-foreground",
              reason === 'forgot_to_use' && "bg-muted-foreground hover:bg-muted-foreground/90",
              reason === 'expired' && "bg-info hover:bg-info/90"
            )}
            size="lg"
          >
            {getReasonIcon(reason)}
            <span className="ml-2">Reportar Desperdício</span>
          </Button>
        </form>
      </Card>

      {/* Recent Waste Reports */}
      {wasteReports.length > 0 && (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Relatórios Recentes</h3>
          <div className="space-y-3">
            {wasteReports.slice(0, 5).map((report) => (
              <div
                key={report.id}
                className={cn(
                  "p-4 rounded-lg border-l-4",
                  report.reason === 'spoiled' && "border-l-error bg-error/5",
                  report.reason === 'bought_too_much' && "border-l-warning bg-warning/5",
                  report.reason === 'forgot_to_use' && "border-l-muted-foreground bg-muted/20",
                  report.reason === 'expired' && "border-l-info bg-info/5"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{CATEGORY_ICONS[report.category]}</span>
                    <h4 className="font-medium">{report.itemName}</h4>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {report.date.toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {WASTE_REASON_LABELS[report.reason]}
                  </span>
                  {report.estimatedValue && (
                    <span className="font-medium text-error">
                      R$ {report.estimatedValue.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {wasteReports.length > 5 && (
            <p className="text-center text-sm text-muted-foreground mt-4">
              E mais {wasteReports.length - 5} relatórios...
            </p>
          )}
        </Card>
      )}
    </div>
  );
};

export default WasteQuestionnaire;