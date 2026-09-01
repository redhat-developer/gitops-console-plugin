import * as React from 'react';

import { K8sResourceCommon, ResourceEventStream } from '@openshift-console/dynamic-plugin-sdk';
import { PageSection, Title } from '@patternfly/react-core';

type EventsTabProps = {
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
