import * as React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom-v5-compat';

import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import {
  ListPageBody,
  ListPageHeader,
  NamespaceBar,
  useActiveNamespace,
} from '@openshift-console/dynamic-plugin-sdk';
import { Grid, GridItem, PageSection } from '@patternfly/react-core';

import HealthStatusCard from './health-status/HealthStatusCard';
import OperationalMetricsCard from './operational-metrics/OperationalMetricsCard';
import ReconciliationCard from './reconciliation/ReconciliationCard';
import SyncActivityCard from './sync-activity/SyncActivityCard';
import SyncStatusCard from './sync-status/SyncStatusCard';

import './DashboardOverviewPage.scss';

const ALL_NAMESPACES_KEY = '#ALL_NS#';

const buildOverviewPath = (namespace: string): string =>
  !namespace || namespace === ALL_NAMESPACES_KEY
    ? '/gitops/overview/all-namespaces'
    : `/gitops/overview/ns/${namespace}`;

// Registered at the `/gitops/overview` path - see console-extensions.json
export const GitOpsOverviewRedirect: React.FC = () => {
  const [activeNamespace] = useActiveNamespace();
  return <Navigate to={buildOverviewPath(activeNamespace)} replace />;
};

interface DashboardOverviewPageProps {
  namespace?: string;
}

const DashboardOverviewPage: React.FC<DashboardOverviewPageProps> = ({
  namespace: namespaceProp,
}) => {
  const { ns } = useParams<{ ns?: string }>();
  const navigate = useNavigate();
  const [, setActiveNamespace] = useActiveNamespace();
  const namespace = ns || namespaceProp;

  React.useEffect(() => {
    setActiveNamespace(namespace || ALL_NAMESPACES_KEY);
  }, [namespace, setActiveNamespace]);

  const handleNamespaceChange = (newNamespace: string) => {
    navigate(buildOverviewPath(newNamespace));
  };

  return (
    <div>
      <NamespaceBar onNamespaceChange={handleNamespaceChange} />
      <ListPageHeader title={t('GitOps Overview')} hideFavoriteButton={false}></ListPageHeader>
      <ListPageBody>
        <PageSection></PageSection>
        <Grid hasGutter md={2} wrap="true">
          <GridItem span={12} md={6} lg={4} rowSpan={1}>
            <SyncStatusCard namespace={namespace} />
          </GridItem>
          <GridItem span={12} md={6} lg={4} rowSpan={1}>
            <HealthStatusCard namespace={namespace} />
          </GridItem>
          <GridItem span={12} md={6} lg={4} rowSpan={1} smRowSpan={1} mdRowSpan={1}>
            <OperationalMetricsCard namespace={namespace} />
          </GridItem>

          <GridItem span={12} md={6} lg={6} sm={12} rowSpan={1} smRowSpan={1} mdRowSpan={1}>
            <SyncActivityCard namespace={namespace} />
          </GridItem>

          <GridItem span={12} md={6} lg={6} sm={12} rowSpan={1} smRowSpan={1} mdRowSpan={1}>
            <ReconciliationCard namespace={namespace} />
          </GridItem>
        </Grid>
      </ListPageBody>
    </div>
  );
};

export default DashboardOverviewPage;
