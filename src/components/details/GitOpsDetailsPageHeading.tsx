import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';

import { routeDecoratorIcon } from '../import/render-utils';
import ExternalLink from '../utils/ExternalLink/ExternalLink';

import './GitOpsDetailsPageHeading.scss';

interface GitOpsDetailsPageHeadingProps {
  appName: string;
  manifestURL: string;
  badge?: React.ReactNode;
}

const GitOpsDetailsPageHeading: React.FC<GitOpsDetailsPageHeadingProps> = ({
  appName,
  manifestURL,
  badge,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="pf-c-page__main-breadcrumb">
        <Breadcrumb className="co-breadcrumb">
          <BreadcrumbItem to="/envdynamic">{t('gitops-plugin~Environments')}</BreadcrumbItem>
          <BreadcrumbItem>{t('gitops-plugin~Application environments')}</BreadcrumbItem>
        </Breadcrumb>
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
