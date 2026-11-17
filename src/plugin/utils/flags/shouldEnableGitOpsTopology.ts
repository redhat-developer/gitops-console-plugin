import { SemVer } from 'semver';

/** Enable Topology for OCP >= 4.19; fail open when version is unknown (namespace users often cannot read ClusterVersion). */
export const shouldEnableGitOpsTopology = (openshiftVersion?: string | null): boolean => {
  if (!openshiftVersion) {
    return true;
  }
  try {
    return new SemVer(openshiftVersion).compare('4.18.99999999') >= 0;
  } catch {
    return true;
  }
};

/** Prefer watched ClusterVersion; fall back to SERVER_FLAGS.releaseVersion. */
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
