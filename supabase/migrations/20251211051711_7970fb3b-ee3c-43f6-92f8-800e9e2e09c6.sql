-- Enable realtime for trading_logs table
ALTER PUBLICATION supabase_realtime ADD TABLE public.trading_logs;

-- Enable realtime for account_balance table
ALTER PUBLICATION supabase_realtime ADD TABLE public.account_balance;

-- Enable REPLICA IDENTITY FULL for complete row data in realtime events
ALTER TABLE public.trading_logs REPLICA IDENTITY FULL;
ALTER TABLE public.account_balance REPLICA IDENTITY FULL;
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.positions REPLICA IDENTITY FULL;
ALTER TABLE public.price_tickers REPLICA IDENTITY FULL;