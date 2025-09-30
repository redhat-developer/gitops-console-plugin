import * as React from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';

// import { PhaseStatus } from 'src/gitops/utils/constants';
// import { getAppOperationState } from 'src/gitops/utils/gitops';
import {
  ApplicationKind,
  ApplicationModel,
  applicationModelRef,
} from '@gitops-models/ApplicationModel';
// import { refreshAppk8s, syncAppK8s, terminateOpK8s } from '@gitops-services/ArgoCD';
import {
  Action,
  K8sVerb,
  useAnnotationsModal,
  useDeleteModal,
  useLabelsModal,
} from '@openshift-console/dynamic-plugin-sdk';

type UseApplicationActionsProvider = (application: ApplicationKind) => [actions: Action[]];
const t = (key: string) => key;

export const useApplicationActionsProvider: UseApplicationActionsProvider = (application) => {
  const navigate = useNavigate();

  const launchLabelsModal = useLabelsModal(application);
  const launchAnnotationsModal = useAnnotationsModal(application);
  const launchDeleteModal = useDeleteModal(application);

  // TODO - Need to get namespace into accessReview, application is undefined so there needs to be a callback
  // of some sort. React.useCallback didn't work
  const actions = React.useMemo(
    () => [
      // {
      //   id: 'gitops-action-sync-application',
      //   disabled:
      //     application &&
      //     application.status?.operationState?.phase &&
      //     application.status?.operationState?.phase == PhaseStatus.RUNNING,
      //   label: t('Sync'),
      //   accessReview: {
      //     group: ApplicationModel.apiGroup,
      //     verb: 'update' as K8sVerb,
      //     resource: ApplicationModel.plural,
      //     namespace: application?.metadata?.namespace,
      //   },
      //   cta: () =>
      //     // TODO - Show toast alert if it fails but this is proving more challenging then I thought
      //     syncAppK8s(application),
      // },
      // {
      //   id: 'gitops-action-stop-application',
      //   disabled:
      //     application &&
      //     application.status?.operationState?.phase &&
      //     getAppOperationState(application).phase != PhaseStatus.RUNNING,
      //   label: t('Stop'),
      //   accessReview: {
      //     group: ApplicationModel.apiGroup,
      //     verb: 'patch' as K8sVerb,
      //     resource: ApplicationModel.plural,
      //     namespace: application?.metadata?.namespace,
      //   },
      //   cta: () =>
      //     // TODO - Show toast alert if it fails but this is proving more challenging then I thought
      //     terminateOpK8s(application),
      // },
      // {
      //   id: 'gitops-action-refresh-application',
      //   disabled: false,
      //   label: t('Refresh'),
      //   accessReview: {
      //     group: ApplicationModel.apiGroup,
      //     verb: 'update' as K8sVerb,
      //     resource: ApplicationModel.plural,
      //     namespace: application?.metadata?.namespace,
      //   },
      //   cta: () =>
      //     // TODO - Show toast alert if it fails but this is proving more challenging then I thought
      //     refreshAppk8s(application, false),
      // },
      // {
      //   id: 'gitops-action-refresh-hard-application',
      //   disabled: false,
      //   label: t('Refresh (Hard)'),
      //   accessReview: {
      //     group: ApplicationModel.apiGroup,
      //     verb: 'update' as K8sVerb,
      //     resource: ApplicationModel.plural,
      //     namespace: application?.metadata?.namespace,
      //   },
      //   cta: () =>
      //     // TODO - Show toast alert if it fails but this is proving more challenging then I thought
      //     refreshAppk8s(application, true),
      // },
      {
        id: 'gitops-action-edit-labels-application',
        disabled: false,
        label: t('Edit labels'),
        accessReview: {
          group: ApplicationModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: ApplicationModel.plural,
          namespace: application?.metadata?.namespace,
        },
        cta: () => {
          launchLabelsModal();
        },
      },
      {
        id: 'gitops-action-edit-annotations-application',
        disabled: false,
        accessReview: {
          group: ApplicationModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: ApplicationModel.plural,
          namespace: application?.metadata?.namespace,
        },
        label: t('Edit annotations'),
        cta: () => {
          launchAnnotationsModal();
        },
      },
      {
        id: 'gitops-action-edit-application',
        disabled: false,
        label: t('Edit Application'),
        accessReview: {
          group: ApplicationModel.apiGroup,
          verb: 'update' as K8sVerb,
          resource: ApplicationModel.plural,
          namespace: application?.metadata?.namespace,
        },
        cta: () => {
          navigate(
            `/k8s/ns/${application.metadata.namespace}/${applicationModelRef}/${application.metadata.name}/yaml`,
          );
        },
      },
      {
        id: 'gitops-action-delete-application',
        disabled: false,
        label: t('Delete Application'),
        accessReview: {
          group: ApplicationModel.apiGroup,
          verb: 'delete' as K8sVerb,
          resource: ApplicationModel.plural,
        },
        cta: () => launchDeleteModal(),
      },
    ],
    [application, navigate, launchLabelsModal, launchAnnotationsModal, launchDeleteModal],
  );

  return [actions];
};
