import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { useLanguage } from '@/i18n';

interface RealtimeIndicatorProps {
  connected: boolean;
  className?: string;
}

export const RealtimeIndicator: React.FC<RealtimeIndicatorProps> = ({
  connected,
  className = '',
}) => {
  const { t } = useLanguage();

  return (
    <Badge
      variant={connected ? 'default' : 'secondary'}
      className={`gap-1 ${className}`}
    >
      {connected ? (
        <>
          <Wifi className="h-3 w-3" />
          <span className="text-xs">{t('live')}</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          <span className="text-xs">{t('offline')}</span>
        </>
      )}
    </Badge>
  );
};
