import { SemVer } from 'semver';

import { SetFeatureFlag } from '@openshift-console/dynamic-plugin-sdk';

import { FLAG_GITOPS_ENABLE_TOPOLOGY } from '../../../const';
import { UseOpenShiftVersion } from '../useClusterVersion';

export const detectOpenShiftVersion = (setFeatureFlag: SetFeatureFlag) => {
  const openshiftVersion = UseOpenShiftVersion();
  const enableTopology = openshiftVersion
    ? new SemVer(openshiftVersion).compare('4.18.99999999') >= 0
    : false; // Need to set this so nightly builds will work, eg: 4.19.0-0.nightly-2025-06-09-210043
  console.log(`GitOps: Detected OpenShift version = ${openshiftVersion}`);
  console.log(`GitOps: Enable GitOps in Topology View = ${enableTopology}`);
  setFeatureFlag(FLAG_GITOPS_ENABLE_TOPOLOGY, enableTopology);
};
