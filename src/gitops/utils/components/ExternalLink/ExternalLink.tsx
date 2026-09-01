import * as React from 'react';
import classNames from 'classnames';
import { SVGIconProps } from '@patternfly/react-icons/dist/esm/createIcon';
import { ButtonProps } from '@patternfly/react-core';

interface ExternalLinkButtonProps extends ButtonProps {
  iconProps?: SVGIconProps;
}

type ExternalLinkProps = ExternalLinkButtonProps & {
  href: string;
  text?: React.ReactNode;
  additionalClassName?: string;
  dataTestID?: string;
  stopPropagation?: boolean;
};

const ExternalLink: React.FC<ExternalLinkProps> = ({
  children,
  href,
  text,
  additionalClassName = '',
  dataTestID,
  stopPropagation,
}) => (
  <a
    className={classNames('co-external-link', additionalClassName)}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    data-test-id={dataTestID}
    {...(stopPropagation ? { onClick: (e) => e.stopPropagation() } : {})}
  >
    {children || text}
  </a>
);

export default ExternalLink;
