import * as React from 'react';

import RolloutList from './RolloutList';

type RolloutListProps = {
  namespace: string;
  hideNameLabelFilters?: boolean;
  showTitle?: boolean;
};

const RolloutListTab: React.FC<RolloutListProps> = ({
  namespace,
  hideNameLabelFilters,
  showTitle,
}) => {
  return (
    <RolloutList
      namespace={namespace}
      hideNameLabelFilters={hideNameLabelFilters}
      showTitle={showTitle}
    />
  );
};

export default RolloutListTab;
