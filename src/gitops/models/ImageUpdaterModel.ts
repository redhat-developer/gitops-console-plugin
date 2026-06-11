import { modelToRef } from 'src/gitops/utils/utils';

import { K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';

export type ImageUpdaterCondition = {
  lastTransitionTime: string;
  message: string;
  observedGeneration?: number;
  reason: string;
  status: string;
  type: string;
};

export type ImageUpdaterRecentUpdate = {
  alias: string;
  applicationsUpdated: number;
  image: string;
  message: string;
  newVersion: string;
  updatedAt: string;
};

export type ImageUpdaterKind = K8sResourceCommon & {
  status?: {
    applicationsMatched?: number;
    imagesManaged?: number;
    lastCheckedAt?: string;
    lastUpdatedAt?: string;
    observedGeneration?: number;
    conditions?: ImageUpdaterCondition[];
    recentUpdates?: ImageUpdaterRecentUpdate[];
  };
};

export const ImageUpdaterModel: K8sModel = {
  label: 'ImageUpdater',
  labelPlural: 'ImageUpdaters',
  apiVersion: 'v1alpha1',
  apiGroup: 'argocd-image-updater.argoproj.io',
  plural: 'imageupdaters',
  abbr: 'IU',
  namespaced: true,
  kind: 'ImageUpdater',
  id: 'imageupdater',
  crd: true,
};

export const imageUpdaterModelRef = modelToRef(ImageUpdaterModel);
