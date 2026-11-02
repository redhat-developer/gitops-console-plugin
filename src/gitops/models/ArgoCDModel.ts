import type {
  K8sModel,
  K8sResourceCommon,
  K8sResourceCondition,
} from '@openshift-console/dynamic-plugin-sdk';

export const ArgoCDModel: K8sModel = {
  apiGroup: 'argoproj.io',
  apiVersion: 'v1beta1',
  kind: 'ArgoCD',
  plural: 'argocds',
  abbr: 'ACD',
  namespaced: true,
  label: 'ArgoCD',
  labelPlural: 'ArgoCDs',
};

export const ArgoCDGroupVersionKind = {
  group: 'argoproj.io',
  version: 'v1beta1',
  kind: 'ArgoCD',
};

export type ArgoCDKind = K8sResourceCommon & {
  spec?: ArgoCDSpec;
  status?: ArgoCDStatus;
};

export type ArgoCDSpec = {
  server?: {
    autoscale?: {
      enabled?: boolean;
    };
    ingress?: {
      enabled?: boolean;
    };
    resources?: {
      requests?: {
        cpu?: string;
        memory?: string;
      };
      limits?: {
        cpu?: string;
        memory?: string;
      };
    };
    route?: {
      enabled?: boolean;
    };
    service?: {
      type?: string;
      port?: number;
      annotations?: { [key: string]: string };
      labels?: { [key: string]: string };
    };
  };
  repo?: {
    resources?: {
      requests?: {
        cpu?: string;
        memory?: string;
      };
      limits?: {
        cpu?: string;
        memory?: string;
      };
    };
  };
};

export type ArgoCDStatus = {
  server: string;
  host: string;
  applicationController: string;
  applicationSetController: string;
  sso: string;
  repo: string;
  conditions: K8sResourceCondition[];
  phase: string;
  redis: string;
};
