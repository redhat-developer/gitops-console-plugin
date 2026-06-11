import { getAnalysisRunSelector, getReplicaSetInfo } from './ReplicaSetInfo';

describe('getAnalysisRunSelector', () => {
  it('builds selector from replica set labels', () => {
    const replicaSets: any[] = [
      { metadata: { labels: { 'rollouts-pod-template-hash': 'abc123' } } },
      { metadata: { labels: { 'rollouts-pod-template-hash': 'def456' } } },
    ];
    expect(getAnalysisRunSelector(replicaSets)).toMatchInlineSnapshot(`
      {
        "matchExpressions": [
          {
            "key": "rollouts-pod-template-hash",
            "operator": "In",
            "values": [
              "abc123",
              "def456",
            ],
          },
        ],
      }
    `);
  });

  it('skips replica sets without hash label', () => {
    const replicaSets: any[] = [
      { metadata: { labels: {} } },
      { metadata: { labels: { 'rollouts-pod-template-hash': 'abc123' } } },
    ];
    expect(getAnalysisRunSelector(replicaSets)).toMatchInlineSnapshot(`
      {
        "matchExpressions": [
          {
            "key": "rollouts-pod-template-hash",
            "operator": "In",
            "values": [
              "abc123",
            ],
          },
        ],
      }
    `);
  });

  it('handles empty list', () => {
    expect(getAnalysisRunSelector([])).toMatchInlineSnapshot(`
      {
        "matchExpressions": [
          {
            "key": "rollouts-pod-template-hash",
            "operator": "In",
            "values": [],
          },
        ],
      }
    `);
  });
});

describe('getReplicaSetInfo', () => {
  const makeRollout = (overrides: any = {}): any => ({
    metadata: { name: 'my-rollout', namespace: 'default' },
    spec: {
      strategy: {
        canary: {
          steps: [{ setWeight: 20 }],
          canaryService: 'canary-svc',
          stableService: 'stable-svc',
        },
      },
    },
    status: {
      stableRS: 'stable-hash',
      currentPodHash: 'canary-hash',
    },
    ...overrides,
  });

  const makeRS = (name: string, hash: string, revision: string, replicas = 1) => ({
    metadata: {
      name,
      namespace: 'default',
      labels: { 'rollouts-pod-template-hash': hash },
      annotations: { 'rollout.argoproj.io/revision': revision },
      ownerReferences: [{ name: 'my-rollout' }],
    },
    spec: {
      replicas,
      template: { spec: { containers: [{ name: 'app', image: 'nginx:1.0' }] } },
    },
    status: {
      replicas,
      availableReplicas: replicas,
      readyReplicas: replicas,
    },
  });

  it('returns empty for null inputs', async () => {
    expect(await getReplicaSetInfo(null as any, [], [], [])).toMatchInlineSnapshot(`[]`);
    expect(await getReplicaSetInfo(makeRollout(), null as any, [], [])).toMatchInlineSnapshot(`[]`);
  });

  it('identifies canary and stable statuses', async () => {
    const rollout = makeRollout();
    const stableRS = makeRS('rs-stable', 'stable-hash', '1');
    const canaryRS = makeRS('rs-canary', 'canary-hash', '2');
    const result = await getReplicaSetInfo(rollout, [stableRS, canaryRS], [], []);
    expect(result.map((r) => ({ name: r.name, statuses: r.statuses }))).toMatchInlineSnapshot(`
      [
        {
          "name": "rs-stable",
          "statuses": [
            3,
          ],
        },
        {
          "name": "rs-canary",
          "statuses": [
            1,
          ],
        },
      ]
    `);
  });

  it('computes ScaledDown status for zero-replica RS', async () => {
    const rollout = makeRollout();
    const rs = makeRS('rs-old', 'old-hash', '0', 0);
    rs.status.replicas = 0;
    rs.status.availableReplicas = 0;
    const result = await getReplicaSetInfo(rollout, [rs], [], []);
    expect(result[0].status).toMatchInlineSnapshot(`"ScaledDown"`);
  });

  it('assigns pods to their owning RS', async () => {
    const rollout = makeRollout();
    const rs = makeRS('rs-1', 'hash-1', '1');
    const pod: any = {
      metadata: { name: 'pod-1', ownerReferences: [{ name: 'rs-1' }] },
      status: { phase: 'Running' },
    };
    const orphanPod: any = {
      metadata: { name: 'pod-2', ownerReferences: [{ name: 'rs-other' }] },
      status: { phase: 'Running' },
    };
    const result = await getReplicaSetInfo(rollout, [rs], [pod, orphanPod], []);
    expect(result[0].pods.pods.length).toMatchInlineSnapshot(`1`);
  });

  it('extracts images from containers', async () => {
    const rollout = makeRollout();
    const rs = makeRS('rs-1', 'hash-1', '1');
    const result = await getReplicaSetInfo(rollout, [rs], [], []);
    expect(result[0].images).toMatchInlineSnapshot(`
      [
        {
          "image": "nginx:1.0",
          "name": "app",
        },
      ]
    `);
  });
});
