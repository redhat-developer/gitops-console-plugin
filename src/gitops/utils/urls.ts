/*
 * Taken from the Argo CD UI from here:
 * https://github.com/argoproj/argo-cd/blob/4bd8b07c514e26c6b7837f30d52afd1a3cdedcfd/ui/src/app/shared/components/urls.ts
 */

import * as GitUrlParse from 'git-url-parse';
import { GitUrl } from 'git-url-parse';

export const isSHA = (revision: string) => {
  if (revision.startsWith('sha256:')) {
    const hashOnly = revision.replace('sha256:', '');
    return hashOnly.match(/^[a-f0-9]{8,69}$/) !== null;
  }
  // https://stackoverflow.com/questions/468370/a-regex-to-match-a-sha1
  return revision.match(/^[a-f0-9]{5,40}$/) !== null;
};

function supportedSource(parsed: GitUrl): boolean {
  return (
    parsed.resource.startsWith('github') ||
    ['gitlab.com', 'bitbucket.org'].indexOf(parsed.source) >= 0
  );
}

function protocol(proto: string): string {
  return proto === 'ssh' ? 'https' : proto;
}

export function repoUrl(url: string): string {
  try {
    const parsed = GitUrlParse(url);

    if (!supportedSource(parsed)) {
      return null;
    }

    return `${protocol(parsed.protocol)}://${parsed.resource}/${parsed.owner}/${parsed.name}`;
  } catch {
    return null;
  }
}

export function revisionUrl(url: string, revision: string, forPath: boolean): string {
  if (!revision) revision = 'HEAD';
  let parsed;
  try {
    parsed = GitUrlParse(url);
  } catch {
    return null;
  }
  let urlSubPath = isSHA(revision) ? 'commit' : 'tree';

  if (url.indexOf('bitbucket') >= 0) {
    // The reason for the condition of 'forPath' is that when we build nested path, we need to use 'src'
    urlSubPath = isSHA(revision) && !forPath ? 'commits' : 'src';
  }

  // Gitlab changed the way urls to commit look like
  // Ref: https://docs.gitlab.com/ee/update/deprecations.html#legacy-urls-replaced-or-removed
  if (parsed.source === 'gitlab.com') {
    urlSubPath = '-/' + urlSubPath;
  }

  if (!supportedSource(parsed)) {
    return null;
  }

  return `${protocol(parsed.protocol)}://${parsed.resource}/${parsed.owner}/${
    parsed.name
  }/${urlSubPath}/${revision || 'HEAD'}`;
}
