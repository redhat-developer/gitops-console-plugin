import * as React from 'react';
import { useParams } from 'react-router-dom-v5-compat';
import AppSetNavPage from '../appset/AppSetNavPage';

const ApplicationSetDetailsPage: React.FC = () => {
  const { name, ns } = useParams<{ name: string; ns: string }>();

  return (
    <AppSetNavPage 
      name={name} 
      namespace={ns} 
      kind="ApplicationSet" 
    />
  );
};

export default ApplicationSetDetailsPage;
