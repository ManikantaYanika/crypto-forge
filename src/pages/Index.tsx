import { TradingHeader } from "@/components/TradingHeader";
import { AccountBalance } from "@/components/AccountBalance";
import { OrderForm } from "@/components/OrderForm";
import { OpenPositions } from "@/components/OpenPositions";
import { OrderHistory } from "@/components/OrderHistory";
import { PriceChart } from "@/components/PriceChart";
import { QuickStats } from "@/components/QuickStats";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <TradingHeader />
      
      <main className="container max-w-[1600px] mx-auto px-4 py-6">
        {/* Quick Stats Bar */}
        <QuickStats />

        {/* Main Grid Layout */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Order Form & Account */}
          <div className="lg:col-span-3 space-y-6">
            <AccountBalance />
            <OrderForm />
          </div>

          {/* Center Column - Chart */}
          <div className="lg:col-span-6">
            <PriceChart />
          </div>

          {/* Right Column - Positions & Orders */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-medium text-foreground">Live Market Data</span>
              </div>
              <div className="space-y-2">
                {[
                  { symbol: "BTCUSDT", price: "43,256.78", change: "+1.24%" },
                  { symbol: "ETHUSDT", price: "2,312.45", change: "-0.82%" },
                  { symbol: "SOLUSDT", price: "98.34", change: "+5.67%" },
                  { symbol: "BNBUSDT", price: "312.50", change: "+0.34%" },
                ].map((item) => (
                  <div
                    key={item.symbol}
                    className="flex items-center justify-between p-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-medium text-foreground">{item.symbol}</span>
                    <div className="text-right">
                      <span className="text-sm font-mono text-foreground">${item.price}</span>
                      <span
                        className={`ml-2 text-xs ${
                          item.change.startsWith("+") ? "text-success" : "text-destructive"
                        }`}
                      >
                        {item.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Tables */}
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <OpenPositions />
          <OrderHistory />
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-muted-foreground pb-6">
          <p>CryptoBot Pro — Binance USDT-M Futures Testnet</p>
          <p className="mt-1 opacity-70">This is a simulated trading environment. No real funds are at risk.</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
