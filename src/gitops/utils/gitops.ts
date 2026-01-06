import { ApplicationKind, OperationState } from '@gitops-models/ApplicationModel';
import { ApplicationSetKind, AppSetGenerator } from '@gitops-models/ApplicationSetModel';
import { k8sListItems, K8sResourceCommon } from '@openshift-console/dynamic-plugin-sdk';
import { K8sResourceConditionStatus } from '@openshift-console/dynamic-plugin-sdk-internal/lib/extensions/console-types';

import { ApplicationSetStatus, PhaseStatus } from './constants';

export const annotationRefreshKey = 'argocd.argoproj.io/refresh';
export const labelControllerNamespaceKey = 'gitops.openshift.io/controllerNamespace';

export function isApplicationRefreshing(app: K8sResourceCommon): boolean {
  // if (app == undefined) return false;
  // if (app.metadata.annotations == undefined) return false;
  // return app.metadata.annotations[annotationRefreshKey] == "refreshing";
  return (
    app &&
    app.metadata &&
    app.metadata.annotations &&
    app.metadata.annotations != undefined &&
    app.metadata.annotations[annotationRefreshKey] == 'refreshing'
  );
}

export function createRevisionURL(repo: string, revision: string) {
  if (!repo || !revision) return undefined;

  if (repo.endsWith('.git')) repo = repo.substring(0, repo.length - 4);
  if (repo.endsWith('/')) repo = repo.substring(0, repo.length - 1);

  return repo + '/commit/' + revision;
}

export function getFriendlyClusterName(cluster: string) {
  switch (cluster) {
    case 'https://kubernetes.default.svc': {
      return 'in-cluster';
    }
    default: {
      return cluster;
    }
  }
}

export function getDuration(startAt: string, finishAt: string) {
  try {
    const start: Date = new Date(startAt);
    const finish: Date = new Date(finishAt);

    return finish.getTime() - start.getTime();
  } catch (e) {
    console.log('Error calculating duration', e);
    return 0;
  }
}

export type ArgoServer = {
  host: string;
  protocol: string;
};

export const getArgoServer = async (model, app: ApplicationKind): Promise<ArgoServer> => {
  const info: ArgoServer = {
    host: '',
    protocol: '',
  };

  const ns = (): string => {
    if (app.status?.controllerNamespace) return app.status?.controllerNamespace;
    else if (app.metadata?.labels && app.metadata.labels[labelControllerNamespaceKey])
      return app.metadata.labels[labelControllerNamespaceKey];
    else return app.metadata.namespace;
  };

  try {
    const [argoServerURL] = await k8sListItems<K8sResourceCommon>({
      model: model,
      queryParams: {
        ns: ns(),
        labelSelector: {
          matchLabels: {
            'app.kubernetes.io/part-of': 'argocd',
          },
        },
      },
    });
    // TODO - Don't hardcode this, determine from route
    info.protocol = 'https';
    if (argoServerURL) {
      info.host = argoServerURL['spec']['host'];
    } else {
      const appsIndex = location.host.indexOf('.apps');
      info.host =
        'argocd-server-' + ns() + (appsIndex !== -1 ? location.host.substring(appsIndex) : '');
    }
    return info;
  } catch (e) {
    console.warn('Error while fetching Argo CD Server url:', e);
    return info;
  }
};

export const getArgoServerForProject = async (
  model,
  project: { metadata?: { namespace?: string; labels?: Record<string, string> } },
): Promise<ArgoServer> => {
  const info: ArgoServer = {
    host: '',
    protocol: '',
  };

  const ns = (): string => {
    if (project.metadata?.labels && project.metadata.labels[labelControllerNamespaceKey])
      return project.metadata.labels[labelControllerNamespaceKey];
    else return project.metadata?.namespace || '';
  };

  try {
    const [argoServerURL] = await k8sListItems<K8sResourceCommon>({
      model: model,
      queryParams: {
        ns: ns(),
        labelSelector: {
          matchLabels: {
            'app.kubernetes.io/part-of': 'argocd',
          },
        },
      },
    });
    info.protocol = 'https';
    if (argoServerURL && argoServerURL['spec']?.['host']) {
      info.host = argoServerURL['spec']['host'];
    } else {
      const appsIndex = location.host.indexOf('.apps');
      if (appsIndex !== -1) {
        info.host = 'argocd-server-' + ns() + location.host.substring(appsIndex);
      }
    }
    return info;
  } catch (e) {
    console.warn('Error while fetching Argo CD Server url:', e);
    return info;
  }
};

// https://github.com/argoproj/argo-cd/blob/master/ui/src/app/applications/components/utils.tsx
export const getAppOperationState = (app: ApplicationKind): OperationState => {
  if (!app.status || !app.status.operationState) return undefined;

  if (app.metadata.deletionTimestamp) {
    return {
      phase: PhaseStatus.RUNNING,
      startedAt: app.metadata.deletionTimestamp,
    } as OperationState;
  } else {
    return app.status.operationState;
  }
};

// Adapted from Argo CD UI code here:
// https://github.com/argoproj/argo-cd/blob/master/ui/src/app/applications/components/utils.tsx
export function getOperationType(application: ApplicationKind) {
  const operation = application.status?.operationState?.operation;
  if (application.metadata.deletionTimestamp && !operation) {
    return 'Delete';
  }
  if (operation && operation.sync) {
    return 'Sync';
  }
  return 'Unknown';
}

export function getAppSetStatus(appset: ApplicationSetKind): ApplicationSetStatus {
  if (appset.status?.conditions) {
    let status: ApplicationSetStatus = ApplicationSetStatus.HEALTHY;
    appset.status.conditions.forEach(function (condition) {
      if (
        condition.type == 'ErrorOccurred' &&
        condition.status != K8sResourceConditionStatus.False
      ) {
        status = ApplicationSetStatus.ERROR;
      } else if (
        condition.type == 'ParametersGenerated' &&
        condition.status != K8sResourceConditionStatus.True
      ) {
        status = ApplicationSetStatus.ERROR;
      } else if (
        condition.type == 'ApplicationSetUpToDate' &&
        condition.status == K8sResourceConditionStatus.True
      ) {
        status = ApplicationSetStatus.ERROR;
      }
    });
    return status;
  } else {
    return ApplicationSetStatus.UNKNOWN;
  }
}

export function getAppSetGeneratorCount(appset: ApplicationSetKind): number {
  function generatorCount(generators: AppSetGenerator[]): number {
    let result = 0;
    console.log(generators);
    generators.forEach((generator) => {
      result++;
      result = result + generatorCount(getGenerators(generator));
    });
    return result;
  }

  return generatorCount(appset.spec.generators);
}

function getGenerators(obj: AppSetGenerator): AppSetGenerator[] {
  if (obj.matrix) return obj.matrix.generators;
  else if (obj.union) return obj.union.generators;
  else if (obj.merge) return obj.merge.generators;
  return [];
}
