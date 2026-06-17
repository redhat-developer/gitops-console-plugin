import { k8sPatch, k8sUpdate } from '@openshift-console/dynamic-plugin-sdk';

import { syncAppK8s, syncResourcek8s, terminateOpK8s, refreshAppk8s } from './ArgoCD';

const mockApp: any = {
  apiVersion: 'argoproj.io/v1alpha1',
  kind: 'Application',
  metadata: {
    name: 'my-app',
    namespace: 'argocd',
    annotations: {},
  },
  spec: {
    destination: { server: 'https://kubernetes.default.svc' },
  },
};

beforeEach(() => {
  (k8sUpdate as jest.Mock).mockClear();
  (k8sPatch as jest.Mock).mockClear();
});

describe('syncAppK8s', () => {
  it('sets operation on app and calls k8sUpdate', async () => {
    const app = JSON.parse(JSON.stringify(mockApp));
    await syncAppK8s(app);
    expect(app.operation).toMatchInlineSnapshot(`
      {
        "info": [
          {
            "name": "Reason",
            "value": "Initiated by user in openshift console",
          },
        ],
        "initiatedBy": {
          "automated": false,
          "username": "OpenShift-Console",
        },
        "sync": {},
      }
    `);
    expect(k8sUpdate).toHaveBeenCalledTimes(1);
  });

  it('includes syncPolicy retry and options when present', async () => {
    const app = JSON.parse(JSON.stringify(mockApp));
    app.spec.syncPolicy = {
      automated: { prune: true },
      retry: { limit: 3 },
      syncOptions: ['CreateNamespace=true'],
    };
    await syncAppK8s(app);
    expect(app.operation.sync).toMatchInlineSnapshot(`
      {
        "prune": true,
        "syncOptions": [
          "CreateNamespace=true",
        ],
      }
    `);
    expect(app.operation.retry).toMatchInlineSnapshot(`
      {
        "limit": 3,
      }
    `);
  });

  it('includes resources when provided', async () => {
    const app = JSON.parse(JSON.stringify(mockApp));
    const resources = [{ name: 'deploy', kind: 'Deployment', group: 'apps', namespace: 'default' }];
    await syncAppK8s(app, resources);
    expect(app.operation.sync.resources).toMatchInlineSnapshot(`
      [
        {
          "group": "apps",
          "kind": "Deployment",
          "name": "deploy",
          "namespace": "default",
        },
      ]
    `);
  });
});

describe('syncResourcek8s', () => {
  it('maps resource statuses to sync resources', async () => {
    const app = JSON.parse(JSON.stringify(mockApp));
    const resources: any[] = [
      { name: 'svc', kind: 'Service', group: '', namespace: 'default', status: 'OutOfSync' },
    ];
    await syncResourcek8s(app, resources);
    expect(app.operation.sync.resources).toMatchInlineSnapshot(`
      [
        {
          "group": "",
          "kind": "Service",
          "name": "svc",
          "namespace": "default",
        },
      ]
    `);
  });
});

describe('terminateOpK8s', () => {
  it('patches operationState phase to Terminating', async () => {
    const app = JSON.parse(JSON.stringify(mockApp));
    await terminateOpK8s(app);
    expect(k8sPatch).toHaveBeenCalledTimes(1);
    expect((k8sPatch as jest.Mock).mock.calls[0][0].data).toMatchInlineSnapshot(`
      [
        {
          "op": "replace",
          "path": "/status/operationState/phase",
          "value": "Terminating",
        },
      ]
    `);
  });
});

describe('refreshAppk8s', () => {
  it('soft refresh sets annotation to refreshing', async () => {
    const app = JSON.parse(JSON.stringify(mockApp));
    await refreshAppk8s(app, false);
    expect(app.metadata.annotations).toMatchInlineSnapshot(`
      {
        "argocd.argoproj.io/refresh": "refreshing",
      }
    `);
    expect(k8sUpdate).toHaveBeenCalledTimes(1);
  });

  it('hard refresh sets annotation to hard', async () => {
    const app = JSON.parse(JSON.stringify(mockApp));
    await refreshAppk8s(app, true);
    expect(app.metadata.annotations).toMatchInlineSnapshot(`
      {
        "argocd.argoproj.io/refresh": "hard",
      }
    `);
  });

  it('creates annotations object if missing', async () => {
    const app = JSON.parse(JSON.stringify(mockApp));
    delete app.metadata.annotations;
    await refreshAppk8s(app, false);
    expect(app.metadata.annotations).toMatchInlineSnapshot(`
      {
        "argocd.argoproj.io/refresh": "refreshing",
      }
    `);
  });
});
