import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, Info, Zap, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useBinance } from "@/hooks/useBinance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const TRADING_PAIRS = [
  "BTCUSDT",
  "ETHUSDT",
  "SOLUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "DOGEUSDT",
];

export function OrderForm() {
  const { prices, placeOrder, isLoading, balance } = useBinance();
  
  const [orderType, setOrderType] = useState<"MARKET" | "LIMIT">("MARKET");
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentPrice = prices.find(p => p.symbol === symbol);
  const priceDisplay = currentPrice?.price?.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }) || "—";
  const priceChange = currentPrice?.priceChangePercent?.toFixed(2) || "0";
  const isPositive = currentPrice?.priceChangePercent ? currentPrice.priceChangePercent >= 0 : true;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await placeOrder(
        symbol,
        side,
        orderType,
        qty,
        orderType === "LIMIT" ? parseFloat(price) : undefined
      );
      setQuantity("");
      setPrice("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimatedValue = () => {
    const qty = parseFloat(quantity) || 0;
    const p = orderType === "LIMIT" ? parseFloat(price) : (currentPrice?.price || 0);
    return (qty * p).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const setPercentage = (pct: number) => {
    if (!balance?.availableBalance || !currentPrice?.price) return;
    const maxValue = balance.availableBalance * (pct / 100);
    const maxQty = maxValue / currentPrice.price;
    setQuantity(maxQty.toFixed(4));
  };

  return (
    <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: "100ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">New Order</h2>
        </div>
      </div>

      {/* Symbol Selector */}
      <div className="mb-4">
        <Select value={symbol} onValueChange={setSymbol}>
          <SelectTrigger className="bg-secondary/50 border-border/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TRADING_PAIRS.map(pair => (
              <SelectItem key={pair} value={pair}>{pair}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Current Price Display */}
      <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Current Price</span>
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold font-mono text-foreground">${priceDisplay}</span>
            <span className={`text-xs flex items-center gap-0.5 ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {isPositive ? '+' : ''}{priceChange}%
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Order Type Tabs */}
        <Tabs value={orderType} onValueChange={(v) => setOrderType(v as "MARKET" | "LIMIT")}>
          <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
            <TabsTrigger value="MARKET" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Market
            </TabsTrigger>
            <TabsTrigger value="LIMIT" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Limit
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Side Selection */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={side === "BUY" ? "buy" : "outline"}
            className="h-11"
            onClick={() => setSide("BUY")}
          >
            <ArrowUpRight className="w-4 h-4" />
            Long / Buy
          </Button>
          <Button
            type="button"
            variant={side === "SELL" ? "sell" : "outline"}
            className="h-11"
            onClick={() => setSide("SELL")}
          >
            <ArrowDownRight className="w-4 h-4" />
            Short / Sell
          </Button>
        </div>

        {/* Price Input (for Limit orders) */}
        {orderType === "LIMIT" && (
          <div className="space-y-2">
            <Label htmlFor="price" className="text-xs text-muted-foreground flex items-center gap-1">
              Price (USDT)
              <Info className="w-3 h-3" />
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder={priceDisplay}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="font-mono bg-secondary/50 border-border/50 focus:border-primary/50"
            />
          </div>
        )}

        {/* Quantity Input */}
        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-xs text-muted-foreground flex items-center gap-1">
            Quantity ({symbol.replace('USDT', '')})
            <Info className="w-3 h-3" />
          </Label>
          <Input
            id="quantity"
            type="number"
            step="0.0001"
            placeholder="0.000"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="font-mono bg-secondary/50 border-border/50 focus:border-primary/50"
            required
          />
          <div className="flex gap-2">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => setPercentage(pct)}
                className="flex-1 py-1 text-xs text-muted-foreground hover:text-primary bg-secondary/50 rounded border border-border/30 hover:border-primary/30 transition-colors"
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-3 rounded-lg bg-secondary/30 border border-border/30 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Order Value</span>
            <span className="font-mono text-foreground">${estimatedValue()}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Available</span>
            <span className="font-mono text-foreground">
              ${balance?.availableBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant={side === "BUY" ? "buy" : "sell"}
          size="xl"
          className="w-full"
          disabled={isLoading || isSubmitting || !quantity}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Placing Order...
            </>
          ) : side === "BUY" ? (
            <>
              <ArrowUpRight className="w-5 h-5" />
              Place Buy Order
            </>
          ) : (
            <>
              <ArrowDownRight className="w-5 h-5" />
              Place Sell Order
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
