import { renderToStaticMarkup } from 'react-dom/server';
import { MetadataLabels } from './MetadataLabels';

describe('MetadataLabels', () => {
  it('renders "No labels" when labels is undefined', () => {
    expect(renderToStaticMarkup(<MetadataLabels kind="Deployment" />)).toMatchInlineSnapshot(
      `"<span class="metadata-labels-no-labels">No labels</span>"`,
    );
  });

  it('renders "No labels" when labels is empty', () => {
    expect(
      renderToStaticMarkup(<MetadataLabels kind="Deployment" labels={{}} />),
    ).toMatchInlineSnapshot(`"<span class="metadata-labels-no-labels">No labels</span>"`);
  });

  it('renders a single label', () => {
    expect(
      renderToStaticMarkup(<MetadataLabels kind="Deployment" labels={{ app: 'frontend' }} />),
    ).toMatchInlineSnapshot(
      `"<div data-testid="label-group" class="co-label-group metadata-labels-group" data-num-labels="10"><span data-testid="label" class="co-m-deployment co-m-expand co-label" data-color="blue" data-href="/search?kind=Deployment&amp;q=app=frontend"><span class="co-label__key" data-test="label-key">app</span><span class="co-label__eq">=</span><span class="co-label__value">frontend</span></span></div>"`,
    );
  });

  it('renders multiple labels', () => {
    expect(
      renderToStaticMarkup(
        <MetadataLabels
          kind="Deployment"
          labels={{ app: 'frontend', tier: 'web', version: 'v1' }}
        />,
      ),
    ).toMatchInlineSnapshot(
      `"<div data-testid="label-group" class="co-label-group metadata-labels-group" data-num-labels="10"><span data-testid="label" class="co-m-deployment co-m-expand co-label" data-color="blue" data-href="/search?kind=Deployment&amp;q=app=frontend"><span class="co-label__key" data-test="label-key">app</span><span class="co-label__eq">=</span><span class="co-label__value">frontend</span></span><span data-testid="label" class="co-m-deployment co-m-expand co-label" data-color="blue" data-href="/search?kind=Deployment&amp;q=tier=web"><span class="co-label__key" data-test="label-key">tier</span><span class="co-label__eq">=</span><span class="co-label__value">web</span></span><span data-testid="label" class="co-m-deployment co-m-expand co-label" data-color="blue" data-href="/search?kind=Deployment&amp;q=version=v1"><span class="co-label__key" data-test="label-key">version</span><span class="co-label__eq">=</span><span class="co-label__value">v1</span></span></div>"`,
    );
  });

  it('renders label without value', () => {
    expect(
      renderToStaticMarkup(<MetadataLabels kind="Pod" labels={{ 'no-value-label': '' }} />),
    ).toMatchInlineSnapshot(
      `"<div data-testid="label-group" class="co-label-group metadata-labels-group" data-num-labels="10"><span data-testid="label" class="co-m-pod co-m-expand co-label" data-color="blue" data-href="/search?kind=Pod&amp;q=no-value-label"><span class="co-label__key" data-test="label-key">no-value-label</span></span></div>"`,
    );
  });
});
