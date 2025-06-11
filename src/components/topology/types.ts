import { K8sKind, K8sResourceCommon, Selector } from '@openshift-console/dynamic-plugin-sdk';

export type RolloutKind = {
  spec: {
    minReadySeconds?: number;
    paused?: boolean;
    progressDeadlineSeconds?: number;
    replicas?: number;
    revisionHistoryLimit?: number;
    selector: Selector;
    strategy?: {
      blueGreen?: {
        maxUnavailable: any;
      };
      canary?: {
        maxUnavailable: any;
      };
    };
    template: any;
  };
  status?: {
    availableReplicas?: number;
    collisionCount?: number;
    conditions?: any;
    observedGeneration?: number;
    readyReplicas?: number;
    replicas?: number;
    unavailableReplicas?: number;
    updatedReplicas?: number;
  };
} & K8sResourceCommon;

export const RolloutModel: K8sKind = {
  label: 'Rollout',
  // t('public~Deployment')
  labelKey: 'public~Rollout',
  apiVersion: 'v1alpha1',
  apiGroup: 'argoproj.io',
  plural: 'rollouts',
  abbr: 'R',
  namespaced: true,
  propagationPolicy: 'Foreground',
  kind: 'Rollout',
  id: 'rollout',
  labelPlural: 'Rollouts',
  // t('public~Deployments')
  labelPluralKey: 'public~Rollouts',
};

export const ReplicaSetModel: K8sKind = {
  label: 'ReplicaSet',
  // t('public~ReplicaSet')
  labelKey: 'public~ReplicaSet',
  apiVersion: 'v1',
  apiGroup: 'apps',
  plural: 'replicasets',
  abbr: 'RS',
  namespaced: true,
  propagationPolicy: 'Foreground',
  kind: 'ReplicaSet',
  id: 'replicaset',
  labelPlural: 'ReplicaSets',
  // t('public~ReplicaSets')
  labelPluralKey: 'public~ReplicaSets',
};
