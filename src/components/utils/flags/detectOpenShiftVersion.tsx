import { SetFeatureFlag } from '@openshift-console/dynamic-plugin-sdk';

import { FLAG_GITOPS_ENABLE_TOPOLOGY } from '../../../const';
import { UseOpenShiftVersion } from '../useClusterVersion';
import { resolveOpenShiftVersion, shouldEnableGitOpsTopology } from './shouldEnableGitOpsTopology';

type ConsoleServerFlags = {
  releaseVersion?: string;
};

export const detectOpenShiftVersion = (setFeatureFlag: SetFeatureFlag) => {
  const watchedVersion = UseOpenShiftVersion();
  const serverReleaseVersion =
    typeof window !== 'undefined'
      ? (window as Window & { SERVER_FLAGS?: ConsoleServerFlags }).SERVER_FLAGS?.releaseVersion
      : undefined;
  const openshiftVersion = resolveOpenShiftVersion(watchedVersion, serverReleaseVersion);
  setFeatureFlag(FLAG_GITOPS_ENABLE_TOPOLOGY, shouldEnableGitOpsTopology(openshiftVersion));
};
