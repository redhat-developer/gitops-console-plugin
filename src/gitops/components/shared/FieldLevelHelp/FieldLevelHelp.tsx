import * as React from 'react';

import { Popover, Title } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

import './FieldLevelHelp.scss';

type FieldLevelHelpProps = {
  title: string;
  helpText: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
};

export const FieldLevelHelp: React.FC<FieldLevelHelpProps> = ({
  title,
  helpText,
  headingLevel = 'h2',
  className = 'co-section-heading',
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline' }}>
      <Title headingLevel={headingLevel} className={className}>
        {title}
      </Title>
      <Popover headerContent={<div>{title}</div>} bodyContent={<div>{helpText}</div>}>
        <button
          className="co-field-level-help"
          aria-label="Help"
          type="button"
          style={{
            padding: 0,
            marginLeft: '4px',
            verticalAlign: 'baseline',
            backgroundColor: 'transparent',
            border: 'none',
            display: 'inline',
            minWidth: 'auto',
            lineHeight: 'inherit',
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <OutlinedQuestionCircleIcon
            className="pf-v6-svg co-field-level-help_icon"
            style={{
              fontSize: '0.75rem',
              width: '0.75rem',
              height: '0.75rem',
              color: '#73bcf7',
              fill: '#73bcf7',
            }}
          />
        </button>
      </Popover>
    </div>
  );
};

export default FieldLevelHelp;
