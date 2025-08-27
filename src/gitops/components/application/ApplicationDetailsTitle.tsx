import * as React from 'react';
import { Link } from 'react-router-dom-v5-compat';
import DevPreviewBadge from '../../../components/import/badges/DevPreviewBadge';
import { DEFAULT_NAMESPACE } from '../../utils/constants';
import { isApplicationRefreshing } from '../../utils/gitops';
import { useGitOpsTranslation } from '../../utils/hooks/useGitOpsTranslation';
import { Action, K8sModel, K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { Breadcrumb, BreadcrumbItem, Spinner, Title } from '@patternfly/react-core';
import ActionsDropdown from '../../utils/components/ActionDropDown/ActionDropDown';
import DetailsPageTitle, { PaneHeading } from '../../utils/components/DetailsPageTitle/DetailsPageTitle';
import './application-details-title.scss';

type ApplicationPageTitleProps = {
  obj: K8sResourceCommon;
  model: K8sModel;
  name: string;
  namespace: string;
  actions: Action[];
};

const ApplicationDetailsTitle: React.FC<ApplicationPageTitleProps> = ({
  obj,
  model,
  name,
  namespace,
  actions,
}) => {
  const { t } = useGitOpsTranslation();
  
  // Determine the correct icon text and styling based on the model
  const isApplicationSet = model.kind === 'ApplicationSet';
  const iconText = isApplicationSet ? 'AS' : 'A';
  const iconTitle = isApplicationSet ? 'Argo CD ApplicationSet' : 'Argo CD Application';
  
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
                className="co-m-resource-icon co-m-resource-icon--lg"
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
              <ActionsDropdown actions={actions} isKebabToggle={false} />
            </div>
          </PaneHeading>
        </DetailsPageTitle>
      </div>
    </>
  );
};

export default ApplicationDetailsTitle;
