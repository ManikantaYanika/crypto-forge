import { TradingHeader } from "@/components/TradingHeader";
import { AccountBalance } from "@/components/AccountBalance";
import { OrderForm } from "@/components/OrderForm";
import { OpenPositions } from "@/components/OpenPositions";
import { OrderHistory } from "@/components/OrderHistory";
import { PriceChart } from "@/components/PriceChart";
import { QuickStats } from "@/components/QuickStats";
import { MarketTicker } from "@/components/MarketTicker";
import { TradingLogs } from "@/components/TradingLogs";

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

          {/* Right Column - Market Ticker */}
          <div className="lg:col-span-3">
            <MarketTicker />
          </div>
        </div>

        {/* Bottom Section - Tables */}
        <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <OpenPositions />
          <OrderHistory />
        </div>

        {/* Trading Logs */}
        <div className="mt-6">
          <TradingLogs />
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
