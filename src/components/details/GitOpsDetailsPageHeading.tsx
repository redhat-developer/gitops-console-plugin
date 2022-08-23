import './GitOpsDetailsPageHeading.scss';

import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { BreadCrumbs, routeDecoratorIcon } from '../import/render-utils';
import ExternalLink from '../utils/ExternalLink/ExternalLink';

interface GitOpsDetailsPageHeadingProps {
  url: string;
  appName: string;
  manifestURL: string;
  badge?: React.ReactNode;
}

const GitOpsDetailsPageHeading: React.FC<GitOpsDetailsPageHeadingProps> = ({
  url,
  appName,
  manifestURL,
  badge,
}) => {
  const { t } = useTranslation();
  const breadcrumbs = [
    {
      name: t('gitops-plugin~Environments'),
      path: '/envdynamic', //TODO: update path
    },
    {
      name: t('gitops-plugin~Application environments'),
      path: `${url}`,
    },
  ];

  return (
    <>
      <div className="pf-c-page__main-breadcrumb">
        <BreadCrumbs breadcrumbs={breadcrumbs} />
      </div>
      <div className="gop-gitops-details-page-heading co-m-nav-title co-m-nav-title--breadcrumbs">
        <h1 className="co-m-pane__heading" style={{ marginRight: 'var(--pf-global--spacer--sm)' }}>
          <div className="co-m-pane__name co-resource-item">
            <span className="co-resource-item__resource-name">{appName}</span>
          </div>
          {badge && <span className="co-m-pane__heading-badge">{badge}</span>}
        </h1>
        <ExternalLink
          href={manifestURL}
          additionalClassName={'co-break-all gop-gitops-details-page-title'}
        >
          {routeDecoratorIcon(manifestURL, 12, t)}&nbsp;
          {manifestURL}&nbsp;
        </ExternalLink>
      </div>
    </>
  );
};

export default GitOpsDetailsPageHeading;
