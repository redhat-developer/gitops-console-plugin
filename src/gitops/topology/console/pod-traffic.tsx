import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { LoadingInline } from '@gitops/utils/components/LoadingSpinner/Loading';
import {
  K8sKind,
  StatusComponent,
  useK8sWatchResource,
} from '@openshift-console/dynamic-plugin-sdk';
import { Tooltip } from '@patternfly/react-core';
import { ConnectedIcon, DisconnectedIcon } from '@patternfly/react-icons';

import { EndpointSliceKind } from './types';

import './Loading.scss';

const EndPointSliceModel: K8sKind = {
  kind: 'EndpointSlice',
  label: 'EndpointSlice',
  labelPlural: 'EndpointSlices',
  apiGroup: 'discovery.k8s.io',
  apiVersion: 'v1',
  abbr: 'EPS',
  namespaced: true,
  plural: 'endpointslices',
};

export type PodTrafficProp = {
  podName: string;
  namespace: string;
  tooltipFlag?: boolean;
};

export const PodTraffic: React.FC<PodTrafficProp> = ({ podName, namespace, tooltipFlag }) => {
  const { t } = useTranslation();
  const [data, loaded, loadError] = useK8sWatchResource<EndpointSliceKind[]>({
    groupVersionKind: {
      kind: EndPointSliceModel.kind,
      version: EndPointSliceModel.apiVersion,
    },
    isList: true,
    namespaced: true,
    namespace,
  });

  if (!loaded) {
    return <LoadingInline />;
  } else if (loaded && loadError) {
    return <StatusComponent status="Error" title={t('plugin__gitops-public~Error')} />;
  }
  const allEndpoints = data?.reduce((prev, next) => prev.concat(next?.endpoints), []);
  const receivingTraffic = allEndpoints?.some((endPoint) => endPoint?.targetRef?.name === podName);
  if (tooltipFlag) {
    return (
      loaded &&
      !loadError && (
        <div data-test="pod-traffic-status">
          <Tooltip
            position="top"
            content={
              receivingTraffic
                ? t('plugin__gitops-public~Receiving Traffic')
                : t('plugin__gitops-public~Not Receiving Traffic')
            }
          >
            {receivingTraffic ? <ConnectedIcon /> : <DisconnectedIcon />}
          </Tooltip>
        </div>
      )
    );
  }
  return loaded && !loadError && (receivingTraffic ? <ConnectedIcon /> : <DisconnectedIcon />);
};
