import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Tooltip, TooltipPosition } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { Node } from '@patternfly/react-topology';

import Decorator from '../console/Decorator';

type ArgoRolloutNodeDecoratorProps = {
  element: Node;
  radius: number;
  x: number;
  y: number;
};

const ArgoRolloutNodeDecorator: React.FC<ArgoRolloutNodeDecoratorProps> = ({
  element,
  radius,
  x,
  y,
}) => {
  const ref = React.useRef();
  const { t } = useTranslation();
  const { data } = element.getData();
  const helpUrl =
    'https://docs.redhat.com/en/documentation/red_hat_openshift_gitops/latest/html/argo_rollouts/argo-rollouts-overview#argo-rollouts-overview';
  if (!data) {
    return null;
  }
  const label = t('topology~Open URL');
  return (
    <Tooltip triggerRef={ref} key="route" content={label} position={TooltipPosition.right}>
      <g ref={ref}>
        <Decorator x={x} y={y} radius={radius} href={helpUrl} external ariaLabel={label}>
          <g transform={`translate(-${radius / 2}, -${radius / 2})`}>
            <ExternalLinkAltIcon style={{ fontSize: radius }} title={label} />
          </g>
        </Decorator>
      </g>
    </Tooltip>
  );
};

export default ArgoRolloutNodeDecorator;
