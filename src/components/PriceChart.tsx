import { TrendingUp, BarChart3, CandlestickChart } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const timeframes = ["1m", "5m", "15m", "1h", "4h", "1D"];

export function PriceChart() {
  const [activeTimeframe, setActiveTimeframe] = useState("15m");

  return (
    <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: "150ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <CandlestickChart className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">BTCUSDT</h2>
              <p className="text-xs text-muted-foreground">Perpetual</p>
            </div>
          </div>
          
          <div className="h-8 w-px bg-border/50" />
          
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold font-mono text-foreground">$43,256.78</span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-success/10 text-success">
              <TrendingUp className="w-3 h-3" />
              <span className="text-xs font-medium">+1.24%</span>
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

      {/* Chart Placeholder */}
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

        {/* Fake candlestick visualization */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(187 85% 53%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(187 85% 53%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,180 L40,160 L80,170 L120,140 L160,150 L200,120 L240,130 L280,100 L320,110 L360,80 L400,90 L440,70 L480,85 L520,60 L560,75 L600,50 L640,65 L680,45 L720,55 L760,40"
            fill="url(#chartGradient)"
            className="animate-fade-in"
          />
          <path
            d="M0,180 L40,160 L80,170 L120,140 L160,150 L200,120 L240,130 L280,100 L320,110 L360,80 L400,90 L440,70 L480,85 L520,60 L560,75 L600,50 L640,65 L680,45 L720,55 L760,40"
            fill="none"
            stroke="hsl(187 85% 53%)"
            strokeWidth="2"
            className="animate-fade-in"
          />
        </svg>

        {/* Price labels */}
        <div className="absolute right-2 top-2 text-xs font-mono text-muted-foreground">$44,000</div>
        <div className="absolute right-2 bottom-2 text-xs font-mono text-muted-foreground">$42,000</div>

        {/* Current price line */}
        <div className="absolute left-0 right-0 top-1/4 flex items-center">
          <div className="flex-1 border-t border-dashed border-primary/50" />
          <div className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-mono rounded-sm">
            43,256.78
          </div>
        </div>
      </div>

      {/* Volume bar */}
      <div className="mt-3 flex items-end gap-0.5 h-12">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-primary/30 rounded-t"
            style={{
              height: `${Math.random() * 80 + 20}%`,
              opacity: 0.3 + Math.random() * 0.7,
            }}
          />
        ))}
      </div>
    </div>
  );
}
