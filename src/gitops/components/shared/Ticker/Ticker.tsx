import * as React from 'react';
import moment from 'moment';
import { interval, Subscription } from 'rxjs';

type TickerProps = {
  intervalMs?: number;
  disabled?: boolean;
  children?: (time: moment.Moment) => React.ReactNode;
};

export const Ticker: React.FC<TickerProps> = ({ intervalMs = 1000, disabled, children }) => {
  const [time, setTime] = React.useState(() => moment());
  const subscriptionRef = React.useRef<Subscription | null>(null);

  React.useEffect(() => {
    if (disabled) {
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = null;
      return;
    }

    if (!subscriptionRef.current) {
      subscriptionRef.current = interval(intervalMs).subscribe(() => setTime(moment()));
    }

    return () => {
      subscriptionRef.current?.unsubscribe();
      subscriptionRef.current = null;
    };
  }, [disabled, intervalMs]);

  return <>{children?.(time)}</>;
};
