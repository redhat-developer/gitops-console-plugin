import * as React from 'react';
import * as _ from 'lodash';

import {
  AllPodStatus,
  ExtPodKind,
  K8sKind,
  K8sResourceCommon,
  K8sResourceKind,
  OverviewItemAlerts,
  PodControllerOverviewItem,
  useK8sWatchResources,
} from '@openshift-console/dynamic-plugin-sdk';
import { GetAPIVersionForModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/k8s-types';

import { useDebounceCallback } from './console/debounce';
import { useDeepCompareMemoize } from './console/deep-compare-memoize';
import { PodKind } from './console/types';
import { ReplicaSetModel } from './types';

export const usePodsForRollouts = (
  rollout: K8sResourceKind,
  revisionIds: string | string[],
  namespace: string,
): { loaded: boolean; loadError: string; pods: PodControllerOverviewItem[] } => {
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [loadError, setLoadError] = React.useState<string>('');
  const [pods, setPods] = React.useState<PodControllerOverviewItem[]>([]);
  const revisions = useDeepCompareMemoize(Array.isArray(revisionIds) ? revisionIds : [revisionIds]);
  const watchedResources = React.useMemo(
    () => ({
      replicaSets: {
        isList: true,
        kind: 'ReplicaSet',
        namespace,
      },
      pods: {
        isList: true,
        kind: 'Pod',
        namespace,
      },
    }),
    [namespace],
  );
  const resources = useK8sWatchResources<{ [key: string]: K8sResourceCommon[] }>(watchedResources);
  const updateResults = React.useCallback(
    (updatedResources) => {
      const errorKey = Object.keys(updatedResources).find((key) => updatedResources[key].loadError);
      if (errorKey) {
        setLoadError(updatedResources[errorKey].loadError?.message);
        return;
      }
      if (
        Object.keys(updatedResources).length > 0 &&
        Object.keys(updatedResources).every((key) => updatedResources[key].loaded)
      ) {
        const rolloutPods = revisions.reduce((acc) => {
          acc.push(...getReplicaSetsForResource(rollout, updatedResources));
          return acc;
        }, []);
        setLoaded(true);
        setLoadError(null);
        setPods(rolloutPods);
      }
    },
    [revisions, rollout],
  );

  const debouncedUpdateResources = useDebounceCallback(updateResults, 250);

  React.useEffect(() => {
    debouncedUpdateResources(resources);
  }, [debouncedUpdateResources, resources]);

  return useDeepCompareMemoize({ loaded, loadError, pods });
};

export const getReplicaSetsForResource = (
  rollout: K8sResourceKind,
  resources: any,
): PodControllerOverviewItem[] => {
  const replicaSets = getActiveReplicaSets(rollout, resources);
  return sortReplicaSetsByRevision(replicaSets).map((rs) =>
    getIdledStatus(toResourceItem(rs, ReplicaSetModel, resources), rollout),
  );
};

export const getActiveReplicaSets = (
  rollout: K8sResourceKind,
  resources: any,
): K8sResourceKind[] => {
  const { replicaSets } = resources;
  const currentRevision = getRolloutRevision(rollout);
  const ownedRS = getOwnedResources(rollout, replicaSets?.data);
  return _.filter(ownedRS, (rs) => getRolloutRevision(rs) === currentRevision);
};

export const getRolloutRevision = (obj: K8sResourceCommon): number => {
  const revision = getAnnotation(obj, ROLLOUT_REVISION_ANNOTATION);
  return revision && parseInt(revision, 10);
};

const getAnnotation = (obj: K8sResourceCommon, annotation: string): string => {
  return obj?.metadata?.annotations?.[annotation];
};

// Annotaton key for rollout revision
export const ROLLOUT_REVISION_ANNOTATION = 'rollout.argoproj.io/revision';

export const getOwnedResources = <T extends K8sResourceKind>(
  obj: K8sResourceKind,
  resources: T[],
): T[] => {
  const uid = obj?.metadata?.uid;
  if (!uid) {
    return [];
  }
  return _.filter(resources, ({ metadata: { ownerReferences } }) => {
    return _.some(ownerReferences, {
      uid,
      controller: true,
    });
  });
};

export const sortReplicaSetsByRevision = (replicaSets: K8sResourceKind[]): K8sResourceKind[] => {
  return sortByRevision(replicaSets, getRolloutRevision);
};

const sortByRevision = (
  replicators: K8sResourceKind[],
  getRevision: (obj: K8sResourceCommon) => number,
  descending = true,
): K8sResourceKind[] => {
  const compare = (left, right) => {
    const leftVersion = getRevision(left);
    const rightVersion = getRevision(right);
    if (!_.isFinite(leftVersion) && !_.isFinite(rightVersion)) {
      const leftName = _.get(left, 'metadata.name', '');
      const rightName = _.get(right, 'metadata.name', '');
      if (descending) {
        return rightName.localeCompare(leftName);
      }
      return leftName.localeCompare(rightName);
    }

    if (!leftVersion) {
      return descending ? 1 : -1;
    }

    if (!rightVersion) {
      return descending ? -1 : 1;
    }

    if (descending) {
      return rightVersion - leftVersion;
    }

    return leftVersion - rightVersion;
  };

  return _.toArray(replicators).sort(compare);
};

const getIdledStatus = (
  rc: PodControllerOverviewItem,
  dc: K8sResourceKind,
): PodControllerOverviewItem => {
  const { pods } = rc;
  if (pods && !pods.length && isIdled(dc)) {
    return {
      ...rc,
      pods: [
        {
          ..._.pick(rc.obj, 'metadata', 'status', 'spec'),
          status: { phase: AllPodStatus.Idle },
        },
      ],
    };
  }
  return rc;
};

export const isIdled = (deploymentConfig: K8sResourceKind): boolean => {
  return !!_.get(
    deploymentConfig,
    'metadata.annotations["idling.alpha.openshift.io/idled-at"]',
    false,
  );
};

const toResourceItem = (
  rs: K8sResourceKind,
  model: K8sKind,
  resources: any,
): PodControllerOverviewItem => {
  const obj = {
    ...rs,
    apiVersion: apiVersionForModel(model),
    kind: `${model.kind}`,
  };
  const isKnative = isKnativeServing(rs, 'metadata.labels');
  const podData = getPodsForResource(rs, resources);
  const pods = podData && !podData.length && isKnative ? getAutoscaledPods(rs) : podData;
  const alerts = combinePodAlerts(pods);
  return {
    alerts,
    obj,
    pods,
    revision: getRolloutRevision(rs),
  };
};

export const apiVersionForModel: GetAPIVersionForModel = (model) =>
  !model?.apiGroup ? model.apiVersion : `${model.apiGroup}/${model.apiVersion}`;

export const isKnativeServing = (configRes: K8sResourceKind, properties: string): boolean => {
  const deploymentsLabels = _.get(configRes, properties) || {};
  return !!deploymentsLabels['serving.knative.dev/configuration'];
};

export const getPodsForResource = (resource: K8sResourceKind, resources: any): PodKind[] => {
  const { pods } = resources;
  return getOwnedResources(resource, pods?.data);
};

const combinePodAlerts = (pods: K8sResourceKind[]): OverviewItemAlerts =>
  _.reduce(
    pods,
    (acc, pod) => ({
      ...acc,
      ...getPodAlerts(pod),
    }),
    {},
  );

const getPodAlerts = (pod: K8sResourceKind): OverviewItemAlerts => {
  const alerts = {};
  const statuses = [
    ..._.get(pod, 'status.initContainerStatuses', []),
    ..._.get(pod, 'status.containerStatuses', []),
  ];
  statuses.forEach((status) => {
    const { name, state } = status;
    const waitingReason = _.get(state, 'waiting.reason');
    if (CONTAINER_WAITING_STATE_ERROR_REASONS.includes(waitingReason)) {
      const key = podAlertKey(waitingReason, pod, name);
      const message = state.waiting.message || waitingReason;
      alerts[key] = { severity: 'error', message };
    }
  });

  _.get(pod, 'status.conditions', []).forEach((condition) => {
    const { type, status, reason, message } = condition;
    if (type === 'PodScheduled' && status === 'False' && reason === 'Unschedulable') {
      // eslint-disable-next-line
        const key = podAlertKey(reason, pod);
      alerts[key] = {
        severity: 'error',
        message: `${reason}: ${message}`,
      };
    }
  });

  return alerts;
};

// List of container status waiting reason values that we should call out as errors in project status rows.
export const CONTAINER_WAITING_STATE_ERROR_REASONS = [
  'CrashLoopBackOff',
  'ErrImagePull',
  'ImagePullBackOff',
];

// Only show an alert once if multiple pods have the same error for the same owner.
const podAlertKey = (alert: any, pod: K8sResourceKind, containerName = 'all'): string => {
  const id = _.get(pod, 'metadata.ownerReferences[0].uid', pod.metadata.uid);
  return `${alert}--${id}--${containerName}`;
};

const getAutoscaledPods = (rc: K8sResourceKind): ExtPodKind[] => {
  return [
    {
      ..._.pick(rc, 'metadata', 'status', 'spec'),
      status: { phase: AllPodStatus.AutoScaledTo0 },
    },
  ];
};
