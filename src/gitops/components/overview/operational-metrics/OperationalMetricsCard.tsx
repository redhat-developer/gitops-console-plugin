import * as React from 'react';

import ExternalLink from '@gitops/utils/components/ExternalLink/ExternalLink';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { PrometheusEndpoint, usePrometheusPoll } from '@openshift-console/dynamic-plugin-sdk';
import {
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  Label,
  Spinner,
  Tooltip,
} from '@patternfly/react-core';

import { OverviewCardProps } from '../chartHelpers';

import '../DashboardOverviewPage.scss';

const rowMetric = (
  title: string,
  query: string,
  loaded: boolean,
  error: any,
  tooltipContent: string,
  labelComponent: React.ReactElement,
) => {
  return (
    <Grid hasGutter>
      <GridItem span={9} md={9} lg={9} sm={9} rowSpan={1} smRowSpan={1} mdRowSpan={1}>
        <div>{title}</div>
      </GridItem>
      <GridItem
        span={3}
        md={3}
        lg={3}
        sm={3}
        rowSpan={2}
        smRowSpan={2}
        mdRowSpan={2}
        style={{ textAlign: 'right' }}
      >
        <ExternalLink
          href={'/monitoring/query-browser?units=short&query0=' + query}
          stopPropagation={true}
        >
          {/* eslint-disable-next-line no-nested-ternary */}
          {!loaded && !error ? (
            <Tooltip content={'Loading metric data...'}>
              <Label variant="outline" className="gitops-dashboard__label-with-external-link">
                <Spinner size="sm" />
              </Label>
            </Tooltip>
          ) : error ? (
            <Tooltip content={t('Error fetching metric data. Click to view metrics dashboard.')}>
              <Label
                variant="outline"
                color="red"
                className="gitops-dashboard__label-with-external-link"
              >
                {'-'}
              </Label>
            </Tooltip>
          ) : (
            <Tooltip content={tooltipContent}>{labelComponent}</Tooltip>
          )}
        </ExternalLink>
      </GridItem>
    </Grid>
  );
};

