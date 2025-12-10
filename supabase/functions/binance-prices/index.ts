import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BINANCE_TESTNET_URL = 'https://testnet.binancefuture.com';

interface TickerData {
  symbol: string;
  price: string;
  priceChange: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const { symbols } = await req.json();
    const symbolList = symbols || ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'XRPUSDT', 'DOGEUSDT'];

    console.log('Fetching prices for:', symbolList);

    // Fetch 24hr ticker data for all symbols
    const tickerPromises = symbolList.map(async (symbol: string) => {
      const response = await fetch(`${BINANCE_TESTNET_URL}/fapi/v1/ticker/24hr?symbol=${symbol}`);
      if (!response.ok) {
        console.error(`Failed to fetch ticker for ${symbol}`);
        return null;
      }
      return response.json();
    });

    const tickerResults = await Promise.all(tickerPromises);
    const tickers: TickerData[] = tickerResults.filter(Boolean);

    console.log(`Fetched ${tickers.length} tickers`);

    // Update database with latest prices
    const upsertData = tickers.map((ticker: any) => ({
      symbol: ticker.symbol,
      price: parseFloat(ticker.lastPrice),
      price_change: parseFloat(ticker.priceChange),
      price_change_percent: parseFloat(ticker.priceChangePercent),
      high_24h: parseFloat(ticker.highPrice),
      low_24h: parseFloat(ticker.lowPrice),
      volume_24h: parseFloat(ticker.volume),
    }));

    const { error } = await supabase
      .from('price_tickers')
      .upsert(upsertData, { onConflict: 'symbol' });

    if (error) {
      console.error('Failed to update prices:', error);
    }

    // Format response
    const formattedPrices = tickers.map((ticker: any) => ({
      symbol: ticker.symbol,
      price: parseFloat(ticker.lastPrice),
      priceChange: parseFloat(ticker.priceChange),
      priceChangePercent: parseFloat(ticker.priceChangePercent),
      high24h: parseFloat(ticker.highPrice),
      low24h: parseFloat(ticker.lowPrice),
      volume24h: parseFloat(ticker.volume),
    }));

    return new Response(JSON.stringify({ 
      success: true, 
      data: formattedPrices,
      timestamp: Date.now(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Price fetch error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
