import * as React from 'react';

import ExternalLink from '@gitops/utils/components/ExternalLink/ExternalLink';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { prometheusResultToTimeSeries } from '@gitops/utils/prometheusChartData';
import { PrometheusEndpoint, usePrometheusPoll } from '@openshift-console/dynamic-plugin-sdk';
import {
  Chart,
  ChartAxis,
  ChartGroup,
  ChartLine,
  ChartThemeColor,
  ChartVoronoiContainer,
} from '@patternfly/react-charts/victory';
import { Card, CardBody, CardTitle } from '@patternfly/react-core';

import {
  ChartCursorLine,
  countTickFormat,
  errorState,
  getCountAxisConfig,
  loadingState,
  NoDataPointsFound,
  OverviewCardProps,
  relativeTimeTickFormat,
  RelativeTimeTickLabel,
  useChartContainerWidth,
  Y_AXIS_STYLE,
} from '../chartHelpers';

// Shared dashboard-wide styles across all cards
import '../DashboardOverviewPage.scss';

// This chart's actual plot-area padding (reserving space for axis labels/ticks around the data).
// Shared with `voronoiPadding` below so the two can never drift apart. See comment below.
const RECONCILE_CHART_PADDING = { bottom: 50, left: 60, right: 25, top: 10 };

const legendData = [
  {
    name: 'Reconciliation Performance (s)',
    childName: 'RECONCILIATION_PERFORMANCE', // See Chartline below
    symbol: { type: 'square', fill: 'var(--pf-t--global--color--nonstatus--blue--default)' },
  },
];

// Self-contained "Application Reconciliation Performance" dashboard card
// See also SyncActivitCard, which is similar in construction.
const ReconciliationCard: React.FC<OverviewCardProps> = ({ namespace }) => {
  const prometheusQuery =
    'sum(increase(argocd_app_reconcile_count{' +
    (namespace ? `namespace='` + namespace + `'` : '') +
    '}[24h])) or on() vector(0)';
  const [result, promLoaded, promError] = usePrometheusPoll({
    endpoint: PrometheusEndpoint.QUERY_RANGE,
    query: prometheusQuery,
    delay: 10 * 1000, // null to not update
    timespan: 24 * 60 * 60 * 1000,
    samples: 240,
  });

  const chartData = React.useMemo(() => prometheusResultToTimeSeries(result), [result]);
  const chartYMax = React.useMemo(() => {
    const maxY = chartData.reduce((max, { y }) => Math.max(max, y), 0);
    return maxY > 0 ? Math.ceil(maxY) : 10;
  }, [chartData]);

  // See `getCountAxisConfig`'s comment (in `chartHelpers.tsx`) -- `domainMax` here replaces this
  // chart's previous `chartYMax * 1.5` `maxDomain` multiplier; the `1.5` headroom factor itself is
  // preserved as-is (just now applied *before* picking a step, not after).
  const reconcileYAxisConfig = React.useMemo(() => getCountAxisConfig(chartYMax, 1.2), [chartYMax]);

  // See `useChartContainerWidth`'s comment (in `chartHelpers.tsx`) for why each chart tracks its
  // own container width independently.
  const [reconcileChartWidth, reconcileChartContainerRef] = useChartContainerWidth(675);

  // Adaptive tick count (replaces a fixed one-tick-per-hour `tickValues` array), matching
  // Console's own `QueryBrowser.tsx`. Let Victory's underlying e3 time scale pick the best fit in
  // terms of the number of ticks on the x-axis.
  const reconcileXAxisTickCount = Math.round(reconcileChartWidth / 100);

  return (
    <Card className="gitops-dashboard__reconcile-card">
      <CardTitle>{t('Application Reconciliation Performance (24 hours)')}</CardTitle>
      <CardBody className="gitops-dashboard__reconcile-card-body">
        {/* eslint-disable-next-line no-nested-ternary */}
        {!promLoaded && !promError ? (
          <div>{loadingState()}</div>
        ) : promError ? (
          <div>
            {errorState(
              t('Unable to retrieve metrics data'),
              t('Error occurred running query on reconciliation metric: ' + promError),
            )}
          </div>
        ) : (
          <>
            <div className="gitops-dashboard__chart-container" ref={reconcileChartContainerRef}>
              {chartData.length === 0 ? (
                <NoDataPointsFound height={190} />
              ) : (
                <Chart
                  ariaDesc={t('Application reconciliation performance over time')}
                  containerComponent={
                    <ChartVoronoiContainer
                      activateData={false}
                      labels={({ datum }) => `${Number.parseInt(datum.y)}`}
                      labelComponent={
                        <ChartCursorLine
                          legendData={legendData}
                          constrainToVisibleArea
                          title={(datum) =>
                            new Date(datum.x).toLocaleString(undefined, {
                              dateStyle: 'medium',
                              timeStyle: 'medium',
                              hour12: true,
                            })
                          }
                        />
                      }
                      constrainToVisibleArea
                      mouseFollowTooltips
                      // Only consider x-axis for voronoi selection
                      voronoiDimension="x"
                      // This is needed so that the tooltip shows only when hovering over the chart.
                      // It works nicely. From AI agent:
                      //
                      // The cast is needed because PatternFly's own `ChartVoronoiContainer` type
                      // narrows `voronoiPadding` to `number` only, even though the underlying
                      // `victory-voronoi-container`/`victory-core` runtime (and even *its own*
                      // type, `PaddingProps`) fully supports a per-side object via
                      // `Helpers.getPadding` -- PatternFly's wrapper just spreads `...rest`
                      // through unchanged, so this is a type-definition gap, not a real runtime
                      // restriction.
                      voronoiPadding={RECONCILE_CHART_PADDING as unknown as number}
                    />
                  }
                  height={190}
                  // Victory recalculates its layout for the real width as the card resizes.
                  width={reconcileChartWidth}
                  maxDomain={{ y: reconcileYAxisConfig.domainMax }}
                  minDomain={{ y: 0 }}
                  name="ReconciliationActivity"
                  padding={RECONCILE_CHART_PADDING}
                  // Scale must be set here, on the top-level `<Chart>` and not on the nested `<ChartAxis>` below.
                  scale={{ x: 'time', y: 'linear' }}
                  themeColor={ChartThemeColor.default}
                >
                  <ChartAxis
                    tickCount={reconcileXAxisTickCount}
                    tickFormat={relativeTimeTickFormat}
                    tickLabelComponent={<RelativeTimeTickLabel />}
                  />
                  <ChartAxis
                    dependentAxis
                    showGrid
                    tickFormat={countTickFormat}
                    tickValues={reconcileYAxisConfig.tickValues}
                    style={Y_AXIS_STYLE}
                  />
                  <ChartGroup>
                    <ChartLine
                      data={chartData}
                      name="RECONCILIATION_PERFORMANCE"
                      style={{
                        data: {
                          stroke: 'var(--pf-t--global--color--nonstatus--blue--default)',
                        },
                      }}
                    />
                  </ChartGroup>
                </Chart>
              )}
            </div>
            <ExternalLink href={'/monitoring/query-browser?units=short&query0=' + prometheusQuery}>
              {t('View in Observe/Metrics')}
            </ExternalLink>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default ReconciliationCard;
