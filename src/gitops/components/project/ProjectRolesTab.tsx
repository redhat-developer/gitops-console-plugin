import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { Badge, EmptyState, EmptyStateBody, PageSection, Title } from '@patternfly/react-core';
import { DataViewTh, DataViewTr } from '@patternfly/react-data-view/dist/esm/DataViewTable';
import { CubesIcon } from '@patternfly/react-icons';
import { ThProps } from '@patternfly/react-table';
import { Tbody, Td, Tr } from '@patternfly/react-table';

import { AppProjectKind, Role } from '../../models/AppProjectModel';
import { useGitOpsTranslation } from '../../utils/hooks/useGitOpsTranslation';
import { GitOpsDataViewTable, useGitOpsDataViewSort } from '../shared/DataView';

type ProjectRolesTabProps = RouteComponentProps<{ ns: string; name: string }> & {
  obj?: AppProjectKind;
};

const ProjectRolesTab: React.FC<ProjectRolesTabProps> = ({ obj }) => {
  const { t } = useGitOpsTranslation();

  const roles = React.useMemo(() => obj?.spec?.roles || [], [obj?.spec?.roles]);

  const columnSortConfig = React.useMemo(
    () => ['name', 'description', 'groups', 'policies'].map((key) => ({ key })),
    [],
  );

  const { sortBy, direction, getSortParams } = useGitOpsDataViewSort(columnSortConfig);
  const columnsDV = useRolesColumnsDV(getSortParams, t);
  const sortedRoles = React.useMemo(() => {
    return sortRolesData(roles, sortBy, direction);
  }, [roles, sortBy, direction]);

  const rows = useRolesRowsDV(sortedRoles, t);

  if (!obj) return null;

  const empty = (
    <Tbody>
      <Tr key="loading" ouiaId="table-tr-loading">
        <Td colSpan={columnsDV.length}>
          <EmptyState headingLevel="h4" icon={CubesIcon} titleText={t('No roles configured')}>
            <EmptyStateBody>
              {t('This AppProject does not have any roles configured.')}
            </EmptyStateBody>
          </EmptyState>
        </Td>
      </Tr>
    </Tbody>
  );

  return (
    <PageSection>
      <Title headingLevel="h2" className="co-section-heading">
        {t('Roles')}
      </Title>
      <GitOpsDataViewTable
        columns={columnsDV}
        rows={rows}
        isEmpty={roles.length === 0}
        emptyState={empty}
      />
    </PageSection>
  );
};

const sortRolesData = (
  data: Role[],
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
      case 'description':
        aValue = a.description || '';
        bValue = b.description || '';
        break;
      case 'groups':
        const aGroupsCount = a.groups?.length || 0;
        const bGroupsCount = b.groups?.length || 0;
        if (aGroupsCount !== bGroupsCount) {
          aValue = aGroupsCount;
          bValue = bGroupsCount;
        } else {
          aValue = a.groups?.slice().sort().join(', ') || '';
          bValue = b.groups?.slice().sort().join(', ') || '';
        }
        break;
      case 'policies':
        const aPoliciesCount = a.policies?.length || 0;
        const bPoliciesCount = b.policies?.length || 0;
        if (aPoliciesCount !== bPoliciesCount) {
          aValue = aPoliciesCount;
          bValue = bPoliciesCount;
        } else {
          aValue = a.policies?.slice().sort().join(', ') || '';
          bValue = b.policies?.slice().sort().join(', ') || '';
        }
        break;
      default:
        return 0;
    }

    if (direction === 'asc') {
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    } else {
      if (aValue > bValue) return -1;
      if (aValue < bValue) return 1;
      return 0;
    }
  });
};

export const useRolesColumnsDV = (
  getSortParams: (columnIndex: number) => ThProps['sort'],
  t: (key: string) => string,
): DataViewTh[] => {
  const columns: DataViewTh[] = [
    {
      cell: t('Name'),
      props: {
        'aria-label': 'name',
        className: 'pf-m-width-20',
        sort: getSortParams(0),
        style: { minWidth: '150px' },
      },
    },
    {
      cell: t('Description'),
      props: {
        'aria-label': 'description',
        className: 'pf-m-width-30',
        sort: getSortParams(1),
        style: { minWidth: '200px' },
      },
    },
    {
      cell: t('Groups'),
      props: {
        'aria-label': 'groups',
        className: 'pf-m-width-25',
        sort: getSortParams(2),
      },
    },
    {
      cell: t('Policies'),
      props: {
        'aria-label': 'policies',
        className: 'pf-m-width-25',
        sort: getSortParams(3),
      },
    },
  ];

  return columns;
};

const useRolesRowsDV = (roles: Role[], t: (key: string) => string): DataViewTr[] => {
  const rows: DataViewTr[] = [];

  roles.forEach((role, index) => {
    rows.push([
      {
        cell: <strong>{role.name}</strong>,
        id: `name-${index}`,
        dataLabel: t('Name'),
      },
      {
        cell: role.description || '-',
        id: `description-${index}`,
        dataLabel: t('Description'),
      },
      {
        cell:
          role.groups && role.groups.length > 0 ? (
            <div>
              {role.groups.map((group, idx) => (
                <Badge key={idx} isRead color="blue" className="pf-u-mr-sm pf-u-mb-sm">
                  {group}
                </Badge>
              ))}
            </div>
          ) : (
            '-'
          ),
        id: `groups-${index}`,
        dataLabel: t('Groups'),
      },
      {
        cell:
          role.policies && role.policies.length > 0 ? (
            <div>
              {role.policies.map((policy, idx) => (
                <Badge key={idx} isRead color="grey" className="pf-u-mr-sm pf-u-mb-sm">
                  {policy}
                </Badge>
              ))}
            </div>
          ) : (
            '-'
          ),
        id: `policies-${index}`,
        dataLabel: t('Policies'),
      },
    ]);
  });

  return rows;
};

export default ProjectRolesTab;
