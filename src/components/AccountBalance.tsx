import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface BalanceItem {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
}

export function AccountBalance() {
  const balances: BalanceItem[] = [
    {
      label: "Total Balance",
      value: "125,432.58",
      change: "+2.34%",
      isPositive: true,
      icon: <Wallet className="w-4 h-4" />,
    },
    {
      label: "Available",
      value: "98,234.12",
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      label: "Unrealized PnL",
      value: "+3,847.23",
      change: "+12.5%",
      isPositive: true,
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      label: "Margin Used",
      value: "27,198.46",
      change: "21.7%",
      icon: <TrendingDown className="w-4 h-4" />,
    },
  ];

  return (
    <div className="glass-card p-5 animate-slide-up">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Wallet className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">Account Overview</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {balances.map((item, index) => (
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
              <span className="text-lg font-semibold font-mono text-foreground">
                ${item.value}
              </span>
              {item.change && (
                <span
                  className={`text-xs font-medium ${
                    item.isPositive ? "text-success" : "text-muted-foreground"
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
