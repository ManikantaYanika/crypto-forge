import { BarChart2, Activity, Zap } from "lucide-react";
import { useTradingContext } from "@/contexts/TradingContext";

export function QuickStats() {
  const { prices, balance, positions } = useTradingContext();

  const btcTicker = prices.find(p => p.symbol === 'BTCUSDT');
  
  const totalPnl = positions.reduce((sum, p) => sum + p.unrealizedPnl, 0);
  const totalMargin = positions.reduce((sum, p) => sum + (p.size * p.entryPrice / p.leverage), 0);

  const formatVolume = (volume: number) => {
    if (volume >= 1000000000) return `$${(volume / 1000000000).toFixed(2)}B`;
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(2)}M`;
    return `$${volume.toFixed(2)}`;
  };

  const stats = [
    {
      label: "24h Volume (BTC)",
      value: btcTicker ? formatVolume(btcTicker.volume24h * btcTicker.price) : "—",
      subValue: btcTicker ? `${(btcTicker.priceChangePercent >= 0 ? '+' : '')}${btcTicker.priceChangePercent.toFixed(2)}%` : undefined,
      isPositive: btcTicker?.priceChangePercent ? btcTicker.priceChangePercent >= 0 : undefined,
      icon: <BarChart2 className="w-4 h-4" />,
    },
    {
      label: "24h High",
      value: btcTicker ? `$${btcTicker.high24h.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : "—",
      icon: <Activity className="w-4 h-4" />,
    },
    {
      label: "24h Low",
      value: btcTicker ? `$${btcTicker.low24h.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : "—",
      icon: <Activity className="w-4 h-4" />,
    },
    {
      label: "Open Positions",
      value: positions.length.toString(),
      subValue: totalPnl !== 0 ? `PnL: $${totalPnl.toFixed(2)}` : undefined,
      isPositive: totalPnl >= 0,
      icon: <Zap className="w-4 h-4" />,
    },
  ];

  return (
    <div className="glass-card p-4 animate-slide-up" style={{ animationDelay: "50ms" }}>
      <div className="flex items-center gap-6 overflow-x-auto">
        {stats.map((stat, index) => (
          <div key={stat.label} className="flex items-center gap-3 min-w-fit">
            <div className="w-8 h-8 rounded-lg bg-secondary/80 flex items-center justify-center text-muted-foreground">
              {stat.icon}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-semibold font-mono text-foreground">{stat.value}</span>
                {stat.subValue && (
                  <span className={`text-xs ${
                    stat.isPositive !== undefined 
                      ? stat.isPositive ? 'text-success' : 'text-destructive'
                      : 'text-muted-foreground'
                  }`}>
                    {stat.subValue}
                  </span>
                )}
              </div>
            </div>
            {index < stats.length - 1 && <div className="h-8 w-px bg-border/50 ml-3" />}
          </div>
        ))}
      </div>
    </div>
  );
}
