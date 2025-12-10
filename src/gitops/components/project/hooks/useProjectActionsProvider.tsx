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
  AppProjectKind,
  AppProjectModel,
  appProjectModelRef,
} from '../../../models/AppProjectModel';
import { useGitOpsTranslation } from '../../../utils/hooks/useGitOpsTranslation';

type UseProjectActionsProvider = (project: AppProjectKind) => Action[];

export const useProjectActionsProvider: UseProjectActionsProvider = (project) => {
  const { t } = useGitOpsTranslation();
  const navigate = useNavigate();
  const launchLabelsModal = useLabelsModal(project);
  const launchAnnotationsModal = useAnnotationsModal(project);
  const launchDeleteModal = useDeleteModal(project);

  const actions = React.useMemo(
    () => [
      {
        id: 'gitops-action-edit-labels-project',
        disabled: false,
        label: t('Edit labels'),
        accessReview: {
          group: AppProjectModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: AppProjectModel.plural,
          namespace: project?.metadata?.namespace,
        },
        cta: () => {
          launchLabelsModal();
        },
      },
      {
        id: 'gitops-action-edit-annotations-project',
        disabled: false,
        label: t('Edit annotations'),
        accessReview: {
          group: AppProjectModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: AppProjectModel.plural,
          namespace: project?.metadata?.namespace,
        },
        cta: () => {
          launchAnnotationsModal();
        },
      },
      {
        id: 'gitops-action-edit-project',
        disabled: !project?.metadata?.namespace || !project?.metadata?.name,
        label: t('Edit AppProject'),
        accessReview: {
          group: AppProjectModel.apiGroup,
          verb: 'update' as K8sVerb,
          resource: AppProjectModel.plural,
          namespace: project?.metadata?.namespace,
        },
        cta: () => {
          if (!project?.metadata?.namespace || !project?.metadata?.name) {
            return;
          }
          navigate(
            `/k8s/ns/${project?.metadata?.namespace}/${appProjectModelRef}/${project?.metadata?.name}/yaml`,
          );
        },
      },
      {
        id: 'gitops-action-delete-project',
        disabled: false,
        label: t('Delete'),
        accessReview: {
          group: AppProjectModel.apiGroup,
          verb: 'delete' as K8sVerb,
          resource: AppProjectModel.plural,
          namespace: project?.metadata?.namespace,
        },
        cta: () => launchDeleteModal(),
      },
    ],
    [project, launchLabelsModal, launchAnnotationsModal, launchDeleteModal, navigate, t],
  );

  return actions;
};
