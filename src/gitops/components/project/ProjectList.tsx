import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom-v5-compat';
import TechPreviewBadge from 'src/plugin/import/badges/TechPreviewBadge';

import ActionsDropdown from '@gitops/utils/components/ActionDropDown/ActionDropDown';
import { modelToGroupVersionKind, modelToRef } from '@gitops/utils/utils';
import {
  Action,
  K8sResourceCommon,
  ListPageBody,
  ListPageCreate,
  ListPageFilter,
  ListPageHeader,
  RowFilter,
  Timestamp,
  useK8sWatchResource,
  useListPageFilter,
} from '@openshift-console/dynamic-plugin-sdk';
import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { ErrorState } from '@patternfly/react-component-groups';
import { EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { DataViewTh, DataViewTr } from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { CubesIcon } from '@patternfly/react-icons';
import { ThProps } from '@patternfly/react-table';
import { Tbody, Td, Tr } from '@patternfly/react-table';

import { ApplicationKind } from '../../models/ApplicationModel';
import { AppProjectKind, AppProjectModel } from '../../models/AppProjectModel';
import {
  ShowOperandsInAllNamespacesRadioGroup,
  useShowOperandsInAllNamespaces,
} from '../shared/AllNamespaces';
import { GitOpsDataViewTable, useGitOpsDataViewSort } from '../shared/DataView';
import { MetadataLabels } from '../shared/MetadataLabels/MetadataLabels';

import { useProjectActionsProvider } from './hooks/useProjectActionsProvider';

import './project-list.scss';

type ProjectListTabProps = {
  namespace?: string;
  hideNameLabelFilters?: boolean;
  showTitle?: boolean;
};

const ProjectList: React.FC<ProjectListTabProps> = ({
  namespace,
  hideNameLabelFilters,
  showTitle,
}) => {
  const location = useLocation();
  const [showOperandsInAllNamespaces] = useShowOperandsInAllNamespaces();
  const listAllNamespaces =
    location.pathname?.includes('openshift-gitops-operator') && showOperandsInAllNamespaces;
  if (listAllNamespaces) {
    namespace = null;
  }
  const [appProjects, loaded, loadError] = useK8sWatchResource<K8sResourceCommon[]>({
    isList: true,
    groupVersionKind: {
      group: 'argoproj.io',
      kind: 'AppProject',
      version: 'v1alpha1',
    },
    namespaced: !listAllNamespaces,
    namespace,
  });

  // Watch Applications to count apps per project
  const [applications, appsLoaded] = useK8sWatchResource<ApplicationKind[]>({
    isList: true,
    groupVersionKind: {
      group: 'argoproj.io',
      kind: 'Application',
      version: 'v1alpha1',
    },
    namespaced: true,
    namespace,
  });

  const columnSortConfig = React.useMemo(() => {
    return [
      'name',
      ...(!listAllNamespaces || !namespace || namespace === '' ? ['namespace'] : []),
      'description',
      'applications',
      'labels',
      'last-updated',
      'actions',
    ].map((key) => ({ key }));
  }, [listAllNamespaces, namespace]);

  const { searchParams, sortBy, direction, getSortParams } =
    useGitOpsDataViewSort(columnSortConfig);

  // Get search query from URL parameters
  const searchQuery = searchParams.get('q') || '';

  const { t } = useTranslation('plugin__gitops-plugin');

  const columnsDV = useColumnsDV(namespace, getSortParams);
  const sortedProjects = React.useMemo(() => {
    return sortData(appProjects as AppProjectKind[], sortBy, direction, applications, appsLoaded);
  }, [appProjects, sortBy, direction, applications, appsLoaded]);

  const filters = getFilters(t, applications, appsLoaded);
  const [data, filteredData, onFilterChange] = useListPageFilter(sortedProjects, filters);

  // Filter by search query if present (after other filters)
  const filteredBySearch = React.useMemo(() => {
    if (!searchQuery) return filteredData;

    return filteredData.filter((project) => {
      const name = project.metadata?.name || '';
      const description = project.spec?.description || '';
      const labels = project.metadata?.labels || {};

      // Check if name, description, or labels match the search query
      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        Object.entries(labels).some(([key, value]) => {
          const labelValue = value || '';
          const labelSelector = `${key}=${labelValue}`;
          const lowerSearchQuery = searchQuery.toLowerCase();
          return (
            labelSelector.toLowerCase().includes(lowerSearchQuery) ||
            key.toLowerCase().includes(lowerSearchQuery)
          );
        })
      );
    });
  }, [filteredData, searchQuery]);

  const rows = useProjectsRowsDV(filteredBySearch, namespace, applications, appsLoaded);

  // Check if there are projects initially (before search)
  const hasProjects = React.useMemo(() => {
    return sortedProjects.length > 0;
  }, [sortedProjects]);

  const getEmptyStateBody = () => {
    if (searchQuery) {
      return (
        <>
          {t('No Argo CD App Projects match the search filter')}{' '}
          <strong>&quot;{searchQuery}&quot;</strong>.
          <br />
          {t('Try removing the filter or searching for a different term to see more App Projects.')}
        </>
      );
    }
    return namespace
      ? t('There are no Argo CD App Projects in this project.')
      : t('There are no Argo CD App Projects in all projects.');
  };

  const empty = (
    <Tbody>
      <Tr key="loading" ouiaId="table-tr-loading">
        <Td colSpan={columnsDV.length}>
          <EmptyState
            headingLevel="h4"
            icon={CubesIcon}
            titleText={
              searchQuery ? t('No matching Argo CD App Projects') : t('No Argo CD App Projects')
            }
          >
            <EmptyStateBody>{getEmptyStateBody()}</EmptyStateBody>
          </EmptyState>
        </Td>
      </Tr>
    </Tbody>
  );
  const error = loadError && (
    <Tbody>
      <Tr key="loading" ouiaId={'table-tr-loading'}>
        <Td colSpan={columnsDV.length}>
          <ErrorState
            titleText={t('Unable to load data')}
            bodyText={t(
              'There was an error retrieving App Projects. Check your connection and reload the page.',
            )}
          />
        </Td>
      </Tr>
    </Tbody>
  );
  const isEmptyState = !loadError && rows.length === 0;

  return (
    <div>
      {showTitle == undefined && (
        <ListPageHeader
          title={t('AppProjects')}
          badge={
            location?.pathname?.includes('openshift-gitops-operator') ? null : (
              <TechPreviewBadge
                tooltipContent={t(
                  'This list page is under tech preview, but not necessarily the resources it represents',
                )}
              />
            )
          }
          helpText={
            location.pathname?.includes('openshift-gitops-operator') ? (
              <ShowOperandsInAllNamespacesRadioGroup />
            ) : null
          }
          hideFavoriteButton={false}
        >
          <ListPageCreate groupVersionKind={modelToRef(AppProjectModel)}>
            {t('Create AppProject')}
          </ListPageCreate>
        </ListPageHeader>
      )}
      <ListPageBody>
        {!hideNameLabelFilters && hasProjects && (
          <ListPageFilter
            data={data}
            loaded={loaded}
            rowFilters={filters}
            onFilterChange={onFilterChange}
            nameFilterPlaceholder={t('Search by name...')}
          />
        )}
        <GitOpsDataViewTable
          columns={columnsDV}
          rows={rows}
          isEmpty={isEmptyState}
          emptyState={empty}
          isError={!!loadError}
          errorState={error || undefined}
        />
      </ListPageBody>
    </div>
  );
};

