import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import classNames from 'classnames';

import { useArgoServer } from '@gitops/hooks/useArgoServer';

import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { ApplicationKind, ApplicationResourceStatus } from '@gitops-models/ApplicationModel';
import { useUserSettings } from '@openshift-console/dynamic-plugin-sdk';
import {
  Flex,
  FlexItem,
  PageBody,
  PageSection,
  PageSectionVariants,
  Title,
} from '@patternfly/react-core';
import ArgoCDLink from '../shared/ArgoCDLink/ArgoCDLink';
import ApplicationResourcesView from './ApplicationResourcesView';
import {
  APPLICATION_RESOURCES_VIEW_SETTING_KEY,
  ApplicationResourcesViewType,
} from './ApplicationResourcesViewType';
import { getApplicationArgoUrl } from '@gitops/utils/gitops';

type ApplicationResourcesTabProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: ApplicationKind;
};

const ApplicationResourcesTab: React.FC<ApplicationResourcesTabProps> = ({ obj }) => {
  const argoServer = useArgoServer(obj);
  const argoURL = getApplicationArgoUrl(argoServer, obj);

  const [savedViewType, setSavedViewType, viewSettingsLoaded] =
  useUserSettings<ApplicationResourcesViewType>(
    APPLICATION_RESOURCES_VIEW_SETTING_KEY,
    ApplicationResourcesViewType.graph,
    false,
  );
  const [viewType, setViewType] = React.useState<ApplicationResourcesViewType>(
    ApplicationResourcesViewType.graph,
  );

  React.useEffect(() => {
    if (viewSettingsLoaded) {
      setViewType(savedViewType ?? ApplicationResourcesViewType.graph);
    }
  }, [savedViewType, viewSettingsLoaded]);

  let resources: ApplicationResourceStatus[];
  if (obj?.status?.resources) {
    resources = obj?.status?.resources;
  } else {
    resources = [];
  }

  const onViewChange = React.useCallback(
    (newViewType: ApplicationResourcesViewType) => {
      setViewType(newViewType);
      setSavedViewType(newViewType);
    },
    [setSavedViewType],
  );

  if (!viewSettingsLoaded) {
    return null;
  }

  return (
    <div>
      <PageSection
        variant={PageSectionVariants.default}
        className={classNames('co-m-pane__body', { 'co-m-pane__body--section-heading': true })}
      >
        <Title headingLevel="h2" className="co-section-heading">
          {t('Application resources')}
        </Title>

        <Flex flex={{ default: 'flexDefault' }}>
          <FlexItem fullWidth={{ default: 'fullWidth' }}>
            {t(
              "The graph and table views show health and sync status for the application's immediate resources only. Click the Argo CD Link to see the complete resource tree. Use the filter to filter resources based on status and kind.",
            )}
          </FlexItem>
        </Flex>
        <PageBody>
          <Flex style={{ marginTop: '15px' }} flex={{ default: 'flexDefault' }}>
            <FlexItem>
              <ArgoCDLink href={argoURL} />
            </FlexItem>
          </Flex>
          {obj?.metadata && (
            <ApplicationResourcesView
              application={obj}
              resources={resources}
              viewType={viewType}
              onViewChange={onViewChange}
              argoBaseURL={argoURL}
            />
          )}
        </PageBody>
      </PageSection>
    </div>
  );
};

export default ApplicationResourcesTab;
