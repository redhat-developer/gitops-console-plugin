import * as React from 'react';
import ExternalLink from 'src/components/utils/ExternalLink/ExternalLink';

import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import argoImage from '@images/argo.png';
import { Tooltip } from '@patternfly/react-core';

type ArgoCDLinkProps = {
  href: string;
};

export const ArgoCDLink: React.FC<ArgoCDLinkProps> = ({ href }) => {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <img
        loading="lazy"
        src={argoImage}
        alt="Argo CD"
        width="22px"
        height="22px"
        style={{ marginRight: '4px' }}
      />
      <Tooltip content={t('View in Argo CD')}>
        <ExternalLink stopPropagation={true} href={href}>
          <span>Argo CD</span>
        </ExternalLink>
      </Tooltip>
    </span>
  );
};

export default ArgoCDLink;
