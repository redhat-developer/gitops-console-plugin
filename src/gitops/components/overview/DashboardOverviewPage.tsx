import * as React from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom-v5-compat';

import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import {
  HorizontalNav,
  ListPageHeader,
  NamespaceBar,
  useActiveNamespace,
} from '@openshift-console/dynamic-plugin-sdk';

import ApplicationsOverviewTab from './tabs/ApplicationsOverviewTab';
import InfrastructureOverviewTab from './tabs/InfrastructureOverviewTab';

import './DashboardOverviewPage.scss';

const ALL_NAMESPACES_KEY = '#ALL_NS#';
const ALL_NAMESPACES_PATH = '/gitops/overview/all-namespaces';
const NS_PATH_PREFIX = '/gitops/overview/ns/';

const buildOverviewPath = (namespace: string, tabSuffix = ''): string => {
  const base =
    !namespace || namespace === ALL_NAMESPACES_KEY
      ? ALL_NAMESPACES_PATH
      : `${NS_PATH_PREFIX}${namespace}`;
  return tabSuffix ? `${base}/${tabSuffix}` : base;
};

/** Tab path after the overview base (e.g. '' or 'infrastructure'). */
const getOverviewTabSuffix = (pathname: string): string => {
  if (pathname.startsWith(`${ALL_NAMESPACES_PATH}/`)) {
    return pathname.slice(ALL_NAMESPACES_PATH.length + 1);
  }
  if (pathname === ALL_NAMESPACES_PATH) {
    return '';
  }
  const nsMatch = pathname.match(/^\/gitops\/overview\/ns\/[^/]+(?:\/(.*))?$/);
  return nsMatch?.[1] ?? '';
};

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
  const { pathname } = useLocation();
  const [, setActiveNamespace] = useActiveNamespace();
  const namespace = ns || namespaceProp;

  React.useEffect(() => {
    setActiveNamespace(namespace || ALL_NAMESPACES_KEY);
  }, [namespace, setActiveNamespace]);

  const handleNamespaceChange = (newNamespace: string) => {
    navigate(buildOverviewPath(newNamespace, getOverviewTabSuffix(pathname)));
  };

  // HorizontalNav appends each page.href to the current path and renders that page's component.
  // Pass shared data (like namespace) via customData — tab components receive it as a prop.
  const pages = React.useMemo(
    () => [
      {
        href: '',
        name: t('Application Overview'),
        component: ApplicationsOverviewTab,
      },
      {
        href: 'infrastructure',
        name: t('Infrastructure'),
        component: InfrastructureOverviewTab,
      },
    ],
    [],
  );

  return (
    <div className="gitops-dashboard-overview-page">
      <NamespaceBar onNamespaceChange={handleNamespaceChange} />
      <div className="gitops-dashboard-overview-page__content">
        <ListPageHeader title={t('GitOps Overview')} hideFavoriteButton={false} />
        <HorizontalNav pages={pages} customData={{ namespace }} />
      </div>
    </div>
  );
};

export default DashboardOverviewPage;
