import * as React from 'react';

import { EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { ResourceAllowDeny } from '../../models/AppProjectModel';
import { useGitOpsTranslation } from '../../utils/hooks/useGitOpsTranslation';

import './ResourceAllowDenyList.scss';

interface ResourceAllowDenyListProps {
  list?: ResourceAllowDeny[];
}

const ResourceAllowDenyList: React.FC<ResourceAllowDenyListProps> = ({ list }) => {
  const { t } = useGitOpsTranslation();

  const resourceList = list || [];

  return (
    <>
      {resourceList.length > 0 ? (
        <div className="resource-allow-deny-list">
          <Table aria-label="Resource Allow/Deny table" borders>
            <Thead>
              <Tr>
                <Th className="resource-allow-deny-list__kind">{t('Kind')}</Th>
                <Th className="resource-allow-deny-list__group">{t('Group')}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {resourceList.map((resource, index) => (
                <Tr key={index}>
                  <Td dataLabel={t('Kind')} className="resource-allow-deny-list__kind">
                    {resource.kind || '-'}
                  </Td>
                  <Td dataLabel={t('Group')} className="resource-allow-deny-list__group">
                    {resource.group || '-'}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      ) : (
        <EmptyState headingLevel="h4" icon={CubesIcon} titleText={t('No resources configured')}>
          <EmptyStateBody>{t('This list does not have any resources configured.')}</EmptyStateBody>
        </EmptyState>
      )}
    </>
  );
};

export default ResourceAllowDenyList;
