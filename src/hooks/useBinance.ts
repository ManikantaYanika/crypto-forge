import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Re-export types for use across the app
export interface PriceTicker {
  symbol: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  high24h: number;
  low24h: number;
  volume24h: number;
}

export interface AccountBalance {
  totalBalance: number;
  availableBalance: number;
  marginBalance: number;
  unrealizedPnl: number;
}

export interface Position {
  id: string;
  symbol: string;
  side: 'LONG' | 'SHORT';
  size: number;
  entryPrice: number;
  markPrice: number;
  unrealizedPnl: number;
  leverage: number;
}

export interface Order {
  id: string;
  orderId: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  type: string;
  quantity: number;
  price: number | null;
  status: string;
  filledQuantity: number;
  createdAt: string;
}

export function useBinance() {
  const [prices, setPrices] = useState<PriceTicker[]>([]);
  const [balance, setBalance] = useState<AccountBalance | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const fetchPrices = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('binance-prices', {
        body: { symbols: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'DOGEUSDT'] },
      });

      if (error) throw error;
      if (data?.success) {
        setPrices(data.data);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Failed to fetch prices:', error);
    }
  }, []);

  const fetchAccount = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('binance-trade', {
        body: { action: 'get_account' },
      });

      if (error) throw error;
      
      if (data?.success && data.data) {
        const usdtAsset = data.data.assets?.find((a: any) => a.asset === 'USDT');
        if (usdtAsset) {
          setBalance({
            totalBalance: parseFloat(usdtAsset.walletBalance),
            availableBalance: parseFloat(usdtAsset.availableBalance),
            marginBalance: parseFloat(usdtAsset.marginBalance),
            unrealizedPnl: parseFloat(usdtAsset.unrealizedProfit),
          });
        }

        // Process positions
        const activePositions = data.data.positions
          ?.filter((p: any) => parseFloat(p.positionAmt) !== 0)
          .map((p: any) => ({
            id: p.symbol,
            symbol: p.symbol,
            side: parseFloat(p.positionAmt) > 0 ? 'LONG' : 'SHORT',
            size: Math.abs(parseFloat(p.positionAmt)),
            entryPrice: parseFloat(p.entryPrice),
            markPrice: parseFloat(p.markPrice || p.entryPrice),
            unrealizedPnl: parseFloat(p.unrealizedProfit),
            leverage: parseInt(p.leverage),
          })) || [];

        setPositions(activePositions);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Failed to fetch account:', error);
      setIsConnected(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const formattedOrders = ordersData?.map((o: any) => ({
        id: o.id,
        orderId: o.order_id,
        symbol: o.symbol,
        side: o.side,
        type: o.order_type,
        quantity: parseFloat(o.quantity),
        price: o.price ? parseFloat(o.price) : null,
        status: o.status,
        filledQuantity: parseFloat(o.filled_quantity || 0),
        createdAt: o.created_at,
      })) || [];

      setOrders(formattedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  }, []);

  const placeOrder = useCallback(async (
    symbol: string,
    side: 'BUY' | 'SELL',
    type: 'MARKET' | 'LIMIT' | 'STOP_LIMIT',
    quantity: number,
    price?: number,
    stopPrice?: number
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('binance-trade', {
        body: {
          action: 'place_order',
          symbol,
          side,
          type,
          quantity,
          price,
          stopPrice,
        },
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Order failed');
      }

      toast({
        title: 'Order Placed',
        description: `${side} ${quantity} ${symbol} - Status: ${data.data.status}`,
      });

      // Refresh data
      await Promise.all([fetchAccount(), fetchOrders()]);

      return data.data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to place order';
      toast({
        title: 'Order Failed',
        description: message,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [fetchAccount, fetchOrders]);

  const cancelOrder = useCallback(async (symbol: string, orderId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('binance-trade', {
        body: { action: 'cancel_order', symbol, orderId },
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Cancel failed');
      }

      toast({
        title: 'Order Canceled',
        description: `Order ${orderId} has been canceled`,
      });

      await fetchOrders();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to cancel order';
      toast({
        title: 'Cancel Failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchOrders]);

  // Initial fetch
  useEffect(() => {
    fetchPrices();
    fetchAccount();
    fetchOrders();

    // Set up price polling (every 3 seconds for more responsive updates)
    const priceInterval = setInterval(fetchPrices, 3000);
    const accountInterval = setInterval(fetchAccount, 8000);

    return () => {
      clearInterval(priceInterval);
      clearInterval(accountInterval);
    };
  }, [fetchPrices, fetchAccount, fetchOrders]);

  // Subscribe to realtime updates for all tables
  useEffect(() => {
    const channel = supabase
      .channel('trading-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'positions' }, () => {
        fetchAccount();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'price_tickers' }, (payload) => {
        // Real-time price updates from database
        const newPrice = payload.new as any;
        if (newPrice) {
          setPrices(prev => prev.map(p => 
            p.symbol === newPrice.symbol 
              ? { 
                  ...p, 
                  price: parseFloat(newPrice.price),
                  priceChange: parseFloat(newPrice.price_change || '0'),
                  priceChangePercent: parseFloat(newPrice.price_change_percent || '0'),
                  high24h: parseFloat(newPrice.high_24h || '0'),
                  low24h: parseFloat(newPrice.low_24h || '0'),
                  volume24h: parseFloat(newPrice.volume_24h || '0'),
                }
              : p
          ));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'account_balance' }, (payload) => {
        // Real-time balance updates
        const newBalance = payload.new as any;
        if (newBalance) {
          setBalance({
            totalBalance: parseFloat(newBalance.total_balance),
            availableBalance: parseFloat(newBalance.available_balance),
            marginBalance: parseFloat(newBalance.margin_balance),
            unrealizedPnl: parseFloat(newBalance.unrealized_pnl),
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders, fetchAccount]);

  return {
    prices,
    balance,
    positions,
    orders,
    isLoading,
    isConnected,
    placeOrder,
    cancelOrder,
    refreshPrices: fetchPrices,
    refreshAccount: fetchAccount,
    refreshOrders: fetchOrders,
  };
}
