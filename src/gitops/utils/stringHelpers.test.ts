import { detectGitType, gitUrlRegex } from './stringHelpers';

describe('gitUrlRegex', () => {
  it('matches valid git URLs', () => {
    expect(gitUrlRegex.test('https://github.com/foo/bar')).toMatchInlineSnapshot(`true`);
    expect(gitUrlRegex.test('https://github.com/foo/bar.git')).toMatchInlineSnapshot(`true`);
    expect(gitUrlRegex.test('git@github.com:foo/bar.git')).toMatchInlineSnapshot(`true`);
    expect(gitUrlRegex.test('ssh://git@github.com/foo/bar')).toMatchInlineSnapshot(`true`);
    expect(gitUrlRegex.test('not a url')).toMatchInlineSnapshot(`false`);
    expect(gitUrlRegex.test('')).toMatchInlineSnapshot(`false`);
  });
});

describe('detectGitType', () => {
  it('detects git providers', () => {
    expect(detectGitType('https://github.com/foo/bar')).toMatchInlineSnapshot(`"github"`);
    expect(detectGitType('https://gitlab.com/foo/bar')).toMatchInlineSnapshot(`"gitlab"`);
    expect(detectGitType('https://bitbucket.org/foo/bar')).toMatchInlineSnapshot(`"bitbucket"`);
    expect(detectGitType('https://example.com/foo/bar')).toMatchInlineSnapshot(`"other"`);
    expect(detectGitType('not a url')).toMatchInlineSnapshot(`""`);
    expect(detectGitType('git@github.com:foo/bar.git')).toMatchInlineSnapshot(`"github"`);
  });
});
