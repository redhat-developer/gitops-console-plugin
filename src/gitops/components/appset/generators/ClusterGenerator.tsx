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
              <pre style={{ 
                fontSize: '12px', 
                backgroundColor: '#f6f6f6', 
                padding: '8px', 
                borderRadius: '4px',
                margin: 0,
                fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace'
              }}>
                {JSON.stringify(generator.selector, null, 2)}
              </pre>
            </DescriptionListDescription>
          </DescriptionListGroup>
        )}
      </DescriptionList>
    </GeneratorView>
  );
};

export default ClusterGenerator;
