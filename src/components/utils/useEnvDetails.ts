import * as React from 'react';
import { useTranslation } from 'react-i18next';
import * as _ from 'lodash';

import { pipelinesBaseURI } from '../../const';

import { fetchAppGroups } from './gitops-utils';

const useEnvDetails = (appName, manifestURL) => {
  const { t } = useTranslation('plugin__gitops-plugin');
  const [envs, setEnvs] = React.useState<string[]>(null);
  const [emptyStateMsg, setEmptyStateMsg] = React.useState(null);
  React.useEffect(() => {
    let ignore = false;

    fetchAppGroups(pipelinesBaseURI, manifestURL)
      .then((appGroups) => {
        if (ignore) return;
        const app = _.find(appGroups, (appObj) => appName === appObj?.name);
        if (!app?.environments) {
          setEmptyStateMsg(
            t(
              'plugin__gitops-plugin~Environment details were not found. Try reloading the page or contacting an administrator.',
            ),
          );
        }
        setEnvs(app?.environments);
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error('Unable to load EnvDetails', e);
      });

    return () => {
      ignore = true;
    };
  }, [appName, manifestURL, t]);
  return [envs, emptyStateMsg];
};

export default useEnvDetails;
