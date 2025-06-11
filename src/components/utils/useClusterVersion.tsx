import { useEffect, useState } from 'react';
import { RootStateOrAny, useSelector } from 'react-redux';

import {
  K8sGroupVersionKind,
  K8sKind,
  K8sModel,
  K8sResourceKindReference,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';

import { ClusterVersionKind } from '../topology/console/types';

export const ClusterVersionModel: K8sKind = {
  label: 'ClusterVersion',
  // t('public~ClusterVersion')
  labelKey: 'public~ClusterVersion',
  labelPlural: 'ClusterVersions',
  // t('public~ClusterVersions')
  labelPluralKey: 'public~ClusterVersions',
  apiVersion: 'v1',
  apiGroup: 'config.openshift.io',
  plural: 'clusterversions',
  abbr: 'CV',
  namespaced: false,
  kind: 'ClusterVersion',
  id: 'clusterversion',
  crd: true,
};

export const featureReducerName = 'FLAGS';

export type FlagsObject = { [key: string]: boolean };

export const getFlagsObject = ({
  [featureReducerName]: featureState,
}: RootStateOrAny): FlagsObject => featureState.toObject();

const getClusterVersionFlag = (state: RootStateOrAny) => getFlagsObject(state)?.['CLUSTER_VERSION'];

export const useClusterVersion = (): ClusterVersionKind => {
  const isClusterVersion = useSelector(getClusterVersionFlag);
  const resource = isClusterVersion
    ? { kind: getReferenceForModel(ClusterVersionModel), name: 'version', isList: false }
    : null;
  const [cvData, cvLoaded, cvLoadError] = useK8sWatchResource<ClusterVersionKind>(resource);
  return cvLoaded && !cvLoadError ? cvData : null;
};

export const UseOpenShiftVersion = (): string => {
  const [openshiftVersion, setOpenShiftVersion] = useState<string>();
  const clusterVersion = useClusterVersion();
  const version = clusterVersion?.status?.history?.[0]?.version;
  useEffect(() => {
    setOpenShiftVersion(version);
  }, [version]);
  return openshiftVersion;
};

export const getReferenceForModel = (model: K8sModel): K8sResourceKindReference =>
  getReference({
    group: model.apiGroup,
    version: model.apiVersion,
    kind: model.kind,
  });

export const getReference = ({
  group,
  version,
  kind,
}: K8sGroupVersionKind): K8sResourceKindReference => [group || 'core', version, kind].join('~');
