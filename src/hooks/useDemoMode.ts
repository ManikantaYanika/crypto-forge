import { useState, useEffect, useCallback } from 'react';
import type { PriceTicker, AccountBalance, Position, Order } from './useBinance';

// Demo data that simulates realistic trading data
const DEMO_PRICES: PriceTicker[] = [
  { symbol: 'BTCUSDT', price: 104250.50, priceChange: 1250.30, priceChangePercent: 1.21, high24h: 105500, low24h: 102800, volume24h: 28500000000 },
  { symbol: 'ETHUSDT', price: 3890.25, priceChange: -45.80, priceChangePercent: -1.16, high24h: 3980, low24h: 3850, volume24h: 12400000000 },
  { symbol: 'SOLUSDT', price: 178.45, priceChange: 5.23, priceChangePercent: 3.02, high24h: 182, low24h: 171, volume24h: 3200000000 },
  { symbol: 'BNBUSDT', price: 715.80, priceChange: 12.40, priceChangePercent: 1.76, high24h: 725, low24h: 698, volume24h: 890000000 },
  { symbol: 'XRPUSDT', price: 2.45, priceChange: 0.08, priceChangePercent: 3.38, high24h: 2.52, low24h: 2.35, volume24h: 2100000000 },
  { symbol: 'DOGEUSDT', price: 0.4125, priceChange: -0.0085, priceChangePercent: -2.02, high24h: 0.428, low24h: 0.405, volume24h: 1850000000 },
];

const DEMO_BALANCE: AccountBalance = {
  totalBalance: 25000.00,
  availableBalance: 18500.00,
  marginBalance: 6500.00,
  unrealizedPnl: 342.50,
};

const DEMO_POSITIONS: Position[] = [
  { id: 'pos1', symbol: 'BTCUSDT', side: 'LONG', size: 0.05, entryPrice: 103500, markPrice: 104250.50, unrealizedPnl: 37.53, leverage: 10 },
  { id: 'pos2', symbol: 'ETHUSDT', side: 'SHORT', size: 1.5, entryPrice: 3920, markPrice: 3890.25, unrealizedPnl: 44.63, leverage: 5 },
  { id: 'pos3', symbol: 'SOLUSDT', side: 'LONG', size: 25, entryPrice: 172.80, markPrice: 178.45, unrealizedPnl: 141.25, leverage: 20 },
];

const DEMO_ORDERS: Order[] = [
  { id: '1', orderId: 'ORD001', symbol: 'BTCUSDT', side: 'BUY', type: 'LIMIT', quantity: 0.02, price: 102000, status: 'OPEN', filledQuantity: 0, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', orderId: 'ORD002', symbol: 'ETHUSDT', side: 'SELL', type: 'MARKET', quantity: 0.5, price: null, status: 'FILLED', filledQuantity: 0.5, createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: '3', orderId: 'ORD003', symbol: 'SOLUSDT', side: 'BUY', type: 'LIMIT', quantity: 10, price: 175, status: 'FILLED', filledQuantity: 10, createdAt: new Date(Date.now() - 14400000).toISOString() },
  { id: '4', orderId: 'ORD004', symbol: 'BNBUSDT', side: 'SELL', type: 'STOP_LIMIT', quantity: 2, price: 700, status: 'OPEN', filledQuantity: 0, createdAt: new Date(Date.now() - 21600000).toISOString() },
  { id: '5', orderId: 'ORD005', symbol: 'XRPUSDT', side: 'BUY', type: 'MARKET', quantity: 500, price: null, status: 'FILLED', filledQuantity: 500, createdAt: new Date(Date.now() - 28800000).toISOString() },
];

// Simulate price fluctuations
function simulatePriceChange(price: number): number {
  const change = (Math.random() - 0.5) * 0.002; // ±0.1% max change
  return price * (1 + change);
}

export function useDemoMode() {
  const [prices, setPrices] = useState<PriceTicker[]>(DEMO_PRICES);
  const [balance, setBalance] = useState<AccountBalance>(DEMO_BALANCE);
  const [positions, setPositions] = useState<Position[]>(DEMO_POSITIONS);
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(ticker => {
        const newPrice = simulatePriceChange(ticker.price);
        const priceChange = newPrice - (ticker.price - ticker.priceChange);
        const priceChangePercent = (priceChange / (ticker.price - ticker.priceChange)) * 100;
        return {
          ...ticker,
          price: Math.round(newPrice * 100) / 100,
          priceChange: Math.round(priceChange * 100) / 100,
          priceChangePercent: Math.round(priceChangePercent * 100) / 100,
        };
      }));

      // Update positions mark prices and PnL
      setPositions(prev => prev.map(pos => {
        const priceData = prices.find(p => p.symbol === pos.symbol);
        if (priceData) {
          const markPrice = simulatePriceChange(priceData.price);
          const pnlMultiplier = pos.side === 'LONG' ? 1 : -1;
          const unrealizedPnl = (markPrice - pos.entryPrice) * pos.size * pnlMultiplier;
          return {
            ...pos,
            markPrice: Math.round(markPrice * 100) / 100,
            unrealizedPnl: Math.round(unrealizedPnl * 100) / 100,
          };
        }
        return pos;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [prices]);

  const placeOrder = useCallback(async (
    symbol: string,
    side: 'BUY' | 'SELL',
    type: 'MARKET' | 'LIMIT' | 'STOP_LIMIT',
    quantity: number,
    price?: number
  ) => {
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newOrder: Order = {
      id: `demo-${Date.now()}`,
      orderId: `DEMO${Date.now().toString().slice(-6)}`,
      symbol,
      side,
      type,
      quantity,
      price: price || null,
      status: type === 'MARKET' ? 'FILLED' : 'OPEN',
      filledQuantity: type === 'MARKET' ? quantity : 0,
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    setIsLoading(false);
    
    return { orderId: newOrder.orderId, status: newOrder.status };
  }, []);

  const cancelOrder = useCallback(async (symbol: string, orderId: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setOrders(prev => prev.map(o => 
      o.orderId === orderId ? { ...o, status: 'CANCELED' } : o
    ));
    setIsLoading(false);
  }, []);

  const refreshPrices = useCallback(async () => {
    // Prices auto-update via interval
  }, []);

  const refreshAccount = useCallback(async () => {
    // Account data is static in demo mode
  }, []);

  const refreshOrders = useCallback(async () => {
    // Orders are managed locally in demo mode
  }, []);

  return {
    prices,
    balance,
    positions,
    orders,
    isLoading,
    isConnected: true, // Always connected in demo mode
    isDemoMode: true,
    placeOrder,
    cancelOrder,
    refreshPrices,
    refreshAccount,
    refreshOrders,
  };
}