// Helper function to get the last update timestamp
// Uses metadata.managedFields (most recent update time) or falls back to creationTimestamp
const getLastUpdateTimestamp = (project: AppProjectKind): string => {
  // Check if managedFields exists and has entries
  if (project.metadata?.managedFields && project.metadata.managedFields.length > 0) {
    // Find the most recent managedFields entry by time
    const mostRecent = project.metadata.managedFields.reduce((latest, current) => {
      const latestTime = latest?.time ? new Date(latest.time).getTime() : 0;
      const currentTime = current?.time ? new Date(current.time).getTime() : 0;
      return currentTime > latestTime ? current : latest;
    });
    if (mostRecent?.time) {
      return mostRecent.time;
    }
  }
  // Fall back to creationTimestamp
  return project.metadata?.creationTimestamp || '';
};

// Helper function to count applications in a project
const getApplicationsCount = (
  project: AppProjectKind,
  applications: ApplicationKind[],
  appsLoaded: boolean,
): number => {
  if (!applications || !appsLoaded) return 0;
  return applications.filter((app) => app.spec?.project === project.metadata?.name).length;
};

const getDescriptionFilterId = (project: K8sResourceCommon): string => {
  const description = (project as AppProjectKind)?.spec?.description;
  const hasDescription = Boolean(description && description.trim() !== '');
  return hasDescription ? 'has-description' : 'no-description';
};

