import * as React from 'react';
// import { useTranslation } from 'react-i18next';
// import { Table, TextFilter } from '@console/internal/components/factory';
// import { fuzzyCaseInsensitive } from '@console/internal/components/factory/table-filters';

// import { VirtualizedTable } from '@openshift-console/dynamic-plugin-sdk';
import { TableComposable, Tbody, InnerScrollContainer, OuterScrollContainer, Td } from '@patternfly/react-table';

import GitOpsEmptyState from '../GitOpsEmptyState';
import { GitOpsAppGroupData } from '../utils/gitops-types';
import {GitOpsTableHeader} from './GitOpsTableHeader';

// import GitOpsTableRow from './GitOpsTableRow';
// import './GitOpsList.scss';

interface GitOpsListProps {
  appGroups: GitOpsAppGroupData[];
  emptyStateMsg: string;
}

const GitOpsList: React.FC<GitOpsListProps> = ({ appGroups, emptyStateMsg }) => {
  // const { t } = useTranslation();
  // const [textFilter, setTextFilter] = React.useState('');

  // const visibleItems = appGroups?.filter(({ name }) => {
    // return fuzzyCaseInsensitive(textFilter, name);
  // });

  const hasSyncStatus: boolean =
    appGroups?.some(
      ({ sync_status }) => sync_status /* eslint-disable-line @typescript-eslint/camelcase */,
    ) || false;

  return (
    <div className="gop-gitops-list">
      {/* {appGroups.map((a) =>
          a && (
            <>
              <div>{a.name} {a.repo_url}</div>
            </>
          )
      )} */}
      {!emptyStateMsg && appGroups ? (
        <>
          {/* <div className="co-m-pane__filter-row">
            <TextFilter
              value={textFilter}
              label={t('gitops-plugin~by name')}
              onChange={(val) => setTextFilter(val)}
            />
          </div> */}
    <OuterScrollContainer>
      <InnerScrollContainer>
        <TableComposable aria-label="Applications table" variant="compact" isStickyHeader>
          <GitOpsTableHeader
            // onSort={onSort}
            // sortDirection={activeSortDirection}
            // sortIndex={activeSortIndex}
            hasSyncStatus={hasSyncStatus}
            // columns={columns}
          />
          <Tbody>
            {/* <Tr> */}
              {appGroups.map(app => {
              (
                  <>
                  <Td key={app.name}>
                    <div>
                      <span>{app.name}</span>
                    </div>
                  </Td>
                  <Td width={10}>
                    <div>
                    {app.repo_url}
                    </div>
                </Td>
                <Td>
                    {app.sync_status}
                </Td>
                <Td>
                    {app.last_deployed}
                </Td>
                </>
              )
              })}
            {/* </Tr> */}
          </Tbody>
        </TableComposable>
      </InnerScrollContainer>
    </OuterScrollContainer>
          {/* <Table
            data={visibleItems}
            aria-label={t('gitops-plugin~Environments table')}
            Header={GitOpsTableHeader(hasSyncStatus)}
            Row={GitOpsTableRow}
            loaded={!emptyStateMsg}
            virtualize
          /> */}

        {/* <VirtualizedTable
          data={visibleItems}
          // unfilteredData={data}
          // loaded={disksLoaded}
          // loadError={undefined}
          columns={GitOpsTableColumn(hasSyncStatus)}
          Row={GitOpsTableRow}
        /> */}

        </>
      ) : (
        <GitOpsEmptyState emptyStateMsg={emptyStateMsg} />
      )}
    </div>
  );
};

export default GitOpsList;
