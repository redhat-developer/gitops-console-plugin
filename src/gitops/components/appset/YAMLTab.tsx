import * as React from 'react';
import { ApplicationSetKind } from '../../models/ApplicationSetModel';
import ResourceYAMLTab from '../shared/ResourceYAMLTab/ResourceYAMLTab';

type YAMLTabProps = {
  obj?: ApplicationSetKind;
  namespace?: string;
  name?: string;
};

const YAMLTab: React.FC<YAMLTabProps> = ({ obj, namespace, name }) => {
  if (!obj) return null;

  return (
    <ResourceYAMLTab 
      obj={obj} 
      namespace={namespace} 
      name={name} 
    />
  );
};

export default YAMLTab;
