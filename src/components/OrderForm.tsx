import { useState } from "react";
import { ArrowUpRight, ArrowDownRight, Info, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "@/hooks/use-toast";

export function OrderForm() {
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [symbol] = useState("BTCUSDT");
  const [currentPrice] = useState("43,256.78");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quantity) {
      toast({
        title: "Validation Error",
        description: "Please enter a quantity",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Order Submitted",
      description: `${side.toUpperCase()} ${orderType.toUpperCase()} order for ${quantity} ${symbol}`,
    });
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
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-secondary">
          <span className="text-xs font-medium text-foreground">{symbol}</span>
        </div>
      </div>

      {/* Current Price Display */}
      <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Current Price</span>
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold font-mono text-foreground">${currentPrice}</span>
            <span className="text-xs text-success flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              +1.24%
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Order Type Tabs */}
        <Tabs value={orderType} onValueChange={(v) => setOrderType(v as "market" | "limit")}>
          <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
            <TabsTrigger value="market" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Market
            </TabsTrigger>
            <TabsTrigger value="limit" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              Limit
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Side Selection */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant={side === "buy" ? "buy" : "outline"}
            className="h-11"
            onClick={() => setSide("buy")}
          >
            <ArrowUpRight className="w-4 h-4" />
            Long / Buy
          </Button>
          <Button
            type="button"
            variant={side === "sell" ? "sell" : "outline"}
            className="h-11"
            onClick={() => setSide("sell")}
          >
            <ArrowDownRight className="w-4 h-4" />
            Short / Sell
          </Button>
        </div>

        {/* Price Input (for Limit orders) */}
        {orderType === "limit" && (
          <div className="space-y-2">
            <Label htmlFor="price" className="text-xs text-muted-foreground flex items-center gap-1">
              Price (USDT)
              <Info className="w-3 h-3" />
            </Label>
            <Input
              id="price"
              type="text"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="font-mono bg-secondary/50 border-border/50 focus:border-primary/50"
            />
          </div>
        )}

        {/* Quantity Input */}
        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-xs text-muted-foreground flex items-center gap-1">
            Quantity (BTC)
            <Info className="w-3 h-3" />
          </Label>
          <Input
            id="quantity"
            type="text"
            placeholder="0.000"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="font-mono bg-secondary/50 border-border/50 focus:border-primary/50"
          />
          <div className="flex gap-2">
            {["25%", "50%", "75%", "100%"].map((pct) => (
              <button
                key={pct}
                type="button"
                className="flex-1 py-1 text-xs text-muted-foreground hover:text-primary bg-secondary/50 rounded border border-border/30 hover:border-primary/30 transition-colors"
              >
                {pct}
              </button>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-3 rounded-lg bg-secondary/30 border border-border/30 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Order Value</span>
            <span className="font-mono text-foreground">$0.00</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Est. Fee</span>
            <span className="font-mono text-foreground">$0.00</span>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant={side === "buy" ? "buy" : "sell"}
          size="xl"
          className="w-full"
        >
          {side === "buy" ? (
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
