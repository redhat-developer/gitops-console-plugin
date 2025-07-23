import { Action, K8sResourceKind } from '@openshift-console/dynamic-plugin-sdk';

export const getDeleteRolloutAction = (deleteModal: () => void): Action => ({
  id: 'delete-rollout',
  label: 'Delete Rollout',
  cta: () => {
    deleteModal();
  },
});

export const editRollout = (obj: K8sResourceKind): Action => ({
  id: 'edit-rollout',
  label: 'Edit Rollout',
  cta: {
    href: `/ns/${obj.metadata.namespace}/${obj.apiVersion.replace('/', '~')}~${obj.kind}/${
      obj.metadata.name
    }/yaml`,
    // The above is: href: `/ns/${obj.metadata.namespace}/argoproj.io~v1alpha1~Rollout/${obj.metadata.name}/yaml`
  },
});
