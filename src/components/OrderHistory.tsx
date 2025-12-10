import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

type OrderStatus = "FILLED" | "CANCELED" | "PENDING" | "PARTIALLY_FILLED";

interface Order {
  id: string;
  time: string;
  symbol: string;
  type: string;
  side: "BUY" | "SELL";
  price: string;
  quantity: string;
  filled: string;
  status: OrderStatus;
}

const mockOrders: Order[] = [
  {
    id: "ORD-7834921",
    time: "14:32:18",
    symbol: "BTCUSDT",
    type: "LIMIT",
    side: "BUY",
    price: "42,850.00",
    quantity: "0.125",
    filled: "0.125",
    status: "FILLED",
  },
  {
    id: "ORD-7834920",
    time: "14:28:45",
    symbol: "ETHUSDT",
    type: "MARKET",
    side: "SELL",
    price: "2,285.00",
    quantity: "2.50",
    filled: "2.50",
    status: "FILLED",
  },
  {
    id: "ORD-7834919",
    time: "13:45:22",
    symbol: "BTCUSDT",
    type: "LIMIT",
    side: "BUY",
    price: "41,500.00",
    quantity: "0.250",
    filled: "0.000",
    status: "CANCELED",
  },
  {
    id: "ORD-7834918",
    time: "12:15:08",
    symbol: "SOLUSDT",
    type: "LIMIT",
    side: "BUY",
    price: "98.50",
    quantity: "15.00",
    filled: "7.50",
    status: "PARTIALLY_FILLED",
  },
];

const statusConfig: Record<OrderStatus, { icon: React.ReactNode; className: string }> = {
  FILLED: {
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    className: "bg-success/10 text-success",
  },
  CANCELED: {
    icon: <XCircle className="w-3.5 h-3.5" />,
    className: "bg-destructive/10 text-destructive",
  },
  PENDING: {
    icon: <Clock className="w-3.5 h-3.5" />,
    className: "bg-warning/10 text-warning",
  },
  PARTIALLY_FILLED: {
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    className: "bg-primary/10 text-primary",
  },
};

export function OrderHistory() {
  return (
    <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h2 className="text-sm font-semibold text-foreground">Order History</h2>
        </div>
        <button className="text-xs text-primary hover:text-primary/80 transition-colors">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/30 hover:bg-transparent">
              <TableHead className="text-xs text-muted-foreground font-medium">Time</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">Order ID</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">Symbol</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">Type</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium">Side</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-right">Price</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-right">Qty / Filled</TableHead>
              <TableHead className="text-xs text-muted-foreground font-medium text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOrders.map((order) => (
              <TableRow
                key={order.id}
                className="border-border/20 hover:bg-secondary/30 transition-colors"
              >
                <TableCell className="font-mono text-xs text-muted-foreground">{order.time}</TableCell>
                <TableCell className="font-mono text-xs text-foreground">{order.id}</TableCell>
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
                <TableCell className="text-right font-mono text-foreground">${order.price}</TableCell>
                <TableCell className="text-right font-mono text-xs">
                  <span className="text-foreground">{order.quantity}</span>
                  <span className="text-muted-foreground"> / {order.filled}</span>
                </TableCell>
                <TableCell className="text-right">
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                      statusConfig[order.status].className
                    }`}
                  >
                    {statusConfig[order.status].icon}
                    {order.status.replace("_", " ")}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
