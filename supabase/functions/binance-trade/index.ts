import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BINANCE_TESTNET_URL = 'https://testnet.binancefuture.com';

interface OrderRequest {
  symbol: string;
  side: 'BUY' | 'SELL';
  type: 'MARKET' | 'LIMIT' | 'STOP_LIMIT';
  quantity: number;
  price?: number;
  stopPrice?: number;
  timeInForce?: string;
}

function createSignature(queryString: string, secret: string): string {
  const hmac = createHmac("sha256", secret);
  hmac.update(queryString);
  return hmac.digest("hex");
}

async function logToDatabase(supabase: any, logType: string, message: string, details?: any, latencyMs?: number) {
  try {
    await supabase.from('trading_logs').insert({
      log_type: logType,
      message,
      details,
      latency_ms: latencyMs,
    });
  } catch (error) {
    console.error('Failed to log to database:', error);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const BINANCE_API_KEY = Deno.env.get('BINANCE_API_KEY');
    const BINANCE_API_SECRET = Deno.env.get('BINANCE_API_SECRET');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    // Validate API credentials
    if (!BINANCE_API_KEY || !BINANCE_API_SECRET) {
      console.error('Missing Binance API credentials');
      throw new Error('Binance API credentials not configured. Please add BINANCE_API_KEY and BINANCE_API_SECRET secrets.');
    }

    // Validate key format (Binance Futures Testnet keys should be 64 characters)
    if (BINANCE_API_KEY.length < 10) {
      console.error('Invalid API key format - too short');
      throw new Error('Invalid BINANCE_API_KEY format. Please use Binance Futures Testnet API key from testnet.binancefuture.com');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const { action, ...params } = await req.json();
    console.log(`Processing action: ${action}`, JSON.stringify(params));

    let result;
    let latency;

    switch (action) {
      case 'place_order': {
        const orderParams = params as OrderRequest;
        
        // Validate required fields
        if (!orderParams.symbol || !orderParams.side || !orderParams.type || !orderParams.quantity) {
          throw new Error('Missing required order parameters: symbol, side, type, quantity');
        }

        // Build order parameters
        const timestamp = Date.now();
        const orderData: Record<string, any> = {
          symbol: orderParams.symbol,
          side: orderParams.side,
          type: orderParams.type,
          quantity: orderParams.quantity.toString(),
          timestamp,
        };

        if (orderParams.type === 'LIMIT') {
          if (!orderParams.price) throw new Error('Price required for LIMIT orders');
          orderData.price = orderParams.price.toString();
          orderData.timeInForce = orderParams.timeInForce || 'GTC';
        }

        if (orderParams.type === 'STOP_LIMIT') {
          if (!orderParams.price || !orderParams.stopPrice) {
            throw new Error('Price and stopPrice required for STOP_LIMIT orders');
          }
          orderData.price = orderParams.price.toString();
          orderData.stopPrice = orderParams.stopPrice.toString();
          orderData.timeInForce = orderParams.timeInForce || 'GTC';
        }

        // Create query string and signature
        const queryString = Object.entries(orderData)
          .map(([key, value]) => `${key}=${value}`)
          .join('&');
        const signature = createSignature(queryString, BINANCE_API_SECRET);

        console.log('Placing order with params:', queryString);

        // Send order to Binance
        const orderStartTime = Date.now();
        const response = await fetch(`${BINANCE_TESTNET_URL}/fapi/v1/order?${queryString}&signature=${signature}`, {
          method: 'POST',
          headers: {
            'X-MBX-APIKEY': BINANCE_API_KEY,
          },
        });

        latency = Date.now() - orderStartTime;
        const responseText = await response.text();
        console.log('Binance response:', response.status, responseText);

        let orderResult;
        try {
          orderResult = JSON.parse(responseText);
        } catch {
          throw new Error(`Invalid response from Binance: ${responseText}`);
        }

        if (!response.ok) {
          await logToDatabase(supabase, 'ERROR', `Order failed: ${orderResult.msg || 'Unknown error'}`, orderResult, latency);
          throw new Error(orderResult.msg || 'Order failed');
        }

        // Store order in database
        const { error: insertError } = await supabase.from('orders').insert({
          order_id: orderResult.orderId?.toString(),
          client_order_id: orderResult.clientOrderId,
          symbol: orderResult.symbol,
          side: orderResult.side,
          order_type: orderResult.type,
          quantity: parseFloat(orderResult.origQty),
          price: orderResult.price ? parseFloat(orderResult.price) : null,
          status: orderResult.status,
          filled_quantity: parseFloat(orderResult.executedQty || '0'),
          average_price: orderResult.avgPrice ? parseFloat(orderResult.avgPrice) : null,
          executed_at: new Date().toISOString(),
          raw_response: orderResult,
        });

        if (insertError) {
          console.error('Failed to store order:', insertError);
        }

        await logToDatabase(supabase, 'ORDER', `Order placed: ${orderResult.side} ${orderResult.origQty} ${orderResult.symbol}`, orderResult, latency);

        result = orderResult;
        break;
      }

      case 'cancel_order': {
        const { symbol, orderId } = params;
        if (!symbol || !orderId) {
          throw new Error('Symbol and orderId required to cancel order');
        }

        const timestamp = Date.now();
        const queryString = `symbol=${symbol}&orderId=${orderId}&timestamp=${timestamp}`;
        const signature = createSignature(queryString, BINANCE_API_SECRET);

        const response = await fetch(`${BINANCE_TESTNET_URL}/fapi/v1/order?${queryString}&signature=${signature}`, {
          method: 'DELETE',
          headers: { 'X-MBX-APIKEY': BINANCE_API_KEY },
        });

        latency = Date.now() - startTime;
        result = await response.json();

        if (!response.ok) {
          await logToDatabase(supabase, 'ERROR', `Cancel order failed: ${result.msg}`, result, latency);
          throw new Error(result.msg || 'Cancel failed');
        }

        // Update order status in database
        await supabase.from('orders')
          .update({ status: 'CANCELED' })
          .eq('order_id', orderId.toString());

        await logToDatabase(supabase, 'ORDER', `Order canceled: ${orderId}`, result, latency);
        break;
      }

      case 'get_account': {
        const timestamp = Date.now();
        const queryString = `timestamp=${timestamp}`;
        const signature = createSignature(queryString, BINANCE_API_SECRET);

        const response = await fetch(`${BINANCE_TESTNET_URL}/fapi/v2/account?${queryString}&signature=${signature}`, {
          headers: { 'X-MBX-APIKEY': BINANCE_API_KEY },
        });

        latency = Date.now() - startTime;
        result = await response.json();

        if (!response.ok) {
          throw new Error(result.msg || 'Failed to get account');
        }

        // Update account balance in database
        const usdtAsset = result.assets?.find((a: any) => a.asset === 'USDT');
        if (usdtAsset) {
          const { error } = await supabase.from('account_balance')
            .upsert({
              id: '00000000-0000-0000-0000-000000000001',
              total_balance: parseFloat(usdtAsset.walletBalance),
              available_balance: parseFloat(usdtAsset.availableBalance),
              margin_balance: parseFloat(usdtAsset.marginBalance),
              unrealized_pnl: parseFloat(usdtAsset.unrealizedProfit),
              asset: 'USDT',
            }, { onConflict: 'id' });

          if (error) console.error('Failed to update balance:', error);
        }

        // Update positions
        if (result.positions) {
          for (const pos of result.positions) {
            const size = parseFloat(pos.positionAmt);
            if (size !== 0) {
              await supabase.from('positions')
                .upsert({
                  symbol: pos.symbol,
                  side: size > 0 ? 'LONG' : 'SHORT',
                  size: Math.abs(size),
                  entry_price: parseFloat(pos.entryPrice),
                  unrealized_pnl: parseFloat(pos.unrealizedProfit),
                  leverage: parseInt(pos.leverage),
                  margin_type: pos.marginType,
                  liquidation_price: parseFloat(pos.liquidationPrice),
                }, { onConflict: 'symbol' });
            } else {
              await supabase.from('positions')
                .delete()
                .eq('symbol', pos.symbol);
            }
          }
        }

        await logToDatabase(supabase, 'BALANCE', 'Account data updated', { 
          totalBalance: usdtAsset?.walletBalance,
          availableBalance: usdtAsset?.availableBalance,
        }, latency);
        break;
      }

      case 'get_open_orders': {
        const timestamp = Date.now();
        const queryString = `timestamp=${timestamp}`;
        const signature = createSignature(queryString, BINANCE_API_SECRET);

        const response = await fetch(`${BINANCE_TESTNET_URL}/fapi/v1/openOrders?${queryString}&signature=${signature}`, {
          headers: { 'X-MBX-APIKEY': BINANCE_API_KEY },
        });

        latency = Date.now() - startTime;
        result = await response.json();

        if (!response.ok) {
          throw new Error(result.msg || 'Failed to get open orders');
        }
        break;
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ success: true, data: result, latency }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Trade error:', error);
    const latency = Date.now() - startTime;
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      latency,
    }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
