import * as React from 'react';

import { EmptyState, EmptyStateBody, PageSection } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { ResourceAllowDeny } from '../../models/AppProjectModel';
import { useGitOpsTranslation } from '../../utils/hooks/useGitOpsTranslation';

interface ResourceAllowDenyListProps {
  list?: ResourceAllowDeny[];
}

const ResourceAllowDenyList: React.FC<ResourceAllowDenyListProps> = ({ list }) => {
  const { t } = useGitOpsTranslation();

  const resourceList = list || [];

  return (
    <PageSection>
      {resourceList.length > 0 ? (
        <Table aria-label="Resource Allow/Deny table" borders>
          <Thead>
            <Tr>
              <Th>{t('Kind')}</Th>
              <Th>{t('Group')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {resourceList.map((resource, index) => (
              <Tr key={index}>
                <Td dataLabel={t('Kind')}>{resource.kind || '-'}</Td>
                <Td dataLabel={t('Group')}>{resource.group || '-'}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <EmptyState headingLevel="h4" icon={CubesIcon} titleText={t('No resources configured')}>
          <EmptyStateBody>{t('This list does not have any resources configured.')}</EmptyStateBody>
        </EmptyState>
      )}
    </PageSection>
  );
};

export default ResourceAllowDenyList;
