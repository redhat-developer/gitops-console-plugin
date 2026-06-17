import { isSHA, repoUrl, revisionUrl } from './urls';

describe('isSHA', () => {
  it('identifies SHA hashes', () => {
    expect(isSHA('abc123def')).toMatchInlineSnapshot(`true`);
    expect(isSHA('abc123def456789012345678901234567890abcd')).toMatchInlineSnapshot(`true`);
    expect(isSHA('sha256:abc123def456789012345678901234567890abcd')).toMatchInlineSnapshot(`true`);
    expect(isSHA('main')).toMatchInlineSnapshot(`false`);
    expect(isSHA('v1.0.0')).toMatchInlineSnapshot(`false`);
    expect(isSHA('abc')).toMatchInlineSnapshot(`false`);
  });
});

describe('repoUrl', () => {
  it('extracts repo URLs from various formats', () => {
    expect(repoUrl('https://github.com/argoproj/argo-cd.git')).toMatchInlineSnapshot(
      `"https://github.com/argoproj/argo-cd"`,
    );
    expect(repoUrl('https://github.com/argoproj/argo-cd')).toMatchInlineSnapshot(
      `"https://github.com/argoproj/argo-cd"`,
    );
    expect(repoUrl('git@github.com:argoproj/argo-cd.git')).toMatchInlineSnapshot(
      `"https://github.com/argoproj/argo-cd"`,
    );
    expect(repoUrl('https://gitlab.com/group/project.git')).toMatchInlineSnapshot(
      `"https://gitlab.com/group/project"`,
    );
    expect(repoUrl('https://bitbucket.org/team/repo.git')).toMatchInlineSnapshot(
      `"https://bitbucket.org/team/repo"`,
    );
    expect(repoUrl('https://internal.example.com/repo.git')).toMatchInlineSnapshot(`null`);
  });
});

describe('revisionUrl', () => {
  it('builds revision URLs for different providers', () => {
    expect(revisionUrl('https://github.com/foo/bar.git', 'abc123def', false)).toMatchInlineSnapshot(
      `"https://github.com/foo/bar/commit/abc123def"`,
    );
    expect(revisionUrl('https://github.com/foo/bar.git', 'main', false)).toMatchInlineSnapshot(
      `"https://github.com/foo/bar/tree/main"`,
    );
    expect(revisionUrl('https://gitlab.com/foo/bar.git', 'abc123def', false)).toMatchInlineSnapshot(
      `"https://gitlab.com/foo/bar/-/commit/abc123def"`,
    );
    expect(
      revisionUrl('https://bitbucket.org/foo/bar.git', 'abc123def', false),
    ).toMatchInlineSnapshot(`"https://bitbucket.org/foo/bar/commits/abc123def"`);
    expect(
      revisionUrl('https://bitbucket.org/foo/bar.git', 'abc123def', true),
    ).toMatchInlineSnapshot(`"https://bitbucket.org/foo/bar/src/abc123def"`);
    expect(revisionUrl('https://github.com/foo/bar.git', '', false)).toMatchInlineSnapshot(
      `"https://github.com/foo/bar/tree/HEAD"`,
    );
  });
});
