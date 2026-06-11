import { renderToStaticMarkup } from 'react-dom/server';
import { OwnerReferences } from './owner-references';

describe('OwnerReferences', () => {
  it('renders "No owner" when no owner references', () => {
    expect(
      renderToStaticMarkup(
        <OwnerReferences resource={{ metadata: { namespace: 'default' } } as any} />,
      ),
    ).toMatchInlineSnapshot(
      `"<span class="pf-v6-u-text-color-subtle">plugin__gitops-public~No owner</span>"`,
    );
  });

  it('renders Application owner reference with model link', () => {
    expect(
      renderToStaticMarkup(
        <OwnerReferences
          resource={
            {
              metadata: {
                namespace: 'default',
                ownerReferences: [
                  {
                    apiVersion: 'argoproj.io/v1alpha1',
                    kind: 'Application',
                    name: 'my-app',
                    uid: 'uid-1',
                  },
                ],
              },
            } as any
          }
        />,
      ),
    ).toMatchInlineSnapshot(
      `"<span data-testid="tooltip"><span class="pf-v6-u-display-inline-block">[Application] my-app</span></span>"`,
    );
  });

  it('renders ApplicationSet owner reference', () => {
    expect(
      renderToStaticMarkup(
        <OwnerReferences
          resource={
            {
              metadata: {
                namespace: 'default',
                ownerReferences: [
                  {
                    apiVersion: 'argoproj.io/v1alpha1',
                    kind: 'ApplicationSet',
                    name: 'my-appset',
                    uid: 'uid-2',
                  },
                ],
              },
            } as any
          }
        />,
      ),
    ).toMatchInlineSnapshot(
      `"<span data-testid="tooltip"><span class="pf-v6-u-display-inline-block">[ApplicationSet] my-appset</span></span>"`,
    );
  });

  it('renders unknown owner with fallback ResourceLink', () => {
    expect(
      renderToStaticMarkup(
        <OwnerReferences
          resource={
            {
              metadata: {
                namespace: 'default',
                ownerReferences: [
                  {
                    apiVersion: 'apps/v1',
                    kind: 'Deployment',
                    name: 'my-deploy',
                    uid: 'uid-3',
                  },
                ],
              },
            } as any
          }
        />,
      ),
    ).toMatchInlineSnapshot(`"[Deployment] my-deploy"`);
  });
});
