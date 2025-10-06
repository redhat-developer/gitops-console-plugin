import * as React from 'react';
import gitUrlParse, { GitUrl } from 'git-url-parse';
import { createRevisionURL } from 'src/gitops/utils/gitops';

import ExternalLink from '../utils/components/ExternalLink/ExternalLink';

interface RevisionProps {
  repoURL: string;
  revision: string;
  helm: boolean;
  revisionExtra?: string;
  path?: string;
}

const Revision: React.FC<RevisionProps> = ({ repoURL, revision, helm, revisionExtra, path }) => {
  if (revision) {
    const hasPath = path && path !== '.';
    let url = revisionUrl(repoURL, revision, hasPath);
    if (url !== null && hasPath) {
      url += '/' + path;
    }
    // eslint-disable-next-line no-nested-ternary
    const content = isSHA(revision)
      ? revision.startsWith('sha256:')
        ? revision.substr(0, 14)
        : revision.substr(0, 7)
      : revision;
    return (
      <>
        {!helm && url !== null ? (
          <span>
            <ExternalLink href={createRevisionURL(repoURL, revision)}>{content}</ExternalLink>
            {revisionExtra && revisionExtra}
          </span>
        ) : (
          <span>{content}</span>
        )}
      </>
    );
  } else {
    return <span>(None)</span>;
  }
};

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

function revisionUrl(url: string, revision: string, forPath: boolean): string {
  let parsed;
  try {
    parsed = gitUrlParse(url);
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

export default Revision;
