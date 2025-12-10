import * as React from 'react';
import { Link } from 'react-router-dom-v5-compat';

import { Button, Icon, Tooltip } from '@patternfly/react-core';
import { TopologyIcon } from '@patternfly/react-icons';

export const topologyLink = (topologyUrl: string, t: (key: string) => string): React.ReactNode => {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <Tooltip position="top" content={t('Topology view')}>
        <Link
          className="pf-v5-c-content"
          rel="noopener noreferrer"
          to={topologyUrl}
          role="button"
          aria-label={t('Topology view')}
        >
          <Button
            icon={
              <Icon size="md">
                <TopologyIcon />
              </Icon>
            }
            variant="plain"
            aria-label={t('Topology view')}
            className="pf-m-plain odc-topology__view-switcher"
            data-test-id="topology-switcher-view"
          ></Button>
        </Link>
      </Tooltip>
    </span>
  );
};
