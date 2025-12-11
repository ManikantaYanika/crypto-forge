import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Radio } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DemoModeToggleProps {
  isDemoMode: boolean;
  onToggle: (enabled: boolean) => void;
  isConnected: boolean;
}

export function DemoModeToggle({ isDemoMode, onToggle, isConnected }: DemoModeToggleProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50">
            {isDemoMode ? (
              <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30 gap-1">
                <AlertCircle className="w-3 h-3" />
                Demo
              </Badge>
            ) : (
              <Badge 
                variant="secondary" 
                className={`gap-1 ${isConnected 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                  : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}
              >
                <Radio className="w-3 h-3" />
                {isConnected ? 'Live' : 'Offline'}
              </Badge>
            )}
            <Switch
              checked={!isDemoMode}
              onCheckedChange={(checked) => onToggle(!checked)}
              className="scale-75"
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p className="text-sm">
            {isDemoMode 
              ? 'Demo Mode: Using simulated data. Toggle to connect to Binance Testnet.'
              : isConnected 
                ? 'Live Mode: Connected to Binance Futures Testnet.'
                : 'Live Mode: Not connected. Check your API keys or switch to Demo mode.'
            }
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
