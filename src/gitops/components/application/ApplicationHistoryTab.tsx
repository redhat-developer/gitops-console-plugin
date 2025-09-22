import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { ApplicationHistory, ApplicationKind } from '@gitops-models/ApplicationModel';
import { PageSection, PageSectionVariants, Title } from '@patternfly/react-core';

import HistoryList from './History/History';

type ApplicationHistoryTabProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: ApplicationKind;
};

const ApplicationHistoryTab: React.FC<ApplicationHistoryTabProps> = ({ obj }) => {
  let history: ApplicationHistory[];
  if (obj?.status?.history) {
    history = obj?.status?.history;
  } else {
    history = [];
  }

  return (
    <div>
      <PageSection
        variant={PageSectionVariants.default}
        className="co-m-pane__body co-m-pane__body--section-heading"
      >
        <Title headingLevel="h2" className="co-section-heading">
          {t('Sync history')}
        </Title>
        <HistoryList history={history} obj={obj} />
      </PageSection>
    </div>
  );
};

export default ApplicationHistoryTab;
