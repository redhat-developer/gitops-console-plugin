import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom-v5-compat';

import { HorizontalNav, NavPage } from '@openshift-console/dynamic-plugin-sdk';
import { LoadingBox } from '@patternfly/quickstarts';

import EnvironmentDetailsPageHeading from './details/EnvironmentDetailsPageHeading';
import DeploymentHistory from './history/DeploymentHistory';
import DevPreviewBadge from './import/badges/DevPreviewBadge';
import useEnvDetails from './utils/useEnvDetails';
import EnvironmentDetailsPage from './EnvironmentDetailsPage';

export const EnvironmentDetailsPageTabs: React.FC = () => {
  const { t } = useTranslation('plugin__gitops-plugin');
  const { appName } = useParams();
  const searchParams = new URLSearchParams(location.search);
  const manifestURL = searchParams.get('url');
  const applicationBaseURI = `/application/${appName}?url=${manifestURL}&app=${appName}`;
  const [envs, emptyStateMsg] = useEnvDetails(appName, manifestURL);

  const pages: NavPage[] = React.useMemo(
    () => [
      {
        href: `${'overview?url='}${manifestURL}`,
        name: t('plugin__gitops-plugin~Overview'),
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
        name: t('plugin__gitops-plugin~Deployment history'),
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
        <title>{t('plugin__gitops-plugin~{{appName}} · Details', { appName })}</title>
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
