import * as React from 'react';
import { ApplicationSetKind } from '../../models/ApplicationSetModel';
import { ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye, Spinner } from '@patternfly/react-core';
import './YAMLTab.scss';

type YAMLTabProps = {
  obj?: ApplicationSetKind;
  namespace?: string;
  name?: string;
};

const YAMLTab: React.FC<YAMLTabProps> = ({ obj }) => {
  if (!obj) return null;

  return (
    <div className="yaml-tab-container">
      <React.Suspense fallback={<Bullseye><Spinner size="xl" /></Bullseye>}>
        <ResourceYAMLEditor initialResource={obj} />
      </React.Suspense>
    </div>
  );
};

export default YAMLTab;
