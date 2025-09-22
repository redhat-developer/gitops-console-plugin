import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { useSearchParams } from 'react-router-dom-v5-compat';
import classNames from 'classnames';

import { useResourceActionsProvider } from '@gitops/hooks/useResourceActionsProvider';
import { OperationState } from '@gitops/Statuses/OperationState';
import SyncStatus from '@gitops/Statuses/SyncStatus';
import ActionDropDown from '@gitops/utils/components/ActionDropDown/ActionDropDown';
import { ArgoServer, getArgoServer, getDuration } from '@gitops/utils/gitops';
import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { ApplicationKind, ApplicationResourceStatus } from '@gitops-models/ApplicationModel';
import {
  Action,
  K8sGroupVersionKind,
  ResourceLink,
  Timestamp,
  useK8sModel,
} from '@openshift-console/dynamic-plugin-sdk';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTermHelpText,
  DescriptionListTermHelpTextButton,
  EmptyState,
  EmptyStateBody,
  Flex,
  FlexItem,
  PageSection,
  PageSectionVariants,
  Popover,
  Title,
} from '@patternfly/react-core';
import DataView, { DataViewState } from '@patternfly/react-data-view/dist/esm/DataView';
import DataViewTable, {
  DataViewTh,
  DataViewTr,
} from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { useDataViewSort } from '@patternfly/react-data-view/dist/esm/Hooks';
import { CubesIcon } from '@patternfly/react-icons';
import { Tbody, Td, Tr } from '@patternfly/react-table';

import { DetailsDescriptionGroup } from '../shared/BaseDetailsSummary/BaseDetailsSummary';

import { ConditionsPopover } from './Conditions/ConditionsPopover';

type ApplicationSyncStatusTabProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: ApplicationKind;
};

