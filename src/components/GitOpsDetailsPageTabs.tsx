import * as React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';

import { HorizontalNav, NavPage } from '@openshift-console/dynamic-plugin-sdk';
import { LoadingBox } from '@patternfly/quickstarts';

import GitOpsDetailsPageHeading from './details/GitOpsDetailsPageHeading';
import GitOpsDeploymentHistory from './history/GitOpsDeploymentHistory';
import DevPreviewBadge from './import/badges/DevPreviewBadge';
import { getApplicationsBaseURI, getPipelinesBaseURI } from './utils/gitops-utils';
import useDefaultSecret from './utils/useDefaultSecret';
import useEnvDetails from './utils/useEnvDetails';
import GitOpsDetailsPage from './GitOpsDetailsPage';

type GitOpsDetailsPageTabsProps = RouteComponentProps<{ appName?: string }>;

export const GitOpsDetailsPageTabs: React.FC<GitOpsDetailsPageTabsProps> = ({ match }) => {
  const { t } = useTranslation();
  const { appName } = match.params;
  const [secretNS, secretName] = useDefaultSecret();
  const pipelinesBaseURI = getPipelinesBaseURI(secretNS, secretName);
  const searchParams = new URLSearchParams(location.search);
  const manifestURL = searchParams.get('url');
  const applicationBaseURI = getApplicationsBaseURI(appName, secretNS, secretName, manifestURL);
  const [envs, emptyStateMsg] = useEnvDetails(appName, manifestURL, pipelinesBaseURI);

  const pages: NavPage[] = React.useMemo(
    () => [
      {
        href: `${'overview?url='}${manifestURL}`,
        name: t('gitops-plugin~Overview'),
        path: 'overview',
        component: (props) => (
          <GitOpsDetailsPage
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
          <GitOpsDeploymentHistory
            {...props}
            customData={{ emptyStateMsg, envs, applicationBaseURI }}
          />
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
      <GitOpsDetailsPageHeading
        appName={appName}
        manifestURL={manifestURL}
        badge={<DevPreviewBadge />}
      />
      {!emptyStateMsg && !envs ? <LoadingBox /> : <HorizontalNav pages={pages} />}
    </>
  );
};

export default GitOpsDetailsPageTabs;
