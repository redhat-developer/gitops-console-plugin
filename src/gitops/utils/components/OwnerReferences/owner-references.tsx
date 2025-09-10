import * as React from 'react';
import * as _ from 'lodash-es';

import {
  K8sResourceKind,
  OwnerReference,
  ResourceLink,
} from '@openshift-console/dynamic-plugin-sdk';

import { useGitOpsTranslation } from '../../hooks/useGitOpsTranslation';

export const OwnerReferences: React.FC<OwnerReferencesProps> = ({ resource }) => {
  const { t } = useGitOpsTranslation();
  const owners = (_.get(resource.metadata, 'ownerReferences') || []).map((o: OwnerReference) => (
    <ResourceLink key={o.uid} kind={o.kind} name={o.name} namespace={resource.metadata.namespace} />
  ));
  return owners.length ? (
    <>{owners}</>
  ) : (
    <span className="pf-v6-u-text-color-subtle">{t('public~No owner')}</span>
  );
};

type OwnerReferencesProps = {
  resource: K8sResourceKind;
};

OwnerReferences.displayName = 'OwnerReferences';
