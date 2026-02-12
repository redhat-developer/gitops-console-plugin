import React from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';

import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { modelToRef } from '@gitops/utils/utils';
import {
  useAnnotationsModal,
  useDeleteModal,
  useLabelsModal,
} from '@openshift-console/dynamic-plugin-sdk';
import { useK8sModel } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/hooks/useK8sModel';
import { GraphElement } from '@patternfly/react-topology';
import { ContextMenuItem } from '@patternfly/react-topology';

interface GraphResourceMenuItemProps {
  graphElement: GraphElement;
  label: string;
}

export const GraphResourceMenuItem: React.FC<GraphResourceMenuItemProps> = ({
  graphElement,
  label,
}) => {
  const data = graphElement.getData();
  const placeholderResource = React.useMemo(
    () => ({
      apiVersion: data.group ? `${data.group}/${data.version}` : data.version,
      kind: data.kind,
      metadata: {
        name: data.name,
        namespace: data.namespace,
      },
    }),
    [data.group, data.version, data.kind, data.name, data.namespace],
  );
  const launchResourceLabelsModal = useLabelsModal(placeholderResource);
  const launchResourceAnnotationsModal = useAnnotationsModal(placeholderResource);
  const [k8sModel] = useK8sModel({ group: data.group, version: data.version, kind: data.kind });
  const modelRef = modelToRef(k8sModel);
  const launchResourceDeleteModal = useDeleteModal(placeholderResource, window.location);
  const navigate = useNavigate();

  return (
    <ContextMenuItem
      key={label}
      onClick={() => {
        if (label === t('Edit labels')) {
          launchResourceLabelsModal();
        } else if (label === t('Edit annotations')) {
          launchResourceAnnotationsModal();
        } else if (label === t('Delete {{x}}', { x: data.kind })) {
          launchResourceDeleteModal();
        } else if (label === t('Edit {{x}}', { x: data.kind })) {
          navigate(`/k8s/ns/${data.namespace}/${modelRef}/${data.name}/yaml`);
        }
      }}
    >
      {label}
    </ContextMenuItem>
  );
};
