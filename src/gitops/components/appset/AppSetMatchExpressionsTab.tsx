import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as YamlFormatter from 'yaml';

import { SidebarSectionHeading } from '@gitops/topology/sidebar/DeploymentSideBarDetails';
import { Card, CardBody, Flex, FlexItem, PageSection } from '@patternfly/react-core';

import { ApplicationSetKind } from '../../models/ApplicationSetModel';
import { useGitOpsTranslation } from '../../utils/hooks/useGitOpsTranslation';

import './AppSetDetailsTab.scss';

type AppSetMatchExpressionsTabProps = RouteComponentProps<{ ns: string; name: string }> & {
  obj?: ApplicationSetKind;
  customData?: object;
};

const AppSetMatchExpressionsTab: React.FC<AppSetMatchExpressionsTabProps> = ({
  obj,
  customData,
}) => {
  const { t } = useGitOpsTranslation();
  const index = customData.step !== undefined ? parseInt(customData?.step) - 1 : -1;
  if (index >= 0) {
    const yaml = obj?.spec?.strategy?.rollingSync?.steps[index] || {};
    return (
      <>
        <PageSection>
          <Flex
            justifyContent={{ default: 'justifyContentSpaceEvenly' }}
            direction={{ default: 'column', lg: 'row' }}
          >
            <Flex flex={{ default: 'flex_2' }}>
              <FlexItem fullWidth={{ default: 'fullWidth' }}>
                <div>
                  <div>
                    <SidebarSectionHeading
                      text={t('Progressive Sync Step {{x}}', { x: customData?.step })}
                    />
                  </div>
                </div>
                <Card>
                  <CardBody>
                    <pre>{YamlFormatter.stringify(yaml, null, 2)}</pre>
                  </CardBody>
                </Card>
              </FlexItem>
            </Flex>
          </Flex>
        </PageSection>
      </>
    );
  } else {
    return <div></div>;
  }
};

export default AppSetMatchExpressionsTab;
