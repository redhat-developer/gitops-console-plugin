import * as React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import { TSpan } from 'victory-core';

import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { ChartLabel, ChartLegendTooltip } from '@patternfly/react-charts/victory';
import { ErrorState } from '@patternfly/react-component-groups';
import { EmptyState, Spinner } from '@patternfly/react-core';

// Shared chart utilities

// Renders the Chart Legend Tooltip content plus a vertical crosshair line at the
// hovered x position, which mirrors Console's own metrics charts, e.g. `query-browser__tooltip-line`
// in `QueryBrowser.tsx`). Keep it consistent.
export const ChartCursorLine: React.FC<any> = (props) => {
  const { x, height, scale } = props;
  // `height` is the full <svg> canvas size, which includes padding reserved for axis tick labels/legend
  // `scale.y` is the fully-resolved d3 scale Victory computed for this chart (domain -> pixel)
  const yRange: [number, number] | undefined = scale?.y?.range?.();
  const y1 = yRange ? Math.min(yRange[0], yRange[1]) : 0;
  const y2 = yRange ? Math.max(yRange[0], yRange[1]) : height;
  return (
    <>
      <line
        x1={x}
        x2={x}
        y1={y1}
        y2={y2}
        style={{ stroke: 'var(--pf-t--global--background--color--inverse--default)' }}
      />
      <ChartLegendTooltip {...props} />
    </>
  );
};

// Renders the axis tick label produced by either x-axis's `tickFormat`
export const RelativeTimeTickLabel = ({ text, ...props }: any) => (
  <ChartLabel
    {...props}
    text={text}
    angle={0}
    style={{ fontSize: '11px', fill: 'var(--pf-t--global--text--color--subtle)' }}
  />
);

const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

// Shared by both charts' dependent (Y) axes.
export const Y_AXIS_STYLE = {
  tickLabels: {
    fontSize: '11px',
    fill: 'var(--pf-t--global--text--color--subtle)',
  },
};

export const relativeTimeTickFormat = (time: any, _index: number, ticks: number[]): string => {
  const dateTickTime = new Date(time);
  const tickTime = dateTickTime.getTime();
  const intervalMs =
    ticks.length > 1 ? new Date(ticks[1]).getTime() - new Date(ticks[0]).getTime() : HOUR_MS;
  // For tick intervals of less than 1 hour, we should use converted minutes.
  const isIntervalLessThanHour = Math.abs(ticks.length * intervalMs) < HOUR_MS;
  if (isIntervalLessThanHour) {
    return `${Math.round((tickTime - Date.now()) / MINUTE_MS)}m`;
  }
  if (intervalMs < HOUR_MS) {
    const inMin = Math.abs(Math.round((tickTime - Date.now()) / MINUTE_MS));
    const rem = inMin % 60;
    const mod = inMin >= 60 ? Math.floor(inMin / 60) : 0;
    return `-${mod}:${String(rem).padStart(2, '0')}`;
  }
  const datePart =
    getDayOfWeek(dateTickTime.getDay()) +
    ' ' +
    dateTickTime.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  return (
    datePart +
    '\n' +
    dateTickTime.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
  );
};

export const getDayOfWeek = (day: number): string => {
  switch (day) {
    case 0:
      return 'Sun';
    case 1:
      return 'Mon';
    case 2:
      return 'Tue';
    case 3:
      return 'Wed';
    case 4:
      return 'Thu';
    case 5:
      return 'Fri';
    case 6:
      return 'Sat';
    default:
      return '';
  }
};

// Shared by time series charts (eg. Sync Activity and Reconciliation) to format thedependent (Y) axes.
const numberFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  compactDisplay: 'short',
});

export const countTickFormat = (time: any): string =>
  numberFormatter.format(Number.parseInt(time, 10));

// Time series charts' dependent (Y) axes plot discrete counts and NOT fractional tick values.
// Rounding instead of truncating will not fix this. (0.2/0.4 -> 0, 0.6/0.8 -> 1 still collides) --
// The fix has to happen when generating the ticks and not when formatting the ticks.
////
// This version picks a genuinely "nice" step instead -- from the same 1/2/5 x 10^n family d3's own
// `tickIncrement` picks from for larger domains, just floored to a minimum of 1 since these axes only
// ever plot whole numbers.
const NICE_STEP_SQRT_2 = Math.sqrt(2); // ~1.414 -- d3's threshold between a "1" and "2" step.
const NICE_STEP_SQRT_10 = Math.sqrt(10); // ~3.162 -- d3's threshold between a "2" and "5" step.
const NICE_STEP_SQRT_50 = Math.sqrt(50); // ~7.071 -- d3's threshold between a "5" and "10" step.

const getNiceIntegerStep = (rawStep: number): number => {
  const clamped = Math.max(rawStep, 1);
  const power = Math.floor(Math.log10(clamped));
  const base = Math.pow(10, power);
  const error = clamped / base;

  const multiple =
    /* eslint-disable-next-line no-nested-ternary */
    error >= NICE_STEP_SQRT_50
      ? 10 /* eslint-disable-next-line no-nested-ternary */
      : error >= NICE_STEP_SQRT_10
      ? 5
      : error >= NICE_STEP_SQRT_2
      ? 2
      : 1;
  return Math.max(1, Math.round(multiple * base));
};

export type CountAxisConfig = { tickValues: number[]; domainMax: number };

export const getCountAxisConfig = (maxY: number, headroom = 1.2, maxTicks = 5): CountAxisConfig => {
  const target = Math.max(maxY, 1) * headroom;
  const step = getNiceIntegerStep(target / maxTicks);
  const domainMax = step * Math.ceil(target / step);
  const tickValues: number[] = [];
  for (let v = 0; v <= domainMax; v += step) {
    tickValues.push(v);
  }
  return { tickValues, domainMax };
};

