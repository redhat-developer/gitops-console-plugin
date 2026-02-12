import * as React from 'react';

import {
  ApplicationKind,
  ApplicationModel,
  ApplicationResourceStatus,
} from '@gitops-models/ApplicationModel';
import { Action, K8sVerb, useDeleteModal } from '@openshift-console/dynamic-plugin-sdk';

type UseResourceActionsProvider = (
  resource: ApplicationResourceStatus,
  application: ApplicationKind,
  argoBaseURL: string,
) => [actions: Action[]];
const t = (key: string) => key;

function getResourceURL(argoBaseURL: string, resource: ApplicationResourceStatus): string {
  return (
    argoBaseURL +
    '?resource=&node=' +
    encodeURI(
      (resource.group ? resource.group : '') +
        '/' +
        resource.kind +
        '/' +
        (resource.namespace ? resource.namespace : '') +
        '/' +
        resource.name,
    )
  );
}

export const useResourceActionsProvider: UseResourceActionsProvider = (
  resource,
  application,
  argoBaseURL,
) => {
  const placeholderResource = React.useMemo(
    () => ({
      apiVersion: `${resource.group}/${resource.version}`,
      kind: resource.kind,
      metadata: {
        name: resource.name,
        namespace: resource.namespace,
      },
    }),
    [resource],
  );

  const launchDeleteModal = useDeleteModal(placeholderResource);
  const actions = React.useMemo(
    () => [
      {
        id: 'gitops-action-view-in-argocd',
        disabled: false,
        label: t('View in Argo CD'),
        accessReview: {
          group: ApplicationModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: ApplicationModel.plural,
          namespace: application?.metadata?.namespace,
        },
        cta: () => {
          window.open(getResourceURL(argoBaseURL, resource), '_blank');
        },
      },
      // {
      //   id: 'gitops-action-sync-resource',
      //   disabled: resource.status==undefined,
      //   label: t('Sync'),
      //   accessReview: {
      //     group: ApplicationModel.apiGroup,
      //     verb: 'update' as K8sVerb,
      //     resource: ApplicationModel.plural,
      //     namespace: application?.metadata?.namespace,
      //   },
      //   cta: () => {
      //     syncResourcek8s(application, [resource]);
      //   },
      // },
      {
        id: 'gitops-action-delete-resource',
        disabled: false,
        label: t('Delete'),
        accessReview: {
          group: ApplicationModel.apiGroup,
          verb: 'delete' as K8sVerb,
          resource: ApplicationModel.plural,
        },
        cta: () => {
          launchDeleteModal();
        },
      },
    ],
    [application, launchDeleteModal, argoBaseURL, resource],
  );

  return [actions];
};
