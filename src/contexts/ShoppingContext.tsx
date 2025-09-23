import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ShoppingList, ShoppingItem, WasteReport, ItemCategory, WasteReason } from '@/types/shopping';

interface ShoppingState {
  currentList: ShoppingList | null;
  shoppingHistory: ShoppingList[];
  wasteReports: WasteReport[];
  loading: boolean;
}

type ShoppingAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CURRENT_LIST'; payload: ShoppingList | null }
  | { type: 'ADD_ITEM'; payload: Omit<ShoppingItem, 'id' | 'createdAt' | 'completed'> }
  | { type: 'TOGGLE_ITEM'; payload: string }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'COMPLETE_LIST' }
  | { type: 'START_NEW_LIST'; payload?: string }
  | { type: 'ADD_WASTE_REPORT'; payload: Omit<WasteReport, 'id' | 'date'> }
  | { type: 'LOAD_DATA'; payload: Partial<ShoppingState> };

const initialState: ShoppingState = {
  currentList: null,
  shoppingHistory: [],
  wasteReports: [],
  loading: false,
};

const shoppingReducer = (state: ShoppingState, action: ShoppingAction): ShoppingState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_CURRENT_LIST':
      return { ...state, currentList: action.payload };

    case 'ADD_ITEM':
      if (!state.currentList) {
        const newList: ShoppingList = {
          id: Date.now().toString(),
          name: 'Lista de Compras',
          items: [],
          createdAt: new Date(),
          isActive: true,
        };
        return {
          ...state,
          currentList: {
            ...newList,
            items: [{
              id: Date.now().toString(),
              ...action.payload,
              completed: false,
              createdAt: new Date(),
            }],
          },
        };
      }

      return {
        ...state,
        currentList: {
          ...state.currentList,
          items: [
            ...state.currentList.items,
            {
              id: Date.now().toString(),
              ...action.payload,
              completed: false,
              createdAt: new Date(),
            },
          ],
        },
      };

    case 'TOGGLE_ITEM':
      if (!state.currentList) return state;
      
      return {
        ...state,
        currentList: {
          ...state.currentList,
          items: state.currentList.items.map((item) =>
            item.id === action.payload
              ? {
                  ...item,
                  completed: !item.completed,
                  completedAt: !item.completed ? new Date() : undefined,
                }
              : item
          ),
        },
      };

    case 'REMOVE_ITEM':
      if (!state.currentList) return state;
      
      return {
        ...state,
        currentList: {
          ...state.currentList,
          items: state.currentList.items.filter((item) => item.id !== action.payload),
        },
      };

    case 'COMPLETE_LIST':
      if (!state.currentList) return state;
      
      const completedList = {
        ...state.currentList,
        completedAt: new Date(),
        isActive: false,
      };

      return {
        ...state,
        currentList: null,
        shoppingHistory: [completedList, ...state.shoppingHistory],
      };

    case 'START_NEW_LIST':
      return {
        ...state,
        currentList: {
          id: Date.now().toString(),
          name: action.payload || 'Nova Lista',
          items: [],
          createdAt: new Date(),
          isActive: true,
        },
      };

    case 'ADD_WASTE_REPORT':
      return {
        ...state,
        wasteReports: [
          {
            id: Date.now().toString(),
            ...action.payload,
            date: new Date(),
          },
          ...state.wasteReports,
        ],
      };

    case 'LOAD_DATA':
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

interface ShoppingContextType extends ShoppingState {
  addItem: (item: Omit<ShoppingItem, 'id' | 'createdAt' | 'completed'>) => void;
  toggleItem: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  completeList: () => void;
  startNewList: (name?: string) => void;
  addWasteReport: (report: Omit<WasteReport, 'id' | 'date'>) => void;
}

const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined);

export const useShoppingContext = () => {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error('useShoppingContext must be used within a ShoppingProvider');
  }
  return context;
};

const STORAGE_KEY = 'compras-organizadas-data';

export const ShoppingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(shoppingReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Convert date strings back to Date objects
        if (parsedData.currentList) {
          parsedData.currentList.createdAt = new Date(parsedData.currentList.createdAt);
          parsedData.currentList.items = parsedData.currentList.items.map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
          }));
        }
        parsedData.shoppingHistory = parsedData.shoppingHistory?.map((list: any) => ({
          ...list,
          createdAt: new Date(list.createdAt),
          completedAt: list.completedAt ? new Date(list.completedAt) : undefined,
          items: list.items.map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt),
            completedAt: item.completedAt ? new Date(item.completedAt) : undefined,
          })),
        })) || [];
        parsedData.wasteReports = parsedData.wasteReports?.map((report: any) => ({
          ...report,
          date: new Date(report.date),
        })) || [];
        
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [state]);

  const addItem = (item: Omit<ShoppingItem, 'id' | 'createdAt' | 'completed'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const toggleItem = (itemId: string) => {
    dispatch({ type: 'TOGGLE_ITEM', payload: itemId });
  };

  const removeItem = (itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  };

  const completeList = () => {
    dispatch({ type: 'COMPLETE_LIST' });
  };

  const startNewList = (name?: string) => {
    dispatch({ type: 'START_NEW_LIST', payload: name });
  };

  const addWasteReport = (report: Omit<WasteReport, 'id' | 'date'>) => {
    dispatch({ type: 'ADD_WASTE_REPORT', payload: report });
  };

  const contextValue: ShoppingContextType = {
    ...state,
    addItem,
    toggleItem,
    removeItem,
    completeList,
    startNewList,
    addWasteReport,
  };

  return (
    <ShoppingContext.Provider value={contextValue}>
      {children}
    </ShoppingContext.Provider>
  );
};