import * as React from 'react';
import Helmet from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';

import { HorizontalNav, NavPage } from '@openshift-console/dynamic-plugin-sdk';
import { LoadingBox } from '@patternfly/quickstarts';

import GitOpsDetailsPageHeading from './details/GitOpsDetailsPageHeading';
import GitOpsDetailsPage from './GitOpsDetailsPage';
import GitOpsDeploymentHistory from './history/GitOpsDeploymentHistory';
import DevPreviewBadge from './import/badges/DevPreviewBadge';
import { getPipelinesBaseURI } from './utils/gitops-utils';
import useDefaultSecret from './utils/useDefaultSecret';
import useEnvDetails from './utils/useEnvDetails';

type GitOpsDetailsPageTabsProps = RouteComponentProps<{ appName?: string }>;

export const GitOpsDetailsPageTabs: React.FC<GitOpsDetailsPageTabsProps> = ({ match }) => {
  const { t } = useTranslation();
  const { appName } = match.params;
  const [secretNS, secretName] = useDefaultSecret();
  const pipelinesBaseURI = getPipelinesBaseURI(secretNS, secretName);
  const searchParams = new URLSearchParams(location.search);
  const manifestURL = searchParams.get('url');
  const [envs, emptyStateMsg] = useEnvDetails(appName, manifestURL, pipelinesBaseURI);

  const pages: NavPage[] = [
    {
      href: `${'overview?url='}${manifestURL}`,
      name: t('gitops-plugin~Overview'),
      path: 'overview',
      component: GitOpsDetailsPage,
    },
    {
      href: `${'deploymenthistory?url='}${manifestURL}`,
      name: t('gitops-plugin~Deployment history'),
      path: 'deploymenthistory',
      component: GitOpsDeploymentHistory,
    },
  ];

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
