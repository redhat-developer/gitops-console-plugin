import * as React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import DevPreviewBadge from '../../../../components/import/badges/DevPreviewBadge';
import { DEFAULT_NAMESPACE } from '../../../utils/constants';
import { isApplicationRefreshing } from '../../../utils/gitops';
import { useGitOpsTranslation } from '../../../utils/hooks/useGitOpsTranslation';
import { Action, K8sModel, K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { Breadcrumb, BreadcrumbItem, Spinner, Title } from '@patternfly/react-core';
import ActionsDropdown from '../../../utils/components/ActionDropDown/ActionDropDown';
import DetailsPageTitle, { PaneHeading } from './DetailsPageTitle';

type ResourceDetailsTitleProps = {
  obj: K8sResourceCommon;
  model: K8sModel;
  name: string;
  namespace: string;
  actions: Action[];
  // Configurable properties for different resource types
  iconText: string;
  iconTitle: string;
  resourcePrefix?: string; // e.g., "Argo CD" for Applications/ApplicationSets
  showDevPreviewBadge?: boolean;
  showRefreshSpinner?: boolean;
};

const ResourceDetailsTitle: React.FC<ResourceDetailsTitleProps> = ({
  obj,
  model,
  name,
  namespace,
  actions,
  iconText,
  iconTitle,
  resourcePrefix = '',
  showDevPreviewBadge = true,
  showRefreshSpinner = true,
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
                  {resourcePrefix} {t(model.labelPlural)}
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem>{resourcePrefix} {t(model.labelPlural + ' Details')}</BreadcrumbItem>
            </Breadcrumb>
          }
        >
          <PaneHeading>
            <Title headingLevel="h1">
              <span
                className="co-m-resource-icon co-m-resource-icon--lg"
                title={iconTitle}
              >
                {iconText}
              </span>
              <span className="co-resource-item__resource-name">
                {name ?? obj?.metadata?.name}{' '}
                {showRefreshSpinner && isApplicationRefreshing(obj) ? <Spinner size="md" /> : <span></span>}
              </span>
              {showDevPreviewBadge && (
                <span style={{ marginLeft: '10px', marginBottom: '3px' }}>
                  <DevPreviewBadge />
                </span>
              )}
            </Title>
            <div className="co-actions">
              <ActionsDropdown actions={actions} isKebabToggle={false} />
            </div>
          </PaneHeading>
        </DetailsPageTitle>
      </div>
    </>
  );
};

export default ResourceDetailsTitle;
