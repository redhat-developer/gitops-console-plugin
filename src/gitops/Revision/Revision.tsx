import * as React from 'react';
import { createRevisionURL } from 'src/gitops/utils/gitops';

import ExternalLink from '../utils/components/ExternalLink/ExternalLink';
import { isSHA, revisionUrl } from '@gitops/utils/urls';

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

export default Revision;