const getApplicationsFilterId = (
  project: K8sResourceCommon,
  applications: ApplicationKind[],
  appsLoaded: boolean,
): string => {
  if (!applications || !appsLoaded) return 'unknown';
  return getApplicationsCount(project as AppProjectKind, applications, appsLoaded) > 0
    ? 'has-applications'
    : 'no-applications';
};

const getProjectTypeFilterId = (project: K8sResourceCommon): string =>
  project?.metadata?.name === 'default' ? 'default' : 'custom';

const getSourceReposFilterId = (project: K8sResourceCommon): string => {
  const sourceRepos = (project as AppProjectKind)?.spec?.sourceRepos;
  const hasSourceRepos = Boolean(sourceRepos && sourceRepos.length > 0);
  return hasSourceRepos ? 'has-source-repos' : 'no-source-repos';
};

const getDestinationsFilterId = (project: K8sResourceCommon): string => {
  const destinations = (project as AppProjectKind)?.spec?.destinations;
  const hasDestinations = Boolean(destinations && destinations.length > 0);
  return hasDestinations ? 'has-destinations' : 'no-destinations';
};

type ProjectFilterIdGetter = (project: K8sResourceCommon) => string;

const createProjectRowFilter = (
  filterGroupName: string,
  type: string,
  getFilterId: ProjectFilterIdGetter,
  items: { id: string; title: string }[],
  skipWhen = false,
): RowFilter => ({
  filterGroupName,
  type,
  reducer: getFilterId,
  filter: (input, project) => {
    if (!input.selected?.length || !project || skipWhen) {
      return true;
    }
    return input.selected.includes(getFilterId(project));
  },
  items,
});

export const sortData = (
  data: AppProjectKind[],
  sortBy: string | undefined,
  direction: 'asc' | 'desc' | undefined,
  applications: ApplicationKind[],
  appsLoaded: boolean,
) => {
  if (!(sortBy && direction)) return data || [];
  if (!data) return [];

  return [...data].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'name':
        aValue = a.metadata?.name || '';
        bValue = b.metadata?.name || '';
        break;
      case 'namespace':
        aValue = a.metadata?.namespace || '';
        bValue = b.metadata?.namespace || '';
        break;
      case 'description':
        aValue = a.spec?.description || '';
        bValue = b.spec?.description || '';
        break;
      case 'applications':
        aValue = getApplicationsCount(a, applications, appsLoaded);
        bValue = getApplicationsCount(b, applications, appsLoaded);
        break;
      case 'labels':
        aValue = a.metadata?.labels || {};
        bValue = b.metadata?.labels || {};
        break;
      case 'last-updated':
        aValue = getLastUpdateTimestamp(a) || '';
        bValue = getLastUpdateTimestamp(b) || '';
        break;
      default:
        return 0;
    }

    if (direction === 'asc') {
      // eslint-disable-next-line no-nested-ternary
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      // eslint-disable-next-line no-nested-ternary
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
};

export const useColumnsDV = (
  namespace: string | undefined,
  getSortParams: (columnIndex: number) => ThProps['sort'],
): DataViewTh[] => {
  const showNamespace = !namespace || namespace === '';
  const i: number = showNamespace ? 1 : 0;
  const { t } = useTranslation('plugin__gitops-plugin');
  const columns: DataViewTh[] = [
    {
      cell: t('Name'),
      props: {
        'aria-label': 'name',
        className: 'pf-m-width-25',
        sort: getSortParams(0),
        style: { minWidth: '200px' },
      },
    },
    ...(showNamespace
      ? [
          {
            cell: t('Namespace'),
            props: {
              'aria-label': 'namespace',
              className: 'pf-m-width-15',
              sort: getSortParams(1),
              style: { minWidth: '150px' },
            },
          },
        ]
      : []),
    {
      cell: t('Description'),
      props: {
        'aria-label': 'description',
        className: 'pf-m-width-25',
        sort: getSortParams(1 + i),
      },
    },
    {
      cell: t('Applications'),
      props: {
        'aria-label': 'applications',
        className: 'pf-m-width-15',
        sort: getSortParams(2 + i),
      },
    },
    {
      cell: t('Labels'),
      props: {
        'aria-label': 'labels',
        className: 'pf-m-width-15',
      },
    },
    {
      cell: t('Last Updated'),
      props: {
        'aria-label': 'last updated',
        className: 'pf-m-width-15',
        sort: getSortParams(showNamespace ? 5 : 4),
      },
    },
    {
      cell: '',
      props: { 'aria-label': 'actions' },
    },
  ];

  return columns;
};

