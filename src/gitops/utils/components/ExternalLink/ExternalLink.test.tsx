import { renderToStaticMarkup } from 'react-dom/server';
import ExternalLink from './ExternalLink';

describe('ExternalLink', () => {
  it('renders with text', () => {
    expect(
      renderToStaticMarkup(<ExternalLink href="https://example.com" text="Example" />),
    ).toMatchInlineSnapshot(
      `"<a class="co-external-link" href="https://example.com" target="_blank" rel="noopener noreferrer">Example</a>"`,
    );
  });

  it('renders with children', () => {
    expect(
      renderToStaticMarkup(
        <ExternalLink href="https://example.com">
          <strong>Child</strong>
        </ExternalLink>,
      ),
    ).toMatchInlineSnapshot(
      `"<a class="co-external-link" href="https://example.com" target="_blank" rel="noopener noreferrer"><strong>Child</strong></a>"`,
    );
  });

  it('applies additionalClassName', () => {
    expect(
      renderToStaticMarkup(
        <ExternalLink href="https://example.com" text="Link" additionalClassName="extra" />,
      ),
    ).toMatchInlineSnapshot(
      `"<a class="co-external-link extra" href="https://example.com" target="_blank" rel="noopener noreferrer">Link</a>"`,
    );
  });

  it('sets data-test-id', () => {
    expect(
      renderToStaticMarkup(
        <ExternalLink href="https://example.com" text="Link" dataTestID="test-link" />,
      ),
    ).toMatchInlineSnapshot(
      `"<a class="co-external-link" href="https://example.com" target="_blank" rel="noopener noreferrer" data-test-id="test-link">Link</a>"`,
    );
  });
});
