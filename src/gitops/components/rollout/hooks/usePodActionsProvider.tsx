import * as React from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import { PodKind } from 'src/components/topology/console/types';

import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import {
  Action,
  K8sVerb,
  useAnnotationsModal,
  useDeleteModal,
  useK8sModel,
  useLabelsModal,
} from '@openshift-console/dynamic-plugin-sdk';

type PodActionsProviderType = (obj: PodKind) => [actions: Action[]];

export const usePodActionsProvider: PodActionsProviderType = (obj) => {
  const { t } = useGitOpsTranslation();

  const navigate = useNavigate();
  const launchLabelsModal = useLabelsModal(obj);
  const launchAnnotationsModal = useAnnotationsModal(obj);
  const launchDeleteModal = useDeleteModal(obj);

  const [podModel] = useK8sModel({ kind: 'Pod', version: 'v1' });

  const actions = React.useMemo(
    () => [
      {
        id: 'gitops-action-edit-labels-pod',
        disabled: false,
        label: t('Edit labels'),
        accessReview: {
          group: podModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: podModel.plural,
          namespace: obj?.metadata?.namespace,
        },
        cta: () => {
          launchLabelsModal();
        },
      },
      {
        id: 'gitops-action-edit-annotations-pod',
        disabled: false,
        label: t('Edit annotations'),
        accessReview: {
          group: podModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: podModel.plural,
          namespace: obj?.metadata?.namespace,
        },
        cta: () => {
          launchAnnotationsModal();
        },
      },
      {
        id: 'gitops-action-edit-pod',
        disabled: false,
        label: t('Edit Pod'),
        accessReview: {
          group: podModel.apiGroup,
          verb: 'update' as K8sVerb,
          resource: podModel.plural,
          namespace: obj?.metadata?.namespace,
        },
        cta: () => {
          navigate(`/k8s/ns/${obj?.metadata?.namespace}/pods/${obj?.metadata?.name}/yaml`);
        },
      },
      {
        id: 'gitops-action-delete-pod',
        label: t('Delete'),
        accessReview: {
          group: podModel.apiGroup,
          verb: 'delete' as K8sVerb,
          resource: podModel.plural,
          namespace: obj?.metadata?.namespace,
        },
        cta: () => launchDeleteModal(),
      },
    ],
    [
      obj,
      launchLabelsModal,
      launchAnnotationsModal,
      launchDeleteModal,
      navigate,
      t,
      podModel.apiGroup,
      podModel.plural,
    ],
  );
  return [actions];
};

export default usePodActionsProvider;
