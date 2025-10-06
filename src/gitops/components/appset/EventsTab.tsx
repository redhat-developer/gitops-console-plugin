import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { ApplicationSetKind } from '../../models/ApplicationSetModel';
import EventsTab from '../shared/EventsTab/EventsTab';

type EventsTabProps = RouteComponentProps<{ ns: string; name: string }> & {
  obj?: ApplicationSetKind;
};

const ApplicationSetEventsTab: React.FC<EventsTabProps> = ({ obj }) => {
  if (!obj) return null;

  return <EventsTab obj={obj} />;
};

export default ApplicationSetEventsTab;
