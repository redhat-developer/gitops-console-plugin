import * as React from 'react';

import { useGitOpsTranslation } from '@gitops/utils/hooks/useGitOpsTranslation';
import { CamelCaseWrap, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';

export const Conditions: React.FC<ConditionsProps> = ({ conditions }) => {
  const { t } = useGitOpsTranslation();

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'True':
        return t('public~True');
      case 'False':
        return t('public~False');
      default:
        return status;
    }
  };

  return (
    <>
      {conditions?.length ? (
        <Table aria-label="Conditions table" borders>
          <Thead>
            <Tr>
              <Th>{t('public~Type')}</Th>
              <Th>{t('public~Status')}</Th>
              <Th>{t('public~Updated')}</Th>
              <Th>{t('public~Reason')}</Th>
              <Th>{t('public~Message')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {conditions?.map?.((condition: any, i: number) => (
              <Tr data-test={condition.type} key={i}>
                <Td dataLabel={t('public~Type')} data-test={`condition[${i}].type`}>
                  <CamelCaseWrap value={condition.type} />
                </Td>
                <Td dataLabel={t('public~Status')} data-test={`condition[${i}].status`}>
                  {getStatusLabel(condition.status)}
                </Td>
                <Td
                  dataLabel={t('public~Updated')}
                  data-test={`condition[${i}].lastTransitionTime`}
                >
                  <Timestamp timestamp={condition.lastTransitionTime} />
                </Td>
                <Td dataLabel={t('public~Reason')} data-test={`condition[${i}].reason`}>
                  <CamelCaseWrap value={condition.reason} />
                </Td>
                <Td dataLabel={t('public~Message')} data-test={`condition[${i}].message`}>
                  {condition.message?.trim() || '-'}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <div className="cos-status-box">
          <div className="pf-u-text-align-center">{t('public~No conditions found')}</div>
        </div>
      )}
    </>
  );
};
Conditions.displayName = 'Conditions';

export type ConditionsProps = {
  conditions: any;
  title?: string;
  subTitle?: string;
};

export default Conditions;
