import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom-v5-compat';

import {
  Action,
  K8sResourceCommon,
  ListPageBody,
  ListPageCreate,
  ListPageFilter,
  ListPageHeader,
  ResourceLink,
  RowFilter,
  useK8sWatchResource,
  useListPageFilter,
} from '@openshift-console/dynamic-plugin-sdk';
import { ErrorState } from '@patternfly/react-component-groups';
import { EmptyState, EmptyStateBody, Flex, FlexItem, Spinner } from '@patternfly/react-core';
import {
  DataViewTable,
  DataViewTh,
  DataViewTr,
} from '@patternfly/react-data-view/dist/dynamic/DataViewTable';
import { useDataViewSort } from '@patternfly/react-data-view/dist/dynamic/Hooks';
import DataView, { DataViewState } from '@patternfly/react-data-view/dist/esm/DataView';
import { CubesIcon } from '@patternfly/react-icons';
import { Tbody, Td, Tr } from '@patternfly/react-table';

import { useApplicationSetActionsProvider } from '../../hooks/useApplicationSetActionsProvider';
import { ApplicationSetStatus } from '../../utils/constants';
import { ApplicationSetKind, ApplicationSetModel } from '../../models/ApplicationSetModel';
import { getAppSetStatus, getAppSetGeneratorCount } from '../../utils/gitops';
import ActionsDropdown from '../../utils/components/ActionDropDown/ActionDropDown';
import { modelToGroupVersionKind, modelToRef } from '../../utils/utils';

interface ApplicationSetProps {
  namespace: string;
  hideNameLabelFilters?: boolean;
  showTitle?: boolean;
}

const ApplicationSetList: React.FC<ApplicationSetProps> = ({
  namespace,
  hideNameLabelFilters,
  showTitle,
}) => {
  const [applicationSets, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    isList: true,
    groupVersionKind: {
      group: 'argoproj.io',
      kind: 'ApplicationSet',
      version: 'v1alpha1',
    },
    namespaced: true,
    namespace,
  });

  const { t } = useTranslation();

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

  const rowFilters: RowFilter[] = React.useMemo(
    () => [
      {
        filterGroupName: t('Status'),
        type: 'application-set-status',
        reducer: (appSet: ApplicationSetKind) => getAppSetStatus(appSet),
        filter: (input, appSet: ApplicationSetKind) => {
          if (!input.selected?.length) {
            return true;
          }
          return input.selected.includes(getAppSetStatus(appSet));
        },
        items: [
          { id: ApplicationSetStatus.HEALTHY, title: t('Healthy') },
          { id: ApplicationSetStatus.ERROR, title: t('Error') },
          { id: ApplicationSetStatus.UNKNOWN, title: t('Unknown') },
        ],
      },
    ],
    [t],
  );

  const [data, filteredData, onFilterChange] = useListPageFilter(
    applicationSets as ApplicationSetKind[],
    rowFilters,
  );

  const sortedData = React.useMemo(
    () => sortData(filteredData, sortBy, direction),
    [filteredData, sortBy, direction],
  );

  const columns = useColumnsDV(namespace, getSortParams);
  const rows = useApplicationSetRowsDV(sortedData, namespace);

  if (loadError) {
    return <ErrorState />;
  }

  if (!loaded) {
    return (
      <div style={{ textAlign: 'center' }}>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <ListPageHeader title={showTitle ? t('Application Sets') : undefined}>
        <ListPageCreate
          groupVersionKind={modelToGroupVersionKind(ApplicationSetModel)}
          namespace={namespace}
        >
          {t('Create Application Set')}
        </ListPageCreate>
      </ListPageHeader>
      <ListPageBody>
        <ListPageFilter
          data={data}
          loaded={loaded}
          rowFilters={rowFilters}
          onFilterChange={onFilterChange}
          hideNameLabelFilters={hideNameLabelFilters}
        />
        <DataView
          aria-label={t('Application Sets')}
          data={sortedData}
          columns={columns}
          rows={rows}
          sortBy={sortBy}
          onSort={onSort}
          emptyState={
            <EmptyState>
              <EmptyStateBody>
                <Flex direction={{ default: 'column' }}>
                  <FlexItem>
                    <CubesIcon size="lg" />
                  </FlexItem>
                  <FlexItem>{t('No Application Sets found')}</FlexItem>
                </Flex>
              </EmptyStateBody>
            </EmptyState>
          }
        />
      </ListPageBody>
    </>
  );
};

export const sortData = (
  data: ApplicationSetKind[],
  sortBy: string | undefined,
  direction: 'asc' | 'desc' | undefined,
) => {
  if (!sortBy || !direction) {
    return data;
  }

  return data.sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case 'name':
        aValue = a.metadata.name;
        bValue = b.metadata.name;
        break;
      case 'namespace':
        aValue = a.metadata.namespace;
        bValue = b.metadata.namespace;
        break;
      case 'status':
        aValue = getAppSetStatus(a);
        bValue = getAppSetStatus(b);
        break;
      case 'generators':
        aValue = getAppSetGeneratorCount(a);
        bValue = getAppSetGeneratorCount(b);
        break;
      default:
        return 0;
    }

    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

const ApplicationSetActionsCell: React.FC<{ appSet: ApplicationSetKind }> = ({ appSet }) => {
  const [actions] = useApplicationSetActionsProvider(appSet);
  return <ActionsDropdown actions={actions} isKebabToggle />;
};

const useApplicationSetRowsDV = (applicationSetsList, namespace): DataViewTr[] => {
  return React.useMemo(
    () =>
      applicationSetsList.map((appSet: ApplicationSetKind) => ({
        id: appSet.metadata.uid,
        cells: [
          {
            title: (
              <ResourceLink
                groupVersionKind={modelToGroupVersionKind(ApplicationSetModel)}
                name={appSet.metadata.name}
                namespace={appSet.metadata.namespace}
                linkTo={namespace ? undefined : true}
              />
            ),
          },
          {
            title: appSet.metadata.namespace,
          },
          {
            title: getAppSetStatus(appSet),
          },
          {
            title: getAppSetGeneratorCount(appSet),
          },
          {
            title: <ApplicationSetActionsCell appSet={appSet} />,
          },
        ],
      })),
    [applicationSetsList, namespace],
  );
};

const useColumnsDV = (namespace, getSortParams) => {
  const { t } = useTranslation();
  return React.useMemo(
    () => [
      {
        id: 'name',
        title: t('Name'),
        sort: getSortParams('name', 0),
      },
      {
        id: 'namespace',
        title: t('Namespace'),
        sort: getSortParams('namespace', 1),
      },
      {
        id: 'status',
        title: t('Status'),
        sort: getSortParams('status', 2),
      },
      {
        id: 'generators',
        title: t('Generators'),
        sort: getSortParams('generators', 3),
      },
      {
        id: 'actions',
        title: '',
      },
    ],
    [t, getSortParams],
  );
};

export default ApplicationSetList;
