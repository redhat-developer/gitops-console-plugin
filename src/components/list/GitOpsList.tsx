import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { VirtualizedTable } from '@openshift-console/dynamic-plugin-sdk';
import GitOpsEmptyState from '../GitOpsEmptyState';
import { GitOpsAppGroupData } from '../utils/gitops-types';
import useGitOpsColumns from '../../hooks/useGitOpsColumns';
import GitOpsTableRow from './GitOpsTableRow';
import './GitOpsList.scss';
import { fuzzyCaseInsensitive } from '../helpers/stringHelpers';
import { TextFilter } from '../import/list-page';

interface GitOpsListProps {
  appGroups: GitOpsAppGroupData[];
  emptyStateMsg: string;
}

const GitOpsList: React.FC<GitOpsListProps> = ({ appGroups, emptyStateMsg }) => {
  const { t } = useTranslation();
  const [textFilter, setTextFilter] = React.useState('');
  
  const visibleItems = appGroups?.filter(({ name }) => {
    return fuzzyCaseInsensitive(textFilter, name);
  });

  const hasSyncStatus: boolean =
  appGroups?.some(
    ({ sync_status }) => sync_status /* eslint-disable-line @typescript-eslint/camelcase */,
    ) || false;
  const columns = useGitOpsColumns(hasSyncStatus);
    
  return (
    <div className="gop-gitops-list">
      {!emptyStateMsg && appGroups ? (
        <>
          <div className="co-m-pane__filter-row">
            <TextFilter
              value={textFilter}
              label={t('gitops-plugin~by name')}
              onChange={(val) => setTextFilter(val)}
            />
          </div>
          <VirtualizedTable<GitOpsAppGroupData>
            data={visibleItems || []}
            unfilteredData={appGroups || []}
            loaded={!emptyStateMsg}
            loadError={null}
            columns={columns}
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
