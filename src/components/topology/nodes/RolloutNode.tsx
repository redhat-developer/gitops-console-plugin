import * as React from 'react';

import { PodRCData } from '@openshift-console/dynamic-plugin-sdk';
import { getResource, WorkloadNode } from '@openshift-console/dynamic-plugin-sdk-internal';
import { observer } from '@patternfly/react-topology';

import { usePodsForRollouts } from '../usePodsForRollouts';

const RolloutNode: React.FC<React.ComponentProps<any>> = (props, donutStatus: PodRCData) => {
  const { element } = props;
  const resource = getResource(element);
  console.log('GitOpsLog: donut status is ' + donutStatus);
  const { loaded, loadError, pods } = usePodsForRollouts(
    resource,
    resource.metadata.uid,
    resource.metadata.namespace,
  );

  const rolloutDonutStatus = React.useMemo(() => {
    if (loaded && !loadError) {
      const [current, previous] = pods;
      const isRollingOut = !!current && !!previous;
      return {
        obj: resource,
        current,
        previous,
        isRollingOut,
        pods: [...(current?.pods || []), ...(previous?.pods || [])],
      };
    }
    return null;
  }, [loaded, loadError, pods, resource]);

  return (
    <WorkloadNode {...props} donutStatus={rolloutDonutStatus} badge="AR" badgeColor="#E9654B" />
  );
};

export default observer(RolloutNode);
