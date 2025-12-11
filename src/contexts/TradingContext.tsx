import { createContext, useContext, ReactNode } from 'react';
import { useTradingData, type PriceTicker, type AccountBalance, type Position, type Order } from '@/hooks/useTradingData';

interface TradingContextType {
  prices: PriceTicker[];
  balance: AccountBalance | null;
  positions: Position[];
  orders: Order[];
  isLoading: boolean;
  isConnected: boolean;
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  placeOrder: (
    symbol: string,
    side: 'BUY' | 'SELL',
    type: 'MARKET' | 'LIMIT' | 'STOP_LIMIT',
    quantity: number,
    price?: number,
    stopPrice?: number
  ) => Promise<any>;
  cancelOrder: (symbol: string, orderId: string) => Promise<void>;
  refreshPrices: () => Promise<void>;
  refreshAccount: () => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const TradingContext = createContext<TradingContextType | null>(null);

export function TradingProvider({ children }: { children: ReactNode }) {
  const tradingData = useTradingData();

  return (
    <TradingContext.Provider value={tradingData}>
      {children}
    </TradingContext.Provider>
  );
}

export function useTradingContext() {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTradingContext must be used within a TradingProvider');
  }
  return context;
}

// Re-export types
export type { PriceTicker, AccountBalance, Position, Order };
