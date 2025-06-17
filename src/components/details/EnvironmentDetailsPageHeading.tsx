import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom-v5-compat';

import { Breadcrumb, BreadcrumbItem, Button } from '@patternfly/react-core';

import { routeDecoratorIcon } from '../import/render-utils';
import ExternalLink from '../utils/ExternalLink/ExternalLink';

import './EnvironmentDetailsPageHeading.scss';

interface EnvironmentDetailsPageHeadingProps {
  appName: string;
  manifestURL: string;
  badge?: React.ReactNode;
}

const EnvironmentDetailsPageHeading: React.FC<EnvironmentDetailsPageHeadingProps> = ({
  appName,
  manifestURL,
  badge,
}) => {
  const { t } = useTranslation('plugin__gitops-plugin');
  const navigate = useNavigate();

  return (
    <>
      <div className="pf-c-page__main-breadcrumb">
        <Breadcrumb className="co-breadcrumb">
          <BreadcrumbItem>
            <Button onClick={() => navigate('/envdynamic')} isInline variant="link">
              {t('plugin__gitops-plugin~Environments')}
            </Button>
          </BreadcrumbItem>
          <BreadcrumbItem>{t('plugin__gitops-plugin~Application environments')}</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <div className="gitops-plugin__environment-details-page-heading co-m-nav-title co-m-nav-title--breadcrumbs">
        <h1 className="co-m-pane__heading" style={{ marginRight: 'var(--pf-global--spacer--sm)' }}>
          <div className="co-m-pane__name co-resource-item">
            <span className="co-resource-item__resource-name">{appName}</span>
          </div>
          {badge && <span className="co-m-pane__heading-badge">{badge}</span>}
        </h1>
        <ExternalLink
          href={manifestURL}
          additionalClassName={'co-break-all gitops-plugin__environment-details-page-title'}
        >
          {routeDecoratorIcon(manifestURL, 12, t)}&nbsp;
          {manifestURL}&nbsp;
        </ExternalLink>
      </div>
    </>
  );
};

export default EnvironmentDetailsPageHeading;
