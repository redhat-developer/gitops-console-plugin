import { detectGitType, gitUrlRegex } from './stringHelpers';

describe('gitUrlRegex', () => {
  it('matches valid https and git URLs', () => {
    expect(gitUrlRegex.test('https://github.com/foo/bar')).toMatchInlineSnapshot(`true`);
    expect(gitUrlRegex.test('https://github.com/foo/bar.git')).toMatchInlineSnapshot(`true`);
    expect(gitUrlRegex.test('https://www.github.com/foo/bar')).toMatchInlineSnapshot(`true`);
    expect(gitUrlRegex.test('http://github.com/foo/bar')).toMatchInlineSnapshot(`true`);
    expect(gitUrlRegex.test('git://github.com/foo/bar.git')).toMatchInlineSnapshot(`true`);
    expect(gitUrlRegex.test('https://gitlab.com/group/sub/project.git')).toMatchInlineSnapshot(
      `true`,
    );
  });

  it('matches valid ssh and scp-style URLs', () => {
    expect(gitUrlRegex.test('git@github.com:foo/bar.git')).toMatchInlineSnapshot(`true`);
    expect(gitUrlRegex.test('ssh://git@github.com/foo/bar')).toMatchInlineSnapshot(`true`);
    expect(gitUrlRegex.test('ssh://git@gitlab.com/foo/bar.git')).toMatchInlineSnapshot(`true`);
    expect(gitUrlRegex.test('git@bitbucket.org:team/repo.git')).toMatchInlineSnapshot(`true`);
  });

  it('rejects empty, blank, and malformed URLs', () => {
    expect(gitUrlRegex.test('')).toMatchInlineSnapshot(`false`);
    expect(gitUrlRegex.test(' ')).toMatchInlineSnapshot(`false`);
    expect(gitUrlRegex.test('not a url')).toMatchInlineSnapshot(`false`);
    expect(gitUrlRegex.test('not-a-url')).toMatchInlineSnapshot(`false`);
    expect(gitUrlRegex.test('https://')).toMatchInlineSnapshot(`false`);
    expect(gitUrlRegex.test('ftp://github.com/foo/bar')).toMatchInlineSnapshot(`false`);
  });

  it('matches non-standard but syntactically valid git hosts', () => {
    expect(gitUrlRegex.test('https://gitea.example.com/foo/bar.git')).toMatchInlineSnapshot(`true`);
    expect(gitUrlRegex.test('https://github.enterprise.example.com/foo/bar')).toMatchInlineSnapshot(
      `true`,
    );
    //host alone is still considered a url shape by this regex
    expect(gitUrlRegex.test('https://github.com')).toMatchInlineSnapshot(`true`);
  });
});

describe('detectGitType', () => {
  it('detects known providers from https URLs', () => {
    expect(detectGitType('https://github.com/foo/bar')).toMatchInlineSnapshot(`"github"`);
    expect(detectGitType('https://www.github.com/foo/bar')).toMatchInlineSnapshot(`"github"`);
    expect(detectGitType('https://gitlab.com/foo/bar')).toMatchInlineSnapshot(`"gitlab"`);
    expect(detectGitType('https://www.gitlab.com/foo/bar')).toMatchInlineSnapshot(`"gitlab"`);
    expect(detectGitType('https://bitbucket.org/foo/bar')).toMatchInlineSnapshot(`"bitbucket"`);
    expect(detectGitType('https://www.bitbucket.org/foo/bar')).toMatchInlineSnapshot(`"bitbucket"`);
  });

  it('detects known providers from scp-style SSH URLs', () => {
    expect(detectGitType('git@github.com:foo/bar.git')).toMatchInlineSnapshot(`"github"`);
    expect(detectGitType('git@gitlab.com:foo/bar.git')).toMatchInlineSnapshot(`"gitlab"`);
    expect(detectGitType('git@bitbucket.org:team/repo.git')).toMatchInlineSnapshot(`"bitbucket"`);
  });

  it('returns empty string for invalid or empty input', () => {
    expect(detectGitType('')).toMatchInlineSnapshot(`""`);
    expect(detectGitType('not a url')).toMatchInlineSnapshot(`""`);
    expect(detectGitType('https://')).toMatchInlineSnapshot(`""`);
  });

  it('returns other for unrecognized or non-standard formats', () => {
    //valid git url shape, but not a known public provider
    expect(detectGitType('https://example.com/foo/bar')).toMatchInlineSnapshot(`"other"`);
    expect(detectGitType('https://gitea.example.com/foo/bar.git')).toMatchInlineSnapshot(`"other"`);
    expect(detectGitType('https://github.enterprise.example.com/foo/bar')).toMatchInlineSnapshot(
      `"other"`,
    );
    //http (not https) and ssh:// do not match hasDomain checks, so provider is unsure
    expect(detectGitType('http://github.com/foo/bar')).toMatchInlineSnapshot(`"other"`);
    expect(detectGitType('ssh://git@github.com/foo/bar')).toMatchInlineSnapshot(`"other"`);
  });
});
