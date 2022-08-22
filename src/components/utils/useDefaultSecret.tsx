import { Map as ImmutableMap } from 'immutable';
import * as _ from 'lodash';
// FIXME upgrading redux types is causing many errors at this time
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { useSelector } from 'react-redux';

import { RequestMap } from '@openshift-console/dynamic-plugin-sdk/lib/api/internal-types';
import { SDKStoreState, UserKind } from '@openshift-console/dynamic-plugin-sdk/lib/app/redux-types';

export type ObserveState = ImmutableMap<string, any>;
export type UIState = ImmutableMap<string, any>;
export type DashboardsState = ImmutableMap<string, RequestMap<any>>;
export type FeatureState = ImmutableMap<string, boolean>;

export type FeatureSubStore = {
  FLAGS: FeatureState;
};

type GetUser = (state: SDKStoreState) => UserKind;
export type RootState = {
  observe: ObserveState;
  UI: UIState;
  dashboards: DashboardsState;
  plugins?: {
    [namespace: string]: any;
  };
} & SDKStoreState &
  FeatureSubStore;

const useDefaultSecret = () => {
  const { user } = useSelector(userStateToProps);
  const userName = _.replace(user?.metadata?.name ?? '', /[^a-zA-Z0-9-]/g, '');
  const defaultSecret = userName
    ? [`pipelines-${userName}-github`, `${userName}-github-token`]
    : [];
  return defaultSecret;
};

export default useDefaultSecret;

export const getUser: GetUser = (state) => state.sdkCore.user;

export const userStateToProps = (state: RootState) => {
  return { user: getUser(state) };
};
