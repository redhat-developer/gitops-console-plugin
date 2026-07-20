import * as React from 'react';

import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';
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
            <div
              style={{
                fontFamily: 'Monaco, Menlo, Ubuntu Mono, monospace',
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                padding: '8px',
                backgroundColor: 'var(--pf-t--global--background--color--secondary--default)',
                border: '1px solid var(--pf-t--global--border--color--default)',
                borderRadius: '4px',
              }}
            >
              {JSON.stringify(generator, null, 2)}
            </div>
          </DescriptionListDescription>
        </DescriptionListGroup>
      </DescriptionList>
    </GeneratorView>
  );
};

export default GenericGenerator;
