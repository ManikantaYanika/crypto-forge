import { Activity, Bell, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { DemoModeToggle } from "./DemoModeToggle";
import { useTradingContext } from "@/contexts/TradingContext";

export function TradingHeader() {
  const { isDemoMode, setDemoMode, isConnected } = useTradingContext();

  return (
    <header className="glass-card border-b border-border/50 px-6 py-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                isDemoMode ? 'bg-amber-500' : isConnected ? 'bg-success' : 'bg-destructive'
              }`} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground tracking-tight">
                CryptoBot <span className="text-primary">Pro</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                {isDemoMode ? 'Demo Mode' : 'Binance Futures Testnet'}
              </p>
            </div>
          </div>
          
          <div className="h-8 w-px bg-border/50 mx-2" />
          
          <DemoModeToggle 
            isDemoMode={isDemoMode} 
            onToggle={setDemoMode} 
            isConnected={isConnected} 
          />
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
