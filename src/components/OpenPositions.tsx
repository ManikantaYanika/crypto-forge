import { ArrowUpRight, ArrowDownRight, X, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useBinance } from "@/hooks/useBinance";

export function OpenPositions() {
  const { positions, prices, refreshAccount, isLoading } = useBinance();

  const getMarkPrice = (symbol: string) => {
    const ticker = prices.find(p => p.symbol === symbol);
    return ticker?.price || 0;
  };

  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    });
  };

  const calculatePnlPercent = (position: any) => {
    const markPrice = getMarkPrice(position.symbol);
    if (!markPrice || !position.entryPrice) return 0;
    
    const priceDiff = position.side === 'LONG' 
      ? markPrice - position.entryPrice 
      : position.entryPrice - markPrice;
    
    return (priceDiff / position.entryPrice) * 100 * position.leverage;
  };

  return (
    <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <h2 className="text-sm font-semibold text-foreground">Open Positions</h2>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {positions.length}
          </span>
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

      {positions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No open positions</p>
          <p className="text-xs mt-1">Place an order to open a position</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/30 hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground font-medium">Symbol</TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium">Side</TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium text-right">Size</TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium text-right">Entry</TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium text-right">Mark</TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium text-right">PnL</TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium text-right">Lev</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((position) => {
                const markPrice = getMarkPrice(position.symbol);
                const pnlPercent = calculatePnlPercent(position);
                const isProfit = position.unrealizedPnl >= 0;

                return (
                  <TableRow
                    key={position.id}
                    className="border-border/20 hover:bg-secondary/30 transition-colors"
                  >
                    <TableCell className="font-medium text-foreground">{position.symbol}</TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          position.side === "LONG"
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {position.side === "LONG" ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {position.side}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-foreground">
                      {formatNumber(position.size, 4)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      ${formatNumber(position.entryPrice)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-foreground">
                      ${formatNumber(markPrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div
                        className={`font-mono font-medium ${
                          isProfit ? "text-success" : "text-destructive"
                        }`}
                      >
                        {isProfit ? '+' : ''}${formatNumber(position.unrealizedPnl)}
                        <span className="text-xs ml-1 opacity-70">
                          {isProfit ? '+' : ''}{pnlPercent.toFixed(2)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-xs font-medium text-warning bg-warning/10 px-2 py-0.5 rounded">
                        {position.leverage}x
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
