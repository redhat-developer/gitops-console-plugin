import { K8sResourceCommon, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import {
  FleetWatchK8sResource,
  useFleetSearchPoll,
  useIsFleetAvailable,
} from '@stolostron/multicluster-sdk';

export function useMulticlusterK8sWatchResource<T extends K8sResourceCommon | K8sResourceCommon[]>(
  initResource: FleetWatchK8sResource,
) {
  const isFleetAvailable = useIsFleetAvailable();
  const fleetResult = useFleetSearchPoll(isFleetAvailable ? initResource : {}); // SDK bug - should be able to pass null here to disable hook
  const localResult = useK8sWatchResource(isFleetAvailable ? null : initResource);
  return isFleetAvailable ? fleetResult : localResult;
}
