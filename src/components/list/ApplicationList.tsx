import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  ListPageFilter,
  RowFilter,
  useListPageFilter,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';

import EnvironmentEmptyState from '../EnvironmentEmptyState';
import { GitOpsAppGroupData } from '../utils/gitops-types';

import { ApplicationColumns } from './ApplicationColumns';
import ApplicationTableRow from './ApplicationTableRow';

import './ApplicationList.scss';

interface ApplicationListProps {
  appGroups: GitOpsAppGroupData[];
  emptyStateMsg: string;
}

const ApplicationList: React.FC<ApplicationListProps> = ({ appGroups, emptyStateMsg }) => {
  const { t } = useTranslation('plugin__gitops-plugin');

  const filters: RowFilter[] = [
    {
      filterGroupName: 'App name',
      type: 'name',
      reducer: ({ name }) => name,
      filter: (input, app) => {
        if (input.selected?.length) {
          return app.name.includes(input.selected);
        }
        return true;
      },
      items: [{ id: 'name', title: 'name' }],
    },
  ];

  const [staticData, filteredData, onFilterChange] = useListPageFilter(appGroups, filters);

  const hasSyncStatus: boolean = appGroups?.some(({ sync_status }) => sync_status) || false;

  return (
    <div className="gitops-plugin__application-list">
      {!emptyStateMsg && appGroups ? (
        <>
          <ListPageFilter
            data={staticData}
            loaded={!emptyStateMsg}
            onFilterChange={onFilterChange}
            nameFilterPlaceholder={t('plugin__gitops-plugin~by name')}
            hideLabelFilter
          />
          <VirtualizedTable<GitOpsAppGroupData>
            data={filteredData || []}
            unfilteredData={staticData || []}
            loaded={!emptyStateMsg}
            loadError={null}
            columns={ApplicationColumns(hasSyncStatus)}
            Row={ApplicationTableRow}
          />
        </>
      ) : (
        <EnvironmentEmptyState emptyStateMsg={emptyStateMsg} />
      )}
    </div>
  );
};

export default ApplicationList;
