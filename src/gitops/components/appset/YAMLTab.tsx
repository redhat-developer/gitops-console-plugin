import * as React from 'react';
import { ApplicationSetKind } from '../../models/ApplicationSetModel';
import { ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';

type YAMLTabProps = {
  obj?: ApplicationSetKind;
  namespace?: string;
  name?: string;
};

const YAMLTab: React.FC<YAMLTabProps> = ({ obj }) => {
  if (!obj) return null;

  return (
    <ResourceYAMLEditor initialResource={obj} header={obj?.kind} />
  );
};

export default YAMLTab;
