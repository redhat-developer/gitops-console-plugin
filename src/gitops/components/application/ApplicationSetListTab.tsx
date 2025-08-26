import * as React from 'react';

import ApplicationSetList from '../shared/ApplicationSetList';

type ApplicationSetListProps = {
  namespace: string;
  hideNameLabelFilters?: boolean;
  showTitle?: boolean;
};

const ApplicationSetListTab: React.FC<ApplicationSetListProps> = ({
  namespace,
  hideNameLabelFilters,
  showTitle,
}) => {
  return (
    <ApplicationSetList
      namespace={namespace}
      hideNameLabelFilters={hideNameLabelFilters}
      showTitle={showTitle}
    />
  );
};

export default ApplicationSetListTab;
