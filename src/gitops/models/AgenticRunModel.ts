import { K8sModel, K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';

export const LightspeedAgenticRunModel: K8sModel = {
  apiGroup: 'agentic.openshift.io',
  apiVersion: 'v1alpha1',
  kind: 'AgenticRun',
  plural: 'agenticruns',
  abbr: 'AGR',
  namespaced: true,
  label: 'AgenticRun',
  labelPlural: 'AgenticRuns',
};

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