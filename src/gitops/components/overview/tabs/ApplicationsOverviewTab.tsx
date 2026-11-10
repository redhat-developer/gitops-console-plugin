import { ApplicationKind } from '@gitops/models/ApplicationModel';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { ListPageBody, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { Grid, GridItem } from '@patternfly/react-core';

import { errorState, warningState } from '../chartHelpers';
import HealthStatusCard from '../health-status/HealthStatusCard';
import NeedsAttentionCard from '../infrastructure/attention/NeedsAttentionCard';
import OperationalMetricsCard from '../operational-metrics/OperationalMetricsCard';
import RecentOperationsCard from '../recent-operations/RecentOperationsCard';
import ReconciliationCard from '../reconciliation/ReconciliationCard';
import SyncActivityCard from '../sync-activity/SyncActivityCard';
import SyncStatusCard from '../sync-status/SyncStatusCard';

type ApplicationsOverviewTabProps = {
  customData?: {
    namespace?: string;
  };
};

const ApplicationsOverviewTab: React.FC<ApplicationsOverviewTabProps> = ({ customData }) => {
  const namespace = customData?.namespace;

  const [applications, isAppsLoaded, appsLoadedError] = useK8sWatchResource<ApplicationKind[]>({
    isList: true,
    groupVersionKind: {
      group: 'argoproj.io',
      kind: 'Application',
      version: 'v1alpha1',
    },
    namespaced: !!namespace,
    namespace,
  });

  if (appsLoadedError) {
    if (String(appsLoadedError).toLocaleLowerCase().includes('model does not exist')) {
      return (
        <div>
          {warningState(
            t('Application model does not exist'),
            t(
              'The Argo CD Application CRD does not exist. Check that the GitOps Operator is installed.',
            ),
          )}
        </div>
      );
    }
    return (
      <div>
        {errorState(
          t('Unable to retrieve applications'),
          t('Error retrieving applications: {{x}}', { x: appsLoadedError }),
        )}
      </div>
    );
  }

  return (
    <ListPageBody>
      <Grid hasGutter md={2} wrap="true">
        <GridItem span={12} md={6} lg={4} rowSpan={1}>
          <SyncStatusCard
            namespace={namespace}
            applications={applications}
            isAppsLoaded={isAppsLoaded}
            appsLoadedError={appsLoadedError}
          />
        </GridItem>
        <GridItem span={12} md={6} lg={4} rowSpan={1}>
          <HealthStatusCard
            namespace={namespace}
            applications={applications}
            isAppsLoaded={isAppsLoaded}
            appsLoadedError={appsLoadedError}
          />
        </GridItem>
        <GridItem span={12} md={6} lg={4} rowSpan={1} smRowSpan={1} mdRowSpan={1}>
          <OperationalMetricsCard namespace={namespace} />
        </GridItem>

        <GridItem span={12} md={12} lg={12} sm={12} rowSpan={1} smRowSpan={1} mdRowSpan={1}>
          <NeedsAttentionCard
            namespace={namespace}
            applications={applications}
            isAppsLoaded={isAppsLoaded}
            appsLoadedError={appsLoadedError}
          />
        </GridItem>
        <GridItem span={12} md={12} lg={12} sm={12} rowSpan={1} smRowSpan={1} mdRowSpan={1}>
          <RecentOperationsCard
            namespace={namespace}
            applications={applications}
            isAppsLoaded={isAppsLoaded}
            appsLoadedError={appsLoadedError}
          />
        </GridItem>

        <GridItem span={12} md={6} lg={6} sm={12} rowSpan={1} smRowSpan={1} mdRowSpan={1}>
          <SyncActivityCard namespace={namespace} />
        </GridItem>

        <GridItem span={12} md={6} lg={6} sm={12} rowSpan={1} smRowSpan={1} mdRowSpan={1}>
          <ReconciliationCard namespace={namespace} />
        </GridItem>
      </Grid>
    </ListPageBody>
  );
};

export default ApplicationsOverviewTab;
