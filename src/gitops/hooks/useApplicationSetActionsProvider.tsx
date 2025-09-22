import * as React from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';

import {
  ApplicationSetKind,
  ApplicationSetModel,
  applicationSetModelRef,
} from '@gitops-models/ApplicationSetModel';
import {
  Action,
  K8sVerb,
  useAnnotationsModal,
  useDeleteModal,
  useLabelsModal,
} from '@openshift-console/dynamic-plugin-sdk';

type UseApplicationSetActionsProvider = (applicationSet: ApplicationSetKind) => [actions: Action[]];
const t = (key: string) => key;

export const useApplicationSetActionsProvider: UseApplicationSetActionsProvider = (
  applicationSet,
) => {
  const navigate = useNavigate();

  const launchLabelsModal = useLabelsModal(applicationSet);
  const launchAnnotationsModal = useAnnotationsModal(applicationSet);
  const launchDeleteModal = useDeleteModal(applicationSet);

  const actions = React.useMemo(
    () => [
      {
        id: 'gitops-action-edit-labels-applicationset',
        disabled: false,
        label: t('Edit labels'),
        accessReview: {
          group: ApplicationSetModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: ApplicationSetModel.plural,
          namespace: applicationSet?.metadata?.namespace,
        },
        cta: () => {
          launchLabelsModal();
        },
      },
      {
        id: 'gitops-action-edit-annotations-applicationset',
        disabled: false,
        accessReview: {
          group: ApplicationSetModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: ApplicationSetModel.plural,
          namespace: applicationSet?.metadata?.namespace,
        },
        label: t('Edit annotations'),
        cta: () => {
          launchAnnotationsModal();
        },
      },
      {
        id: 'gitops-action-edit-applicationset',
        disabled: false,
        label: t('Edit ApplicationSet'),
        accessReview: {
          group: ApplicationSetModel.apiGroup,
          verb: 'update' as K8sVerb,
          resource: ApplicationSetModel.plural,
          namespace: applicationSet?.metadata?.namespace,
        },
        cta: () => {
          // Navigate to the same page with a query parameter to switch to YAML tab
          navigate(
            `/k8s/ns/${applicationSet.metadata.namespace}/${applicationSetModelRef}/${applicationSet.metadata.name}?tab=yaml`,
          );
        },
      },
      {
        id: 'gitops-action-delete-applicationset',
        disabled: false,
        label: t('Delete ApplicationSet'),
        accessReview: {
          group: ApplicationSetModel.apiGroup,
          verb: 'delete' as K8sVerb,
          resource: ApplicationSetModel.plural,
        },
        cta: () => launchDeleteModal(),
      },
    ],
    [applicationSet, navigate, launchLabelsModal, launchAnnotationsModal, launchDeleteModal],
  );

  return [actions];
};
