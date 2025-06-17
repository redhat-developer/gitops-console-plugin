import { Action, K8sResourceKind } from '@openshift-console/dynamic-plugin-sdk';

export const getDeleteRolloutAction = (obj: K8sResourceKind): Action => ({
  id: 'delete-rollout',
  label: 'Delete Rollout',
  cta: () => {
    console.log('GitOps: DeleteRolloutAction disabled for ' + obj?.metadata?.name);
    // Dependency on console. We need to implement later
    // deleteResourceModal({
    //   blocking: true,
    //   resourceName: rollout,
    //   resourceType: 'Rollout',
    //   actionLabel: t('Delete'),
    //   redirect,
    //   onSubmit: () => {
    //     return coFetchJSON.delete(
    //       `/api/helm/release/async?name=${releaseName}&ns=${namespace}&version=${releaseVersion}`,
    //       null,
    //       null,
    //       -1,
    //     );
    //   },
    // });
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
