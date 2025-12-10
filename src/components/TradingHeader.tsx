import { Activity, Bell, Settings, Wifi } from "lucide-react";
import { Button } from "./ui/button";

export function TradingHeader() {
  return (
    <header className="glass-card border-b border-border/50 px-6 py-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-background" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground tracking-tight">
                CryptoBot <span className="text-primary">Pro</span>
              </h1>
              <p className="text-xs text-muted-foreground">Binance Futures Testnet</p>
            </div>
          </div>
          
          <div className="h-8 w-px bg-border/50 mx-2" />
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
            <Wifi className="w-3.5 h-3.5 text-success" />
            <span className="text-xs font-medium text-success">Connected</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
