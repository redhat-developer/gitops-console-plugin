import * as React from 'react';
import { ApplicationSetKind } from '../../models/ApplicationSetModel';
import { ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { RouteComponentProps } from 'react-router';

type YAMLTabProps = RouteComponentProps<{ ns: string; name: string }> & {
  obj?: ApplicationSetKind;
  namespace?: string;
  name?: string;
};

const YAMLTab: React.FC<YAMLTabProps> = ({ obj }) => {
  if (!obj) return null;

  return (
    <React.Suspense fallback={<Bullseye><Spinner size="xl" /></Bullseye>}>
      <ResourceYAMLEditor initialResource={obj} />
    </React.Suspense>
  );
};

export default YAMLTab;