export const useProjectsRowsDV = (
  projectsList: AppProjectKind[],
  namespace: string | undefined,
  applications: ApplicationKind[],
  appsLoaded: boolean,
): DataViewTr[] => {
  const rows: DataViewTr[] = [];
  if (projectsList == undefined || projectsList.length == 0) {
    return rows;
  }
  const showNamespace = !namespace || namespace === '';
  projectsList.forEach((obj, index) => {
    const appsCount = getApplicationsCount(obj, applications, appsLoaded);

    rows.push([
      {
        cell: (
          <div>
            <ResourceLink
              groupVersionKind={modelToGroupVersionKind(AppProjectModel)}
              name={obj.metadata.name}
              namespace={obj.metadata.namespace}
              inline={true}
            />
          </div>
        ),
        id: 'name',
        dataLabel: 'Name',
      },
      ...(showNamespace
        ? [
            {
              cell: <ResourceLink kind="Namespace" name={obj.metadata.namespace} />,
              id: obj.metadata.namespace,
              dataLabel: 'Namespace',
            },
          ]
        : []),
      {
        id: 'description',
        cell: obj.spec?.description || '-',
      },
      {
        id: 'applications',
        cell: appsLoaded ? appsCount.toString() : '-',
      },
      {
        id: 'labels',
        cell: (
          <div className="pf-m-width-40">
            <MetadataLabels
              kind={
                AppProjectModel.apiGroup +
                '~' +
                AppProjectModel.apiVersion +
                '~' +
                AppProjectModel.kind
              }
              labels={obj?.metadata?.labels}
            />
          </div>
        ),
      },
      {
        id: 'last-updated',
        cell: (() => {
          const lastUpdate = getLastUpdateTimestamp(obj);
          return (
            <div style={{ whiteSpace: 'nowrap' }}>
              {lastUpdate ? <Timestamp timestamp={lastUpdate} /> : '-'}
            </div>
          );
        })(),
      },
      {
        id: 'actions-' + index,
        cell: <ProjectActionsCell project={obj} />,
        props: { style: { paddingTop: 8, paddingRight: 0, paddingLeft: 0, width: 10 } },
      },
    ]);
  });
  return rows;
};

const ProjectActionsCell: React.FC<{
  project: AppProjectKind;
}> = ({ project }) => {
  const actionList: Action[] = useProjectActionsProvider(project);
  return (
    <div style={{ textAlign: 'right' }}>
      <ActionsDropdown
        actions={actionList || []}
        id="gitops-project-actions"
        isKebabToggle={true}
      />
    </div>
  );
};

const getFilters = (
  t: (key: string) => string,
  applications: ApplicationKind[],
  appsLoaded: boolean,
): RowFilter[] => [
  createProjectRowFilter(t('Description'), 'has-description', getDescriptionFilterId, [
    { id: 'has-description', title: t('Has Description') },
    { id: 'no-description', title: t('No Description') },
  ]),
  createProjectRowFilter(
    t('Applications'),
    'has-applications',
    (project) => getApplicationsFilterId(project, applications, appsLoaded),
    [
      { id: 'has-applications', title: t('Has Applications') },
      { id: 'no-applications', title: t('No Applications') },
    ],
    !applications || !appsLoaded,
  ),
  createProjectRowFilter(t('Project Type'), 'project-type', getProjectTypeFilterId, [
    { id: 'default', title: t('Default Project') },
    { id: 'custom', title: t('Custom Projects') },
  ]),
  createProjectRowFilter(t('Source Repositories'), 'has-source-repos', getSourceReposFilterId, [
    { id: 'has-source-repos', title: t('Has Source Repos') },
    { id: 'no-source-repos', title: t('No Source Repos') },
  ]),
  createProjectRowFilter(t('Destinations'), 'has-destinations', getDestinationsFilterId, [
    { id: 'has-destinations', title: t('Has Destinations') },
    { id: 'no-destinations', title: t('No Destinations') },
  ]),
];

export default ProjectList;
