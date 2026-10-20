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

import '../DashboardOverviewPage.scss';

// This chart's actual plot-area padding (reserving space for axis labels/ticks around the data).
// Shared with `voronoiPadding` below so the two can never drift apart. See comment below.
const SYNC_CHART_PADDING = { bottom: 50, left: 60, right: 25, top: 10 };

// Self-contained "Application Sync Activity" dashboard card
const SyncActivityCard: React.FC<OverviewCardProps> = ({ namespace }) => {
  // See Console's `QueryBrowser.tsx` when fanning one poll out across multiple queries.
  // Use same strategy to compute `now` once for all queries's endTime so the time range X values are the same.
  const [syncChartsEndTime, setSyncChartsEndTime] = React.useState(() => Date.now());
  React.useEffect(() => {
    const interval = setInterval(() => setSyncChartsEndTime(Date.now()), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const appsSyncedPQ =
    `sum(argocd_app_info{sync_status='Synced'` +
    (namespace ? `, namespace='` + namespace + `'` : '') +
    `}) or on() vector(0)`;
  const [resultAppsSyncedPQ, loadedAppsSyncedPQ, errorAppsSyncedPQ] = usePrometheusPoll({
    endpoint: PrometheusEndpoint.QUERY_RANGE,
    query: appsSyncedPQ,
    delay: 5 * 1000,
    endTime: syncChartsEndTime,
    timespan: 24 * 60 * 60 * 1000,
    samples: 240,
  });

  const appsOutOfSyncPQ =
    `sum(argocd_app_info{sync_status='OutOfSync'` +
    (namespace ? `, namespace='` + namespace + `'` : '') +
    `}) or on() vector(0)`;
  const [resultAppsOutOfSyncPQ, loadedAppsOutOfSyncPQ, errorAppsOutOfSyncPQ] = usePrometheusPoll({
    endpoint: PrometheusEndpoint.QUERY_RANGE,
    query: appsOutOfSyncPQ,
    delay: 5 * 1000,
    endTime: syncChartsEndTime,
    timespan: 24 * 60 * 60 * 1000,
    samples: 240,
  });

  // Counter for application sync history.
  const numberOfSyncsPQ =
    'sum(increase(argocd_app_sync_total{' +
    (namespace ? `namespace='` + namespace + `'` : '') +
    '}[24h])) or on() vector(0)';
  const [resultNumberOfSyncsPQ, loadedNumberOfSyncsPQ, errorNumberOfSyncsPQ] = usePrometheusPoll({
    endpoint: PrometheusEndpoint.QUERY_RANGE,
    query: numberOfSyncsPQ,
    delay: 5 * 1000,
    endTime: syncChartsEndTime,
    timespan: 24 * 60 * 60 * 1000,
    samples: 240,
  });

  const syncChartData = React.useMemo(
    () => prometheusResultToTimeSeries(resultNumberOfSyncsPQ),
    [resultNumberOfSyncsPQ],
  );
  const syncChartYMax = React.useMemo(() => {
    const maxY = syncChartData.reduce((max, { y }) => Math.max(max, y), 0);
    return maxY > 0 ? Math.ceil(maxY) : 10;
  }, [syncChartData]);

  const syncedChartData = React.useMemo(
    () => prometheusResultToTimeSeries(resultAppsSyncedPQ),
    [resultAppsSyncedPQ],
  );
  const syncedChartYMax = React.useMemo(() => {
    const maxY = syncedChartData.reduce((max, { y }) => Math.max(max, y), 0);
    return maxY > 0 ? Math.ceil(maxY) : 10;
  }, [syncedChartData]);

  const outOfSyncChartData = React.useMemo(
    () => prometheusResultToTimeSeries(resultAppsOutOfSyncPQ),
    [resultAppsOutOfSyncPQ],
  );
  const outOfSyncChartYMax = React.useMemo(() => {
    const maxY = outOfSyncChartData.reduce((max, { y }) => Math.max(max, y), 0);
    return maxY > 0 ? Math.ceil(maxY) : 10;
  }, [outOfSyncChartData]);

  const syncChartCombinedYMax = Math.max(syncChartYMax, syncedChartYMax, outOfSyncChartYMax);

  const syncYAxisConfig = React.useMemo(
    () => getCountAxisConfig(syncChartCombinedYMax, 1.2),
    [syncChartCombinedYMax],
  );

  const syncLegendData = [
    {
      name: t('Syncs (24h sliding window)'),
      childName: 'SYNCHRONIZATIONS_COUNT', // See Chartline below
      symbol: { type: 'square', fill: 'var(--pf-t--global--color--nonstatus--blue--default)' },
    },
    {
      name: t('Synced'),
      childName: 'SYNCED_APPS_COUNT', // See Chartline below
      symbol: { type: 'square', fill: 'var(--pf-t--global--color--nonstatus--green--default)' },
    },
    {
      name: t('Out of Sync'),
      childName: 'OUT_OF_SYNC_APPS_COUNT', // See Chartline below
      symbol: { type: 'square', fill: 'var(--pf-t--global--color--nonstatus--yellow--default)' },
    },
  ];

  // See `useChartContainerWidth`'s comment (in `chartHelpers.tsx`) for why each chart tracks its
  // own container width independently.
  const [syncChartWidth, syncChartContainerRef] = useChartContainerWidth(675);

  // Adaptive tick count (replaces a fixed one-tick-per-hour `tickValues` array), matching
  // Console's own `QueryBrowser.tsx`. Let Victory's underlying e3 time scale pick the best fit in
  // terms of the number of ticks on the x-axis.
  const syncXAxisTickCount = Math.round(syncChartWidth / 100);

  return (
    <Card className="gitops-dashboard__reconcile-card">
      <CardTitle>{t('Application Sync Activity (24 hours)')}</CardTitle>
      <CardBody className="gitops-dashboard__reconcile-card-body">
        {/* eslint-disable-next-line no-nested-ternary */}
        {(!loadedNumberOfSyncsPQ && !errorNumberOfSyncsPQ) ||
        (!loadedAppsSyncedPQ && !errorAppsSyncedPQ) ||
        (!loadedAppsOutOfSyncPQ && !errorAppsOutOfSyncPQ) ? (
          <div>{loadingState()}</div>
        ) : /* eslint-disable-next-line no-nested-ternary */
        errorNumberOfSyncsPQ ? (
          <div>
            {errorState(
              t('Unable to retrieve metrics data'),
              t('Error occurred running query on Sync count: ' + errorNumberOfSyncsPQ),
            )}
          </div>
        ) : /* eslint-disable-next-line no-nested-ternary */
        errorAppsSyncedPQ ? (
          <div>
            {errorState(
              t('Unable to retrieve metrics data'),
              t('Error occurred running query on Synced apps: ' + errorAppsSyncedPQ),
            )}
          </div>
        ) : errorAppsOutOfSyncPQ ? (
          <div>
            {errorState(
              t('Unable to retrieve metrics data'),
              t('Error occurred running query on Out of Sync apps: ' + errorAppsOutOfSyncPQ),
            )}
          </div>
        ) : (
          <>
            <div className="gitops-dashboard__chart-container" ref={syncChartContainerRef}>
              {syncChartData.length === 0 ? (
                <NoDataPointsFound height={190} />
              ) : (
                <Chart
                  ariaDesc={t('Application sync activity over time')}
                  containerComponent={
                    <ChartVoronoiContainer
                      activateData={false}
                      labels={({ datum }) => `${Number.parseInt(datum.y)}`}
                      labelComponent={
                        <ChartCursorLine
                          legendData={syncLegendData}
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
                      voronoiPadding={SYNC_CHART_PADDING as unknown as number}
                    />
                  }
                  height={190}
                  // Victory recalculates its layout for the real width as the card resizes.
                  width={syncChartWidth}
                  maxDomain={{ y: syncYAxisConfig.domainMax }}
                  minDomain={{ y: 0 }}
                  name="SynchronizationActivity"
                  padding={SYNC_CHART_PADDING}
                  // Scale must be set here, on the top-level `<Chart>` and not on the nested `<ChartAxis>` below.
                  scale={{ x: 'time', y: 'linear' }}
                  themeColor={ChartThemeColor.default}
                >
                  <ChartAxis
                    tickCount={syncXAxisTickCount}
                    tickFormat={relativeTimeTickFormat}
                    tickLabelComponent={<RelativeTimeTickLabel />}
                  />
                  <ChartAxis
                    dependentAxis
                    showGrid
                    tickFormat={countTickFormat}
                    tickValues={syncYAxisConfig.tickValues}
                    style={Y_AXIS_STYLE}
                  />
                  <ChartGroup>
                    <ChartLine
                      data={syncChartData}
                      name="SYNCHRONIZATIONS_COUNT" // See syncLegendData
                      style={{
                        data: {
                          stroke: 'var(--pf-t--global--color--nonstatus--blue--default)',
                        },
                      }}
                    />
                    <ChartLine
                      data={syncedChartData}
                      name="SYNCED_APPS_COUNT" // See syncLegendData
                      style={{
                        data: {
                          stroke: 'var(--pf-t--global--color--nonstatus--green--default)',
                        },
                      }}
                    />
                    <ChartLine
                      data={outOfSyncChartData}
                      name="OUT_OF_SYNC_APPS_COUNT" // See syncLegendData
                      style={{
                        data: {
                          stroke: 'var(--pf-t--global--color--nonstatus--yellow--default)',
                        },
                      }}
                    />
                  </ChartGroup>
                </Chart>
              )}
            </div>
            <ExternalLink
              href={
                '/monitoring/query-browser?units=short&query0=' +
                numberOfSyncsPQ +
                '&query1=' +
                appsSyncedPQ +
                '&query2=' +
                appsOutOfSyncPQ
              }
            >
              {t('View in Observe/Metrics')}
            </ExternalLink>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default SyncActivityCard;
