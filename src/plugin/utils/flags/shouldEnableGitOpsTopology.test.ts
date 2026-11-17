import { resolveOpenShiftVersion, shouldEnableGitOpsTopology } from './shouldEnableGitOpsTopology';

describe('shouldEnableGitOpsTopology', () => {
  it('fails open when version is unavailable (namespace-scoped users)', () => {
    expect(shouldEnableGitOpsTopology(undefined)).toBe(true);
    expect(shouldEnableGitOpsTopology(null)).toBe(true);
    expect(shouldEnableGitOpsTopology('')).toBe(true);
  });

  it('enables for OpenShift 4.19+', () => {
    expect(shouldEnableGitOpsTopology('4.19.0')).toBe(true);
    expect(shouldEnableGitOpsTopology('4.19.6')).toBe(true);
    expect(shouldEnableGitOpsTopology('4.20.46')).toBe(true);
    expect(shouldEnableGitOpsTopology('4.19.0-0.nightly-2025-06-09-210043')).toBe(true);
  });

  it('disables for OpenShift before 4.19 when version is known', () => {
    expect(shouldEnableGitOpsTopology('4.18.0')).toBe(false);
    expect(shouldEnableGitOpsTopology('4.17.1')).toBe(false);
  });
});

describe('resolveOpenShiftVersion', () => {
  it('prefers watched ClusterVersion when present', () => {
    expect(resolveOpenShiftVersion('4.20.1', '4.19.0')).toBe('4.20.1');
  });

  it('falls back to SERVER_FLAGS.releaseVersion', () => {
    expect(resolveOpenShiftVersion(undefined, '4.20.46')).toBe('4.20.46');
  });

  it('ignores placeholder unknown server version', () => {
    expect(resolveOpenShiftVersion(undefined, '0.0.0-unknown')).toBeUndefined();
  });
});
