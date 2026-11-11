import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

export type AgenticRunKind = K8sResourceCommon & {
  spec?: {
    analysis: {
      agent: string;
    };
    execution: {
      agent: string;
    };
    request: string;
  };
};
