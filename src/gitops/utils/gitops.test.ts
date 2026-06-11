import {
  createRevisionURL,
  getFriendlyClusterName,
  getDuration,
  isApplicationRefreshing,
  getOperationType,
  getAppSetStatus,
} from './gitops';

describe('createRevisionURL', () => {
  it('builds commit URLs', () => {
    expect(createRevisionURL('https://github.com/foo/bar.git', 'abc123')).toMatchInlineSnapshot(
      `"https://github.com/foo/bar/commit/abc123"`,
    );
    expect(createRevisionURL('https://github.com/foo/bar/', 'abc123')).toMatchInlineSnapshot(
      `"https://github.com/foo/bar/commit/abc123"`,
    );
    expect(createRevisionURL('https://github.com/foo/bar', 'abc123')).toMatchInlineSnapshot(
      `"https://github.com/foo/bar/commit/abc123"`,
    );
    expect(createRevisionURL('', 'abc123')).toMatchInlineSnapshot(`undefined`);
    expect(createRevisionURL('https://github.com/foo/bar', '')).toMatchInlineSnapshot(`undefined`);
    expect(createRevisionURL(undefined, undefined)).toMatchInlineSnapshot(`undefined`);
  });
});

describe('getFriendlyClusterName', () => {
  it('maps cluster URLs to friendly names', () => {
    expect(getFriendlyClusterName('https://kubernetes.default.svc')).toMatchInlineSnapshot(
      `"in-cluster"`,
    );
    expect(getFriendlyClusterName('https://my-cluster.example.com')).toMatchInlineSnapshot(
      `"https://my-cluster.example.com"`,
    );
  });
});

describe('getDuration', () => {
  it('calculates duration in milliseconds', () => {
    expect(getDuration('2024-01-01T00:00:00Z', '2024-01-01T00:01:00Z')).toMatchInlineSnapshot(
      `60000`,
    );
    expect(getDuration('2024-01-01T00:00:00Z', '2024-01-01T00:00:00Z')).toMatchInlineSnapshot(`0`);
    expect(getDuration('invalid', 'invalid')).toMatchInlineSnapshot(`NaN`);
  });
});

describe('isApplicationRefreshing', () => {
  it('checks refresh annotation', () => {
    expect(
      isApplicationRefreshing({
        metadata: { annotations: { 'argocd.argoproj.io/refresh': 'refreshing' } },
      } as any),
    ).toMatchInlineSnapshot(`true`);

    expect(
      isApplicationRefreshing({
        metadata: { annotations: { 'argocd.argoproj.io/refresh': 'normal' } },
      } as any),
    ).toMatchInlineSnapshot(`false`);

    expect(
      isApplicationRefreshing({
        metadata: { annotations: {} },
      } as any),
    ).toMatchInlineSnapshot(`false`);

    expect(
      isApplicationRefreshing({
        metadata: {},
      } as any),
    ).toMatchInlineSnapshot(`undefined`);

    expect(isApplicationRefreshing(undefined)).toMatchInlineSnapshot(`undefined`);
  });
});

describe('getOperationType', () => {
  it('detects operation types', () => {
    expect(
      getOperationType({
        metadata: {},
        status: { operationState: { operation: { sync: {} } } },
      } as any),
    ).toMatchInlineSnapshot(`"Sync"`);

    expect(
      getOperationType({
        metadata: { deletionTimestamp: '2024-01-01T00:00:00Z' },
        status: {},
      } as any),
    ).toMatchInlineSnapshot(`"Delete"`);

    expect(
      getOperationType({
        metadata: {},
        status: { operationState: { operation: {} } },
      } as any),
    ).toMatchInlineSnapshot(`"Unknown"`);
  });
});

describe('getAppSetStatus', () => {
  it('determines ApplicationSet status', () => {
    expect(
      getAppSetStatus({
        status: { conditions: [{ type: 'ErrorOccurred', status: 'True' }] },
      } as any),
    ).toMatchInlineSnapshot(`"Error"`);

    expect(
      getAppSetStatus({
        status: { conditions: [{ type: 'ParametersGenerated', status: 'False' }] },
      } as any),
    ).toMatchInlineSnapshot(`"Error"`);

    expect(
      getAppSetStatus({
        status: {},
      } as any),
    ).toMatchInlineSnapshot(`"Unknown"`);

    expect(getAppSetStatus({} as any)).toMatchInlineSnapshot(`"Unknown"`);
  });
});
