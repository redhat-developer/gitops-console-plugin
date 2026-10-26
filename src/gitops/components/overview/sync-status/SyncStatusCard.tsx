import * as React from 'react';

import { APPLICATION_SYNC_UNKNOWN_FILTER_ID } from '@gitops/components/shared/applicationListFilters';
import { ApplicationKind } from '@gitops/models/ApplicationModel';
import { SyncStatus } from '@gitops/utils/constants';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { ChartDonut, ChartLegend, ChartTooltip } from '@patternfly/react-charts/victory';
import { Card, CardBody, CardTitle } from '@patternfly/react-core';

import {
  ChartData,
  errorState,
  getNamespacePath,
  LegendData,
  loadingState,
  OverviewCardForApplicationsProps,
  StatusChartLegendLabel,
} from '../chartHelpers';

// Shared dashboard-wide styles across all cards
import '../DashboardOverviewPage.scss';

// Self-contained "Sync status" dashboard card, that watches Applications
const SyncStatusCard: React.FC<OverviewCardForApplicationsProps> = ({
  namespace,
  applications,
  isAppsLoaded,
  appsLoadedError,
}) => {
  const namespacePath = getNamespacePath(namespace);
  const appsCount = applications.length ? applications.length : 0;
  const syncStatus = applications.map(
    (application: ApplicationKind) => application.status?.sync?.status,
  );

  const syncStatusCount = syncStatus.reduce((acc, status) => {
    if (status === 'Synced') {
      acc[SyncStatus.SYNCED] = (acc[SyncStatus.SYNCED] || 0) + 1;
    } else if (status === 'OutOfSync') {
      acc[SyncStatus.OUT_OF_SYNC] = (acc[SyncStatus.OUT_OF_SYNC] || 0) + 1;
    } else {
      acc[SyncStatus.UNKNOWN] = (acc[SyncStatus.UNKNOWN] || 0) + 1;
    }
    return acc;
  }, {});

  const actualSyncedCount = syncStatusCount[SyncStatus.SYNCED] || 0;
  const actualOutOfSyncCount = syncStatusCount[SyncStatus.OUT_OF_SYNC] || 0;
  const actualSyncUnknownCount = syncStatusCount[SyncStatus.UNKNOWN] || 0;
  const syncStatusChartData: ChartData[] = [
    { x: SyncStatus.SYNCED, y: actualSyncedCount },
    { x: SyncStatus.OUT_OF_SYNC, y: actualOutOfSyncCount },
    { x: SyncStatus.UNKNOWN, y: actualSyncUnknownCount },
  ];
  const syncedPercentage =
    appsCount === 0 || actualSyncedCount == 0 ? 0 : (actualSyncedCount / appsCount) * 100;
  const outOfSyncPercentage =
    appsCount === 0 || actualOutOfSyncCount == 0 ? 0 : (actualOutOfSyncCount / appsCount) * 100;
  const syncUnknownPercentage =
    appsCount === 0 || actualSyncUnknownCount == 0 ? 0 : (actualSyncUnknownCount / appsCount) * 100;

  const syncStatusLegendData: LegendData[] = [
    {
      name: `Synced: ${actualSyncedCount} (${syncedPercentage.toFixed(0)}%)`,
      symbol: { type: 'circle' },
      url: '/k8s/' + namespacePath + '/argoproj.io~v1alpha1~Application?rowFilter-app-sync=Synced',
      linkText: `Synced`,
      suffixText: `: ${actualSyncedCount} (${syncedPercentage.toFixed(0)}%)`,
    },
    {
      name: `OutOfSync: ${actualOutOfSyncCount} (${outOfSyncPercentage.toFixed(0)}%)`,
      symbol: { type: 'circle' },
      url:
        '/k8s/' + namespacePath + '/argoproj.io~v1alpha1~Application?rowFilter-app-sync=OutOfSync',
      linkText: `OutOfSync`,
      suffixText: `: ${actualOutOfSyncCount} (${outOfSyncPercentage.toFixed(0)}%)`,
    },
    {
      name: `Unknown: ${actualSyncUnknownCount} (${syncUnknownPercentage.toFixed(0)}%)`,
      symbol: { type: 'circle' },
      url:
        '/k8s/' +
        namespacePath +
        '/argoproj.io~v1alpha1~Application?rowFilter-app-sync=' +
        APPLICATION_SYNC_UNKNOWN_FILTER_ID,
      linkText: `Unknown`,
      suffixText: `: ${actualSyncUnknownCount} (${syncUnknownPercentage.toFixed(0)}%)`,
    },
  ];

  return (
    <Card className="gitops-dashboard__fixed-height-row-card">
      <CardTitle>{t('Sync status')}</CardTitle>
      <CardBody className="gitops-dashboard__donut-card-body">
        {/* eslint-disable-next-line no-nested-ternary */}
        {!isAppsLoaded && !appsLoadedError ? (
          <div>{loadingState()}</div>
        ) : appsLoadedError ? (
          <div>
            {errorState(
              t('Unable to retrieve applications'),
              t('Error retrieving applications: {{x}}', { x: String(appsLoadedError) }),
            )}
          </div>
        ) : (
          <div className="gitops-dashboard__donut-container">
            <ChartDonut
              ariaDesc="Sync status"
              ariaTitle="Sync status"
              animate={true}
              constrainToVisibleArea
              data={syncStatusChartData}
              height={270}
              width={270}
              labels={({ datum }) => `${datum.x}: ${datum.y}`}
              legendData={syncStatusLegendData}
              legendPosition="bottom"
              legendOrientation="vertical"
              colorScale={[
                'var(--pf-t--global--dark--color--status--success--100)',
                'var(--pf-t--global--dark--color--status--warning--100)',
                'rgb(204, 214, 221)',
              ]}
              name="SyncStatus"
              padding={{
                bottom: 150,
                left: 20,
                right: 20,
                top: 20,
              }}
              labelComponent={
                <ChartTooltip
                  constrainToVisibleArea
                  style={{
                    fontSize: 12,
                  }}
                />
              }
              legendComponent={
                <ChartLegend
                  labelComponent={<StatusChartLegendLabel />}
                  style={{ labels: { fontSize: 12 } }}
                  symbolSpacer={8}
                  rowGutter={0}
                />
              }
              title={appsCount.toString()}
              subTitle={t('Apps')}
            />
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default SyncStatusCard;