// Similar to Console's metric chart empty state (`GraphEmpty` in `graph-empty.tsx`, used by `QueryBrowser.tsx`)
// Shown when a Prometheus query returns no data point.
export const NoDataPointsFound: React.FC<{ height: number }> = ({ height }) => (
  <div
    style={{
      alignItems: 'center',
      display: 'flex',
      height,
      justifyContent: 'center',
      width: '100%',
    }}
  >
    <div className="pf-v6-u-text-color-subtle">{t('No datapoints found.')}</div>
  </div>
);

// Assisted by AI agent so our charts will behave like Console's own metrics chart. See comments below
// for AI agent's generated documenation. It works well.
//
// Tracks the actual rendered pixel width of a time series chart container div (via the returned callback
// ref), so it can be fed back into that chart's own `<Chart width={...}>` prop. This makes
// Victory recompute its real layout (axis positions, tick spacing, line points) for the
// container's exact current width, so text renders at its native, undistorted size
//
// This mirrors Console's own metrics chart, `QueryBrowser.tsx`'s `useRefWidth` hook (also just a
// ref + measured width fed into `<Chart width={width}>`) -- `ResizeObserver` is used here instead
// of `useRefWidth`'s `window.resize`/`sidebar_toggle` event listeners since it directly observes
// this specific element instead of assuming what else might resize it.
//
// The returned ref *must* be a callback ref, not a plain `useRef` + a `useEffect(..., [])`: the
// chart div this gets attached to only renders once its own `promLoaded`/`promError` (from the
// async `usePrometheusPoll` call) resolves, which happens well after the component's first
// render. A `[]`-deps effect only runs once, immediately after that *first* render -- at which
// point the div doesn't exist yet, so `.current` would be `null` and the observer would never
// actually get created, leaving the width stuck at its initial default forever. A callback ref
// instead fires exactly when React actually attaches (or detaches) the DOM node, whenever that
// happens to be.
//
// Each chart calls this separately (its own `useState`/`useRef`/callback, not shared) rather than
// both charts sharing one `ResizeObserver` instance: a shared instance only ever tracks whichever
// div's ref callback fired *most* recently, silently disconnecting from the other -- invisible
// today only because both charts' `GridItem`s happen to use identical breakpoints (so they're
// always the same width regardless of which one is actually being observed), but fragile if that
// ever changes.
export function useChartContainerWidth(
  defaultWidth: number,
): [number, (el: HTMLDivElement | null) => void] {
  const [width, setWidth] = React.useState(defaultWidth);
  const resizeObserverRef = React.useRef<ResizeObserver | null>(null);
  const containerRef = React.useCallback((el: HTMLDivElement | null) => {
    resizeObserverRef.current?.disconnect();
    resizeObserverRef.current = null;
    if (!el) {
      return;
    }
    setWidth(el.getBoundingClientRect().width);
    const resizeObserver = new ResizeObserver(([entry]) => {
      if (entry) {
        setWidth(entry.contentRect.width);
      }
    });
    resizeObserver.observe(el);
    resizeObserverRef.current = resizeObserver;
  }, []);
  return [width, containerRef];
}

// All of our cards will accept a namespace since the project can be specific or All Projects.
export interface OverviewCardProps {
  namespace?: string;
}

// For legendData property of a ChartDonut
export interface LegendData {
  name: string;
  symbol: { type: string };
  url: string;
  // link: string;
  linkText: string;
  suffixText: string;
}

// For data property of a ChartDonut
export interface ChartData {
  x?: string;
  y?: number;
}

// Renders a `ChartLegend` label's text as a link to the matching filtered Application list
// linkText that matches will have the link.  Other text will just be regular text.
export const LinkedTSpan = ({ linkText, to, children, ...props }: any) => {
  const tspan = <TSpan {...props}>{children}</TSpan>;
  return children === linkText ? (
    <Link to={to} onClick={(e) => e.stopPropagation()} className="gitops-dashboard__link">
      {tspan}
    </Link>
  ) : (
    tspan
  );
};

export const loadingState = () => {
  return (
    <EmptyState
      variant="sm"
      className="gitops-dashboard__half-size-empty-state"
      titleText={t('Loading...')}
      status="custom"
      icon={Spinner}
    />
  );
};

export const errorState = (errorTitle: string, errorMessage: string) => {
  return (
    <ErrorState
      titleText={errorTitle}
      status="danger"
      customFooter={<></>} // Hide the button
      bodyText={errorMessage}
    />
  );
};

export const StatusChartLegendLabel = ({ datum, ...props }: any) => {
  return (
    <ChartLabel
      {...props}
      inline={true}
      text={[datum?.linkText, datum?.suffixText]}
      tspanComponent={<LinkedTSpan linkText={datum?.linkText} to={datum?.url} />}
      style={[
        {
          ...props.style,
          fontSize: 12,
          cursor: 'pointer',
          textDecoration: 'underline',
          textDecorationStyle: 'dashed',
          fill: 'var(--pf-t--global--text--color--link--default)',
          height: 12,
        },
        {
          ...props.style,
          fontSize: 12,
          height: 12,
        },
      ]}
    />
  );
};

export const getNamespacePath = (namespace: string): string =>
  !namespace ? '/all-namespaces' : `/ns/${namespace}`;

export const DEFAULT_GITOPS_OPERATOR_NAMESPACE = 'openshift-gitops-operator';
