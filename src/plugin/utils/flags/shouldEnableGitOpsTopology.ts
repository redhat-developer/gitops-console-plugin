import { SemVer } from 'semver';

/**
 * Whether Developer Topology Rollout extensions should be enabled.
 *
 * Topology factories require GITOPS_ENABLE_TOPOLOGY. Historically this was derived
 * only from watching ClusterVersion (cluster-scoped). Namespace-scoped users often
 * cannot read ClusterVersion, which forced the flag off even when they can list
 * Rollouts in their project (Search still worked; Topology did not).
 *
 * When the version string is missing/unreadable, fail open — ARGO_ROLLOUT still
 * gates on the Rollout CRD existing.
 */
export const shouldEnableGitOpsTopology = (openshiftVersion?: string | null): boolean => {
  if (!openshiftVersion) {
    return true;
  }
  try {
    // Same threshold as before: enable for OpenShift >= 4.19 (incl. nightlies).
    return new SemVer(openshiftVersion).compare('4.18.99999999') >= 0;
  } catch {
    return true;
  }
};

/** Prefer Console SERVER_FLAGS (no RBAC); fall back to watched ClusterVersion. */
export const resolveOpenShiftVersion = (
  watchedClusterVersion?: string | null,
  serverReleaseVersion?: string | null,
): string | undefined => {
  const watched = watchedClusterVersion?.trim();
  if (watched) {
    return watched;
  }
  const fromServer = serverReleaseVersion?.trim();
  if (fromServer && fromServer !== '0.0.0-unknown') {
    return fromServer;
  }
  return undefined;
};
