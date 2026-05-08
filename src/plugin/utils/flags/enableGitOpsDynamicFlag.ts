import { SetFeatureFlag } from '@openshift-console/dynamic-plugin-sdk';

import { FLAG_GITOPS_DYNAMIC } from '../../../const';

export const enableGitOpsDynamicFlag = (setFeatureFlag: SetFeatureFlag) =>
  setFeatureFlag(FLAG_GITOPS_DYNAMIC, true);
