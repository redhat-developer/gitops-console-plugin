import * as React from 'react';
import { Link } from 'react-router-dom-v5-compat';

import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { modelToRef } from '@gitops/utils/utils';
import {
  K8sModel,
  useAccessReview,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { Card, CardBody, Divider, Flex } from '@patternfly/react-core';

import { OverviewCardProps } from '../../chartHelpers';

import { FLEX_SPACE_SM, LINK_MARGIN, LINK_MARGIN_FOR_EMPTY_LIST } from './constants';
import CreateResourceLink from './CreateResourceLink';
import ErrorHeader from './ErrorHeader';
import InfrastructureCardTitle from './InfrastructureCardTitle';
import LoadingHeader from './LoadingHeader';
import { createK8sResourceEntries, ResourceWithStatus } from './resourceEntries';

export type InfrastructureResourceCardProps = OverviewCardProps & {
  model: K8sModel;
  title: string;
  entryKeyPrefix: string;
  errorTitle: string;
  viewListLinkText: string;
  createLinkText: string;
  className?: string;
};

const InfrastructureResourceCard: React.FC<InfrastructureResourceCardProps> = ({
  namespace,
  model,
  title,
  entryKeyPrefix,
  errorTitle,
  viewListLinkText,
  createLinkText,
  className,
}) => {
  const [resources, loaded, error] = useK8sWatchResource<ResourceWithStatus[]>({
    groupVersionKind: {
      group: model.apiGroup,
      version: model.apiVersion,
      kind: model.kind,
    },
    isList: true,
    namespaced: !!namespace,
    ...(namespace ? { namespace } : {}),
  });

  // K8sVerb from Dynamic Pluging SDK - we need to move up
  const canCreateAccess = useAccessReview({
    group: model.apiGroup,
    resource: model.plural,
    verb: 'create',
    namespace,
  });

  const canListAccess = useAccessReview({
    group: model.apiGroup,
    resource: model.plural,
    verb: 'list',
    namespace: namespace ? namespace : undefined,
  });

  const modelRef = modelToRef(model);
  const linkToResourceList = namespace
    ? `/k8s/ns/${namespace}/${modelRef}`
    : `/k8s/all-namespaces/${modelRef}`;
  const isEmpty = !resources || resources.length === 0;

  return (
    <Card className={className ? className : 'gitops-dashboard__infrastructure-card'}>
      <InfrastructureCardTitle title={title} total={resources?.length} />
      {/* eslint-disable-next-line no-nested-ternary */}
      {!loaded && !error ? (
        <LoadingHeader />
      ) : error ? (
        <ErrorHeader title={errorTitle} error={error} />
      ) : (
        <CardBody className="gitops-dashboard__infrastructure-card-body">
          {!isEmpty ? (
            <Flex direction={{ default: 'column' }} spaceItems={FLEX_SPACE_SM}>
              {createK8sResourceEntries(resources, entryKeyPrefix, model, namespace)}
            </Flex>
          ) : (
            <Flex direction={{ default: 'column' }} spaceItems={FLEX_SPACE_SM}>
              {t('No {{x}} found', { x: model.labelPlural })}
            </Flex>
          )}
          {canListAccess[0] && !canListAccess[1] && (
            <>
              <Divider style={isEmpty ? LINK_MARGIN_FOR_EMPTY_LIST : LINK_MARGIN} />
              <Flex key={`${entryKeyPrefix}-resource-list-link`}>
                <Link to={linkToResourceList}>{viewListLinkText}</Link>
              </Flex>
            </>
          )}
          {canCreateAccess[0] && !canCreateAccess[1] && namespace && (
            <CreateResourceLink
              isEmptyList={isEmpty}
              createLinkUrlString={`/k8s/ns/${namespace}/${modelRef}/~new`}
              createLinkText={createLinkText}
            />
          )}
        </CardBody>
      )}
    </Card>
  );
};

export default InfrastructureResourceCard;
