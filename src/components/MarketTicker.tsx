import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { useBinance } from "@/hooks/useBinance";

export function MarketTicker() {
  const { prices, refreshPrices, isLoading, isConnected } = useBinance();

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (price >= 1) {
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
    } else {
      return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
    }
  };

  return (
    <div className="glass-card p-4 animate-slide-up" style={{ animationDelay: "150ms" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-destructive'}`} />
          <span className="text-xs font-medium text-foreground">Live Market Data</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={refreshPrices}
          disabled={isLoading}
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <div className="space-y-2">
        {prices.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground text-xs">
            Loading prices...
          </div>
        ) : (
          prices.map((ticker) => {
            const isPositive = ticker.priceChangePercent >= 0;
            
            return (
              <div
                key={ticker.symbol}
                className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-1 h-6 rounded-full ${isPositive ? 'bg-success' : 'bg-destructive'}`} />
                  <span className="text-sm font-medium text-foreground">{ticker.symbol}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono text-foreground">${formatPrice(ticker.price)}</span>
                  <div className={`flex items-center justify-end gap-0.5 text-xs ${isPositive ? 'text-success' : 'text-destructive'}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isPositive ? '+' : ''}{ticker.priceChangePercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
