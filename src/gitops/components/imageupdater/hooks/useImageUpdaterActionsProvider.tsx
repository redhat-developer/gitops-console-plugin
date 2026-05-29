import * as React from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';

import {
  Action,
  K8sVerb,
  useAnnotationsModal,
  useDeleteModal,
  useLabelsModal,
} from '@openshift-console/dynamic-plugin-sdk';

import {
  ImageUpdaterKind,
  ImageUpdaterModel,
  imageUpdaterModelRef,
} from '../../../models/ImageUpdaterModel';
import { useGitOpsTranslation } from '../../../utils/hooks/useGitOpsTranslation';

type UseImageUpdaterActionsProvider = (imageUpdater: ImageUpdaterKind) => Action[];

export const useImageUpdaterActionsProvider: UseImageUpdaterActionsProvider = (imageUpdater) => {
  const { t } = useGitOpsTranslation();
  const navigate = useNavigate();
  const launchLabelsModal = useLabelsModal(imageUpdater);
  const launchAnnotationsModal = useAnnotationsModal(imageUpdater);
  const launchDeleteModal = useDeleteModal(imageUpdater);

  const actions = React.useMemo(
    () => [
      {
        id: 'gitops-action-edit-labels-imageupdater',
        disabled: false,
        label: t('Edit labels'),
        accessReview: {
          group: ImageUpdaterModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: ImageUpdaterModel.plural,
          namespace: imageUpdater?.metadata?.namespace,
        },
        cta: () => {
          launchLabelsModal();
        },
      },
      {
        id: 'gitops-action-edit-annotations-imageupdater',
        disabled: false,
        label: t('Edit annotations'),
        accessReview: {
          group: ImageUpdaterModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: ImageUpdaterModel.plural,
          namespace: imageUpdater?.metadata?.namespace,
        },
        cta: () => {
          launchAnnotationsModal();
        },
      },
      {
        id: 'gitops-action-edit-imageupdater',
        disabled: !imageUpdater?.metadata?.namespace || !imageUpdater?.metadata?.name,
        label: t('Edit ImageUpdater'),
        accessReview: {
          group: ImageUpdaterModel.apiGroup,
          verb: 'update' as K8sVerb,
          resource: ImageUpdaterModel.plural,
          namespace: imageUpdater?.metadata?.namespace,
        },
        cta: () => {
          if (!imageUpdater?.metadata?.namespace || !imageUpdater?.metadata?.name) {
            return;
          }
          navigate(
            `/k8s/ns/${imageUpdater?.metadata?.namespace}/${imageUpdaterModelRef}/${imageUpdater?.metadata?.name}/yaml`,
          );
        },
      },
      {
        id: 'gitops-action-delete-imageupdater',
        disabled: false,
        label: t('Delete ImageUpdater'),
        accessReview: {
          group: ImageUpdaterModel.apiGroup,
          verb: 'delete' as K8sVerb,
          resource: ImageUpdaterModel.plural,
          namespace: imageUpdater?.metadata?.namespace,
        },
        cta: () => launchDeleteModal(),
      },
    ],
    [imageUpdater, launchLabelsModal, launchAnnotationsModal, launchDeleteModal, navigate, t],
  );

  return actions;
};
