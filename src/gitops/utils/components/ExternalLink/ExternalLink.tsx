import * as React from 'react';

import { ExternalLinkAltIcon } from '@patternfly/react-icons';

type ExternalLinkProps = {
  href?: string;
  text?: React.ReactNode;
  children?: React.ReactNode;
  stopPropagation?: boolean;
};

const ExternalLink = ({ href, text, children, stopPropagation }: ExternalLinkProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="pf-v5-c-content"
    {...(stopPropagation ? { onClick: (e) => e.stopPropagation() } : {})}
  >
    {children || text} <ExternalLinkAltIcon />
  </a>
);

export default ExternalLink;
