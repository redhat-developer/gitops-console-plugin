import { isSHA, repoUrl, revisionUrl } from './urls';

describe('isSHA', () => {
  it('identifies short and full hex SHAs', () => {
    expect(isSHA('abcde')).toMatchInlineSnapshot(`true`);
    expect(isSHA('abc123def')).toMatchInlineSnapshot(`true`);
    expect(isSHA('abc123def456789012345678901234567890abcd')).toMatchInlineSnapshot(`true`);
    expect(isSHA('1234567890123456789012345678901234567890')).toMatchInlineSnapshot(`true`);
  });

  it('identifies sha256-prefixed hashes', () => {
    expect(isSHA('sha256:abc123de')).toMatchInlineSnapshot(`true`);
    expect(isSHA('sha256:abc123def456789012345678901234567890abcd')).toMatchInlineSnapshot(`true`);
  });

  it('rejects empty strings, branches, tags, and missing SHAs', () => {
    expect(isSHA('')).toMatchInlineSnapshot(`false`);
    expect(isSHA('HEAD')).toMatchInlineSnapshot(`false`);
    expect(isSHA('main')).toMatchInlineSnapshot(`false`);
    expect(isSHA('develop')).toMatchInlineSnapshot(`false`);
    expect(isSHA('v1.0.0')).toMatchInlineSnapshot(`false`);
    expect(isSHA('v1.2.3')).toMatchInlineSnapshot(`false`);
  });

  it('rejects values outside the supported hex length and charset', () => {
    //too short for plain sha (needs 5–40 hex chars)
    expect(isSHA('abc')).toMatchInlineSnapshot(`false`);
    expect(isSHA('abcd')).toMatchInlineSnapshot(`false`);
    //too long for plain sha (>40)
    expect(isSHA('12345678901234567890123456789012345678901')).toMatchInlineSnapshot(`false`);
    //uppercase is not matched by the lowercase-only regex
    expect(isSHA('ABCDEF')).toMatchInlineSnapshot(`false`);
    expect(isSHA('abc123DEF')).toMatchInlineSnapshot(`false`);
    //sha256 prefix with empty or too-short hash
    expect(isSHA('sha256:')).toMatchInlineSnapshot(`false`);
    expect(isSHA('sha256:abc')).toMatchInlineSnapshot(`false`);
  });
});

describe('repoUrl', () => {
  it('extracts canonical https repo paths from common formats', () => {
    expect(repoUrl('https://github.com/argoproj/argo-cd.git')).toMatchInlineSnapshot(
      `"https://github.com/argoproj/argo-cd"`,
    );
    expect(repoUrl('https://github.com/argoproj/argo-cd')).toMatchInlineSnapshot(
      `"https://github.com/argoproj/argo-cd"`,
    );
    expect(repoUrl('git@github.com:argoproj/argo-cd.git')).toMatchInlineSnapshot(
      `"https://github.com/argoproj/argo-cd"`,
    );
    expect(repoUrl('ssh://git@github.com/foo/bar.git')).toMatchInlineSnapshot(
      `"https://github.com/foo/bar"`,
    );
    expect(repoUrl('https://gitlab.com/group/project.git')).toMatchInlineSnapshot(
      `"https://gitlab.com/group/project"`,
    );
    expect(repoUrl('https://bitbucket.org/team/repo.git')).toMatchInlineSnapshot(
      `"https://bitbucket.org/team/repo"`,
    );
  });

  it('returns null for empty, malformed, or unsupported providers', () => {
    expect(repoUrl('')).toMatchInlineSnapshot(`null`);
    expect(repoUrl('not a url')).toMatchInlineSnapshot(`null`);
    expect(repoUrl('https://internal.example.com/repo.git')).toMatchInlineSnapshot(`null`);
    expect(repoUrl('https://gitea.io/foo/bar')).toMatchInlineSnapshot(`null`);
  });
});

describe('revisionUrl', () => {
  it('builds commit URLs for SHA revisions', () => {
    expect(revisionUrl('https://github.com/foo/bar.git', 'abc123def', false)).toMatchInlineSnapshot(
      `"https://github.com/foo/bar/commit/abc123def"`,
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
  });

  it('builds tree/src URLs for branch names', () => {
    expect(revisionUrl('https://github.com/foo/bar.git', 'main', false)).toMatchInlineSnapshot(
      `"https://github.com/foo/bar/tree/main"`,
    );
    expect(revisionUrl('https://gitlab.com/foo/bar.git', 'main', false)).toMatchInlineSnapshot(
      `"https://gitlab.com/foo/bar/-/tree/main"`,
    );
    expect(revisionUrl('https://bitbucket.org/foo/bar.git', 'main', false)).toMatchInlineSnapshot(
      `"https://bitbucket.org/foo/bar/src/main"`,
    );
    expect(revisionUrl('https://bitbucket.org/foo/bar.git', 'main', true)).toMatchInlineSnapshot(
      `"https://bitbucket.org/foo/bar/src/main"`,
    );
  });

  it('defaults missing revision to HEAD', () => {
    expect(revisionUrl('https://github.com/foo/bar.git', '', false)).toMatchInlineSnapshot(
      `"https://github.com/foo/bar/tree/HEAD"`,
    );
    expect(revisionUrl('https://github.com/foo/bar.git', null as any, false)).toMatchInlineSnapshot(
      `"https://github.com/foo/bar/tree/HEAD"`,
    );
  });

  it('returns null for empty, malformed, or unsupported repo URLs', () => {
    expect(revisionUrl('', 'abc123', false)).toMatchInlineSnapshot(`null`);
    expect(revisionUrl('not a url', 'abc123', false)).toMatchInlineSnapshot(`null`);
    expect(revisionUrl('https://gitea.io/foo/bar.git', 'abc123', false)).toMatchInlineSnapshot(
      `null`,
    );
  });
});
