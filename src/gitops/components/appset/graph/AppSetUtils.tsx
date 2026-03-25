import { ApplicationSetKind } from '@gitops/models/ApplicationSetModel';
import { HealthStatusCode } from '@gitops/Statuses/HealthStatus';
import { HealthStatus } from '@gitops/utils/constants';

// AppSet Health Status will be changed in a future PR for consistency. For now, we will use this:
export function getAppSetHealthStatus(appSet: ApplicationSetKind): HealthStatusCode {
  const conditions = appSet.status?.conditions;

  if (!conditions || conditions.length === 0) {
    return 'Unknown';
  }

  // Check for errors first (indicates degraded state)
  const errorCondition = conditions.find((c) => c.type === 'ErrorOccurred' && c.status === 'True');
  if (errorCondition) {
    return 'Degraded';
  }

  // Check if rollout is progressing
  const progressingCondition = conditions.find(
    (c) => c.type === 'RolloutProgressing' && c.status === 'True',
  );
  if (progressingCondition) {
    return 'Progressing';
  }

  // Check if resources are up to date (healthy state)
  const resourcesUpToDateCondition = conditions.find(
    (c) => c.type === 'ResourcesUpToDate' && c.status === 'True',
  );
  if (resourcesUpToDateCondition) {
    // Would be healthy but we should check the resources so that it will match
    const resources = appSet.status?.resources;
    if (!resources || resources.length === 0) {
      return 'Healthy'; // As far as we know about the conditions, it's healthy.
    }

    // Check for missing resources
    const missingResourceExist = resources.find((r) => r.health.status === HealthStatus.MISSING);
    if (missingResourceExist) {
      return 'Missing';
    }

    const degradedResourceExist = resources.find((r) => r.health.status === HealthStatus.DEGRADED);
    if (degradedResourceExist) {
      return 'Degraded';
    }

    const progressingResourceExist = resources.find(
      (r) => r.health.status === HealthStatus.PROGRESSING,
    );
    if (progressingResourceExist) {
      return 'Progressing';
    }

    const allHealthyResources = resources.every((r) => r.health.status === HealthStatus.HEALTHY);
    if (allHealthyResources) {
      return 'Healthy';
    }
    return 'Healthy';
  }
  return 'Unknown';
}
