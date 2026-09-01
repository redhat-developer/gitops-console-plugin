import * as React from 'react';

import { ApplicationSetKind } from '../../models/ApplicationSetModel';
import ApplicationList from '../shared/ApplicationList';

import './AppsTab.scss';

type AppsTabProps = {
  obj?: ApplicationSetKind;
};

const AppsTab: React.FC<AppsTabProps> = ({ obj }) => {
  const namespace = obj?.metadata?.namespace;
  if (!obj || !namespace) return null;

  return (
    <ApplicationList
      namespace={namespace}
      hideNameLabelFilters={false}
      showTitle={false}
      appset={obj}
    />
  );
};

export default AppsTab;
