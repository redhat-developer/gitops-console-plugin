import { modelToRef } from 'src/gitops/utils/utils';

import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { K8sModel, Selector } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';
import { K8sResourceCondition } from '@openshift-console/dynamic-plugin-sdk-internal/lib/extensions/console-types';

export const ApplicationSetModel: K8sModel = {
  label: 'ApplicationSet',
  labelPlural: 'ApplicationSets',
  apiVersion: 'v1alpha1',
  apiGroup: 'argoproj.io',
  plural: 'applicationsets',
  abbr: 'appset',
  namespaced: true,
  kind: 'ApplicationSet',
  id: 'applicationset',
  crd: true,
};

export type ListAppSetGenerator = {
  elements?: object[];
  elementsYaml?: string;
};

export type ClusterAppSetGenerator = {
  selector?: Selector;
  values?: Map<string, string>;
};

export type GeneratorParent = {
  generators: AppSetGenerator[];
};

export type MatrixAppSetGenerator = GeneratorParent; // & {};

export type UnionAppSetGenerator = GeneratorParent; // & {};

export type MergeAppSetGenerator = GeneratorParent & {
  mergeKeys: string[];
};

export type GitAppSetGenerator = {
  repoURL: string;
  revision?: string;
  files?: {
    path: string;
  }[];
  directories?: {
    exclude: boolean;
    path: string;
  }[];
};

export type SCMProviderAppSetGenerator = {
  awsCodeCommit?: object;
  azureDevOps?: object;
  bitbucket?: object;
  bitbucketServer?: object;
  cloneProtocol?: string;
  filters?: object[];
  gitea?: object;
  github?: object;
  gitlab?: object;
  requeueAfterSeconds?: number;
  values?: Map<string, string>;
};

export type PullRequestAppSetGenerator = {
  azuredevops?: object;
  bitbucket?: object;
  bitbucketServer?: object;
  filters?: object[];
  gitea?: object;
  github?: object;
  gitlab?: object;
  requeueAfterSeconds?: number;
};

export type ClusterDecisionresource = {
  configMapRef: string;
  labelSelector: object;
  name: string;
  requeueAfterSeconds?: number;
  values?: Map<string, string>;
};

export type AppSetGenerator = {
  clusters?: ClusterAppSetGenerator;
  git?: GitAppSetGenerator;
  list?: ListAppSetGenerator;
  matrix?: MatrixAppSetGenerator;
  merge?: MergeAppSetGenerator;
  pullRequest: PullRequestAppSetGenerator;
  scmProvider?: SCMProviderAppSetGenerator;
  union?: UnionAppSetGenerator;
};

export type ApplicationSetSpec = GeneratorParent; // & {};

export type ApplicationSetStatus = {
  conditions?: K8sResourceCondition[];
};

export type ApplicationSetKind = K8sResourceCommon & {
  spec: ApplicationSetSpec;
  status?: ApplicationSetStatus;
};

export const applicationSetModelRef = modelToRef(ApplicationSetModel);
