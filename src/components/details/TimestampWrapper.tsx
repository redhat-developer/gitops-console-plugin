import * as _ from 'lodash';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  K8sModel,
  K8sResourceCommon,
  K8sResourceKindReference,
  Timestamp,
  useK8sModel,
  useK8sWatchResources,
} from '@openshift-console/dynamic-plugin-sdk';
import { getReference } from '@openshift-console/dynamic-plugin-sdk/lib/utils/k8s/k8s-ref';

import { GitOpsResource } from '../utils/gitops-types';

interface TimestampWrapperProps {
  resModels: GitOpsResource[];
}

export type K8sResourceKind = K8sResourceCommon & {
  spec?: {
    [key: string]: any;
  };
  status?: { [key: string]: any };
  data?: { [key: string]: any };
};

export const getReferenceForModel = (model: K8sModel): K8sResourceKindReference =>
  getReference({ group: model.apiGroup, version: model.apiVersion, kind: model.kind });

const TimestampWrapper: React.FC<TimestampWrapperProps> = ({ resModels }) => {
  const [lastUpdatedTimestamp, setLastUpdatedTimestamp] = React.useState<number>(null);
  const { t } = useTranslation();
  const memoResources = React.useMemo(() => {
    let resources = {};
    _.forEach(resModels, (res) => {
      const { group, version, kind, name, namespace } = res;
      const resourceRef = getReference({ group, version, kind });
      const model = useK8sModel(resourceRef);
      resources = {
        ...resources,
        [`${name}-${kind}-${namespace}`]: {
          ...(model['K8sModel'].namespaced ? { namespace } : {}),
          kind: model['K8sModel'].crd
            ? getReferenceForModel(model['K8sModel'])
            : model['K8sModel'].kind,
          namespace,
          name,
          optional: true,
        },
      };
    });
    return resources;
  }, [resModels]);

  const resourcesData = useK8sWatchResources<{
    [key: string]: K8sResourceKind;
  }>(memoResources);

  React.useEffect(() => {
    const timestamp = _.max(
      _.map(resourcesData, (resObj) => {
        const resTimestamp = resObj?.data?.status?.conditions?.[0]?.lastUpdateTime;
        return new Date(resTimestamp).getTime();
      }),
    );
    setLastUpdatedTimestamp(timestamp);
  }, [resourcesData]);

  return (
    <>
      {lastUpdatedTimestamp ? (
        <Timestamp timestamp={lastUpdatedTimestamp} />
      ) : (
        <div>{t('gitops-plugin~Info not available')}</div>
      )}
    </>
  );
};

export default TimestampWrapper;
