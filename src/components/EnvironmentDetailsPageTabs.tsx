import * as React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';

import { HorizontalNav, NavPage } from '@openshift-console/dynamic-plugin-sdk';
import { LoadingBox } from '@patternfly/quickstarts';

import EnvironmentDetailsPageHeading from './details/EnvironmentDetailsPageHeading';
import DeploymentHistory from './history/DeploymentHistory';
import DevPreviewBadge from './import/badges/DevPreviewBadge';
import useEnvDetails from './utils/useEnvDetails';
import EnvironmentDetailsPage from './EnvironmentDetailsPage';

type EnvironmentDetailsPageTabsProps = RouteComponentProps<{ appName?: string }>;

export const EnvironmentDetailsPageTabs: React.FC<EnvironmentDetailsPageTabsProps> = ({
  match,
}) => {
  const { t } = useTranslation();
  const { appName } = match.params;
  const searchParams = new URLSearchParams(location.search);
  const manifestURL = searchParams.get('url');
  const applicationBaseURI = `/application/${appName}?url=${manifestURL}&app=${appName}`;
  const [envs, emptyStateMsg] = useEnvDetails(appName, manifestURL);

  const pages: NavPage[] = React.useMemo(
    () => [
      {
        href: `${'overview?url='}${manifestURL}`,
        name: t('gitops-plugin~Overview'),
        path: 'overview',
        component: (props) => (
          <EnvironmentDetailsPage
            {...props}
            customData={{ emptyStateMsg, envs, applicationBaseURI, manifestURL }}
          />
        ),
      },
      {
        href: `${'deploymenthistory?url='}${manifestURL}`,
        name: t('gitops-plugin~Deployment history'),
        path: 'deploymenthistory',
        component: (props) => (
          <DeploymentHistory {...props} customData={{ emptyStateMsg, envs, applicationBaseURI }} />
        ),
      },
    ],
    [t, emptyStateMsg, envs, applicationBaseURI, manifestURL],
  );

  return (
    <>
      <Helmet>
        <title>{t('gitops-plugin~{{appName}} · Details', { appName })}</title>
      </Helmet>
      <EnvironmentDetailsPageHeading
        appName={appName}
        manifestURL={manifestURL}
        badge={<DevPreviewBadge />}
      />
      {!emptyStateMsg && !envs ? <LoadingBox /> : <HorizontalNav pages={pages} />}
    </>
  );
};

export default EnvironmentDetailsPageTabs;
