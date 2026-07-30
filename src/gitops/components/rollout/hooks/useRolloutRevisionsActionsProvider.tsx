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
import { RolloutKind, RolloutModel } from '../model/RolloutModel';
import { abortRollout, promoteRollout, restartRollout, retryRollout } from '../services/Rollout';
import { isDeploying, RolloutStatus } from '../utils/rollout-utils';

type UseRolloutRevisionsActionsProvider = (
  rollout: RolloutKind,
  onError?: (error: Error | string, action: string) => void,
) => [actions: Action[]];

export const useRolloutRevisionsActionsProvider: UseRolloutRevisionsActionsProvider = (
  rollout,
  onError,
) => {
  const { t } = useGitOpsTranslation();
  const navigate = useNavigate();
  const launchLabelsModal = useLabelsModal(rollout);
  const launchAnnotationsModal = useAnnotationsModal(rollout);
  const launchDeleteModal = useDeleteModal(rollout);

  const actions = React.useMemo(
    () => [
      {
        id: 'gitops-action-promote',
        disabled: !isDeploying(rollout),
        label: t('Promote'),
        accessReview: {
          group: RolloutModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: RolloutModel.plural,
          namespace: rollout?.metadata?.namespace,
        },
        cta: () =>
          void promoteRollout(rollout, false).catch((err: unknown) => {
            onError?.(err instanceof Error ? err : String(err), t('Promote'));
          }),
      },
      {
        id: 'gitops-action-promote-full',
        disabled: !isDeploying(rollout),
        label: t('Full Promote'),
        accessReview: {
          group: RolloutModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: RolloutModel.plural,
          namespace: rollout?.metadata?.namespace,
        },
        cta: () =>
          void promoteRollout(rollout, true).catch((err: unknown) => {
            onError?.(err instanceof Error ? err : String(err), t('Full Promote'));
          }),
      },
      {
        id: 'separator-rollout-actions',
        label: '',
        cta: () => undefined,
      },
      {
        id: 'gitops-action-abort',
        disabled: !isDeploying(rollout),
        label: t('Abort'),
        accessReview: {
          group: RolloutModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: RolloutModel.plural,
          namespace: rollout?.metadata?.namespace,
        },
        cta: () =>
          void abortRollout(rollout).catch((err: unknown) => {
            onError?.(err instanceof Error ? err : String(err), t('Abort'));
          }),
      },
      {
        id: 'gitops-action-retry',
        disabled: rollout?.status?.phase !== RolloutStatus.Degraded,
        label: t('Retry'),
        accessReview: {
          group: RolloutModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: RolloutModel.plural,
          namespace: rollout?.metadata?.namespace,
        },
        cta: () =>
          void retryRollout(rollout).catch((err: unknown) => {
            onError?.(err instanceof Error ? err : String(err), t('Retry'));
          }),
      },
      {
        id: 'gitops-action-restart',
        disabled: false,
        label: t('Restart'),
        accessReview: {
          group: RolloutModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: RolloutModel.plural,
          namespace: rollout?.metadata?.namespace,
        },
        cta: () => {
          void restartRollout(rollout).catch((err: unknown) => {
            onError?.(err instanceof Error ? err : String(err), t('Restart'));
          });
        },
      },
    ],
    [rollout, launchLabelsModal, launchAnnotationsModal, launchDeleteModal, navigate, t, onError],
  );

  return [actions];
};
