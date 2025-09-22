import * as React from 'react';
import { createRevisionURL } from 'src/gitops/utils/gitops';

import ExternalLink from '../utils/components/ExternalLink/ExternalLink';

interface RevisionProps {
  repoURL: string;
  revision: string;
  helm: boolean;
  revisionExtra?: string;
}

const Revision: React.FC<RevisionProps> = ({ repoURL, revision, helm, revisionExtra }) => {
  if (revision) {
    return (
      <>
        {!helm && (
          <span>
            <ExternalLink href={createRevisionURL(repoURL, revision)}>
              ({revision.substring(0, 7) || ''})
            </ExternalLink>
            {revisionExtra && revisionExtra}
          </span>
        )}
        {helm && <span>({revision.substring(0, 7) || ''})</span>}
      </>
    );
  } else {
    return <span>(None)</span>;
  }
};

export default Revision;
