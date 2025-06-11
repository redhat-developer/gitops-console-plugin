import * as React from 'react';

import {
  DetailsTabSectionExtensionHook,
  K8sResourceKind,
} from '@openshift-console/dynamic-plugin-sdk';
import { TopologyDataObject } from '@openshift-console/dynamic-plugin-sdk/lib/extensions/topology-types';
import { getResource } from '@openshift-console/dynamic-plugin-sdk-internal';
import { GraphElement } from '@patternfly/react-topology';

import DevPreviewBadge from '../../../components/import/badges/DevPreviewBadge';
import { PodOverviewItem } from '../console/PodsOverview';
import { usePodsForRollouts } from '../usePodsForRollouts';

import { SidebarSectionHeading } from './DeploymentSideBarDetails';

type OperatorGroupData = {
  csvName: string;
  operatorKind: string;
  builderImage: string;
  apiVersion: string;
  rollout: K8sResourceKind;
};

export const ResourceSection: React.FC<{
  item: TopologyDataObject<OperatorGroupData>;
}> = ({ item }) => {
  const { resource } = item;
  const { loaded, loadError, pods } = usePodsForRollouts(
    resource,
    resource.metadata.uid,
    resource.metadata.namespace,
  );
  // rename to podData
  const statusOfPods = React.useMemo(() => {
    if (loaded && !loadError) {
      const [current, previous] = pods;
      const isRollingOut = !!current && !!previous;
      return {
        obj: resource,
        current,
        previous,
        isRollingOut,
        pods: [...(current?.pods || []), ...(previous?.pods || [])],
      };
    }
    return null;
  }, [loaded, loadError, pods, resource]);

  const podContent = [];

  if (statusOfPods) {
    if (statusOfPods.pods?.length > 0) {
      statusOfPods.pods.forEach((pod) => {
        podContent.push(<PodOverviewItem key={pod.metadata.uid} pod={pod} />);
      });
    }
  }

  return (
    <div className="ocs-sidebar-tabsection">
      <div className="co-m-pane__heading-owner">
        <span>
          <DevPreviewBadge />
          <SidebarSectionHeading text={'Pods'} />
        </span>
        <div>
          {statusOfPods && statusOfPods.pods && (
            <div>
              <ul className="list-group">
                <div>{podContent}</div>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const useOperatorBackedPanelResourceSection: DetailsTabSectionExtensionHook = (
  element: GraphElement,
) => {
  const resource = getResource(element);
  element.getData();

  if (!resource || resource.kind !== 'Rollout') {
    return [undefined, true, undefined];
  }

  const section = <ResourceSection item={element.getData()} />;

  return [section, true, undefined];
};