const ApplicationSyncStatusTab: React.FC<ApplicationSyncStatusTabProps> = ({ obj }) => {
  const [model] = useK8sModel({ group: 'route.openshift.io', version: 'v1', kind: 'Route' });

  const [argoServer, setArgoServer] = React.useState<ArgoServer>({ host: '', protocol: '' });

  React.useEffect(() => {
    (async () => {
      getArgoServer(model, obj)
        .then((server) => {
          setArgoServer(server);
        })
        .catch((err) => {
          console.error('Error:', err);
        });
    })();
  }, [model, obj]);

  let resources: ApplicationResourceStatus[];
  if (obj?.status?.operationState?.syncResult?.resources) {
    resources = obj.status.operationState.syncResult.resources;
  } else {
    resources = [];
  }

  let currentActiveState = null;
  if (resources.length === 0) {
    currentActiveState = DataViewState.empty;
  }
  const [searchParams, setSearchParams] = useSearchParams();
  const { sortBy, direction, onSort } = useDataViewSort({ searchParams, setSearchParams });
  const getSortParams = (columnId: string, columnIndex: number) => ({
    sortBy: {
      index: columnIndex,
      direction,
      defaultDirection: 'asc' as const,
    },
    onSort: (_event: any, index: number, dir: 'asc' | 'desc') => {
      onSort(_event, columnId, dir);
    },
    columnIndex,
  });
  const columnsDV = useResourceColumnsDV(getSortParams);
  const sortedResources = React.useMemo(() => {
    return sortData(resources, sortBy, direction);
  }, [resources, sortBy, direction]);

  const rows = useResourceRowsDV(
    sortedResources,
    obj,
    argoServer.protocol +
      '://' +
      argoServer.host +
      '/applications/' +
      obj?.metadata?.namespace +
      '/' +
      obj?.metadata?.name,
  );

  const empty = (
    <Tbody>
      <Tr key="loading" ouiaId="table-tr-loading">
        <Td colSpan={columnsDV.length}>
          <EmptyState headingLevel="h4" icon={CubesIcon} titleText="No resources">
            <EmptyStateBody>
              There are no resources asssociated with the application.
            </EmptyStateBody>
          </EmptyState>
        </Td>
      </Tr>
    </Tbody>
  );

  return (
    <div>
      <PageSection
        variant={PageSectionVariants.default}
        className={classNames('co-m-pane__body', { 'co-m-pane__body--section-heading': true })}
      >
        <Title headingLevel="h2" className="co-section-heading">
          {t('Sync status')}
        </Title>
        <div className="row">
          <div className="col-sm-6">
            <DescriptionList className="pf-c-description-list">
              <DetailsDescriptionGroup
                title={t('Operation')}
                help={t('The operation that was performed.')}
              >
                <Flex>
                  {obj?.status?.operationState && (
                    <FlexItem>
                      <OperationState app={obj} />
                    </FlexItem>
                  )}
                  {obj?.status?.conditions && (
                    <FlexItem>
                      <ConditionsPopover conditions={obj.status.conditions} />
                    </FlexItem>
                  )}
                  {!obj?.status?.operationState && !obj?.status?.conditions && '-'}
                </Flex>
              </DetailsDescriptionGroup>
              <DescriptionListGroup className="pf-c-description-list__group">
                <DescriptionListTermHelpText className="pf-c-description-list__term">
                  <Popover
                    headerContent={<div>{t('Phase')}</div>}
                    bodyContent={<div>{t('The operation phase.')}</div>}
                  >
                    <DescriptionListTermHelpTextButton>
                      {t('Phase')}
                    </DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  {obj.status?.operationState?.phase ? obj.status?.operationState?.phase : '-'}
                </DescriptionListDescription>
              </DescriptionListGroup>

              <DescriptionListGroup className="pf-c-description-list__group">
                <DescriptionListTermHelpText className="pf-c-description-list__term">
                  <Popover
                    headerContent={<div>{t('Message')}</div>}
                    bodyContent={<div>{t('The message from the operation.')}</div>}
                  >
                    <DescriptionListTermHelpTextButton>
                      {t('Message')}
                    </DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  {obj.status?.operationState?.message ? obj.status?.operationState?.message : '-'}
                </DescriptionListDescription>
              </DescriptionListGroup>

              <DescriptionListGroup className="pf-c-description-list__group">
                <DescriptionListTermHelpText className="pf-c-description-list__term">
                  <Popover
                    headerContent={<div>{t('Initiated By')}</div>}
                    bodyContent={<div>{t('Who initiated the operation.')}</div>}
                  >
                    <DescriptionListTermHelpTextButton>
                      {t('Intiated By')}
                    </DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  {obj.status?.operationState?.operation?.initiatedBy?.automated
                    ? t('automated sync policy')
                    : obj.status?.operationState?.operation?.initiatedBy?.username || '-'}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </div>
          <div className="col-sm-6">
            <DescriptionList className="pf-c-description-list">
              <DescriptionListGroup className="pf-c-description-list__group">
                <DescriptionListTermHelpText className="pf-c-description-list__term">
                  <Popover
                    headerContent={<div>{t('Started At')}</div>}
                    bodyContent={<div>{t('When the operation was started.')}</div>}
                  >
                    <DescriptionListTermHelpTextButton>
                      {t('Started At')}
                    </DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  <Timestamp timestamp={obj.status?.operationState?.startedAt} />
                </DescriptionListDescription>
              </DescriptionListGroup>

              <DescriptionListGroup className="pf-c-description-list__group">
                <DescriptionListTermHelpText className="pf-c-description-list__term">
                  <Popover
                    headerContent={<div>{t('Duration')}</div>}
                    bodyContent={<div>{t('How long the operation took to complete.')}</div>}
                  >
                    <DescriptionListTermHelpTextButton>
                      {t('Duration')}
                    </DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  {obj.status?.operationState?.finishedAt ? (
                    <span>
                      {getDuration(
                        obj.status.operationState.startedAt,
                        obj.status.operationState.finishedAt,
                      ) / 1000}{' '}
                      seconds
                    </span>
                  ) : (
                    '-'
                  )}
                </DescriptionListDescription>
              </DescriptionListGroup>

              <DescriptionListGroup className="pf-c-description-list__group">
                <DescriptionListTermHelpText className="pf-c-description-list__term">
                  <Popover
                    headerContent={<div>{t('Finished At')}</div>}
                    bodyContent={<div>{t('When the operation was finished.')}</div>}
                  >
                    <DescriptionListTermHelpTextButton>
                      {t('Finished At')}
                    </DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  <Timestamp timestamp={obj.status?.operationState?.finishedAt} />
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </div>
        </div>
      </PageSection>
      <PageSection variant={PageSectionVariants.default}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Resources Last Synced')}
        </Title>
        <DataView activeState={currentActiveState}>
          <DataViewTable rows={rows} columns={columnsDV} bodyStates={empty && { empty }} />
        </DataView>
      </PageSection>
    </div>
  );
};

