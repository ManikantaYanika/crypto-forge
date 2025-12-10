import { Clock, BarChart2, Activity, Percent } from "lucide-react";

interface Stat {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
}

export function QuickStats() {
  const stats: Stat[] = [
    {
      label: "24h Volume",
      value: "$2.4B",
      subValue: "+12.5%",
      icon: <BarChart2 className="w-4 h-4" />,
    },
    {
      label: "24h High",
      value: "$43,850",
      icon: <Activity className="w-4 h-4" />,
    },
    {
      label: "24h Low",
      value: "$41,200",
      icon: <Activity className="w-4 h-4" />,
    },
    {
      label: "Funding Rate",
      value: "0.0100%",
      subValue: "in 2h 34m",
      icon: <Percent className="w-4 h-4" />,
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
                  <span className="text-xs text-success">{stat.subValue}</span>
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
