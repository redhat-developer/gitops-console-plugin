import * as React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import DevPreviewBadge from 'src/components/import/badges/DevPreviewBadge';

import FavoriteButton from '@gitops/components/shared/FavoriteButton/FavoriteButton';
import ActionsDropdown from '@gitops/utils/components/ActionDropDown/ActionDropDown';
import { DEFAULT_NAMESPACE } from '@gitops/utils/constants';
import { isApplicationRefreshing } from '@gitops/utils/gitops';
import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import { Action, K8sModel, K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import {
  Breadcrumb,
  BreadcrumbItem,
  Flex,
  PageBreadcrumb,
  PageGroup,
  PageSection,
  Spinner,
  Title,
} from '@patternfly/react-core';

import './details-page-header.scss';

const PaneHeading: React.FC = ({ children }) => (
  <Flex
    alignItems={{ default: 'alignItemsCenter' }}
    justifyContent={{ default: 'justifyContentSpaceBetween' }}
  >
    {children}
  </Flex>
);

type DetailsPageTitleProps = {
  breadcrumb: React.ReactNode;
};

const DetailsPageTitle: React.FC<DetailsPageTitleProps> = ({ breadcrumb, children }) => (
  <div>
    <PageGroup>
      <PageBreadcrumb>{breadcrumb}</PageBreadcrumb>
      <PageSection className="details-page-title" hasBodyWrapper={false}>
        {children}
      </PageSection>
    </PageGroup>
  </div>
);

type ApplicationPageTitleProps = {
  obj: K8sResourceCommon;
  model: K8sModel;
  name: string;
  namespace: string;
  actions: Action[];
  iconText: string;
  iconTitle: string;
};

const DetailsPageHeader: React.FC<ApplicationPageTitleProps> = ({
  obj,
  model,
  name,
  namespace,
  actions,
  iconText,
  iconTitle,
}) => {
  const { t } = useGitOpsTranslation();
  return (
    <>
      <div>
        <DetailsPageTitle
          breadcrumb={
            <Breadcrumb className="pf-c-breadcrumb co-breadcrumb">
              <BreadcrumbItem>
                <Link
                  to={`/k8s/ns/${namespace || DEFAULT_NAMESPACE}/${
                    model.apiGroup + '~' + model.apiVersion + '~' + model.kind
                  }`}
                >
                  Argo CD {t(model.labelPlural)}
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem>Argo CD {t(model.labelPlural + ' Details')}</BreadcrumbItem>
            </Breadcrumb>
          }
        >
          <PaneHeading>
            <Title headingLevel="h1">
              <span
                className="co-m-resource-icon co-m-resource-icon--lg argocd-resource-icon"
                title={iconTitle}
              >
                {iconText}
              </span>
              <span className="co-resource-item__resource-name">
                {name ?? obj?.metadata?.name}{' '}
                {isApplicationRefreshing(obj) ? <Spinner size="md" /> : <span></span>}
              </span>
              <span style={{ marginLeft: '10px', marginBottom: '3px' }}>
                <DevPreviewBadge />
              </span>
            </Title>
            <div className="co-actions">
              <FavoriteButton defaultName={name ?? obj?.metadata?.name} />
              <ActionsDropdown actions={actions} isKebabToggle={false} />
            </div>
          </PaneHeading>
        </DetailsPageTitle>
      </div>
    </>
  );
};

export default DetailsPageHeader;