const OperationalMetricsCard: React.FC<OverviewCardProps> = ({ namespace }) => {
  const lastUpdateTime = 10; // in seconds

  // Successful Syncs
  const successfulSyncsPQ =
    `sum(argocd_app_sync_total{phase='Succeeded'` +
    (namespace ? `,namespace='` + namespace + `'` : ``) +
    `})`;
  const [resultSuccessfulSyncsPQ, loadedSuccessfulSyncsPQ, errorSuccessfulSyncsPQ] =
    usePrometheusPoll({
      endpoint: PrometheusEndpoint.QUERY,
      delay: lastUpdateTime * 1000,
      query: successfulSyncsPQ,
    });
  const noOfSuccessfulSyncs = resultSuccessfulSyncsPQ?.data?.result[0]?.value[1];

  // Failed Syncs
  const failedSyncsPQ =
    `sum(increase(argocd_app_sync_total{phase!='Succeeded'` +
    (namespace ? `,namespace='` + namespace + `'` : ``) +
    `}[24h]))`;
  const [resultFailedSyncsPQ, loadedFailedSyncsPQ, errorFailedSyncsPQ] = usePrometheusPoll({
    endpoint: PrometheusEndpoint.QUERY,
    delay: lastUpdateTime * 1000,
    query: failedSyncsPQ,
  });
  const noOfFailedSyncs = resultFailedSyncsPQ?.data?.result[0]?.value[1];

  // Orphaned Resources
  const orphanedResourcesCountPQ =
    `sum(argocd_app_orphaned_resources_count` +
    (namespace ? `{namespace='` + namespace + `'}` : ``) +
    `)`;
  const [
    resultOrphanedResourcesCountPQ,
    loadedOrphanedResourcesCountPQ,
    errorOrphanedResourcesCountPQ,
  ] = usePrometheusPoll({
    endpoint: PrometheusEndpoint.QUERY,
    delay: lastUpdateTime * 1000,
    query: orphanedResourcesCountPQ,
  });
  const noOfOrphanedResources = resultOrphanedResourcesCountPQ?.data?.result[0]?.value[1];

  // Apps with Autosync enabled
  const autosyncEnabledPQ =
    `sum(argocd_app_info{autosync_enabled='true'` +
    (namespace ? `,namespace='` + namespace + `'` : ``) +
    `})`;
  const [resultAutosyncEnabledPQ, loadedAutosyncEnabledPQ, errorAutosyncEnabledPQ] =
    usePrometheusPoll({
      endpoint: PrometheusEndpoint.QUERY,
      delay: lastUpdateTime * 1000,
      query: autosyncEnabledPQ,
    });
  const noOfAutosyncEnabled = resultAutosyncEnabledPQ?.data?.result[0]?.value[1];
  // Last update time can be undefined for 0 apps. If last successful sync is used, then the last update time
  // can be undefined for > 0 apps that haven't synced yet. Therefore, use the following two metrics to determine the
  // last update time. For any x number of apps, the there should be at least one with either autosync enabled or disabled.
  // The same delay update time will be used for all metrics.
  let timeOfLastUpdate = resultAutosyncEnabledPQ?.data?.result[0]?.value[0]
    ? new Date(
        Number(resultAutosyncEnabledPQ?.data?.result[0]?.value[0]) * 1000,
      ).toLocaleTimeString()
    : undefined;

  // Apps with Autosync disabled
  const autosyncDisabledPQ =
    `sum(argocd_app_info{autosync_enabled='false'` +
    (namespace ? `,namespace='` + namespace + `'` : '') +
    `})`;
  const [resultAutosyncDisabledPQ, loadedAutosyncDisabledPQ, errorAutosyncDisabledPQ] =
    usePrometheusPoll({
      endpoint: PrometheusEndpoint.QUERY,
      delay: lastUpdateTime * 1000,
      query: autosyncDisabledPQ,
    });
  const noOfAutosyncDisabled = resultAutosyncDisabledPQ?.data?.result[0]?.value[1];
  // If there are no apps with autosync enabled, then there should be at least one with autosync disabled.
  if (!timeOfLastUpdate) {
    timeOfLastUpdate = resultAutosyncDisabledPQ?.data?.result[0]?.value[0]
      ? new Date(
          Number(resultAutosyncDisabledPQ?.data?.result[0]?.value[0]) * 1000,
        ).toLocaleTimeString()
      : undefined;
  }
  // Repo Queue
  const repoQueuePQ =
    `sum(argocd_repo_pending_request_total` +
    (namespace ? `{namespace='` + namespace + `'})` : ')');
  const [resultRepoQueuePQ, loadedRepoQueuePQ, errorRepoQueuePQ] = usePrometheusPoll({
    endpoint: PrometheusEndpoint.QUERY,
    delay: lastUpdateTime * 1000,
    query: repoQueuePQ,
  });
  const noOfRepoQueue = resultRepoQueuePQ?.data?.result[0]?.value[1];

  // Git fetch failures
  const gitFetchFailedTotalPQ =
    `sum(argocd_git_lsremote_fail_total` + (namespace ? `{namespace='` + namespace + `'})` : ')');
  const [resultGitFetchFailedTotalPQ, loadedGitFetchFailedTotalPQ, errorGitFetchFailedTotalPQ] =
    usePrometheusPoll({
      endpoint: PrometheusEndpoint.QUERY,
      delay: lastUpdateTime * 1000,
      query: gitFetchFailedTotalPQ,
    });
  const noOfGitFetchFailedTotal = resultGitFetchFailedTotalPQ?.data?.result[0]?.value[1];

  return (
    <Card className="gitops-dashboard__operational-metrics-card">
      <CardTitle>
        <span style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>{t('Operational metrics')}</span>
          {timeOfLastUpdate && (
            <Tooltip content={t('Last update time. Updated every 10 seconds.')}>
              <Label color="blue" variant="outline" tooltipPosition="left">
                {timeOfLastUpdate}
              </Label>
            </Tooltip>
          )}
        </span>
      </CardTitle>
      <CardBody
        className="gitops-dashboard__operational-metrics-card-body"
        style={{ fontSize: '12px' }}
      >
        {rowMetric(
          t('Successful syncs'),
          successfulSyncsPQ,
          loadedSuccessfulSyncsPQ,
          errorSuccessfulSyncsPQ,
          t('Number of successful syncs'),
          <Label
            variant="filled"
            color="blue"
            className="gitops-dashboard__label-with-external-link"
          >
            {noOfSuccessfulSyncs ? noOfSuccessfulSyncs : '0'}
          </Label>,
        )}
        {rowMetric(
          t('Failed syncs'),
          failedSyncsPQ,
          loadedFailedSyncsPQ,
          errorFailedSyncsPQ,
          t(
            'Number of failed syncs over a 24 hour moving window. If a failed sync happens, this counter increases by one. 24 hours later, this number will then decrease by one.',
          ),
          noOfFailedSyncs ? (
            <Label
              color="red"
              variant="outline"
              tooltipPosition="left"
              className="gitops-dashboard__label-with-external-link"
            >
              {Number.parseInt(noOfFailedSyncs)}
            </Label>
          ) : (
            <Label
              variant="filled"
              color="blue"
              tooltipPosition="left"
              className="gitops-dashboard__label-with-external-link"
            >
              {'0'}
            </Label>
          ),
        )}
        {rowMetric(
          t('Orphaned resources'),
          orphanedResourcesCountPQ,
          loadedOrphanedResourcesCountPQ,
          errorOrphanedResourcesCountPQ,
          t('Number of orphaned resources'),
          <Label
            variant="filled"
            color="blue"
            className="gitops-dashboard__label-with-external-link"
          >
            {noOfOrphanedResources ? noOfOrphanedResources : '0'}
          </Label>,
        )}
        {rowMetric(
          t('Apps with Autosync enabled'),
          autosyncEnabledPQ,
          loadedAutosyncEnabledPQ,
          errorAutosyncEnabledPQ,
          t('Number of apps with autosync enabled'),
          <Label
            variant="filled"
            color="blue"
            className="gitops-dashboard__label-with-external-link"
          >
            {noOfAutosyncEnabled ? noOfAutosyncEnabled : '0'}
          </Label>,
        )}
        {rowMetric(
          t('Apps with Autosync disabled'),
          autosyncDisabledPQ,
          loadedAutosyncDisabledPQ,
          errorAutosyncDisabledPQ,
          t('Number of apps with autosync disabled'),
          <Label
            variant="filled"
            color="blue"
            className="gitops-dashboard__label-with-external-link"
          >
            {noOfAutosyncDisabled ? noOfAutosyncDisabled : '0'}
          </Label>,
        )}
        {rowMetric(
          t('Repo Queue'),
          repoQueuePQ,
          loadedRepoQueuePQ,
          errorRepoQueuePQ,
          t('Number of repos in the queue'),
          <Label
            variant="filled"
            color="blue"
            className="gitops-dashboard__label-with-external-link"
          >
            {noOfRepoQueue ? noOfRepoQueue : '0'}
          </Label>,
        )}
        {rowMetric(
          t('Git fetch failures'),
          gitFetchFailedTotalPQ,
          loadedGitFetchFailedTotalPQ,
          errorGitFetchFailedTotalPQ,
          t('Number of git fetch failures'),
          noOfGitFetchFailedTotal ? (
            <Label
              color="red"
              variant="outline"
              tooltipPosition="left"
              className="gitops-dashboard__label-with-external-link"
            >
              {noOfGitFetchFailedTotal}
            </Label>
          ) : (
            <Label
              variant="filled"
              color="blue"
              className="gitops-dashboard__label-with-external-link"
            >
              {'0'}
            </Label>
          ),
        )}
      </CardBody>
    </Card>
  );
};

export default OperationalMetricsCard;
