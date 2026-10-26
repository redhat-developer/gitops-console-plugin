import * as React from 'react';

import { ApplicationKind } from '@gitops/models/ApplicationModel';
import { HealthStatus } from '@gitops/utils/constants';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { K8sResourceCommon, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { ChartDonut, ChartLegend, ChartTooltip } from '@patternfly/react-charts/victory';
import { Card, CardBody, CardTitle } from '@patternfly/react-core';

import {
  ChartData,
  errorState,
  getNamespacePath,
  LegendData,
  loadingState,
  OverviewCardProps,
  StatusChartLegendLabel,
} from '../chartHelpers';

// Shared dashboard-wide styles across all cards
import '../DashboardOverviewPage.scss';

// Self-contained "Health status" dashboard card, that watches Applications
const HealthStatusCard: React.FC<OverviewCardProps> = ({ namespace }) => {
  const [applications, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    isList: true,
    groupVersionKind: {
      group: 'argoproj.io',
      kind: 'Application',
      version: 'v1alpha1',
    },
    namespaced: !!namespace,
    namespace,
  });

  const namespacePath = getNamespacePath(namespace);
  const appsCount = applications.length ? applications.length : 0;
  const healthStatus = applications.map(
    (application: ApplicationKind) => application.status?.health?.status,
  );

  const healthStatusCount = healthStatus.reduce((acc, status) => {
    switch (status) {
      case HealthStatus.HEALTHY:
        acc[HealthStatus.HEALTHY] = (acc[HealthStatus.HEALTHY] || 0) + 1;
        break;
      case HealthStatus.PROGRESSING:
        acc[HealthStatus.PROGRESSING] = (acc[HealthStatus.PROGRESSING] || 0) + 1;
        break;
      case HealthStatus.DEGRADED:
        acc[HealthStatus.DEGRADED] = (acc[HealthStatus.DEGRADED] || 0) + 1;
        break;
      case HealthStatus.MISSING:
        acc[HealthStatus.MISSING] = (acc[HealthStatus.MISSING] || 0) + 1;
        break;
      case HealthStatus.SUSPENDED:
        acc[HealthStatus.SUSPENDED] = (acc[HealthStatus.SUSPENDED] || 0) + 1;
        break;
      case HealthStatus.UNKNOWN:
        acc[HealthStatus.UNKNOWN] = (acc[HealthStatus.UNKNOWN] || 0) + 1;
        break;
      default:
        acc[HealthStatus.UNKNOWN] = (acc[HealthStatus.UNKNOWN] || 0) + 1;
        break;
    }
    return acc;
  }, {});

  const actualHealthyCount = healthStatusCount[HealthStatus.HEALTHY] || 0;
  const actualProgressingCount = healthStatusCount[HealthStatus.PROGRESSING] || 0;
  const actualDegradedCount = healthStatusCount[HealthStatus.DEGRADED] || 0;
  const actualMissingCount = healthStatusCount[HealthStatus.MISSING] || 0;
  const actualSuspendedCount = healthStatusCount[HealthStatus.SUSPENDED] || 0;
  const actualUnknownCount = healthStatusCount[HealthStatus.UNKNOWN] || 0;

  const healthStatusChartData: ChartData[] = [
    { x: HealthStatus.HEALTHY, y: actualHealthyCount },
    { x: HealthStatus.PROGRESSING, y: actualProgressingCount },
    { x: HealthStatus.DEGRADED, y: actualDegradedCount },
    { x: HealthStatus.MISSING, y: actualMissingCount },
    { x: HealthStatus.SUSPENDED, y: actualSuspendedCount },
    { x: HealthStatus.UNKNOWN, y: actualUnknownCount },
  ];

  const healthyPercentage =
    appsCount === 0 || actualHealthyCount == 0 ? 0 : (actualHealthyCount / appsCount) * 100;
  const progressingPercentage =
    appsCount === 0 || actualProgressingCount == 0 ? 0 : (actualProgressingCount / appsCount) * 100;
  const degradedPercentage =
    appsCount === 0 || actualDegradedCount == 0 ? 0 : (actualDegradedCount / appsCount) * 100;
  const missingPercentage =
    appsCount === 0 || actualMissingCount == 0 ? 0 : (actualMissingCount / appsCount) * 100;
  const suspendedPercentage =
    appsCount === 0 || actualSuspendedCount == 0 ? 0 : (actualSuspendedCount / appsCount) * 100;
  const unknownPercentage =
    appsCount === 0 || actualUnknownCount == 0 ? 0 : (actualUnknownCount / appsCount) * 100;

  const healthStatusLegendData: LegendData[] = [
    {
      name: `Healthy: ${actualHealthyCount} (${healthyPercentage.toFixed(0)}%)`,
      symbol: { type: 'circle' },
      url:
        '/k8s/' + namespacePath + '/argoproj.io~v1alpha1~Application?rowFilter-app-health=Healthy',
      linkText: t('Healthy'),
      suffixText: `: ${actualHealthyCount} (${healthyPercentage.toFixed(0)}%)`,
    },
    {
      name: `Progressing: ${actualProgressingCount} (${progressingPercentage.toFixed(0)}%)`,
      symbol: { type: 'circle' },
      url:
        '/k8s/' +
        namespacePath +
        '/argoproj.io~v1alpha1~Application?rowFilter-app-health=Progressing',
      linkText: t('Progressing'),
      suffixText: `: ${actualProgressingCount} (${progressingPercentage.toFixed(0)}%)`,
    },
    {
      name: `Degraded: ${actualDegradedCount} (${degradedPercentage.toFixed(0)}%)`,
      symbol: { type: 'circle' },
      url:
        '/k8s/' + namespacePath + '/argoproj.io~v1alpha1~Application?rowFilter-app-health=Degraded',
      linkText: t('Degraded'),
      suffixText: `: ${actualDegradedCount} (${degradedPercentage.toFixed(0)}%)`,
    },
    {
      name: `Missing: ${actualMissingCount} (${missingPercentage.toFixed(0)}%)`,
      symbol: { type: 'circle' },
      url:
        '/k8s/' + namespacePath + '/argoproj.io~v1alpha1~Application?rowFilter-app-health=Missing',
      linkText: t('Missing'),
      suffixText: `: ${actualMissingCount} (${missingPercentage.toFixed(0)}%)`,
    },
    {
      name: `Suspended: ${actualSuspendedCount} (${suspendedPercentage.toFixed(0)}%)`,
      symbol: { type: 'circle' },
      url:
        '/k8s/' +
        namespacePath +
        '/argoproj.io~v1alpha1~Application?rowFilter-app-health=Suspended',
      linkText: t('Suspended'),
      suffixText: `: ${actualSuspendedCount} (${suspendedPercentage.toFixed(0)}%)`,
    },
    {
      name: `Unknown: ${actualUnknownCount} (${unknownPercentage.toFixed(0)}%)`,
      symbol: { type: 'circle' },
      url:
        '/k8s/' + namespacePath + '/argoproj.io~v1alpha1~Application?rowFilter-app-health=Unknown',
      linkText: t('Unknown'),
      suffixText: `: ${actualUnknownCount} (${unknownPercentage.toFixed(0)}%)`,
    },
  ];

  return (
    <Card className="gitops-dashboard__fixed-height-row-card">
      <CardTitle>{t('Health status')}</CardTitle>
      <CardBody className="gitops-dashboard__donut-card-body">
        {/* eslint-disable-next-line no-nested-ternary */}
        {!loaded && !loadError ? (
          <div>{loadingState()}</div>
        ) : loadError ? (
          <div>
            {errorState(
              t('Unable to retrieve applications'),
              t('Error retrieving applications: {{x}}', { x: String(loadError) }),
            )}
          </div>
        ) : (
          <div className="gitops-dashboard__donut-container">
            <ChartDonut
              ariaDesc="Health status"
              ariaTitle="Health status"
              animate={true}
              constrainToVisibleArea
              data={healthStatusChartData}
              height={270}
              width={270}
              labels={({ datum }) => `${datum.x}: ${datum.y}`}
              legendData={healthStatusLegendData}
              legendPosition="bottom"
              legendOrientation="vertical"
              colorScale={[
                'var(--pf-t--global--color--status--success--default)',
                'var(--pf-t--global--color--nonstatus--blue--default)',
                'var(--pf-t--global--color--status--danger--default)',
                'var(--pf-t--global--color--status--warning--default)',
                'var(--pf-t--global--color--nonstatus--purple--default)',
                'rgb(204, 214, 221)',
              ]}
              name="HealthStatus"
              padding={{
                bottom: 150,
                left: 10,
                right: 10,
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

export default HealthStatusCard;