const sortData = (
  data: ApplicationResourceStatus[],
  sortBy: string | undefined,
  direction: 'asc' | 'desc' | undefined,
) => {
  if (!sortBy || !direction) return data;

  return [...data].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'name':
        aValue = a.name || '';
        bValue = b.name || '';
        break;
      case 'namespace':
        aValue = a.namespace || '';
        bValue = b.namespace || '';
        break;
      case 'status':
        aValue = a.status || '';
        bValue = b.status || '';
        break;
      case 'hook':
        aValue = a.hookPhase || '';
        bValue = b.hookPhase || '';
        break;
      case 'message':
        aValue = a.message || '';
        bValue = b.message || '';
        break;
      default:
        return 0;
    }

    if (direction === 'asc') {
      if (aValue < bValue) {
        return -1;
      } else if (aValue > bValue) {
        return 1;
      }
      return 0;
      // return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      if (aValue > bValue) {
        return -1;
      } else if (aValue < bValue) {
        return 1;
      }
      return 0; // return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
};

export const useResourceColumnsDV = (getSortParams) => {
  const columns: DataViewTh[] = [
    {
      id: 'name',
      cell: t('plugin__gitops-plugin~Name'),
      props: {
        key: 'name',
        'aria-label': 'name',
        className: 'pf-m-width-25',
        sort: getSortParams('name', 0),
      },
    },
    {
      id: 'namespace',
      cell: 'Namespace',
      props: {
        key: 'namespace',
        'aria-label': 'namespace',
        className: 'pf-m-width-20',
        sort: getSortParams('namespace', 1),
      },
    },
    {
      id: 'status',
      cell: 'Status',
      props: {
        key: 'status',
        'aria-label': 'status',
        className: 'pf-m-width-15',
        sort: getSortParams('status', 2),
      },
    },
    {
      id: 'hook',
      cell: 'Hook',
      props: {
        key: 'hook',
        'aria-label': 'hook',
        className: 'pf-m-width-15',
        sort: getSortParams('hook', 3),
      },
    },
    {
      id: 'message',
      cell: 'Message',
      props: {
        key: 'message',
        'aria-label': 'message',
        className: 'pf-m-width-15',
        sort: getSortParams('message', 4),
      },
    },
    {
      id: 'actions',
      cell: '',
      props: {
        'aria-label': 'actions',
        className: 'dropdown-kebab-pf pf-c-table__action',
      },
    },
  ];
  return columns;
};

const useResourceRowsDV = (
  resources: ApplicationResourceStatus[],
  obj: ApplicationKind,
  argoBaseURL: string,
): DataViewTr[] => {
  const rows: DataViewTr[] = [];

  resources.forEach((resource, index) => {
    const gvk: K8sGroupVersionKind = {
      version: resource.version,
      group: resource.group,
      kind: resource.kind,
    };

    rows.push([
      {
        cell: (
          <div>
            <ResourceLink
              groupVersionKind={gvk}
              name={resource.name}
              namespace={resource.namespace}
            />
          </div>
        ),
        id: resource.name + '-' + index,
        dataLabel: 'Name',
      },
      {
        cell: resource.namespace,
        id: resource.namespace,
        dataLabel: 'Namespace',
      },
      {
        id: 'status-' + index,
        cell: <>{resource.status ? <SyncStatus status={resource.status} /> : '-'}</>,
        dataLabel: 'Status',
      },
      {
        id: 'hook-' + index,
        cell: <>{resource.hookPhase}</>,
      },
      {
        id: 'message-' + index,
        cell: <>{resource.message}</>,
        dataLabel: 'Message',
      },
      {
        id: 'actions-' + index,
        cell: <ResourceActionsCell resource={resource} app={obj} argoBaseURL={argoBaseURL} />,
        props: {
          style: { paddingTop: 8, paddingRight: 0, paddingLeft: 0, width: 10 },
          className: 'dropdown-kebab-pf pf-c-table__action',
        },
      },
    ]);
  });
  return rows;
};

const ResourceActionsCell: React.FC<{
  resource: ApplicationResourceStatus;
  app: ApplicationKind;
  argoBaseURL: string;
}> = ({ resource, app, argoBaseURL }) => {
  const actionList: [actions: Action[]] = useResourceActionsProvider(resource, app, argoBaseURL);

  return (
    <div style={{ textAlign: 'right' }}>
      <ActionDropDown
        actions={actionList ? actionList[0] : []}
        id="gitops-application-actions"
        isKebabToggle={true}
      />
    </div>
  );
};

export default ApplicationSyncStatusTab;
