import * as React from 'react';

import ApplicationList from '../shared/ApplicationList';

type ApplicationListProps = {
  namespace: string;
  hideNameLabelFilters?: boolean;
  showTitle?: boolean;
};

const ApplicationListTab: React.FC<ApplicationListProps> = ({
  namespace,
  hideNameLabelFilters,
  showTitle,
}) => {
  return (
    <ApplicationList
      namespace={namespace}
      hideNameLabelFilters={hideNameLabelFilters}
      showTitle={showTitle}
    />
  );
};

export default ApplicationListTab;
