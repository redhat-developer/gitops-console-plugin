import * as React from 'react';

import { Action, K8sVerb } from '@openshift-console/dynamic-plugin-sdk';

import { useGitOpsTranslation } from '../../../utils/hooks/useGitOpsTranslation';
import { RolloutKind, RolloutModel } from '../model/RolloutModel';
import { ReplicaSetInfo } from '../revisions/ReplicaSetInfo';
import { rollbackRollout } from '../services/Rollout';

type UseRolloutRevisionsRSActionsProvider = (
  rollout: RolloutKind,
  replicaSet: ReplicaSetInfo,
  index: number,
  onError?: (err: Error | string, action: string) => void,
) => [actions: Action[]];

export const useRolloutRevisionsRSActionsProvider: UseRolloutRevisionsRSActionsProvider = (
  rollout,
  replicaSet,
  index,
  onError,
) => {
  const { t } = useGitOpsTranslation();

  const actions = React.useMemo(
    () => [
      {
        id: 'gitops-action-rollback-' + index,
        disabled: index === 0,
        label: t('Rollback'),
        accessReview: {
          group: RolloutModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: RolloutModel.plural,
          namespace: rollout?.metadata?.namespace,
        },
        cta: () => {
          void rollbackRollout(rollout, replicaSet.replicaSet).catch((err: unknown) => {
            onError?.(err instanceof Error ? err : String(err), t('Rollback'));
          });
        },
      },
    ],
    [rollout, replicaSet, index, onError, t],
  );

  return [actions];
};
