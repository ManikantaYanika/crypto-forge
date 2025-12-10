import { TrendingUp, TrendingDown, BarChart3, CandlestickChart } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useBinance } from "@/hooks/useBinance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const timeframes = ["1m", "5m", "15m", "1h", "4h", "1D"];
const TRADING_PAIRS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT"];

export function PriceChart() {
  const { prices } = useBinance();
  const [activeTimeframe, setActiveTimeframe] = useState("15m");
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [priceHistory, setPriceHistory] = useState<number[]>([]);

  const currentTicker = prices.find(p => p.symbol === selectedSymbol);
  const currentPrice = currentTicker?.price || 0;
  const priceChange = currentTicker?.priceChangePercent || 0;
  const isPositive = priceChange >= 0;

  // Simulate price history for the chart
  useEffect(() => {
    if (currentPrice > 0) {
      setPriceHistory(prev => {
        const newHistory = [...prev, currentPrice];
        return newHistory.slice(-40); // Keep last 40 data points
      });
    }
  }, [currentPrice]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Calculate chart path from price history
  const generateChartPath = () => {
    if (priceHistory.length < 2) return "";
    
    const minPrice = Math.min(...priceHistory);
    const maxPrice = Math.max(...priceHistory);
    const range = maxPrice - minPrice || 1;
    
    const width = 760;
    const height = 200;
    const padding = 20;
    
    const points = priceHistory.map((price, index) => {
      const x = padding + (index / (priceHistory.length - 1)) * (width - padding * 2);
      const y = height - padding - ((price - minPrice) / range) * (height - padding * 2);
      return `${x},${y}`;
    });
    
    return `M${points.join(' L')}`;
  };

  const generateAreaPath = () => {
    const linePath = generateChartPath();
    if (!linePath) return "";
    
    const width = 760;
    const height = 200;
    const padding = 20;
    
    return `${linePath} L${width - padding},${height - padding} L${padding},${height - padding} Z`;
  };

  return (
    <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: "150ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <CandlestickChart className="w-4 h-4 text-primary" />
            </div>
            <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
              <SelectTrigger className="w-32 bg-transparent border-none p-0 h-auto">
                <div>
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {TRADING_PAIRS.map(pair => (
                  <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="h-8 w-px bg-border/50" />
          
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-mono text-foreground">
              ${formatPrice(currentPrice)}
            </span>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded ${
              isPositive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
            }`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span className="text-xs font-medium">
                {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  activeTimeframe === tf
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <BarChart3 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64 rounded-lg bg-gradient-to-b from-secondary/30 to-secondary/10 border border-border/30 overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 border-t border-border/20"
              style={{ top: `${(i + 1) * 20}%` }}
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 border-l border-border/20"
              style={{ left: `${(i + 1) * 12.5}%` }}
            />
          ))}
        </div>

        {/* Chart line */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 760 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isPositive ? "hsl(142 71% 45%)" : "hsl(0 72% 51%)"} stopOpacity="0.3" />
              <stop offset="100%" stopColor={isPositive ? "hsl(142 71% 45%)" : "hsl(0 72% 51%)"} stopOpacity="0" />
            </linearGradient>
          </defs>
          {priceHistory.length > 1 && (
            <>
              <path
                d={generateAreaPath()}
                fill="url(#chartGradient)"
                className="transition-all duration-300"
              />
              <path
                d={generateChartPath()}
                fill="none"
                stroke={isPositive ? "hsl(142 71% 45%)" : "hsl(0 72% 51%)"}
                strokeWidth="2"
                className="transition-all duration-300"
              />
            </>
          )}
        </svg>

        {/* Price labels */}
        {currentTicker && (
          <>
            <div className="absolute right-2 top-2 text-xs font-mono text-muted-foreground">
              ${formatPrice(currentTicker.high24h)}
            </div>
            <div className="absolute right-2 bottom-2 text-xs font-mono text-muted-foreground">
              ${formatPrice(currentTicker.low24h)}
            </div>
          </>
        )}

        {/* Current price line */}
        <div className="absolute left-0 right-0 top-1/3 flex items-center">
          <div className="flex-1 border-t border-dashed border-primary/50" />
          <div className={`px-2 py-0.5 text-xs font-mono rounded-sm ${
            isPositive ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
          }`}>
            {formatPrice(currentPrice)}
          </div>
        </div>
      </div>

      {/* Volume bar */}
      <div className="mt-3 flex items-end gap-0.5 h-12">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t transition-all duration-300 ${
              isPositive ? 'bg-success/30' : 'bg-destructive/30'
            }`}
            style={{
              height: `${Math.random() * 80 + 20}%`,
              opacity: 0.3 + Math.random() * 0.7,
            }}
          />
        ))}
      </div>

      {/* Stats */}
      {currentTicker && (
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">24h High</p>
            <p className="text-sm font-mono text-foreground">${formatPrice(currentTicker.high24h)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">24h Low</p>
            <p className="text-sm font-mono text-foreground">${formatPrice(currentTicker.low24h)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">24h Volume</p>
            <p className="text-sm font-mono text-foreground">
              {(currentTicker.volume24h / 1000000).toFixed(2)}M
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">24h Change</p>
            <p className={`text-sm font-mono ${isPositive ? 'text-success' : 'text-destructive'}`}>
              ${currentTicker.priceChange.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
