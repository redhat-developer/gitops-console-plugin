import { isContainerLoopingFilter, getPodStatus } from './pod-utils';

describe('isContainerLoopingFilter', () => {
  it('detects CrashLoopBackOff', () => {
    expect(
      isContainerLoopingFilter({ state: { waiting: { reason: 'CrashLoopBackOff' } } }),
    ).toMatchInlineSnapshot(`true`);
  });

  it('returns false for other waiting reasons', () => {
    expect(
      isContainerLoopingFilter({ state: { waiting: { reason: 'ImagePullBackOff' } } }),
    ).toMatchInlineSnapshot(`false`);
  });

  it('returns falsy for no waiting state', () => {
    expect(isContainerLoopingFilter({ state: { running: {} } })).toMatchInlineSnapshot(`undefined`);
  });
});

const makePod = (overrides: any = {}) => ({
  metadata: { ...overrides.metadata },
  spec: { containers: overrides.containers || [{ name: 'main' }] },
  status: {
    phase: overrides.phase || 'Running',
    containerStatuses: overrides.containerStatuses || [
      { name: 'main', ready: true, state: { running: {} } },
    ],
  },
});

describe('getPodStatus', () => {
  it('returns Terminating for pods with deletionTimestamp', () => {
    expect(
      getPodStatus(makePod({ metadata: { deletionTimestamp: '2024-01-01T00:00:00Z' } })),
    ).toMatchInlineSnapshot(`"Terminating"`);
  });

  it('returns CrashLoopBackOff for looping containers', () => {
    expect(
      getPodStatus(
        makePod({
          containerStatuses: [
            {
              name: 'main',
              ready: false,
              state: { waiting: { reason: 'CrashLoopBackOff' } },
            },
          ],
        }),
      ),
    ).toMatchInlineSnapshot(`"CrashLoopBackOff"`);
  });

  it('returns Warning for failed containers', () => {
    expect(
      getPodStatus(
        makePod({
          containerStatuses: [
            {
              name: 'main',
              ready: false,
              state: { terminated: { exitCode: 1 } },
            },
          ],
        }),
      ),
    ).toMatchInlineSnapshot(`"Warning"`);
  });

  it('returns Not Ready for running but unready pods', () => {
    expect(
      getPodStatus(
        makePod({
          containerStatuses: [{ name: 'main', ready: false, state: { running: {} } }],
        }),
      ),
    ).toMatchInlineSnapshot(`"Not Ready"`);
  });

  it('returns Running for healthy pods', () => {
    expect(getPodStatus(makePod())).toMatchInlineSnapshot(`"Running"`);
  });

  it('returns Pending phase', () => {
    expect(
      getPodStatus(
        makePod({
          phase: 'Pending',
          containerStatuses: [],
        }),
      ),
    ).toMatchInlineSnapshot(`"Pending"`);
  });

  it('returns Succeeded phase', () => {
    expect(
      getPodStatus(
        makePod({
          phase: 'Succeeded',
          containerStatuses: [],
        }),
      ),
    ).toMatchInlineSnapshot(`"Succeeded"`);
  });
});
