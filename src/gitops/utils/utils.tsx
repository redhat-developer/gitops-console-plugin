import React from 'react';

import { COLORS } from '@gitops/components/shared/colors';
import {
  GroupVersionKind,
  K8sResourceCommon,
  K8sResourceKindReference,
  K8sVerb,
  useAccessReview,
} from '@openshift-console/dynamic-plugin-sdk';
import { K8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/api/common-types';

const modelToRef = (obj: K8sModel) => `${obj.apiGroup}~${obj.apiVersion}~${obj.kind}`;
const modelToGroupVersionKind = (obj: K8sModel) => ({
  version: obj.apiVersion,
  kind: obj.kind,
  group: obj.apiGroup,
});

export { modelToGroupVersionKind, modelToRef };

export type ResourceUrlProps = {
  model: K8sModel;
  resource?: K8sResourceCommon;
  activeNamespace?: string;
  name?: string;
};

export const ALL_NAMESPACES_SESSION_KEY = '#ALL_NS#';

/**
 * function for getting a resource URL
 * @param {ResourceUrlProps} urlProps - object with model, resource to get the URL from (optional) and active namespace/project name (optional)
 * @returns {string} the URL for the resource
 */
export const getResourceUrl = (urlProps: ResourceUrlProps): string => {
  const { activeNamespace, model, resource } = urlProps;

  if (!model) return null;
  const { crd, namespaced, plural } = model;

  const namespace =
    resource?.metadata?.namespace ||
    (activeNamespace !== ALL_NAMESPACES_SESSION_KEY && activeNamespace);
  const namespaceUrl = namespace ? `ns/${namespace}` : 'all-namespaces';

  const ref = crd ? `${model.apiGroup || 'core'}~${model.apiVersion}~${model.kind}` : plural || '';
  const name = resource?.metadata?.name || '';

  return `/k8s/${namespaced ? namespaceUrl : 'cluster'}/${ref}/${name}`;
};

export function useObjectModifyPermissions(
  obj: K8sResourceCommon,
  model: K8sModel,
): [[boolean, boolean], [boolean, boolean], [boolean, boolean]] {
  const canPatch = useAccessReview({
    group: model.apiGroup,
    verb: 'patch' as K8sVerb,
    resource: model.plural,
    name: obj.metadata.name,
    namespace: obj.metadata.namespace,
  });

  const canUpdate = useAccessReview({
    group: model.apiGroup,
    verb: 'update' as K8sVerb,
    resource: model.plural,
    name: obj.metadata.name,
    namespace: obj.metadata.namespace,
  });

  const canDelete = useAccessReview({
    group: model.apiGroup,
    verb: 'delete' as K8sVerb,
    resource: model.plural,
    name: obj.metadata.name,
    namespace: obj.metadata.namespace,
  });

  return [canPatch, canUpdate, canDelete];
}

export function resourceAsArray(
  resource: K8sResourceCommon | K8sResourceCommon[],
): K8sResourceCommon[] {
  return Array.isArray(resource) ? resource : [resource];
}

export function encodeHTMLEntities(rawStr: string): string {
  if (rawStr == undefined) return undefined;
  return rawStr.replace(/[\u00A0-\u9999<>\&]/g, (i) => `&#${i.charCodeAt(0)};`);
}

export function getSelectorSearchURL(namespace: string, kind: string, selector: string): string {
  if (namespace) {
    return '/search/ns/' + namespace + '?kind=' + kind + '&q=' + selector;
  } else {
    return '/search?kind=' + kind + '&q=' + selector;
  }
}

export const isGroupVersionKind = (ref: GroupVersionKind | string) => ref?.split('~').length === 3;

export const kindForReference = (ref: K8sResourceKindReference) =>
  isGroupVersionKind(ref) ? ref.split('~')[2] : ref;

export type SyncStatusCode = 'Unknown' | 'Synced' | 'OutOfSync';

export const SyncStatuses: { [key: string]: SyncStatusCode } = {
  Unknown: 'Unknown',
  Synced: 'Synced',
  OutOfSync: 'OutOfSync',
};

export const SpinningIcon = ({ color }: { color: string }) => {
  return (
    <svg
      className="icon spin"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      style={{ color }}
    >
      <path
        fill={color}
        d="M222.7 32.1c5 16.9-4.6 34.8-21.5 39.8C121.8 95.6 64 169.1 64 256c0 106 86 192 192 192s192-86 192-192c0-86.9-57.8-160.4-137.1-184.1c-16.9-5-26.6-22.9-21.5-39.8s22.9-26.6 39.8-21.5C434.9 42.1 512 140 512 256c0 141.4-114.6 256-256 256S0 397.4 0 256C0 140 77.1 42.1 182.9 10.6c16.9-5 34.8 4.6 39.8 21.5z"
      />
    </svg>
  );
};

export const ComparisonStatusIcon = ({
  status,
  resource,
  label,
  noSpin,
  isButton,
}: {
  status: SyncStatusCode;
  resource?: { requiresPruning?: boolean };
  label?: boolean;
  noSpin?: boolean;
  isButton?: boolean;
}) => {
  let className = 'fas fa-question-circle';
  let color = COLORS.sync.unknown;
  let title = 'Unknown';
  switch (status) {
    case SyncStatuses.Synced:
      className = `fa fa-check-circle${isButton ? ' status-button' : ''}`;
      color = COLORS.sync.synced;
      title = 'Synced';
      break;
    case SyncStatuses.OutOfSync:
      // eslint-disable-next-line no-case-declarations
      const requiresPruning = resource && resource.requiresPruning;
      className = requiresPruning
        ? `fa fa-trash${isButton ? ' status-button' : ''}`
        : `fa fa-arrow-alt-circle-up${isButton ? ' status-button' : ''}`;
      title = 'OutOfSync';
      if (requiresPruning) {
        title = `${title} (This resource is not present in the application's source. It will be deleted from Kubernetes if the prune option is enabled during sync.)`;
      }
      color = COLORS.sync.out_of_sync;
      break;
    case SyncStatuses.Unknown:
      className = `fa fa-circle-notch ${noSpin ? '' : 'fa-spin'}${
        isButton ? ' status-button' : ''
      }`;
      break;
  }
  return className.includes('fa-spin') ? (
    <SpinningIcon color={color} />
  ) : (
    <React.Fragment>
      <i title={title} className={className} style={{ color }} /> {label && title}
    </React.Fragment>
  );
};
