import * as React from 'react';

import ExternalLink from '@gitops/utils/components/ExternalLink/ExternalLink';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { Tooltip } from '@patternfly/react-core';

type ArgoCDLinkProps = {
  href: string;
};

export const ArgoCDLink: React.FC<ArgoCDLinkProps> = ({ href }) => {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <i className="fas fa-link" style={{ marginRight: '4px' }}></i>
      <Tooltip content={t('View in Argo CD')}>
        <ExternalLink stopPropagation={true} href={href}>
          <span>Argo CD</span>
        </ExternalLink>
      </Tooltip>
    </span>
  );
};

export default ArgoCDLink;
