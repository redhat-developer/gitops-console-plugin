import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { K8sResourceCommon, ResourceEventStream } from '@openshift-console/dynamic-plugin-sdk';
import { PageSection, Title } from '@patternfly/react-core';

type EventsTabProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: K8sResourceCommon;
};

const EventsTab: React.FC<EventsTabProps> = ({ obj }) => {
  return (
    <>
      <PageSection>
        <Title headingLevel="h2">{obj.kind} events</Title>
      </PageSection>
      {obj && <ResourceEventStream resource={obj} />}
    </>
  );
};

export default EventsTab;
