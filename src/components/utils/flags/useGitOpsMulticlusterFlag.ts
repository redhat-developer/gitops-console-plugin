import { useEffect } from 'react';

import { SetFeatureFlag } from '@openshift-console/dynamic-plugin-sdk';
import { useIsFleetAvailable } from '@stolostron/multicluster-sdk';

import { FLAG_GITOPS_MULTICLUSTER } from '../../../const';

export const useGitOpsMulticlusterFlag = (setFeatureFlag: SetFeatureFlag) => {
  const isFleetAvailable = useIsFleetAvailable();

  useEffect(() => {
    if (isFleetAvailable) {
      setFeatureFlag(FLAG_GITOPS_MULTICLUSTER, isFleetAvailable);
    }
  }, [isFleetAvailable, setFeatureFlag]);
};
