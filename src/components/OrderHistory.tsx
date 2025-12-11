import { CheckCircle2, XCircle, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useTradingContext } from "@/contexts/TradingContext";
import { format } from "date-fns";

type OrderStatus = "FILLED" | "CANCELED" | "PENDING" | "PARTIALLY_FILLED" | "NEW" | "REJECTED" | "EXPIRED" | "OPEN";

const statusConfig: Record<string, { icon: React.ReactNode; className: string }> = {
  FILLED: {
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    className: "bg-success/10 text-success",
  },
  CANCELED: {
    icon: <XCircle className="w-3.5 h-3.5" />,
    className: "bg-destructive/10 text-destructive",
  },
  REJECTED: {
    icon: <XCircle className="w-3.5 h-3.5" />,
    className: "bg-destructive/10 text-destructive",
  },
  EXPIRED: {
    icon: <XCircle className="w-3.5 h-3.5" />,
    className: "bg-muted text-muted-foreground",
  },
  PENDING: {
    icon: <Clock className="w-3.5 h-3.5" />,
    className: "bg-warning/10 text-warning",
  },
  NEW: {
    icon: <Clock className="w-3.5 h-3.5" />,
    className: "bg-warning/10 text-warning",
  },
  OPEN: {
    icon: <Clock className="w-3.5 h-3.5" />,
    className: "bg-primary/10 text-primary",
  },
  PARTIALLY_FILLED: {
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    className: "bg-primary/10 text-primary",
  },
};

export function OrderHistory() {
  const { orders, refreshOrders, isLoading } = useTradingContext();

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm:ss');
    } catch {
      return '—';
    }
  };

  const formatNumber = (num: number | null, decimals = 2) => {
    if (num === null) return '—';
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    });
  };

  return (
    <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h2 className="text-sm font-semibold text-foreground">Order History</h2>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {orders.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={refreshOrders}
          disabled={isLoading}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No orders yet</p>
          <p className="text-xs mt-1">Your order history will appear here</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/30 hover:bg-transparent">
                <TableHead className="text-xs text-muted-foreground font-medium">Time</TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium">Symbol</TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium">Type</TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium">Side</TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium text-right">Price</TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium text-right">Qty / Filled</TableHead>
                <TableHead className="text-xs text-muted-foreground font-medium text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const config = statusConfig[order.status] || statusConfig.PENDING;
                
                return (
                  <TableRow
                    key={order.id}
                    className="border-border/20 hover:bg-secondary/30 transition-colors"
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {formatTime(order.createdAt)}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{order.symbol}</TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        {order.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-medium ${
                          order.side === "BUY" ? "text-success" : "text-destructive"
                        }`}
                      >
                        {order.side}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-foreground">
                      {order.price ? `$${formatNumber(order.price)}` : 'Market'}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      <span className="text-foreground">{formatNumber(order.quantity, 4)}</span>
                      <span className="text-muted-foreground"> / {formatNumber(order.filledQuantity, 4)}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}
                      >
                        {config.icon}
                        {order.status.replace("_", " ")}
                      </div>
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
