import * as React from 'react';

import { useUserSettings } from '@openshift-console/dynamic-plugin-sdk';

export const deseralizeData = (data: string | null) => {
  if (typeof data !== 'string') {
    return data;
  }
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};

export const useUserSettingsCompatibility = <T>(
  key: string,
  storageKey: string,
  defaultValue?: T,
  sync = false,
): [T, React.Dispatch<React.SetStateAction<T>>, boolean] => {
  const [settings, setSettings, loaded] = useUserSettings<T>(
    key,
    localStorage.getItem(storageKey) !== null
      ? deseralizeData(localStorage.getItem(storageKey))
      : defaultValue,
    sync,
  );

  React.useEffect(
    () => () => {
      if (loaded) {
        localStorage.removeItem(storageKey);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loaded],
  );

  return [settings, setSettings, loaded];
};
