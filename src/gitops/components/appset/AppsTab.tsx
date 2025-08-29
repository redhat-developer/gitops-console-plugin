import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { ApplicationSetKind } from '../../models/ApplicationSetModel';
import { PageSection } from '@patternfly/react-core';
import ApplicationList from '../shared/ApplicationList';
import './AppsTab.scss';

type AppsTabProps = RouteComponentProps<{ ns: string; name: string }> & {
  obj?: ApplicationSetKind;
  namespace?: string;
  name?: string;
};

const AppsTab: React.FC<AppsTabProps> = ({ obj, namespace }) => {
  if (!obj || !namespace) return null;

  return (
    <PageSection>
      <ApplicationList 
        namespace={namespace}
        hideNameLabelFilters={false}
        showTitle={false}
        appset={obj}
      />
    </PageSection>
  );
};

export default AppsTab;
