import { renderToStaticMarkup } from 'react-dom/server';
import Revision from './Revision';

describe('Revision', () => {
  it('renders SHA revision (truncated to 7 chars)', () => {
    expect(
      renderToStaticMarkup(
        <Revision
          repoURL="https://github.com/foo/bar.git"
          revision="abc123def456789"
          helm={false}
        />,
      ),
    ).toMatchInlineSnapshot(
      `"<span><a class="co-external-link" href="https://github.com/foo/bar/commit/abc123def456789" target="_blank" rel="noopener noreferrer">abc123d</a></span>"`,
    );
  });

  it('renders sha256: prefix (truncated to 14 chars)', () => {
    expect(
      renderToStaticMarkup(
        <Revision
          repoURL="https://github.com/foo/bar.git"
          revision="sha256:abc123def456789012345"
          helm={false}
        />,
      ),
    ).toMatchInlineSnapshot(
      `"<span><a class="co-external-link" href="https://github.com/foo/bar/commit/sha256:abc123def456789012345" target="_blank" rel="noopener noreferrer">sha256:abc123d</a></span>"`,
    );
  });

  it('renders branch name as-is', () => {
    expect(
      renderToStaticMarkup(
        <Revision repoURL="https://github.com/foo/bar.git" revision="main" helm={false} />,
      ),
    ).toMatchInlineSnapshot(
      `"<span><a class="co-external-link" href="https://github.com/foo/bar/commit/main" target="_blank" rel="noopener noreferrer">main</a></span>"`,
    );
  });

  it('renders helm revision without link', () => {
    expect(
      renderToStaticMarkup(
        <Revision repoURL="https://github.com/foo/bar.git" revision="abc123def" helm={true} />,
      ),
    ).toMatchInlineSnapshot(`"<span>abc123d</span>"`);
  });

  it('renders empty revision as (None)', () => {
    expect(
      renderToStaticMarkup(
        <Revision repoURL="https://github.com/foo/bar.git" revision="" helm={false} />,
      ),
    ).toMatchInlineSnapshot(`"<span>(None)</span>"`);
  });

  it('renders with revisionExtra', () => {
    expect(
      renderToStaticMarkup(
        <Revision
          repoURL="https://github.com/foo/bar.git"
          revision="abc123def"
          helm={false}
          revisionExtra=" (latest)"
        />,
      ),
    ).toMatchInlineSnapshot(
      `"<span><a class="co-external-link" href="https://github.com/foo/bar/commit/abc123def" target="_blank" rel="noopener noreferrer">abc123d</a> (latest)</span>"`,
    );
  });
});
