import {
  modelToRef,
  modelToGroupVersionKind,
  encodeHTMLEntities,
  getSelectorSearchURL,
  resourceAsArray,
  isGroupVersionKind,
  kindForReference,
  getResourceUrl,
  resourcePathFromModel,
  ALL_NAMESPACES_SESSION_KEY,
} from './utils';

const makeModel = (overrides = {}) => ({
  apiGroup: 'argoproj.io',
  apiVersion: 'v1alpha1',
  kind: 'Application',
  plural: 'applications',
  namespaced: true,
  crd: true,
  label: 'Application',
  labelPlural: 'Applications',
  abbr: 'APP',
  ...overrides,
});

describe('modelToRef', () => {
  it('builds group~version~kind string', () => {
    expect(modelToRef(makeModel())).toMatchInlineSnapshot(`"argoproj.io~v1alpha1~Application"`);
    expect(
      modelToRef(makeModel({ apiGroup: '', kind: 'Pod', apiVersion: 'v1' })),
    ).toMatchInlineSnapshot(`"~v1~Pod"`);
  });
});

describe('modelToGroupVersionKind', () => {
  it('returns version/kind/group object', () => {
    expect(modelToGroupVersionKind(makeModel())).toMatchInlineSnapshot(`
      {
        "group": "argoproj.io",
        "kind": "Application",
        "version": "v1alpha1",
      }
    `);
  });
});

describe('encodeHTMLEntities', () => {
  it('encodes special characters', () => {
    expect(encodeHTMLEntities('<b>bold</b>')).toMatchInlineSnapshot(
      `"&#60;b&#62;bold&#60;/b&#62;"`,
    );
    expect(encodeHTMLEntities('a & b')).toMatchInlineSnapshot(`"a &#38; b"`);
    expect(encodeHTMLEntities('plain text')).toMatchInlineSnapshot(`"plain text"`);
    expect(encodeHTMLEntities(undefined)).toMatchInlineSnapshot(`undefined`);
  });
});

describe('getSelectorSearchURL', () => {
  it('builds search URL with namespace', () => {
    expect(getSelectorSearchURL('my-ns', 'Pod', 'app=web')).toMatchInlineSnapshot(
      `"/search/ns/my-ns?kind=Pod&q=app=web"`,
    );
  });

  it('builds search URL without namespace', () => {
    expect(getSelectorSearchURL('', 'Deployment', 'env=prod')).toMatchInlineSnapshot(
      `"/search?kind=Deployment&q=env=prod"`,
    );
  });
});

describe('resourceAsArray', () => {
  it('wraps a single resource', () => {
    const r = { apiVersion: 'v1', kind: 'Pod' };
    expect(resourceAsArray(r as any)).toMatchInlineSnapshot(`
      [
        {
          "apiVersion": "v1",
          "kind": "Pod",
        },
      ]
    `);
  });

  it('passes through an array', () => {
    const arr = [{ apiVersion: 'v1', kind: 'Pod' }];
    expect(resourceAsArray(arr as any)).toMatchInlineSnapshot(`
      [
        {
          "apiVersion": "v1",
          "kind": "Pod",
        },
      ]
    `);
  });
});

describe('isGroupVersionKind', () => {
  it('detects GVK format', () => {
    expect(isGroupVersionKind('apps~v1~Deployment')).toMatchInlineSnapshot(`true`);
    expect(isGroupVersionKind('Deployment')).toMatchInlineSnapshot(`false`);
    expect(isGroupVersionKind('a~b')).toMatchInlineSnapshot(`false`);
    expect(isGroupVersionKind(undefined)).toMatchInlineSnapshot(`false`);
  });
});

describe('kindForReference', () => {
  it('extracts kind from GVK ref', () => {
    expect(kindForReference('apps~v1~Deployment')).toMatchInlineSnapshot(`"Deployment"`);
    expect(kindForReference('Deployment')).toMatchInlineSnapshot(`"Deployment"`);
  });
});

describe('getResourceUrl', () => {
  it('builds namespaced resource URL', () => {
    expect(
      getResourceUrl({
        model: makeModel(),
        resource: { metadata: { name: 'myapp', namespace: 'default' } } as any,
      }),
    ).toMatchInlineSnapshot(`"/k8s/ns/default/argoproj.io~v1alpha1~Application/myapp"`);
  });

  it('uses activeNamespace fallback', () => {
    expect(
      getResourceUrl({ model: makeModel(), activeNamespace: 'test-ns' }),
    ).toMatchInlineSnapshot(`"/k8s/ns/test-ns/argoproj.io~v1alpha1~Application/"`);
  });

  it('handles all-namespaces', () => {
    expect(
      getResourceUrl({ model: makeModel(), activeNamespace: ALL_NAMESPACES_SESSION_KEY }),
    ).toMatchInlineSnapshot(`"/k8s/all-namespaces/argoproj.io~v1alpha1~Application/"`);
  });

  it('handles non-CRD model', () => {
    expect(
      getResourceUrl({
        model: makeModel({ crd: false }),
        activeNamespace: 'default',
      }),
    ).toMatchInlineSnapshot(`"/k8s/ns/default/applications/"`);
  });

  it('returns null for missing model', () => {
    expect(getResourceUrl({ model: null })).toMatchInlineSnapshot(`null`);
  });
});

describe('resourcePathFromModel', () => {
  it('builds path for namespaced CRD Application', () => {
    expect(resourcePathFromModel(makeModel(), 'myapp', 'default')).toMatchInlineSnapshot(
      `"/k8s/ns/default/argoproj.io~v1alpha1~Application/myapp"`,
    );
  });

  it('builds path for non-Application CRD', () => {
    expect(
      resourcePathFromModel(makeModel({ kind: 'AppProject' }), 'proj', 'default'),
    ).toMatchInlineSnapshot(`"/k8s/ns/default/argoproj.io~v1alpha1~AppProject/proj"`);
  });

  it('builds path for non-CRD resource', () => {
    expect(
      resourcePathFromModel(makeModel({ crd: false }), 'mypod', 'default'),
    ).toMatchInlineSnapshot(`"/k8s/ns/default/applications/mypod"`);
  });

  it('builds path for cluster-scoped resource', () => {
    expect(
      resourcePathFromModel(makeModel({ namespaced: false, crd: false }), 'mynode'),
    ).toMatchInlineSnapshot(`"/k8s/cluster/applications/mynode"`);
  });

  it('builds all-namespaces path', () => {
    expect(resourcePathFromModel(makeModel())).toMatchInlineSnapshot(
      `"/k8s/all-namespaces/argoproj.io~v1alpha1~Application"`,
    );
  });
});
