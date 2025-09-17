import * as React from 'react';
import { DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm } from '@patternfly/react-core';
import { ClusterIcon } from '@patternfly/react-icons';
import GeneratorView from './GeneratorView';

interface ClusterGeneratorProps {
  generator: any;
}

const ClusterGenerator: React.FC<ClusterGeneratorProps> = ({ generator }) => {
  return (
    <GeneratorView icon={<ClusterIcon />} title="Cluster">
      <DescriptionList isHorizontal isCompact>
        {generator.selector && (
          <DescriptionListGroup>
            <DescriptionListTerm>Selector</DescriptionListTerm>
            <DescriptionListDescription>
              <div style={{ 
                fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace',
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                padding: '8px',
                backgroundColor: 'var(--pf-v5-global--BackgroundColor--200)',
                border: '1px solid var(--pf-v5-global--BorderColor--200)',
                borderRadius: '4px'
              }}>
                {JSON.stringify(generator.selector, null, 2)}
              </div>
            </DescriptionListDescription>
          </DescriptionListGroup>
        )}
      </DescriptionList>
    </GeneratorView>
  );
};

export default ClusterGenerator;
