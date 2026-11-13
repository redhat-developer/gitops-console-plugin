import * as React from 'react';

import { ArgoCDGroupVersionKind, ArgoCDKind, ArgoCDModel } from '@gitops/models/ArgoCDModel';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { ALL_NAMESPACES_SESSION_KEY } from '@gitops/utils/utils';
import { useAccessReview, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { Card, CardBody, Flex } from '@patternfly/react-core';

import { DEFAULT_GITOPS_OPERATOR_NAMESPACE, OverviewCardProps } from '../../chartHelpers';
import { CSVKind } from '../operator/GitOpsOperatorCard';
import { FLEX_SPACE_SM } from '../shared/constants';
import CreateResourceLink from '../shared/CreateResourceLink';
import ErrorHeader from '../shared/ErrorHeader';
import InfrastructureCardTitle from '../shared/InfrastructureCardTitle';
import LoadingHeader from '../shared/LoadingHeader';
import { createK8sResourceEntries } from '../shared/resourceEntries';

const ArgoCDInstancesCard: React.FC<OverviewCardProps> = ({ namespace }) => {
  // TODO NEED TO COMBINE THIS WITH GitOpsOperatorCard
  const [csvs, csvsLoaded, csvsError] = useK8sWatchResource<CSVKind[]>({
    isList: true,
    groupVersionKind: {
      group: 'operators.coreos.com',
      version: 'v1alpha1',
      kind: 'ClusterServiceVersion',
    },
    namespaced: !!namespace,
    ...(namespace && namespace !== ALL_NAMESPACES_SESSION_KEY ? { namespace: namespace } : {}),
  });

  const gitopsOperator = React.useMemo(() => {
    const csv = (csvs ?? []).find((c) => {
      const name = (c.metadata as Record<string, string>)?.name ?? '';
      return (
        name.startsWith(DEFAULT_GITOPS_OPERATOR_NAMESPACE) || name.startsWith('gitops-operator')
      );
    });
    if (!csv) return null;
    const meta = csv.metadata;
    const spec = csv.spec;
    const status = csv.status;
    return {
      name: meta.name,
      message: status?.message ?? '',
      phase: status?.phase ?? 'Unknown',
      displayName: spec?.displayName ?? '',
      provider: spec?.provider?.name ?? '',
      version: spec?.version ?? '',
      operatorNamespace: meta.namespace ?? '',
      createdAt: meta.creationTimestamp || undefined,
      currentNamespace: namespace || t('All Namespaces'),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [csvs]);

  // END OF TODO - Update references below too

  const [argoCDInstances, argoCDInstancesLoaded, argoCDInstancesError] = useK8sWatchResource<
    ArgoCDKind[]
  >({
    groupVersionKind: {
      group: ArgoCDGroupVersionKind.group,
      version: ArgoCDGroupVersionKind.version,
      kind: ArgoCDGroupVersionKind.kind,
    },
    isList: true,
    namespaced: !!namespace,
    ...(namespace ? { namespace: namespace } : {}),
  });

  const [canCreateArgoCDAccess, isLoadingCreateArgoCDAccess] = useAccessReview({
    group: ArgoCDGroupVersionKind.group,
    resource: ArgoCDModel.plural,
    verb: 'create',
    namespace: namespace,
  });

  return (
    <Card className="gitops-dashboard__infrastructure-card">
      <InfrastructureCardTitle title={t('Argo CD Instances')} total={argoCDInstances?.length} />
      {/* eslint-disable-next-line no-nested-ternary */}
      {!argoCDInstancesLoaded && !argoCDInstancesError ? (
        <LoadingHeader />
      ) : argoCDInstancesError ? (
        <ErrorHeader title={t('Error retrieving Argo CD instances')} error={argoCDInstancesError} />
      ) : (
        <CardBody className="gitops-dashboard__infrastructure-card-body">
          {argoCDInstances && argoCDInstances.length > 0 ? (
            <Flex direction={{ default: 'column' }} spaceItems={FLEX_SPACE_SM}>
              {createK8sResourceEntries(
                argoCDInstances,
                'id-argocd-instance',
                ArgoCDModel,
                namespace,
              )}
            </Flex>
          ) : (
            <Flex direction={{ default: 'column' }} spaceItems={FLEX_SPACE_SM}>
              {t('No {{x}} found', { x: ArgoCDModel.labelPlural })}
            </Flex>
          )}
          {canCreateArgoCDAccess &&
            !isLoadingCreateArgoCDAccess &&
            csvsLoaded &&
            !csvsError &&
            gitopsOperator &&
            argoCDInstances?.length === 0 &&
            namespace && (
              <CreateResourceLink
                isEmptyList={argoCDInstances && argoCDInstances.length == 0}
                createLinkUrlString={
                  `/k8s/ns/${namespace}/clusterserviceversions/` +
                  gitopsOperator.name +
                  `/argoproj.io~v1beta1~ArgoCD/~new`
                }
                createLinkText={t('Create Argo CD instance')}
              />
            )}
        </CardBody>
      )}
    </Card>
  );
};

export default ArgoCDInstancesCard;
