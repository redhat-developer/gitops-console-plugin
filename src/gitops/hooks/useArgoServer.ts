import * as React from 'react';

import { ApplicationKind } from '@gitops/models/ApplicationModel';
import { useK8sModel } from '@openshift-console/dynamic-plugin-sdk';

import { ArgoServer, getArgoServer } from '../utils/gitops';

export const useArgoServer = (app?: ApplicationKind): ArgoServer => {
  const [model] = useK8sModel({ group: 'route.openshift.io', version: 'v1', kind: 'Route' });
  const [argoServer, setArgoServer] = React.useState<ArgoServer>({ host: '', protocol: '' });

  React.useEffect(() => {
    if (!app) {
      return undefined;
    }

    getArgoServer(model, app)
      .then(setArgoServer)
      .catch((err) => {
        console.error('Error:', err);
      });
  }, [model, app]);

  return argoServer;
};
