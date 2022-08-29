import * as React from 'react';
import { useTranslation } from 'react-i18next';

import {
  ListPageFilter,
  RowFilter,
  useListPageFilter,
  VirtualizedTable,
} from '@openshift-console/dynamic-plugin-sdk';

import GitOpsEmptyState from '../GitOpsEmptyState';
import { GitOpsAppGroupData } from '../utils/gitops-types';

import { GitOpsColumns } from './GitOpsColumns';
import GitOpsTableRow from './GitOpsTableRow';

import './GitOpsList.scss';

interface GitOpsListProps {
  appGroups: GitOpsAppGroupData[];
  emptyStateMsg: string;
}

const GitOpsList: React.FC<GitOpsListProps> = ({ appGroups, emptyStateMsg }) => {
  const { t } = useTranslation();

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
    <div className="gop-gitops-list">
      {!emptyStateMsg && appGroups ? (
        <>
          <ListPageFilter
            data={staticData}
            loaded={!emptyStateMsg}
            onFilterChange={onFilterChange}
            nameFilterPlaceholder={t('gitops-plugin~by name')}
            hideLabelFilter
          />
          <VirtualizedTable<GitOpsAppGroupData>
            data={filteredData || []}
            unfilteredData={staticData || []}
            loaded={!emptyStateMsg}
            loadError={null}
            columns={GitOpsColumns(hasSyncStatus)}
            Row={GitOpsTableRow}
          />
        </>
      ) : (
        <GitOpsEmptyState emptyStateMsg={emptyStateMsg} />
      )}
    </div>
  );
};

export default GitOpsList;
