export type ItemCategory = 
  | 'fruits' 
  | 'vegetables' 
  | 'dairy' 
  | 'meat' 
  | 'grains' 
  | 'beverages' 
  | 'cleaning' 
  | 'personal';

export type WasteReason = 'spoiled' | 'bought_too_much' | 'forgot_to_use' | 'expired';

export interface ShoppingItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity?: number;
  unit?: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: Date;
  completedAt?: Date;
  isActive: boolean;
}

export interface WasteReport {
  id: string;
  itemName: string;
  category: ItemCategory;
  reason: WasteReason;
  quantity?: number;
  estimatedValue?: number;
  date: Date;
}

export interface WasteStats {
  totalItems: number;
  totalValue: number;
  byCategory: Record<ItemCategory, number>;
  byReason: Record<WasteReason, number>;
  monthlyTrend: Array<{
    month: string;
    items: number;
    value: number;
  }>;
}

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  fruits: 'Frutas',
  vegetables: 'Vegetais',
  dairy: 'Laticínios',
  meat: 'Carnes',
  grains: 'Grãos',
  beverages: 'Bebidas',
  cleaning: 'Limpeza',
  personal: 'Higiene'
};

export const WASTE_REASON_LABELS: Record<WasteReason, string> = {
  spoiled: 'Estragou',
  bought_too_much: 'Comprei demais',
  forgot_to_use: 'Esqueci de usar',
  expired: 'Venceu'
};

export const CATEGORY_ICONS: Record<ItemCategory, string> = {
  fruits: '🍎',
  vegetables: '🥕',
  dairy: '🥛',
  meat: '🥩',
  grains: '🌾',
  beverages: '🥤',
  cleaning: '🧽',
  personal: '🧴'
};