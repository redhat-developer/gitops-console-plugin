import * as React from 'react';

import { AppProjectKind } from '../../models/AppProjectModel';
import ApplicationList from '../shared/ApplicationList';

type ProjectApplicationsTabProps = {
  obj?: AppProjectKind;
};

const ProjectApplicationsTab: React.FC<ProjectApplicationsTabProps> = ({ obj }) => {
  const namespace = obj?.metadata?.namespace;
  if (!obj || !namespace) return null;

  return (
    <ApplicationList
      namespace={namespace}
      hideNameLabelFilters={false}
      showTitle={false}
      project={obj}
    />
  );
};

export default ProjectApplicationsTab;
