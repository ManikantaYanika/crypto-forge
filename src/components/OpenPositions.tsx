import { ArrowUpRight, ArrowDownRight, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface Position {
  id: string;
  symbol: string;
  side: "long" | "short";
  size: string;
  entryPrice: string;
  markPrice: string;
  pnl: string;
  pnlPercent: string;
  leverage: string;
}

const mockPositions: Position[] = [
  {
    id: "1",
    symbol: "BTCUSDT",
    side: "long",
    size: "0.125",
    entryPrice: "42,850.00",
    markPrice: "43,256.78",
    pnl: "+508.35",
    pnlPercent: "+9.48%",
    leverage: "10x",
  },
  {
    id: "2",
    symbol: "ETHUSDT",
    side: "short",
    size: "2.50",
    entryPrice: "2,285.00",
    markPrice: "2,312.45",
    pnl: "-68.63",
    pnlPercent: "-1.20%",
    leverage: "5x",
  },
];

export function OpenPositions() {
  return (
    <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <h2 className="text-sm font-semibold text-foreground">Open Positions</h2>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {mockPositions.length}
          </span>
        </div>
      </div>

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
              <TableHead className="text-xs text-muted-foreground font-medium text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPositions.map((position) => (
              <TableRow
                key={position.id}
                className="border-border/20 hover:bg-secondary/30 transition-colors"
              >
                <TableCell className="font-medium text-foreground">{position.symbol}</TableCell>
                <TableCell>
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      position.side === "long"
                        ? "bg-success/10 text-success"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {position.side === "long" ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {position.side.toUpperCase()}
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-foreground">{position.size}</TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">
                  ${position.entryPrice}
                </TableCell>
                <TableCell className="text-right font-mono text-foreground">
                  ${position.markPrice}
                </TableCell>
                <TableCell className="text-right">
                  <div
                    className={`font-mono font-medium ${
                      position.pnl.startsWith("+") ? "text-success" : "text-destructive"
                    }`}
                  >
                    ${position.pnl}
                    <span className="text-xs ml-1 opacity-70">{position.pnlPercent}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-xs font-medium text-warning bg-warning/10 px-2 py-0.5 rounded">
                    {position.leverage}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                    <X className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
