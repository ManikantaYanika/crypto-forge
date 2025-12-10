-- Create orders table for storing trading orders
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT,
  client_order_id TEXT,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('BUY', 'SELL')),
  order_type TEXT NOT NULL CHECK (order_type IN ('MARKET', 'LIMIT', 'STOP_LIMIT')),
  quantity DECIMAL NOT NULL,
  price DECIMAL,
  stop_price DECIMAL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'NEW', 'PARTIALLY_FILLED', 'FILLED', 'CANCELED', 'REJECTED', 'EXPIRED')),
  filled_quantity DECIMAL DEFAULT 0,
  average_price DECIMAL,
  commission DECIMAL DEFAULT 0,
  commission_asset TEXT,
  executed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  raw_response JSONB
);

-- Create positions table for tracking open positions
CREATE TABLE public.positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL UNIQUE,
  side TEXT NOT NULL CHECK (side IN ('LONG', 'SHORT')),
  size DECIMAL NOT NULL DEFAULT 0,
  entry_price DECIMAL NOT NULL,
  mark_price DECIMAL,
  unrealized_pnl DECIMAL DEFAULT 0,
  leverage INTEGER NOT NULL DEFAULT 1,
  margin_type TEXT DEFAULT 'CROSS',
  liquidation_price DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create account_balance table for tracking balance
CREATE TABLE public.account_balance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_balance DECIMAL NOT NULL DEFAULT 0,
  available_balance DECIMAL NOT NULL DEFAULT 0,
  margin_balance DECIMAL NOT NULL DEFAULT 0,
  unrealized_pnl DECIMAL NOT NULL DEFAULT 0,
  asset TEXT NOT NULL DEFAULT 'USDT',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trading_logs table for detailed logging
CREATE TABLE public.trading_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  log_type TEXT NOT NULL CHECK (log_type IN ('INFO', 'WARNING', 'ERROR', 'ORDER', 'POSITION', 'BALANCE')),
  message TEXT NOT NULL,
  details JSONB,
  latency_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create price_tickers table for caching latest prices
CREATE TABLE public.price_tickers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL UNIQUE,
  price DECIMAL NOT NULL,
  price_change DECIMAL,
  price_change_percent DECIMAL,
  high_24h DECIMAL,
  low_24h DECIMAL,
  volume_24h DECIMAL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables (we'll make them public for the testnet demo)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trading_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_tickers ENABLE ROW LEVEL SECURITY;

-- Create public access policies (for testnet demo - in production, add user_id column and auth)
CREATE POLICY "Allow public read access on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on orders" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on positions" ON public.positions FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on positions" ON public.positions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on positions" ON public.positions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access on positions" ON public.positions FOR DELETE USING (true);

CREATE POLICY "Allow public read access on account_balance" ON public.account_balance FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on account_balance" ON public.account_balance FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on account_balance" ON public.account_balance FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on trading_logs" ON public.trading_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on trading_logs" ON public.trading_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on price_tickers" ON public.price_tickers FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on price_tickers" ON public.price_tickers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on price_tickers" ON public.price_tickers FOR UPDATE USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_positions_updated_at BEFORE UPDATE ON public.positions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_account_balance_updated_at BEFORE UPDATE ON public.account_balance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_price_tickers_updated_at BEFORE UPDATE ON public.price_tickers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for price_tickers and positions
ALTER PUBLICATION supabase_realtime ADD TABLE public.price_tickers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.positions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;