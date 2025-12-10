import { useState, useEffect } from "react";
import { Terminal, AlertTriangle, CheckCircle, Info, RefreshCw, X } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface LogEntry {
  id: string;
  log_type: string;
  message: string;
  details: any;
  latency_ms: number | null;
  created_at: string;
}

const logTypeConfig: Record<string, { icon: React.ReactNode; className: string }> = {
  INFO: {
    icon: <Info className="w-3 h-3" />,
    className: "text-primary",
  },
  WARNING: {
    icon: <AlertTriangle className="w-3 h-3" />,
    className: "text-warning",
  },
  ERROR: {
    icon: <X className="w-3 h-3" />,
    className: "text-destructive",
  },
  ORDER: {
    icon: <CheckCircle className="w-3 h-3" />,
    className: "text-success",
  },
  POSITION: {
    icon: <CheckCircle className="w-3 h-3" />,
    className: "text-primary",
  },
  BALANCE: {
    icon: <Info className="w-3 h-3" />,
    className: "text-muted-foreground",
  },
};

export function TradingLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('trading_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    const channel = supabase
      .channel('logs-updates')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'trading_logs' }, (payload) => {
        setLogs(prev => [payload.new as LogEntry, ...prev].slice(0, 50));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'HH:mm:ss.SSS');
    } catch {
      return '—';
    }
  };

  return (
    <div className="glass-card animate-slide-up" style={{ animationDelay: "400ms" }}>
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Trading Logs</h2>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {logs.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={(e) => {
              e.stopPropagation();
              fetchLogs();
            }}
            disabled={isLoading}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <span className="text-xs text-muted-foreground">
            {isExpanded ? 'Click to collapse' : 'Click to expand'}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-border/30">
          <div className="max-h-64 overflow-y-auto p-2">
            {logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No logs yet</p>
                <p className="text-xs mt-1">Trading activity will be logged here</p>
              </div>
            ) : (
              <div className="space-y-1 font-mono text-xs">
                {logs.map((log) => {
                  const config = logTypeConfig[log.log_type] || logTypeConfig.INFO;
                  
                  return (
                    <div
                      key={log.id}
                      className="flex items-start gap-2 p-2 rounded hover:bg-secondary/30 transition-colors"
                    >
                      <span className="text-muted-foreground shrink-0">
                        {formatTime(log.created_at)}
                      </span>
                      <span className={`shrink-0 ${config.className}`}>
                        {config.icon}
                      </span>
                      <span className={`shrink-0 uppercase w-16 ${config.className}`}>
                        [{log.log_type}]
                      </span>
                      <span className="text-foreground flex-1">{log.message}</span>
                      {log.latency_ms && (
                        <span className="text-muted-foreground shrink-0">
                          {log.latency_ms}ms
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
