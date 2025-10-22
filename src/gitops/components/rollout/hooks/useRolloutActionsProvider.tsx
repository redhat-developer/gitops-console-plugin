import * as React from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';

import {
  Action,
  K8sVerb,
  useAnnotationsModal,
  useDeleteModal,
  useLabelsModal,
} from '@openshift-console/dynamic-plugin-sdk';

import { RolloutKind, RolloutModel, rolloutModelRef } from '../model/RolloutModel';

type UseRolloutActionsProvider = (rollout: RolloutKind) => [actions: Action[]];
const t = (key: string) => key;

export const useRolloutActionsProvider: UseRolloutActionsProvider = (rollout) => {
  const navigate = useNavigate();
  const launchLabelsModal = useLabelsModal(rollout);
  const launchAnnotationsModal = useAnnotationsModal(rollout);
  const launchDeleteModal = useDeleteModal(rollout);

  const actions = React.useMemo(
    () => [
      // {
      //   id: 'gitops-action-promote',
      //   // disabled: !isDeploying(rollout),
      //   label: t('Promote'),
      //   accessReview: {
      //     group: RolloutModel.apiGroup,
      //     verb: 'patch' as K8sVerb,
      //     resource: RolloutModel.plural,
      //     namespace: rollout?.metadata?.namespace,
      //   },
      //   cta: () =>
      //     // TODO - Show toast alert if it fails but this is proving more challenging then I thought
      //     // promoteRollout(rollout, false)
      //     {},
      // },
      // {
      //   id: 'gitops-action-promote-full',
      //   // disabled: !isDeploying(rollout),
      //   label: t('Full Promote'),
      //   accessReview: {
      //     group: RolloutModel.apiGroup,
      //     verb: 'patch' as K8sVerb,
      //     resource: RolloutModel.plural,
      //     namespace: rollout?.metadata?.namespace,
      //   },
      //   cta: () =>
      //     // TODO - Show toast alert if it fails but this is proving more challenging then I thought
      //     // promoteRollout(rollout, true)
      //     {},
      // },
      // {
      //   id: 'gitops-action-abort',
      //   // disabled: !isDeploying(rollout),
      //   label: t('Abort'),
      //   accessReview: {
      //     group: RolloutModel.apiGroup,
      //     verb: 'patch' as K8sVerb,
      //     resource: RolloutModel.plural,
      //     namespace: rollout?.metadata?.namespace,
      //   },
      //   cta: () =>
      //     // TODO - Show toast alert if it fails but this is proving more challenging then I thought
      //     // abortRollout(rollout)
      //     {},
      // },
      // {
      //   id: 'gitops-action-retry',
      //   disabled: rollout?.status?.phase !== RolloutStatus.Degraded,
      //   label: t('Retry'),
      //   accessReview: {
      //     group: RolloutModel.apiGroup,
      //     verb: 'patch' as K8sVerb,
      //     resource: RolloutModel.plural,
      //     namespace: rollout?.metadata?.namespace,
      //   },
      //   cta: () =>
      //     // TODO - Show toast alert if it fails but this is proving more challenging then I thought
      //     // retryRollout(rollout)
      //     {},
      // },
      // {
      //   id: 'gitops-action-restart',
      //   disabled: false,
      //   label: t('Restart'),
      //   accessReview: {
      //     group: RolloutModel.apiGroup,
      //     verb: 'patch' as K8sVerb,
      //     resource: RolloutModel.plural,
      //     namespace: rollout?.metadata?.namespace,
      //   },
      //   cta: () =>
      //     // TODO - Show toast alert if it fails but this is proving more challenging then I thought
      //     // restartRollout(rollout)
      //     {},
      // },
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
    [rollout, launchLabelsModal, launchAnnotationsModal, launchDeleteModal],
  );

  return [actions];
};
