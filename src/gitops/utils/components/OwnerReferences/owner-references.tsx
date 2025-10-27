import * as React from 'react';
import * as _ from 'lodash-es';

import { ApplicationModel } from '@gitops/models/ApplicationModel';
import { ApplicationSetModel } from '@gitops/models/ApplicationSetModel';
import {
  K8sModel,
  K8sResourceKind,
  OwnerReference,
  ResourceLink,
} from '@openshift-console/dynamic-plugin-sdk';
import { Tooltip } from '@patternfly/react-core';

import { useGitOpsTranslation } from '../../hooks/useGitOpsTranslation';

const getModel = (ownerRef: OwnerReference): K8sModel | null => {
  // Handle Argo CD resources
  const argoApiGroup = 'argoproj.io';
  if (ownerRef.apiVersion.includes(argoApiGroup)) {
    if (ownerRef.kind === 'ApplicationSet') {
      return ApplicationSetModel;
    } else if (ownerRef.kind === 'Application') {
      return ApplicationModel;
    }
  }

  return null;
};

export const OwnerReferences: React.FC<OwnerReferencesProps> = ({ resource }) => {
  const { t } = useGitOpsTranslation();
  const owners = (_.get(resource.metadata, 'ownerReferences') || []).map((o: OwnerReference) => {
    const model = getModel(o);

    if (!model) {
      // Fallback to simple ResourceLink for unknown types
      return (
        <ResourceLink
          key={o.uid}
          kind={o.kind}
          name={o.name}
          namespace={resource.metadata.namespace}
        />
      );
    }

    return (
      <Tooltip key={o.uid} content={<div>View {model.kind}</div>} position="top">
        <ResourceLink
          namespace={resource.metadata.namespace}
          groupVersionKind={{
            group: model.apiGroup,
            version: model.apiVersion,
            kind: model.kind,
          }}
          name={o.name}
        />
      </Tooltip>
    );
  });
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
