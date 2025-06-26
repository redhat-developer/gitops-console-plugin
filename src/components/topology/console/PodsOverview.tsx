import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, GridItem } from '@patternfly/react-core';
import { Link } from 'react-router-dom-v5-compat';
import * as _ from 'lodash';

import { PodPhase, ResourceLink, StatusComponent } from '@openshift-console/dynamic-plugin-sdk';
import { ExtPodKind } from '@openshift-console/dynamic-plugin-sdk-internal/lib/extensions/console-types';

import { PodTraffic } from './pod-traffic';
import { ContainerStatus } from './types';

export const podPhase = (pod: ExtPodKind): PodPhase => {
  if (!pod || !pod.status) {
    return '';
  }

  if (pod.metadata.deletionTimestamp) {
    return 'Terminating';
  }

  if (pod.status.reason === 'NodeLost') {
    return 'Unknown';
  }

  if (pod.status.reason === 'Evicted') {
    return 'Evicted';
  }

  let initializing = false;
  let phase = pod.status.phase || pod.status.reason;

  _.each(pod.status.initContainerStatuses, (container: ContainerStatus, i: number) => {
    const { terminated, waiting } = container.state;
    const initContainerSpec = pod.spec.initContainers.find((c) => c.name === container.name);

    if (terminated && terminated.exitCode === 0) {
      return true;
    }

    if (initContainerSpec?.restartPolicy === 'Always' && container.started) {
      return true;
    }

    initializing = true;
    if (terminated && terminated.reason) {
      phase = `Init:${terminated.reason}`;
    } else if (terminated && !terminated.reason) {
      phase = terminated.signal
        ? `Init:Signal:${terminated.signal}`
        : `Init:ExitCode:${terminated.exitCode}`;
    } else if (waiting && waiting.reason && waiting.reason !== 'PodInitializing') {
      phase = `Init:${waiting.reason}`;
    } else {
      phase = `Init:${i}/${pod.status.initContainerStatuses.length}`;
    }
    return false;
  });

  if (!initializing) {
    let hasRunning = false;
    const containerStatuses = pod.status.containerStatuses || [];
    for (let i = containerStatuses.length - 1; i >= 0; i--) {
      const {
        state: { running, terminated, waiting },
        ready,
      } = containerStatuses[i];
      if (terminated && terminated.reason) {
        phase = terminated.reason;
      } else if (waiting && waiting.reason) {
        phase = waiting.reason;
      } else if (waiting && !waiting.reason) {
        phase = terminated.signal
          ? `Signal:${terminated.signal}`
          : `ExitCode:${terminated.exitCode}`;
      } else if (running && ready) {
        hasRunning = true;
      }
    }

    // Change pod status back to "Running" if there is at least one container
    // still reporting as "Running" status.
    if (phase === 'Completed' && hasRunning) {
      phase = 'Running';
    }
  }

  return phase;
};

type PodOverviewItemProps = {
  pod: ExtPodKind;
};

export const PodOverviewItem: React.FC<PodOverviewItemProps> = ({ pod }) => {
  const {
    metadata: { name, namespace },
  } = pod;
  const { t } = useTranslation();
  const status = podPhase(pod);
  return (
    <li className="list-group-item">
      <Grid hasGutter>
        <GridItem span={5}>
          <ResourceLink kind={pod.kind} name={name} namespace={namespace} />
        </GridItem>
        <GridItem span={3}>
          <StatusComponent status={status} />
        </GridItem>
        <GridItem span={1}>
          <PodTraffic podName={name} namespace={namespace} tooltipFlag />
        </GridItem>
        <GridItem span={3}>
          <Link to={`${resourcePath(pod.metadata.name, pod.metadata.namespace)}/logs`}>
            {t('public~View logs')}
          </Link>
        </GridItem>
      </Grid>
    </li>
  );
};

export const resourcePath = (name?: string, namespace?: string) => {
  let url = '/k8s/';
  url += namespace ? `ns/${namespace}/` : 'all-namespaces/';
  url += 'pods';
  url += `/${encodeURIComponent(name)}`;
  return url;
};
