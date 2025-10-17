import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { K8sResourceCommon, ResourceYAMLEditor } from '@openshift-console/dynamic-plugin-sdk';
import { Bullseye, Spinner } from '@patternfly/react-core';

import './ResourceYAMLTab.scss';

type ResourceYAMLTabProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: K8sResourceCommon;
};

const ResourceYAMLTab: React.FC<ResourceYAMLTabProps> = ({ obj }) => {
  return (
    <div className="yaml-tab-container">
      <React.Suspense
        fallback={
          <Bullseye>
            <Spinner size="xl" />
          </Bullseye>
        }
      >
        <ResourceYAMLEditor initialResource={obj} />
      </React.Suspense>
    </div>
  );
};

export default ResourceYAMLTab;
