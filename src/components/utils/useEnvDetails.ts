import * as React from 'react';
import { useTranslation } from 'react-i18next';
import * as _ from 'lodash';

import { fetchDataFrequency, pipelinesBaseURI } from '../../const';

import { fetchAppGroups } from './gitops-utils';

const useEnvDetails = (appName, manifestURL) => {
  const { t } = useTranslation('plugin__gitops-plugin');
  const [envs, setEnvs] = React.useState<string[]>(null);
  const [emptyStateMsg, setEmptyStateMsg] = React.useState(null);

  React.useEffect(() => {
    let ignore = false;
    const getAppData = async () => {
      let data;
      try {
        data = await fetchAppGroups(pipelinesBaseURI, manifestURL);
        if (ignore) return;

        const app = _.find(data, (appObj) => appName === appObj?.name);
        if (!app?.environments) {
          setEmptyStateMsg(
            t(
              'plugin__gitops-plugin~Environment details were not found. Try reloading the page or contacting an administrator.',
            ),
          );
        }
        setEnvs(app?.environments);
      } catch (err) {
        console.error('Unable to load EnvDetails', err);
      }
    };

    const id = setInterval(getAppData, fetchDataFrequency * 1000);
    return () => {
      ignore = true;
      clearInterval(id);
    };
  }, [appName, manifestURL, t]);
  return [envs, emptyStateMsg];
};

export default useEnvDetails;
