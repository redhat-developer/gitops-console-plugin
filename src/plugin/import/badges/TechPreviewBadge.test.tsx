import { renderToStaticMarkup } from 'react-dom/server';
import TechPreviewBadge from './TechPreviewBadge';

describe('TechPreviewBadge', () => {
  it('renders label without tooltip', () => {
    expect(renderToStaticMarkup(<TechPreviewBadge />)).toMatchInlineSnapshot(
      `"<span data-testid="label" class="gitops-plugin__preview-badge">plugin__gitops-plugin~Tech preview</span>"`,
    );
  });

  it('renders with tooltip when tooltipContent provided', () => {
    expect(
      renderToStaticMarkup(<TechPreviewBadge tooltipContent="This is a tech preview feature" />),
    ).toMatchInlineSnapshot(
      `"<span data-testid="tooltip" data-tooltip="This is a tech preview feature"><span data-testid="label" class="gitops-plugin__preview-badge">plugin__gitops-plugin~Tech preview</span></span>"`,
    );
  });
});
