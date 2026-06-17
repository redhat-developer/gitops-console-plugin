import { isDeploying } from './rollout-utils';

describe('isDeploying', () => {
  it('returns true for Progressing', () => {
    expect(isDeploying({ status: { phase: 'Progressing' } } as any)).toMatchInlineSnapshot(`true`);
  });

  it('returns true for Paused', () => {
    expect(isDeploying({ status: { phase: 'Paused' } } as any)).toMatchInlineSnapshot(`true`);
  });

  it('returns false for Healthy', () => {
    expect(isDeploying({ status: { phase: 'Healthy' } } as any)).toMatchInlineSnapshot(`false`);
  });

  it('returns false for undefined status', () => {
    expect(isDeploying(undefined)).toMatchInlineSnapshot(`false`);
  });

  it('returns false for missing phase', () => {
    expect(isDeploying({ status: {} } as any)).toMatchInlineSnapshot(`false`);
  });
});
