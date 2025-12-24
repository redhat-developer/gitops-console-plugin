import * as React from 'react';

import { Badge, EmptyState, EmptyStateBody, PageSection } from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

import { Destination } from '../../models/AppProjectModel';
import { useGitOpsTranslation } from '../../utils/hooks/useGitOpsTranslation';
import { getDisplayValue, isDenyRule } from '../../utils/project-utils';

interface DestinationsListProps {
  destinations?: Destination[];
}

const DestinationsList: React.FC<DestinationsListProps> = ({ destinations }) => {
  const { t } = useGitOpsTranslation();

  const destinationsList = destinations || [];

  return (
    <PageSection>
      {destinationsList.length > 0 ? (
        <Table aria-label="Destinations table" borders>
          <Thead>
            <Tr>
              <Th>{t('Type')}</Th>
              <Th>{t('Server')}</Th>
              <Th>{t('Name')}</Th>
              <Th>{t('Namespace')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {destinationsList.map((destination, index) => {
              const serverIsDeny = isDenyRule(destination.server);
              const namespaceIsDeny = isDenyRule(destination.namespace);
              const hasDenyRule = serverIsDeny || namespaceIsDeny;

              return (
                <Tr key={index}>
                  <Td dataLabel={t('Type')}>
                    {hasDenyRule ? (
                      <Badge isRead color="red">
                        {t('Deny')}
                      </Badge>
                    ) : (
                      <Badge isRead color="green">
                        {t('Allow')}
                      </Badge>
                    )}
                  </Td>
                  <Td dataLabel={t('Server')}>
                    <code>{getDisplayValue(destination.server)}</code>
                  </Td>
                  <Td dataLabel={t('Name')}>
                    <code>{getDisplayValue(destination.name)}</code>
                  </Td>
                  <Td dataLabel={t('Namespace')}>
                    <code>{getDisplayValue(destination.namespace)}</code>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      ) : (
        <EmptyState headingLevel="h4" icon={CubesIcon} titleText={t('No destinations configured')}>
          <EmptyStateBody>
            {t('This AppProject does not have any destinations configured.')}
          </EmptyStateBody>
        </EmptyState>
      )}
    </PageSection>
  );
};

export default DestinationsList;
