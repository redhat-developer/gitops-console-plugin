import * as React from 'react';
import { useParams } from 'react-router-dom-v5-compat';

import ProjectNavPage from './ProjectNavPage';

const ProjectDetailsPage: React.FC = () => {
  const { name, ns } = useParams<{ name?: string; ns?: string }>();

  if (!name || !ns) {
    return <div>Error: Missing required route parameters</div>;
  }

  return <ProjectNavPage name={name} namespace={ns} kind="AppProject" />;
};

export default ProjectDetailsPage;
