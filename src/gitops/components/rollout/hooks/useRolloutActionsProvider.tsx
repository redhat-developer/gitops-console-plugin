import * as React from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';

import {
  Action,
  K8sVerb,
  useAnnotationsModal,
  useDeleteModal,
  useLabelsModal,
} from '@openshift-console/dynamic-plugin-sdk';

import { useGitOpsTranslation } from '../../../utils/hooks/useGitOpsTranslation';
import { RolloutKind, RolloutModel, rolloutModelRef } from '../model/RolloutModel';

type UseRolloutActionsProvider = (rollout: RolloutKind) => [actions: Action[]];

export const useRolloutActionsProvider: UseRolloutActionsProvider = (rollout) => {
  const { t } = useGitOpsTranslation();
  const navigate = useNavigate();
  const launchLabelsModal = useLabelsModal(rollout);
  const launchAnnotationsModal = useAnnotationsModal(rollout);
  const launchDeleteModal = useDeleteModal(rollout);

  const actions = React.useMemo(
    () => [
      {
        id: 'gitops-action-edit-labels-rollout',
        disabled: false,
        label: t('Edit labels'),
        accessReview: {
          group: RolloutModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: RolloutModel.plural,
          namespace: rollout?.metadata?.namespace,
        },
        cta: () => {
          launchLabelsModal();
        },
      },
      {
        id: 'gitops-action-edit-annotations-rollout',
        disabled: false,
        label: t('Edit annotations'),
        accessReview: {
          group: RolloutModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: RolloutModel.plural,
          namespace: rollout?.metadata?.namespace,
        },
        cta: () => {
          launchAnnotationsModal();
        },
      },
      {
        id: 'gitops-action-edit-rollout',
        disabled: false,
        label: t('Edit Rollout'),
        accessReview: {
          group: RolloutModel.apiGroup,
          verb: 'update' as K8sVerb,
          resource: RolloutModel.plural,
          namespace: rollout?.metadata?.namespace,
        },
        cta: () => {
          navigate(
            `/k8s/ns/${rollout.metadata.namespace}/${rolloutModelRef}/${rollout.metadata.name}/yaml`,
          );
        },
      },
      {
        id: 'gitops-action-delete-rollout',
        label: t('Delete'),
        accessReview: {
          group: RolloutModel.apiGroup,
          verb: 'delete' as K8sVerb,
          resource: RolloutModel.plural,
          namespace: rollout?.metadata?.namespace,
        },
        cta: () => launchDeleteModal(),
      },
    ],
    [rollout, launchLabelsModal, launchAnnotationsModal, launchDeleteModal, navigate, t],
  );

  return [actions];
};
