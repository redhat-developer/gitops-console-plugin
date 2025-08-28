import * as React from 'react';
import { DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm } from '@patternfly/react-core';
import { QuestionCircleIcon } from '@patternfly/react-icons';
import GeneratorView from './GeneratorView';

interface GenericGeneratorProps {
  gentype: string;
  generator: any;
}

const GenericGenerator: React.FC<GenericGeneratorProps> = ({ gentype, generator }) => {
  return (
    <GeneratorView icon={<QuestionCircleIcon />} title={`${gentype} Generator`}>
      <DescriptionList isHorizontal isCompact>
        <DescriptionListGroup>
          <DescriptionListTerm>Configuration</DescriptionListTerm>
          <DescriptionListDescription>
            <pre style={{ 
              fontSize: '12px', 
              backgroundColor: '#f6f6f6', 
              padding: '8px', 
              borderRadius: '4px',
              margin: 0,
              fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace'
            }}>
              {JSON.stringify(generator, null, 2)}
            </pre>
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </GeneratorView>
  );
};

export default GenericGenerator;
