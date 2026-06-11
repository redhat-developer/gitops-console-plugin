import * as React from 'react';

import { modelToGroupVersionKind } from '@gitops/utils/utils';
import { HorizontalNav, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { ErrorState } from '@patternfly/react-component-groups';
import { Bullseye, Spinner } from '@patternfly/react-core';

import { ImageUpdaterKind, ImageUpdaterModel } from '../../models/ImageUpdaterModel';
import { useGitOpsTranslation } from '../../utils/hooks/useGitOpsTranslation';
import DetailsPageHeader from '../shared/DetailsPageHeader/DetailsPageHeader';
import ResourceYAMLTab from '../shared/ResourceYAMLTab/ResourceYAMLTab';

import { useImageUpdaterActionsProvider } from './hooks/useImageUpdaterActionsProvider';
import ImageUpdaterDetailsTab from './ImageUpdaterDetailsTab';
import ImageUpdaterRecentUpdatesTab from './ImageUpdaterRecentUpdatesTab';

type ImageUpdaterPageProps = {
  name: string;
  namespace: string;
  kind: string;
};

const ImageUpdaterNavPage: React.FC<ImageUpdaterPageProps> = ({ name, namespace, kind }) => {
  const { t } = useGitOpsTranslation();
  const [imageUpdater, loaded, loadError] = useK8sWatchResource<ImageUpdaterKind>({
    groupVersionKind: modelToGroupVersionKind(ImageUpdaterModel),
    kind,
    name,
    namespace,
  });

  const actions = useImageUpdaterActionsProvider(imageUpdater);

  const pages = React.useMemo(
    () => [
      {
        href: '',
        name: t('Details'),
        component: ImageUpdaterDetailsTab,
      },
      {
        href: 'recent-updates',
        name: t('Recent Updates'),
        component: ImageUpdaterRecentUpdatesTab,
      },
      {
        href: 'yaml',
        name: t('YAML'),
        component: ResourceYAMLTab,
      },
    ],
    [t],
  );

  return (
    <>
      <DetailsPageHeader
        obj={imageUpdater}
        model={ImageUpdaterModel}
        namespace={namespace}
        name={name}
        actions={actions}
        iconText="IU"
        iconTitle={t('ArgoCD ImageUpdater')}
      />
      {/* eslint-disable-next-line no-nested-ternary */}
      {loaded && !loadError ? (
        <div>
          <HorizontalNav pages={pages} resource={imageUpdater} />
        </div>
      ) : loadError ? (
        <ErrorState
          titleText={t('Unable to load data')}
          bodyText={t(
            'There was an error retrieving the ImageUpdater. Check your connection and reload the page.',
          )}
        />
      ) : (
        <Bullseye>
          <Spinner size="xl" />
        </Bullseye>
      )}
    </>
  );
};

export default ImageUpdaterNavPage;
