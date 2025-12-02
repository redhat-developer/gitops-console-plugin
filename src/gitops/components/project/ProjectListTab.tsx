import * as React from 'react';

import ProjectList from './ProjectList';

type ProjectListTabProps = {
  namespace?: string;
  hideNameLabelFilters?: boolean;
  showTitle?: boolean;
};

const ProjectListTab: React.FC<ProjectListTabProps> = ({
  namespace,
  hideNameLabelFilters,
  showTitle,
}) => {
  return (
    <ProjectList
      namespace={namespace}
      hideNameLabelFilters={hideNameLabelFilters}
      showTitle={showTitle}
    />
  );
};

export default ProjectListTab;
