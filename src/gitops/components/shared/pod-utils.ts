import * as _ from 'lodash';

import { AllPodStatus } from '@openshift-console/dynamic-plugin-sdk-internal/lib/extensions/console-types';

const isContainerFailedFilter = (containerStatus) => {
  return containerStatus.state.terminated && containerStatus.state.terminated.exitCode !== 0;
};

export const isContainerLoopingFilter = (containerStatus) => {
  return (
    containerStatus.state.waiting && containerStatus.state.waiting.reason === 'CrashLoopBackOff'
  );
};

const numContainersReadyFilter = (pod) => {
  const {
    status: { containerStatuses },
  } = pod;
  let numReady = 0;
  _.forEach(containerStatuses, (status) => {
    if (status.ready) {
      numReady++;
    }
  });
  return numReady;
};

const isReady = (pod) => {
  const {
    spec: { containers },
  } = pod;
  const numReady = numContainersReadyFilter(pod);
  const total = _.size(containers);

  return numReady === total;
};

const podWarnings = (pod) => {
  const {
    status: { phase, containerStatuses },
  } = pod;
  if (phase === AllPodStatus.Running && containerStatuses) {
    return _.map(containerStatuses, (containerStatus) => {
      if (!containerStatus.state) {
        return null;
      }

      if (isContainerFailedFilter(containerStatus)) {
        if (_.has(pod, ['metadata', 'deletionTimestamp'])) {
          return AllPodStatus.Failed;
        }
        return AllPodStatus.Warning;
      }
      if (isContainerLoopingFilter(containerStatus)) {
        return AllPodStatus.CrashLoopBackOff;
      }
      return null;
    }).filter((x) => x);
  }
  return null;
};

export const getPodStatus = (pod) => {
  if (_.has(pod, ['metadata', 'deletionTimestamp'])) {
    return AllPodStatus.Terminating;
  }
  const warnings = podWarnings(pod);
  if (warnings !== null && warnings.length) {
    if (warnings.includes(AllPodStatus.CrashLoopBackOff)) {
      return AllPodStatus.CrashLoopBackOff;
    }
    if (warnings.includes(AllPodStatus.Failed)) {
      return AllPodStatus.Failed;
    }
    return AllPodStatus.Warning;
  }
  const phase = _.get(pod, ['status', 'phase'], AllPodStatus.Unknown);
  if (phase === AllPodStatus.Running && !isReady(pod)) {
    return AllPodStatus.NotReady;
  }
  return phase;
};
