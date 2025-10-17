import * as React from 'react';
import { ReactNode } from 'react';

import { Card, CardBody, CardTitle, Divider, Icon } from '@patternfly/react-core';

type GeneratorViewProps = {
  title: string;
  icon?: JSX.Element;
  children?: ReactNode;
};

const GeneratorView: React.FC<GeneratorViewProps> = ({ title, icon, children }) => (
  <Card>
    <CardTitle>
      <div style={{ display: 'flex', verticalAlign: 'bottom' }}>
        {icon && <Icon size="lg">{icon}</Icon>}
        <span style={{ paddingLeft: '6px' }}>{title}</span>
      </div>
      {children && <Divider style={{ paddingTop: '6px', paddingBottom: '4px' }} />}
    </CardTitle>
    {children && <CardBody>{children}</CardBody>}
  </Card>
);

export default GeneratorView;
