import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useBinance, type PriceTicker, type AccountBalance, type Position, type Order } from './useBinance';
import { useDemoMode } from './useDemoMode';

const DEMO_MODE_KEY = 'trading_demo_mode';

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

// Hook to determine which data source to use
export function useTradingData(): TradingContextType {
  const [isDemoMode, setIsDemoMode] = useState(() => {
    // Check localStorage for demo mode preference, default to true
    const stored = localStorage.getItem(DEMO_MODE_KEY);
    return stored === null ? true : stored === 'true';
  });

  const binanceData = useBinance();
  const demoData = useDemoMode();

  const setDemoMode = useCallback((enabled: boolean) => {
    localStorage.setItem(DEMO_MODE_KEY, String(enabled));
    setIsDemoMode(enabled);
  }, []);

  // Auto-enable demo mode if Binance connection fails repeatedly
  useEffect(() => {
    if (!isDemoMode && !binanceData.isConnected && binanceData.prices.length === 0) {
      // If not in demo mode and Binance isn't connected, suggest demo mode
      const timeout = setTimeout(() => {
        if (!binanceData.isConnected) {
          setDemoMode(true);
        }
      }, 10000); // Wait 10 seconds before auto-switching

      return () => clearTimeout(timeout);
    }
  }, [isDemoMode, binanceData.isConnected, binanceData.prices.length, setDemoMode]);

  if (isDemoMode) {
    return {
      ...demoData,
      isDemoMode: true,
      setDemoMode,
    };
  }

  return {
    ...binanceData,
    isDemoMode: false,
    setDemoMode,
  };
}

// Re-export types for convenience
export type { PriceTicker, AccountBalance, Position, Order };
