import { Wallet, TrendingUp, TrendingDown, DollarSign, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { useTradingContext } from "@/contexts/TradingContext";

export function AccountBalance() {
  const { balance, isConnected, refreshAccount, isLoading } = useTradingContext();

  const formatNumber = (num: number | undefined) => {
    if (num === undefined) return "0.00";
    return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const balanceItems = [
    {
      label: "Total Balance",
      value: formatNumber(balance?.totalBalance),
      change: balance?.unrealizedPnl ? `${balance.unrealizedPnl >= 0 ? '+' : ''}${((balance.unrealizedPnl / (balance.totalBalance || 1)) * 100).toFixed(2)}%` : undefined,
      isPositive: balance?.unrealizedPnl ? balance.unrealizedPnl >= 0 : undefined,
      icon: <Wallet className="w-4 h-4" />,
    },
    {
      label: "Available",
      value: formatNumber(balance?.availableBalance),
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      label: "Unrealized PnL",
      value: `${balance?.unrealizedPnl && balance.unrealizedPnl >= 0 ? '+' : ''}${formatNumber(balance?.unrealizedPnl)}`,
      isPositive: balance?.unrealizedPnl ? balance.unrealizedPnl >= 0 : undefined,
      icon: balance?.unrealizedPnl && balance.unrealizedPnl >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />,
    },
    {
      label: "Margin Balance",
      value: formatNumber(balance?.marginBalance),
      icon: <TrendingDown className="w-4 h-4" />,
    },
  ];

  return (
    <div className="glass-card p-5 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Wallet className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">Account Overview</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
            isConnected ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-destructive'}`} />
            {isConnected ? 'Live' : 'Offline'}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={refreshAccount}
            disabled={isLoading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {balanceItems.map((item, index) => (
          <div
            key={item.label}
            className="p-3 rounded-lg bg-secondary/50 border border-border/30 hover:border-primary/30 transition-colors"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="text-muted-foreground">{item.icon}</div>
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-lg font-semibold font-mono ${
                item.isPositive !== undefined 
                  ? item.isPositive ? 'text-success' : 'text-destructive'
                  : 'text-foreground'
              }`}>
                ${item.value}
              </span>
              {item.change && (
                <span
                  className={`text-xs font-medium ${
                    item.isPositive ? "text-success" : "text-destructive"
                  }`}
                >
                  {item.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
